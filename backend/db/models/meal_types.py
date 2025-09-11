# Meal type constants
class MealType:
    BREAKFAST = 'morgenmad'
    LUNCH = 'frokost'
    DINNER = 'aftensmad'
    SNACK = 'snack'
    
    ALL_TYPES = [BREAKFAST, LUNCH, DINNER, SNACK]
    
    @classmethod
    def is_valid(cls, meal_type):
        return meal_type in cls.ALL_TYPES
    
    @classmethod
    def get_display_name(cls, meal_type):
        display_names = {
            cls.BREAKFAST: 'Morgenmad',
            cls.LUNCH: 'Frokost',
            cls.DINNER: 'Aftensmad',
            cls.SNACK: 'Snack'
        }
        return display_names.get(meal_type, meal_type)
