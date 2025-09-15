from db.models.nutrient import Nutrient
from db.database import db

class NutrientService:
    def __init__(self):
        self.db = db
    
    def get_all_nutrients(self):
        """Get all nutrients from database."""
        return Nutrient.query.all()
    
    def get_nutrient_by_name(self, name):
        """Get nutrient by name."""
        return Nutrient.query.filter_by(name=name).first()
    
    def get_nutrient_by_id(self, nutrient_id):
        """Get nutrient by ID."""
        return Nutrient.query.get(nutrient_id)
    
    def create_nutrient(self, name, calories_per_gram, description=None):
        """Create a new nutrient."""
        nutrient = Nutrient(
            name=name,
            calories_per_gram=calories_per_gram,
            description=description
        )
        self.db.session.add(nutrient)
        self.db.session.commit()
        return nutrient
    
    def update_nutrient(self, nutrient_id, **kwargs):
        """Update an existing nutrient."""
        nutrient = Nutrient.query.get(nutrient_id)
        if not nutrient:
            return None
        
        for key, value in kwargs.items():
            if hasattr(nutrient, key):
                setattr(nutrient, key, value)
        
        self.db.session.commit()
        return nutrient
    
    def delete_nutrient(self, nutrient_id):
        """Delete a nutrient."""
        nutrient = Nutrient.query.get(nutrient_id)
        if not nutrient:
            return False
        
        self.db.session.delete(nutrient)
        self.db.session.commit()
        return True
    
    def initialize_default_nutrients(self):
        """Initialize database with default nutrient values."""
        default_nutrients = [
            {'name': 'protein', 'calories_per_gram': 4.0, 'description': 'Protein provides 4 calories per gram'},
            {'name': 'carbohydrates', 'calories_per_gram': 4.0, 'description': 'Carbohydrates provide 4 calories per gram'},
            {'name': 'fat', 'calories_per_gram': 9.0, 'description': 'Fat provides 9 calories per gram'},
            {'name': 'fiber', 'calories_per_gram': 0.0, 'description': 'Fiber provides no calories'},
            {'name': 'sugar', 'calories_per_gram': 4.0, 'description': 'Sugar provides 4 calories per gram'},
            {'name': 'alcohol', 'calories_per_gram': 7.0, 'description': 'Alcohol provides 7 calories per gram'}
        ]
        
        for nutrient_data in default_nutrients:
            existing = self.get_nutrient_by_name(nutrient_data['name'])
            if not existing:
                self.create_nutrient(
                    name=nutrient_data['name'],
                    calories_per_gram=nutrient_data['calories_per_gram'],
                    description=nutrient_data['description']
                )
    
    def get_calories_for_nutrient(self, nutrient_name, grams):
        """Calculate calories for a specific amount of a nutrient."""
        nutrient = self.get_nutrient_by_name(nutrient_name)
        if not nutrient:
            return 0.0
        return nutrient.calories_per_gram * grams
