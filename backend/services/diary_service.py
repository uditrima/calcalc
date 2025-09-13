from db.models.diary_entry_improved import DiaryEntry
from db.models.food import Food
from db.database import db
from services.food_association_service import FoodAssociationService
from datetime import date

class DiaryService:
    def __init__(self):
        self.db = db
    
    def get_entries_by_date(self, target_date):
        """Return all diary entries for a given date."""
        return DiaryEntry.query.filter_by(date=target_date).all()
    
    def add_entry(self, food_id, grams, meal_type, target_date=None):
        """Create a new diary entry."""
        if target_date is None:
            target_date = date.today()
        
        # Get food to calculate nutrition
        food = Food.query.get(food_id)
        if not food:
            return None
        
        entry = DiaryEntry(
            food_id=food_id,
            amount_grams=grams,
            meal_type=meal_type,
            date=target_date
        )
        
        # Calculate nutrition values
        entry.calculate_nutrition(food)
        
        self.db.session.add(entry)
        self.db.session.commit()
        
        # Update food associations (temporarily disabled for debugging)
        # association_service = FoodAssociationService(self.db.session)
        # association_service.update_associations_for_meal(target_date, meal_type)
        
        return entry
    
    def update_entry(self, entry_id, data):
        """Update an existing diary entry."""
        entry = DiaryEntry.query.get(entry_id)
        if not entry:
            return None
        
        # Update fields if provided
        if 'grams' in data:
            entry.grams = data['grams']
        if 'meal_type' in data:
            entry.meal_type = data['meal_type']
        if 'date' in data:
            entry.date = data['date']
        if 'food_id' in data:
            entry.food_id = data['food_id']
        
        self.db.session.commit()
        return entry
    
    def delete_entry(self, entry_id):
        """Delete a diary entry."""
        entry = DiaryEntry.query.get(entry_id)
        if not entry:
            return False
        
        self.db.session.delete(entry)
        self.db.session.commit()
        return True
    
    def calculate_entry_nutrition(self, entry):
        """Calculate nutrition values for a diary entry."""
        if not entry or not entry.food:
            return {}
        
        # Return the already calculated values from the entry
        return {
            'calories': entry.calories,
            'protein': entry.protein,
            'carbohydrates': entry.carbohydrates,
            'fat': entry.fat,
            'fiber': entry.fiber,
            'sugar': entry.sugar,
            'saturated_fat': entry.saturated_fat,
            'unsaturated_fat': entry.unsaturated_fat,
            'cholesterol': entry.cholesterol,
            'sodium': entry.sodium,
            'potassium': entry.potassium,
            'calcium': entry.calcium,
            'iron': entry.iron,
            'vitamin_a': entry.vitamin_a,
            'vitamin_c': entry.vitamin_c,
            'vitamin_d': entry.vitamin_d,
            'vitamin_b12': entry.vitamin_b12,
            'magnesium': entry.magnesium
        }
    
    def calculate_daily_nutrition(self, target_date):
        """Calculate total daily nutrition for a given date."""
        entries = self.get_entries_by_date(target_date)
        total_nutrition = {
            'calories': 0.0,
            'protein': 0.0,
            'carbohydrates': 0.0,
            'fat': 0.0,
            'fiber': 0.0,
            'sugar': 0.0,
            'saturated_fat': 0.0,
            'unsaturated_fat': 0.0,
            'cholesterol': 0.0,
            'sodium': 0.0,
            'potassium': 0.0,
            'calcium': 0.0,
            'iron': 0.0,
            'vitamin_a': 0.0,
            'vitamin_c': 0.0,
            'vitamin_d': 0.0,
            'vitamin_b12': 0.0,
            'magnesium': 0.0
        }
        
        for entry in entries:
            entry_nutrition = self.calculate_entry_nutrition(entry)
            for nutrient, value in entry_nutrition.items():
                total_nutrition[nutrient] += value
        
        return total_nutrition
