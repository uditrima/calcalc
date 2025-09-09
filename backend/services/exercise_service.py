from db.models.exercise import Exercise
from db.database import db
from datetime import date

class ExerciseService:
    def __init__(self):
        self.db = db
    
    def get_exercises_by_date(self, target_date):
        """Return all exercises for a given date."""
        return Exercise.query.filter_by(date=target_date).all()
    
    def add_exercise(self, name, duration_minutes, calories_burned, target_date=None):
        """Create a new exercise entry."""
        if target_date is None:
            target_date = date.today()
        
        exercise = Exercise(
            name=name,
            duration_minutes=duration_minutes,
            calories_burned=calories_burned,
            date=target_date
        )
        
        self.db.session.add(exercise)
        self.db.session.commit()
        return exercise
    
    def update_exercise(self, exercise_id, data):
        """Update an existing exercise entry."""
        exercise = Exercise.query.get(exercise_id)
        if not exercise:
            return None
        
        # Update fields if provided
        if 'name' in data:
            exercise.name = data['name']
        if 'duration_minutes' in data:
            exercise.duration_minutes = data['duration_minutes']
        if 'calories_burned' in data:
            exercise.calories_burned = data['calories_burned']
        if 'date' in data:
            exercise.date = data['date']
        
        self.db.session.commit()
        return exercise
    
    def delete_exercise(self, exercise_id):
        """Delete an exercise entry."""
        exercise = Exercise.query.get(exercise_id)
        if not exercise:
            return False
        
        self.db.session.delete(exercise)
        self.db.session.commit()
        return True
