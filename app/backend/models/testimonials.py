from core.database import Base
from sqlalchemy import Boolean, Column, Integer, String

class Testimonials(Base):
    __tablename__ = "testimonials"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=True)
    content = Column(String(1024), nullable=False)      # or Text if you prefer
    rating = Column(Integer, nullable=False)
    avatar_url = Column(String(512), nullable=True)
    is_featured = Column(Boolean, nullable=True)
    sort_order = Column(Integer, nullable=True)
