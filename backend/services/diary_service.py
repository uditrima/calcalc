from db.models.diary_entry import DiaryEntry
from db.models.food import Food
from db.database import db
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
            grams=grams,
            meal_type=meal_type,
            date=target_date
        )
        
        self.db.session.add(entry)
        self.db.session.commit()
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
        
        food = entry.food
        grams = entry.grams
        multiplier = grams / 100.0
        
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
