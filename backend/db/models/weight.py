from sqlalchemy import Column, Integer, Float, Date
from db.database import db
from datetime import date

class Weight(db.Model):
    __tablename__ = 'weights'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Required fields
    date = Column(Date, default=date.today)
    weight_kg = Column(Float, nullable=False)
