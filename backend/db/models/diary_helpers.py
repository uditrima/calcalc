from sqlalchemy import func, and_
from datetime import date, datetime, timedelta
from db.models.diary_entry import DiaryEntry
from db.models.food import Food
from db.models.meal_types import MealType

class DiaryHelpers:
    @staticmethod
    def get_daily_summary(session, target_date):
        """Get total nutritional intake for a specific date"""
        entries = session.query(DiaryEntry).filter(DiaryEntry.date == target_date).all()
        
        summary = {
            'date': target_date,
            'total_calories': sum(entry.calories for entry in entries),
            'total_protein': sum(entry.protein for entry in entries),
            'total_carbohydrates': sum(entry.carbohydrates for entry in entries),
            'total_fat': sum(entry.fat for entry in entries),
            'total_fiber': sum(entry.fiber for entry in entries),
            'total_sugar': sum(entry.sugar for entry in entries),
            'total_saturated_fat': sum(entry.saturated_fat for entry in entries),
            'total_unsaturated_fat': sum(entry.unsaturated_fat for entry in entries),
            'total_cholesterol': sum(entry.cholesterol for entry in entries),
            'total_sodium': sum(entry.sodium for entry in entries),
            'total_potassium': sum(entry.potassium for entry in entries),
            'total_calcium': sum(entry.calcium for entry in entries),
            'total_iron': sum(entry.iron for entry in entries),
            'total_vitamin_a': sum(entry.vitamin_a for entry in entries),
            'total_vitamin_c': sum(entry.vitamin_c for entry in entries),
            'total_vitamin_d': sum(entry.vitamin_d for entry in entries),
            'total_vitamin_b12': sum(entry.vitamin_b12 for entry in entries),
            'total_magnesium': sum(entry.magnesium for entry in entries),
            'meal_breakdown': {}
        }
        
        # Break down by meal type
        for meal_type in MealType.ALL_TYPES:
            meal_entries = [e for e in entries if e.meal_type == meal_type]
            summary['meal_breakdown'][meal_type] = {
                'calories': sum(entry.calories for entry in meal_entries),
                'protein': sum(entry.protein for entry in meal_entries),
                'carbohydrates': sum(entry.carbohydrates for entry in meal_entries),
                'fat': sum(entry.fat for entry in meal_entries),
                'entry_count': len(meal_entries)
            }
        
        return summary
    
    @staticmethod
    def get_meal_entries(session, target_date, meal_type):
        """Get all entries for a specific date and meal type"""
        return session.query(DiaryEntry).filter(
            and_(
                DiaryEntry.date == target_date,
                DiaryEntry.meal_type == meal_type
            )
        ).all()
    
    @staticmethod
    def get_food_usage_history(session, food_id, days=30):
        """Get usage history for a specific food over the last N days"""
        start_date = date.today() - timedelta(days=days)
        
        return session.query(DiaryEntry).filter(
            and_(
                DiaryEntry.food_id == food_id,
                DiaryEntry.date >= start_date
            )
        ).order_by(DiaryEntry.date.desc()).all()
    
    @staticmethod
    def get_most_used_foods(session, days=30, limit=10):
        """Get most frequently used foods over the last N days"""
        start_date = date.today() - timedelta(days=days)
        
        return session.query(
            Food,
            func.count(DiaryEntry.id).label('usage_count'),
            func.sum(DiaryEntry.calories).label('total_calories')
        ).join(DiaryEntry).filter(
            DiaryEntry.date >= start_date
        ).group_by(Food.id).order_by(
            func.count(DiaryEntry.id).desc()
        ).limit(limit).all()
    
    @staticmethod
    def get_recent_foods(session, days=7, limit=20):
        """Get recently used foods (based on last_used timestamp)"""
        cutoff_time = int((datetime.now() - timedelta(days=days)).timestamp())
        
        return session.query(Food).filter(
            Food.last_used >= cutoff_time
        ).order_by(Food.last_used.desc()).limit(limit).all()
    
    @staticmethod
    def get_weekly_summary(session, start_date):
        """Get weekly nutritional summary"""
        end_date = start_date + timedelta(days=6)
        
        entries = session.query(DiaryEntry).filter(
            and_(
                DiaryEntry.date >= start_date,
                DiaryEntry.date <= end_date
            )
        ).all()
        
        # Group by date
        daily_summaries = {}
        for entry in entries:
            if entry.date not in daily_summaries:
                daily_summaries[entry.date] = {
                    'calories': 0,
                    'protein': 0,
                    'carbohydrates': 0,
                    'fat': 0,
                    'entry_count': 0
                }
            
            daily_summaries[entry.date]['calories'] += entry.calories
            daily_summaries[entry.date]['protein'] += entry.protein
            daily_summaries[entry.date]['carbohydrates'] += entry.carbohydrates
            daily_summaries[entry.date]['fat'] += entry.fat
            daily_summaries[entry.date]['entry_count'] += 1
        
        return daily_summaries
