# Meal type constants
class MealType:
    BREAKFAST = 'morgenmad'
    LUNCH = 'frokost'
    DINNER = 'aftensmad'
    SNACK = 'snack'
    SNACK1 = 'mellemmaaltid1'
    SNACK2 = 'mellemmaaltid2'
    
    # Core meal types (4) - used in food header dropdown
    CORE_TYPES = [BREAKFAST, LUNCH, DINNER, SNACK]
    
    # Extended meal types (5) - used in add food and diary
    EXTENDED_TYPES = [BREAKFAST, LUNCH, DINNER, SNACK1, SNACK2]
    
    # All meal types
    ALL_TYPES = [BREAKFAST, LUNCH, DINNER, SNACK, SNACK1, SNACK2]
    
    @classmethod
    def is_valid(cls, meal_type):
        return meal_type in cls.ALL_TYPES
    
    @classmethod
    def get_display_name(cls, meal_type):
        display_names = {
            cls.BREAKFAST: 'Morgenmad',
            cls.LUNCH: 'Frokost',
            cls.DINNER: 'Aftensmad',
            cls.SNACK: 'Snack',
            cls.SNACK1: 'Mellemmåltid 1',
            cls.SNACK2: 'Mellemmåltid 2'
        }
        return display_names.get(meal_type, meal_type)
    
    @classmethod
    def get_core_types(cls):
        return cls.CORE_TYPES
    
    @classmethod
    def get_extended_types(cls):
        return cls.EXTENDED_TYPES
