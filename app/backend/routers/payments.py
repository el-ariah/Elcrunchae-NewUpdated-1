import logging
import hmac
import hashlib
import json
from datetime import datetime
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from core.database import get_db
from core.config import settings
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from models.orders import Orders
from models.order_items import Order_items

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/payment", tags=["payment"])

# Razorpay config from environment
RAZORPAY_KEY_ID = settings.razorpay_key_id if hasattr(settings, 'razorpay_key_id') else None
RAZORPAY_KEY_SECRET = settings.razorpay_key_secret if hasattr(settings, 'razorpay_key_secret') else None

RAZORPAY_API_BASE = "https://api.razorpay.com/v1"


# ─── Request/Response Models ─────────────────────────────────

class CartItemRequest(BaseModel):
    product_id: int
    product_name: str
    product_image: str = ""
    quantity: int
    unit_price: float


class CreateOrderRequest(BaseModel):
    items: list[CartItemRequest]
    shipping_name: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_pincode: str
    shipping_phone: str


class CreateOrderResponse(BaseModel):
    order_id: int
    razorpay_order_id: str
    razorpay_key_id: str
    amount: int  # in paise
    currency: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: int


class PaymentStatusResponse(BaseModel):
    status: str
    order_id: int
    payment_status: str
    message: str


# ─── Helper: Create Razorpay Order ───────────────────────────

async def create_razorpay_order(amount_paise: int, receipt: str) -> dict:
    """Create an order on Razorpay."""
    import os
    key_id = os.environ.get("RAZORPAY_KEY_ID", RAZORPAY_KEY_ID or "")
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET or "")

    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay credentials not configured")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RAZORPAY_API_BASE}/orders",
            json={
                "amount": amount_paise,
                "currency": "INR",
                "receipt": receipt,
                "payment_capture": 1,
            },
            auth=(key_id, key_secret),
            timeout=30.0,
        )

    if response.status_code != 200:
        logger.error(f"Razorpay order creation failed: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to create Razorpay order")

    return response.json()


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """Verify Razorpay payment signature using HMAC SHA256."""
    import os
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET or "")
    if not key_secret:
        return False

    message = f"{order_id}|{payment_id}"
    expected_signature = hmac.new(
        key_secret.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected_signature, signature)


# ─── Endpoints ────────────────────────────────────────────────

@router.post("/create_payment_session", response_model=CreateOrderResponse)
async def create_payment_session(
    data: CreateOrderRequest,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create an order in DB + Razorpay order for checkout."""
    import os
    try:
        if not data.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        # Calculate totals
        subtotal = sum(item.unit_price * item.quantity for item in data.items)
        shipping_fee = 0 if subtotal >= 499 else 49
        total_amount = subtotal + shipping_fee
        amount_paise = int(round(total_amount * 100))

        # 1. Create order in database
        now = datetime.now()
        new_order = Orders(
            user_id=current_user.id,
            status="pending",
            total_amount=total_amount,
            shipping_fee=shipping_fee,
            shipping_name=data.shipping_name,
            shipping_address=data.shipping_address,
            shipping_city=data.shipping_city,
            shipping_state=data.shipping_state,
            shipping_pincode=data.shipping_pincode,
            shipping_phone=data.shipping_phone,
            payment_status="pending",
            created_at=now,
        )
        db.add(new_order)
        await db.flush()

        # 2. Create order items
        for item in data.items:
            order_item = Order_items(
                user_id=current_user.id,
                order_id=new_order.id,
                product_id=item.product_id,
                product_name=item.product_name,
                product_image=item.product_image,
                quantity=item.quantity,
                unit_price=item.unit_price,
            )
            db.add(order_item)

        # 3. Create Razorpay order
        receipt = f"order_{new_order.id}"
        rz_order = await create_razorpay_order(amount_paise, receipt)

        # 4. Save Razorpay order ID to our order
        new_order.razorpay_order_id = rz_order["id"]
        await db.commit()
        await db.refresh(new_order)

        key_id = os.environ.get("RAZORPAY_KEY_ID", RAZORPAY_KEY_ID or "")

        return CreateOrderResponse(
            order_id=new_order.id,
            razorpay_order_id=rz_order["id"],
            razorpay_key_id=key_id,
            amount=amount_paise,
            currency="INR",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment session creation error: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create payment session: {str(e)}")


@router.post("/verify_payment", response_model=PaymentStatusResponse)
async def verify_payment(
    data: VerifyPaymentRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify Razorpay payment signature and update order status."""
    try:
        # 1. Verify signature
        is_valid = verify_razorpay_signature(
            data.razorpay_order_id,
            data.razorpay_payment_id,
            data.razorpay_signature,
        )

        if not is_valid:
            # Update order as failed
            stmt = (
                update(Orders)
                .where(Orders.id == data.order_id, Orders.user_id == current_user.id)
                .values(payment_status="failed", status="cancelled")
            )
            await db.execute(stmt)
            await db.commit()

            return PaymentStatusResponse(
                status="failed",
                order_id=data.order_id,
                payment_status="failed",
                message="Payment verification failed. Invalid signature.",
            )

        # 2. Update order as paid
        now = datetime.now()
        stmt = (
            update(Orders)
            .where(Orders.id == data.order_id, Orders.user_id == current_user.id)
            .values(
                payment_status="paid",
                status="paid",
                razorpay_payment_id=data.razorpay_payment_id,
            )
        )
        await db.execute(stmt)
        await db.commit()

        return PaymentStatusResponse(
            status="paid",
            order_id=data.order_id,
            payment_status="paid",
            message="Payment verified successfully!",
        )

    except Exception as e:
        logger.error(f"Payment verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to verify payment: {str(e)}")