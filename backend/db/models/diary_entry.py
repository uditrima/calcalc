from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.database import db
from datetime import date

class DiaryEntry(db.Model):
    __tablename__ = 'diary_entries'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Required fields
    date = Column(Date, default=date.today)
    meal_type = Column(String(50), nullable=False)
    grams = Column(Float, default=0.0)
    
    # Foreign key to Food
    food_id = Column(Integer, ForeignKey('foods.id'), nullable=False)
    
    # Relationship to Food
    food = relationship("Food", backref="diary_entries")
