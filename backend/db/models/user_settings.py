from sqlalchemy import Column, Integer, Float, String, Date, Boolean
from db.database import db
from datetime import date

class UserSettings(db.Model):
    __tablename__ = 'user_settings'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Personal Metrics
    height_cm = Column(Float, default=179.0)
    starting_weight_kg = Column(Float, default=97.0)
    starting_weight_date = Column(Date, default=date.today)
    current_weight_kg = Column(Float, default=101.5)
    goal_weight_kg = Column(Float, default=85.0)
    weekly_goal_kg = Column(Float, default=0.5)  # Positive for weight loss, negative for gain
    
    # Nutrition Goals Settings
    customize_daily_goals = Column(Boolean, default=True)
    calorie_goals_by_meal = Column(Boolean, default=True)
    show_nutrients_by_meal = Column(Boolean, default=True)
    show_nutrients_as_percent = Column(Boolean, default=False)  # False = grams, True = percent
    additional_nutrient_goals = Column(Boolean, default=False)
    
    # Fitness Goals Settings
    workouts_per_week = Column(Integer, default=0)
    minutes_per_workout = Column(Integer, default=0)
    adjust_daily_goals_on_exercise = Column(Boolean, default=True)
    
    # UI Settings
    theme = Column(String(20), default='dark')
    language = Column(String(5), default='da')
    units = Column(String(10), default='metric')  # metric or imperial
    
    # Timestamps
    created_at = Column(Date, default=date.today)
    updated_at = Column(Date, default=date.today)
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'height_cm': self.height_cm,
            'starting_weight_kg': self.starting_weight_kg,
            'starting_weight_date': self.starting_weight_date.isoformat() if self.starting_weight_date else None,
            'current_weight_kg': self.current_weight_kg,
            'goal_weight_kg': self.goal_weight_kg,
            'weekly_goal_kg': self.weekly_goal_kg,
            'customize_daily_goals': self.customize_daily_goals,
            'calorie_goals_by_meal': self.calorie_goals_by_meal,
            'show_nutrients_by_meal': self.show_nutrients_by_meal,
            'show_nutrients_as_percent': self.show_nutrients_as_percent,
            'additional_nutrient_goals': self.additional_nutrient_goals,
            'workouts_per_week': self.workouts_per_week,
            'minutes_per_workout': self.minutes_per_workout,
            'adjust_daily_goals_on_exercise': self.adjust_daily_goals_on_exercise,
            'theme': self.theme,
            'language': self.language,
            'units': self.units,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<UserSettings(id={self.id}, height={self.height_cm}cm, current_weight={self.current_weight_kg}kg)>'
