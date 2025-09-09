from sqlalchemy import Column, Integer, String, Float, DateTime
from db.database import Base

class Food(Base):
    __tablename__ = 'foods'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Required fields
    name = Column(String(255), unique=True, nullable=False)
    
    # Nutritional values per 100g (all with default 0.0)
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbohydrates = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    fiber = Column(Float, default=0.0)
    sugar = Column(Float, default=0.0)
    saturated_fat = Column(Float, default=0.0)
    unsaturated_fat = Column(Float, default=0.0)
    cholesterol = Column(Float, default=0.0)
    sodium = Column(Float, default=0.0)
    potassium = Column(Float, default=0.0)
    calcium = Column(Float, default=0.0)
    iron = Column(Float, default=0.0)
    vitamin_a = Column(Float, default=0.0)
    vitamin_c = Column(Float, default=0.0)
    vitamin_d = Column(Float, default=0.0)
    vitamin_b12 = Column(Float, default=0.0)
    magnesium = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
