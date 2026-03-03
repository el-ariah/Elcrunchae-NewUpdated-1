import logging
import smtplib
import os
import html
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


def sanitize_for_html(value: str) -> str:
    """Sanitize a string for safe HTML rendering - prevents HTML injection."""
    if not value:
        return ""
    # Escape HTML entities
    safe = html.escape(str(value), quote=True)
    # Remove any remaining potentially dangerous patterns
    safe = re.sub(r'javascript:', '', safe, flags=re.IGNORECASE)
    safe = re.sub(r'on\w+\s*=', '', safe, flags=re.IGNORECASE)
    return safe


def sanitize_for_text(value: str) -> str:
    """Sanitize a string for plain text rendering."""
    if not value:
        return ""
    # Strip any HTML tags
    return re.sub(r'<[^>]*>', '', str(value)).strip()


def get_estimated_delivery() -> str:
    """Calculate estimated delivery date (5-7 business days from now)"""
    delivery_date = datetime.now() + timedelta(days=7)
    return delivery_date.strftime("%B %d, %Y")


def build_order_confirmation_html(
    order_id: int,
    customer_name: str,
    items: list,
    subtotal: float,
    shipping_fee: float,
    total: float,
    shipping_name: str,
    shipping_address: str,
    shipping_city: str,
    shipping_state: str,
    shipping_pincode: str,
    shipping_phone: str,
) -> str:
    """Build HTML email for order confirmation with sanitized inputs."""
    estimated_delivery = get_estimated_delivery()

    # Sanitize ALL user-provided inputs
    safe_customer_name = sanitize_for_html(customer_name)
    safe_shipping_name = sanitize_for_html(shipping_name)
    safe_shipping_address = sanitize_for_html(shipping_address)
    safe_shipping_city = sanitize_for_html(shipping_city)
    safe_shipping_state = sanitize_for_html(shipping_state)
    safe_shipping_pincode = sanitize_for_html(shipping_pincode)
    safe_shipping_phone = sanitize_for_html(shipping_phone)

    # Validate numeric values
    safe_order_id = int(order_id)
    safe_subtotal = float(subtotal)
    safe_shipping_fee = float(shipping_fee)
    safe_total = float(total)

    items_html = ""
    for item in items:
        product_name = sanitize_for_html(str(item.get('product_name', 'Product')))
        quantity = int(item.get('quantity', 1))
        total_price = float(item.get('total_price', 0))
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                <strong>{product_name}</strong><br>
                <span style="color: #6b7280; font-size: 13px;">Qty: {quantity}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                ₹{total_price:.0f}
            </td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #166534, #15803d); padding: 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">El Crunchae</h1>
                <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">Pure Crunch, Pure Joy</p>
            </div>

            <!-- Success Banner -->
            <div style="background-color: #f0fdf4; padding: 24px; text-align: center; border-bottom: 2px solid #bbf7d0;">
                <div style="font-size: 48px; margin-bottom: 8px;">✅</div>
                <h2 style="color: #166534; margin: 0; font-size: 22px;">Order Confirmed!</h2>
                <p style="color: #15803d; margin: 8px 0 0; font-size: 14px;">Order #{safe_order_id}</p>
            </div>

            <!-- Greeting -->
            <div style="padding: 24px 32px 0;">
                <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                    Hi <strong>{safe_customer_name}</strong>,<br><br>
                    Thank you for your order! We're thrilled to have you as a customer. Your order has been confirmed and is being prepared for shipment.
                </p>
            </div>

            <!-- Estimated Delivery -->
            <div style="margin: 16px 32px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 600;">📦 ESTIMATED DELIVERY</p>
                <p style="margin: 4px 0 0; color: #78350f; font-size: 18px; font-weight: 700;">{estimated_delivery}</p>
                <p style="margin: 4px 0 0; color: #a16207; font-size: 12px;">3-7 business days</p>
            </div>

            <!-- Order Items -->
            <div style="padding: 0 32px;">
                <h3 style="color: #111827; font-size: 16px; margin-bottom: 12px;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f9fafb;">
                            <th style="padding: 10px 12px; text-align: left; font-size: 13px; color: #6b7280; font-weight: 600;">Item</th>
                            <th style="padding: 10px 12px; text-align: right; font-size: 13px; color: #6b7280; font-weight: 600;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Subtotal</td>
                            <td style="padding: 8px 12px; text-align: right; color: #6b7280; font-size: 14px;">₹{safe_subtotal:.0f}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Shipping</td>
                            <td style="padding: 8px 12px; text-align: right; color: #6b7280; font-size: 14px;">{"FREE" if safe_shipping_fee == 0 else f"₹{safe_shipping_fee:.0f}"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: 700; color: #166534; font-size: 16px; border-top: 2px solid #166534;">Total</td>
                            <td style="padding: 12px; font-weight: 700; color: #166534; font-size: 16px; text-align: right; border-top: 2px solid #166534;">₹{safe_total:.0f}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Shipping Info -->
            <div style="margin: 24px 32px; background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                <h3 style="color: #111827; font-size: 15px; margin: 0 0 12px;">🚚 Shipping To</h3>
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                    <strong>{safe_shipping_name}</strong><br>
                    {safe_shipping_address}<br>
                    {safe_shipping_city}, {safe_shipping_state} - {safe_shipping_pincode}<br>
                    📞 {safe_shipping_phone}
                </p>
            </div>

            <!-- Help Section -->
            <div style="padding: 0 32px 24px;">
                <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
                    Need help? Contact us at <a href="mailto:christeena@el-ariah.com" style="color: #166534;">christeena@el-ariah.com</a>
                    or call <a href="tel:+918151977997" style="color: #166534;">+91 81519 77997</a>.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #111827; padding: 24px 32px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2026 El Crunchae by El-Ariah Preserves Pty Ltd. All rights reserved.
                </p>
                <p style="color: #6b7280; font-size: 11px; margin: 8px 0 0;">
                    Bangalore, India | <a href="https://el-ariah.com" style="color: #4ade80;">el-ariah.com</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content


async def send_order_confirmation_email(
    to_email: str,
    order_id: int,
    customer_name: str,
    items: list,
    subtotal: float,
    shipping_fee: float,
    total: float,
    shipping_name: str,
    shipping_address: str,
    shipping_city: str,
    shipping_state: str,
    shipping_pincode: str,
    shipping_phone: str,
) -> bool:
    """Send order confirmation email. Returns True on success, False on failure."""
    # Validate email format
    if not to_email or not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', to_email):
        logger.warning("Invalid email address for order #%s: %s", order_id, to_email)
        return False

    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")
    from_email = os.environ.get("FROM_EMAIL", smtp_user)

    if not smtp_host or not smtp_user or not smtp_pass:
        logger.warning(
            "Email configuration incomplete (SMTP_HOST, SMTP_USER, SMTP_PASS required). "
            "Skipping email notification for order #%s",
            order_id,
        )
        return False

    html_content = build_order_confirmation_html(
        order_id=order_id,
        customer_name=customer_name,
        items=items,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        shipping_name=shipping_name,
        shipping_address=shipping_address,
        shipping_city=shipping_city,
        shipping_state=shipping_state,
        shipping_pincode=shipping_pincode,
        shipping_phone=shipping_phone,
    )

    # Sanitize values for plain text
    safe_name = sanitize_for_text(customer_name)
    safe_total = float(total)
    safe_shipping_name = sanitize_for_text(shipping_name)
    safe_shipping_address = sanitize_for_text(shipping_address)
    safe_shipping_city = sanitize_for_text(shipping_city)
    safe_shipping_state = sanitize_for_text(shipping_state)
    safe_shipping_pincode = sanitize_for_text(shipping_pincode)
    safe_shipping_phone = sanitize_for_text(shipping_phone)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Order Confirmed! #{int(order_id)} — El Crunchae"
    msg["From"] = f"El Crunchae <{from_email}>"
    msg["To"] = to_email

    plain_text = (
        f"Order Confirmed! #{int(order_id)}\n\n"
        f"Hi {safe_name},\n\n"
        f"Thank you for your order! Your order #{int(order_id)} has been confirmed.\n"
        f"Total: ₹{safe_total:.0f}\n"
        f"Estimated Delivery: {get_estimated_delivery()}\n\n"
        f"Shipping to: {safe_shipping_name}, {safe_shipping_address}, {safe_shipping_city}, {safe_shipping_state} - {safe_shipping_pincode}\n"
        f"Phone: {safe_shipping_phone}\n\n"
        f"Need help? Contact christeena@el-ariah.com or call +91 81519 77997\n\n"
        f"— El Crunchae by El-Ariah Preserves"
    )

    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(from_email, [to_email], msg.as_string())
        logger.info("Order confirmation email sent to %s for order #%s", to_email, order_id)
        return True
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed for order #%s", order_id)
        return False
    except smtplib.SMTPException as e:
        logger.error("SMTP error sending email for order #%s: %s", order_id, str(e))
        return False
    except Exception as e:
        logger.error("Failed to send email for order #%s: %s", order_id, str(e))
        return False