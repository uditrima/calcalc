from db.models.user_settings import UserSettings
from db.database import db
from datetime import date
from typing import Optional, Dict, Any

class UserSettingsService:
    """Service for managing user settings"""
    
    @staticmethod
    def get_settings() -> Optional[UserSettings]:
        """Get the current user settings (assuming single user for now)"""
        return UserSettings.query.first()
    
    @staticmethod
    def create_default_settings() -> UserSettings:
        """Create default settings if none exist"""
        settings = UserSettings()
        db.session.add(settings)
        db.session.commit()
        return settings
    
    @staticmethod
    def get_or_create_settings() -> UserSettings:
        """Get existing settings or create default ones"""
        settings = UserSettingsService.get_settings()
        if not settings:
            settings = UserSettingsService.create_default_settings()
        return settings
    
    @staticmethod
    def update_settings(settings_data: Dict[str, Any]) -> UserSettings:
        """Update user settings with provided data"""
        settings = UserSettingsService.get_or_create_settings()
        
        # Update personal metrics
        if 'height_cm' in settings_data:
            settings.height_cm = float(settings_data['height_cm'])
        if 'starting_weight_kg' in settings_data:
            settings.starting_weight_kg = float(settings_data['starting_weight_kg'])
        if 'starting_weight_date' in settings_data:
            settings.starting_weight_date = date.fromisoformat(settings_data['starting_weight_date'])
        if 'current_weight_kg' in settings_data:
            settings.current_weight_kg = float(settings_data['current_weight_kg'])
        if 'goal_weight_kg' in settings_data:
            settings.goal_weight_kg = float(settings_data['goal_weight_kg'])
        if 'weekly_goal_kg' in settings_data:
            settings.weekly_goal_kg = float(settings_data['weekly_goal_kg'])
        
        # Update nutrition goals settings
        if 'customize_daily_goals' in settings_data:
            settings.customize_daily_goals = bool(settings_data['customize_daily_goals'])
        if 'calorie_goals_by_meal' in settings_data:
            settings.calorie_goals_by_meal = bool(settings_data['calorie_goals_by_meal'])
        if 'show_nutrients_by_meal' in settings_data:
            settings.show_nutrients_by_meal = bool(settings_data['show_nutrients_by_meal'])
        if 'show_nutrients_as_percent' in settings_data:
            settings.show_nutrients_as_percent = bool(settings_data['show_nutrients_as_percent'])
        if 'additional_nutrient_goals' in settings_data:
            settings.additional_nutrient_goals = bool(settings_data['additional_nutrient_goals'])
        
        # Update fitness goals settings
        if 'workouts_per_week' in settings_data:
            settings.workouts_per_week = int(settings_data['workouts_per_week'])
        if 'minutes_per_workout' in settings_data:
            settings.minutes_per_workout = int(settings_data['minutes_per_workout'])
        if 'adjust_daily_goals_on_exercise' in settings_data:
            settings.adjust_daily_goals_on_exercise = bool(settings_data['adjust_daily_goals_on_exercise'])
        
        # Update UI settings
        if 'theme' in settings_data:
            settings.theme = str(settings_data['theme'])
        if 'language' in settings_data:
            settings.language = str(settings_data['language'])
        if 'units' in settings_data:
            settings.units = str(settings_data['units'])
        
        # Update timestamp
        settings.updated_at = date.today()
        
        db.session.commit()
        return settings
    
    @staticmethod
    def delete_settings() -> bool:
        """Delete all user settings"""
        try:
            UserSettings.query.delete()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting settings: {e}")
            return False
