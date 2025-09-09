from sqlalchemy import Column, Integer, Float
from db.database import db

class UserGoals(db.Model):
    __tablename__ = 'user_goals'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Goal fields with defaults
    daily_calories = Column(Float, default=2000.0)
    protein_target = Column(Float, default=150.0)
    carbs_target = Column(Float, default=250.0)
    fat_target = Column(Float, default=70.0)
