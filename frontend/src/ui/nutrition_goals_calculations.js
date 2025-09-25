// Nutrition Goals Calculations
import { MACRO_CALORIES_PER_GRAM } from './nutrition_goals_constants.js';

export function calculateMacroCalories(protein, carbs, fat) {
    return {
        protein: protein * MACRO_CALORIES_PER_GRAM.protein,
        carbs: carbs * MACRO_CALORIES_PER_GRAM.carbs,
        fat: fat * MACRO_CALORIES_PER_GRAM.fat
    };
}

export function calculateMacroPercentages(protein, carbs, fat, totalCalories) {
    const macroCalories = calculateMacroCalories(protein, carbs, fat);
    
    return {
        protein: (macroCalories.protein / totalCalories) * 100,
        carbs: (macroCalories.carbs / totalCalories) * 100,
        fat: (macroCalories.fat / totalCalories) * 100
    };
}

export function calculateTotalCaloriesFromMacros(protein, carbs, fat) {
    const macroCalories = calculateMacroCalories(protein, carbs, fat);
    return macroCalories.protein + macroCalories.carbs + macroCalories.fat;
}
