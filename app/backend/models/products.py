from core.database import Base
from sqlalchemy import Boolean, Column, Float, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    slug = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    category_label = Column(String(255), nullable=True)
    description = Column(String(1024), nullable=True)       # or Text
    long_description = Column(String(4096), nullable=True)  # or Text
    weight = Column(String(50), nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    image = Column(String(512), nullable=True)
    box_image = Column(String(512), nullable=True)
    nutrition_highlights = Column(String(1024), nullable=True)
    shelf_life = Column(String(255), nullable=True)
    how_to_use = Column(String(2048), nullable=True)
    badge = Column(String(100), nullable=True)
    sku = Column(String(100), nullable=True)
    stock_quantity = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=True)
    sort_order = Column(Integer, nullable=True)
