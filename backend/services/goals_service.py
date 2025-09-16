from db.models.user_goals import UserGoals
from db.database import db

class GoalsService:
    def __init__(self):
        self.db = db
    
    def get_goals(self):
        """Return the current goals (assuming single goals record)."""
        return UserGoals.query.first()
    
    def set_goals(self, data):
        """Create or overwrite goals."""
        # Delete ALL existing goals first
        UserGoals.query.delete()
        self.db.session.commit()
        
        # Create new goals
        goals = UserGoals(
            daily_calories=data.get('daily_calories', 2000.0),
            protein_target=data.get('protein_target', 150.0),
            carbs_target=data.get('carbs_target', 250.0),
            fat_target=data.get('fat_target', 70.0)
        )
        
        self.db.session.add(goals)
        self.db.session.commit()
        return goals
    
    def update_goals(self, goal_id, data):
        """Update existing goals."""
        # Since we only have one goals record, get the first one
        goals = UserGoals.query.first()
        if not goals:
            # If no goals exist, create new ones
            return self.set_goals(data)
        
        # Update fields if provided
        if 'daily_calories' in data:
            goals.daily_calories = data['daily_calories']
        if 'protein_target' in data:
            goals.protein_target = data['protein_target']
        if 'carbs_target' in data:
            goals.carbs_target = data['carbs_target']
        if 'fat_target' in data:
            goals.fat_target = data['fat_target']
        
        self.db.session.commit()
        return goals
