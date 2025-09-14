// Central definition of meal types
// This is the single source of truth for meal types across the application

export const MEAL_TYPES = {
    BREAKFAST: 'morgenmad',
    LUNCH: 'frokost', 
    DINNER: 'aftensmad',
    SNACK: 'snack',
    SNACK1: 'mellemmaaltid1',
    SNACK2: 'mellemmaaltid2'
};

export const MEAL_DISPLAY_NAMES = {
    [MEAL_TYPES.BREAKFAST]: 'Morgenmad',
    [MEAL_TYPES.LUNCH]: 'Frokost',
    [MEAL_TYPES.DINNER]: 'Aftensmad', 
    [MEAL_TYPES.SNACK]: 'Snack',
    [MEAL_TYPES.SNACK1]: 'Mellemmåltid 1',
    [MEAL_TYPES.SNACK2]: 'Mellemmåltid 2'
};

// All meal types as array
export const ALL_MEAL_TYPES = Object.values(MEAL_TYPES);

// Core meal types (for food header dropdown)
export const CORE_MEAL_TYPES = [
    MEAL_TYPES.BREAKFAST,
    MEAL_TYPES.LUNCH,
    MEAL_TYPES.DINNER,
    MEAL_TYPES.SNACK
];

// Extended meal types (for add food and diary)
export const EXTENDED_MEAL_TYPES = [
    MEAL_TYPES.BREAKFAST,
    MEAL_TYPES.LUNCH,
    MEAL_TYPES.DINNER,
    MEAL_TYPES.SNACK1,
    MEAL_TYPES.SNACK2
];

// Helper functions
export function getMealDisplayName(mealType) {
    return MEAL_DISPLAY_NAMES[mealType] || mealType;
}

export function isValidMealType(mealType) {
    return ALL_MEAL_TYPES.includes(mealType);
}

export function getMealOptions(coreOnly = false) {
    const types = coreOnly ? CORE_MEAL_TYPES : EXTENDED_MEAL_TYPES;
    return types.map(type => ({
        value: type,
        label: getMealDisplayName(type)
    }));
}
