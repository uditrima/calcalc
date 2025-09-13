from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import datetime

class FoodAssociation(Base):
    __tablename__ = 'food_associations'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Meal context
    meal_type = Column(String(50), nullable=False)  # 'morgenmad', 'frokost', 'aftensmad', 'snack'
    
    # Food pair (order doesn't matter - we'll always store smaller ID first)
    food1_id = Column(Integer, ForeignKey('foods.id'), nullable=False)
    food2_id = Column(Integer, ForeignKey('foods.id'), nullable=False)
    
    # Association metrics
    co_occurrence_count = Column(Integer, nullable=False, default=0)  # How many times they appear together
    total_occurrences_food1 = Column(Integer, nullable=False, default=0)  # Total times food1 appears in this meal
    total_occurrences_food2 = Column(Integer, nullable=False, default=0)  # Total times food2 appears in this meal
    
    # Calculated confidence and support
    confidence = Column(Float, nullable=False, default=0.0)  # P(food2|food1) = co_occurrence / total_occurrences_food1
    support = Column(Float, nullable=False, default=0.0)  # P(food1 AND food2) = co_occurrence / total_meals
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    food1 = relationship("Food", foreign_keys=[food1_id])
    food2 = relationship("Food", foreign_keys=[food2_id])
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_meal_food_pair', 'meal_type', 'food1_id', 'food2_id', unique=True),
        Index('idx_meal_confidence', 'meal_type', 'confidence'),
        Index('idx_meal_support', 'meal_type', 'support'),
    )
    
    def update_metrics(self, total_meals_in_type):
        """Update confidence and support based on current counts"""
        if self.total_occurrences_food1 > 0:
            self.confidence = self.co_occurrence_count / self.total_occurrences_food1
        else:
            self.confidence = 0.0
            
        if total_meals_in_type > 0:
            self.support = self.co_occurrence_count / total_meals_in_type
        else:
            self.support = 0.0
    
    @classmethod
    def get_or_create(cls, session, meal_type, food1_id, food2_id):
        """Get existing association or create new one, ensuring food1_id < food2_id"""
        # Ensure consistent ordering
        if food1_id > food2_id:
            food1_id, food2_id = food2_id, food1_id
            
        association = session.query(cls).filter_by(
            meal_type=meal_type,
            food1_id=food1_id,
            food2_id=food2_id
        ).first()
        
        if not association:
            association = cls(
                meal_type=meal_type,
                food1_id=food1_id,
                food2_id=food2_id
            )
            session.add(association)
            
        return association
