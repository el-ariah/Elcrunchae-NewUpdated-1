from core.database import Base
from sqlalchemy import Column, DateTime, Float, Integer, String


class Orders(Base):
    __tablename__ = "orders"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    total_amount = Column(Float, nullable=False)
    shipping_fee = Column(Float, nullable=True)
    shipping_name = Column(String(255), nullable=True)
    shipping_address = Column(String(512), nullable=True)
    shipping_city = Column(String(100), nullable=True)
    shipping_state = Column(String(100), nullable=True)
    shipping_pincode = Column(String(20), nullable=True)
    shipping_phone = Column(String(20), nullable=True)
    razorpay_order_id = Column(String(191), nullable=True)
    razorpay_payment_id = Column(String(191), nullable=True)
    payment_status = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
