// Nutrition Goals Constants
export const KNOB_RANGES = {
    Kalorier: { min: 0, max: 3500, step: 1 },
    Kulhydrater: { min: 0, max: 350, step: 1 },
    Protein: { min: 0, max: 350, step: 1 },
    Fedt: { min: 0, max: 150, step: 1 }
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
