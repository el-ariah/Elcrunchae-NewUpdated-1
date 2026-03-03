from core.database import Base
from sqlalchemy import Boolean, Column, Float, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    slug = Column(String, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    category_label = Column(String, nullable=True)
    description = Column(String, nullable=True)
    long_description = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    image = Column(String, nullable=True)
    box_image = Column(String, nullable=True)
    nutrition_highlights = Column(String, nullable=True)
    shelf_life = Column(String, nullable=True)
    how_to_use = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    sku = Column(String, nullable=True)
    stock_quantity = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=True)
    sort_order = Column(Integer, nullable=True)