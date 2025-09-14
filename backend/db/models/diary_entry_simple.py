from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import date, datetime

class DiaryEntry(Base):
    __tablename__ = 'diary_entries'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Date and meal information
    date = Column(Date, nullable=False, default=date.today)
    meal_type = Column(String(50), nullable=False)  # 'morgenmad', 'frokost', 'aftensmad', 'snack'
    
    # Food reference
    food_id = Column(Integer, ForeignKey('foods.id'), nullable=False)
    
    # Amount consumed in grams
    grams = Column(Float, nullable=False, default=100.0)
    
    # Relationships
    food = relationship("Food", backref="diary_entries")
    
    def calculate_nutrition(self, food):
        """Calculate nutritional values based on grams and food's per-100g values"""
        multiplier = self.grams / 100.0
        
        return {
            'calories': food.calories * multiplier,
            'protein': food.protein * multiplier,
            'carbohydrates': food.carbohydrates * multiplier,
            'fat': food.fat * multiplier,
            'fiber': food.fiber * multiplier,
            'sugar': food.sugar * multiplier,
            'saturated_fat': food.saturated_fat * multiplier,
            'unsaturated_fat': food.unsaturated_fat * multiplier,
            'cholesterol': food.cholesterol * multiplier,
            'sodium': food.sodium * multiplier,
            'potassium': food.potassium * multiplier,
            'calcium': food.calcium * multiplier,
            'iron': food.iron * multiplier,
            'vitamin_a': food.vitamin_a * multiplier,
            'vitamin_c': food.vitamin_c * multiplier,
            'vitamin_d': food.vitamin_d * multiplier,
            'vitamin_b12': food.vitamin_b12 * multiplier,
            'magnesium': food.magnesium * multiplier
        }
