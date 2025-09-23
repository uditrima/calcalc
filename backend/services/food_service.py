from db.models.food import Food
from db.database import db

class FoodService:
    def __init__(self):
        self.db = db
    
    def get_all_foods(self):
        """Return all foods from database."""
        return Food.query.all()
    
    def get_food_by_id(self, food_id):
        """Return a single food by ID."""
        return Food.query.get(food_id)
    
    def create_food(self, data):
        """Create a new food entry."""
        food = Food(
            name=data['name'],
            category=data.get('category', 'ukendt'),
            brand=data.get('brand'),
            used=data.get('used', 0),
            last_used=data.get('last_used'),
            last_portion=data.get('last_portion', 1.0),
            calories=data.get('calories', 0.0),
            protein=data.get('protein', 0.0),
            carbohydrates=data.get('carbohydrates', 0.0),
            fat=data.get('fat', 0.0),
            fiber=data.get('fiber', 0.0),
            sugar=data.get('sugar', 0.0),
            saturated_fat=data.get('saturated_fat', 0.0),
            unsaturated_fat=data.get('unsaturated_fat', 0.0),
            cholesterol=data.get('cholesterol', 0.0),
            sodium=data.get('sodium', 0.0),
            potassium=data.get('potassium', 0.0),
            calcium=data.get('calcium', 0.0),
            iron=data.get('iron', 0.0),
            vitamin_a=data.get('vitamin_a', 0.0),
            vitamin_c=data.get('vitamin_c', 0.0),
            vitamin_d=data.get('vitamin_d', 0.0),
            vitamin_b12=data.get('vitamin_b12', 0.0),
            magnesium=data.get('magnesium', 0.0)
        )
        
        self.db.session.add(food)
        self.db.session.commit()
        return food
    
    def update_food(self, food_id, data):
        """Update an existing food entry."""
        food = Food.query.get(food_id)
        if not food:
            return None
        
        # Update fields if provided in data
        if 'name' in data:
            food.name = data['name']
        if 'calories' in data:
            food.calories = data['calories']
        if 'protein' in data:
            food.protein = data['protein']
        if 'carbohydrates' in data:
            food.carbohydrates = data['carbohydrates']
        if 'fat' in data:
            food.fat = data['fat']
        if 'fiber' in data:
            food.fiber = data['fiber']
        if 'sugar' in data:
            food.sugar = data['sugar']
        if 'saturated_fat' in data:
            food.saturated_fat = data['saturated_fat']
        if 'unsaturated_fat' in data:
            food.unsaturated_fat = data['unsaturated_fat']
        if 'cholesterol' in data:
            food.cholesterol = data['cholesterol']
        if 'sodium' in data:
            food.sodium = data['sodium']
        if 'potassium' in data:
            food.potassium = data['potassium']
        if 'calcium' in data:
            food.calcium = data['calcium']
        if 'iron' in data:
            food.iron = data['iron']
        if 'vitamin_a' in data:
            food.vitamin_a = data['vitamin_a']
        if 'vitamin_c' in data:
            food.vitamin_c = data['vitamin_c']
        if 'vitamin_d' in data:
            food.vitamin_d = data['vitamin_d']
        if 'vitamin_b12' in data:
            food.vitamin_b12 = data['vitamin_b12']
        if 'magnesium' in data:
            food.magnesium = data['magnesium']
        if 'last_used' in data:
            food.last_used = data['last_used']
        if 'last_portion' in data:
            food.last_portion = data['last_portion']
        if 'used' in data:
            food.used = data['used']
        
        self.db.session.commit()
        return food
    
    def delete_food(self, food_id):
        """Delete a food entry."""
        food = Food.query.get(food_id)
        if not food:
            return False
        
        self.db.session.delete(food)
        self.db.session.commit()
        return True
