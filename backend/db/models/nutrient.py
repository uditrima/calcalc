from sqlalchemy import Column, Integer, String, Float
from db.database import db

class Nutrient(db.Model):
    __tablename__ = 'nutrients'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Nutrient name (e.g., 'protein', 'carbohydrates', 'fat', 'fiber')
    name = Column(String(100), nullable=False, unique=True)
    
    # Calories per gram
    calories_per_gram = Column(Float, nullable=False)
    
    # Optional: Description of the nutrient
    description = Column(String(255), nullable=True)
    
    def __repr__(self):
        return f'<Nutrient(name={self.name}, calories_per_gram={self.calories_per_gram})>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'calories_per_gram': self.calories_per_gram,
            'description': self.description
        }
