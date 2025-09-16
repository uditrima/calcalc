// Nutrition Goals Constants
export const KNOB_RANGES = {
    Kalorier: { min: 500, max: 5000, step: 50 },
    Kulhydrater: { min: 50, max: 500, step: 5 },
    Protein: { min: 50, max: 300, step: 5 },
    Fedt: { min: 20, max: 200, step: 2 }
};

export const LABEL_TO_FIELD_MAP = {
    'Kalorier': 'daily_calories',
    'Kulhydrater': 'carbs_target',
    'Protein': 'protein_target',
    'Fedt': 'fat_target'
};

export const MACRO_CALORIES_PER_GRAM = {
    protein: 4,
    carbs: 4,
    fat: 9
};

export const MACRO_LABELS = ['Protein', 'Kulhydrater', 'Fedt'];
