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
    
    # Amount consumed
    amount_grams = Column(Float, nullable=False, default=100.0)  # Amount in grams
    
    # Calculated nutritional values for this specific entry
    # (based on amount_grams and food's per-100g values)
    calories = Column(Float, nullable=False, default=0.0)
    protein = Column(Float, nullable=False, default=0.0)
    carbohydrates = Column(Float, nullable=False, default=0.0)
    fat = Column(Float, nullable=False, default=0.0)
    fiber = Column(Float, nullable=False, default=0.0)
    sugar = Column(Float, nullable=False, default=0.0)
    saturated_fat = Column(Float, nullable=False, default=0.0)
    unsaturated_fat = Column(Float, nullable=False, default=0.0)
    cholesterol = Column(Float, nullable=False, default=0.0)
    sodium = Column(Float, nullable=False, default=0.0)
    potassium = Column(Float, nullable=False, default=0.0)
    calcium = Column(Float, nullable=False, default=0.0)
    iron = Column(Float, nullable=False, default=0.0)
    vitamin_a = Column(Float, nullable=False, default=0.0)
    vitamin_c = Column(Float, nullable=False, default=0.0)
    vitamin_d = Column(Float, nullable=False, default=0.0)
    vitamin_b12 = Column(Float, nullable=False, default=0.0)
    magnesium = Column(Float, nullable=False, default=0.0)
    
    # Optional notes
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    food = relationship("Food", backref="diary_entries")
    
    def calculate_nutrition(self, food):
        """Calculate nutritional values based on amount_grams and food's per-100g values"""
        multiplier = self.amount_grams / 100.0
        
        self.calories = food.calories * multiplier
        self.protein = food.protein * multiplier
        self.carbohydrates = food.carbohydrates * multiplier
        self.fat = food.fat * multiplier
        self.fiber = food.fiber * multiplier
        self.sugar = food.sugar * multiplier
        self.saturated_fat = food.saturated_fat * multiplier
        self.unsaturated_fat = food.unsaturated_fat * multiplier
        self.cholesterol = food.cholesterol * multiplier
        self.sodium = food.sodium * multiplier
        self.potassium = food.potassium * multiplier
        self.calcium = food.calcium * multiplier
        self.iron = food.iron * multiplier
        self.vitamin_a = food.vitamin_a * multiplier
        self.vitamin_c = food.vitamin_c * multiplier
        self.vitamin_d = food.vitamin_d * multiplier
        self.vitamin_b12 = food.vitamin_b12 * multiplier
        self.magnesium = food.magnesium * multiplier
