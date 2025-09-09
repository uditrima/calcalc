from sqlalchemy import Column, Integer, String, Float, Date
from db.database import db
from datetime import date

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Required fields
    name = Column(String(255), nullable=False)
    duration_minutes = Column(Float, default=0.0)
    calories_burned = Column(Float, default=0.0)
    date = Column(Date, default=date.today)
