// Goals Utilities
// Shared logic for goals calculations and formatting

import { MACRO_CALORIES_PER_GRAM } from '../ui/nutrition_goals_constants.js';

/**
 * Default fallback goals configuration
 */
export const DEFAULT_GOALS = {
    daily_calories: 2000,
    protein_target: 150,
    carbs_target: 250,
    fat_target: 70
};

/**
 * Default macro distribution for calories-to-macros conversion
 */
export const DEFAULT_MACRO_DISTRIBUTION = {
    protein: 0.25, // 25%
    carbs: 0.50,   // 50%
    fat: 0.25      // 25%
};

/**
 * Alternative macro distribution (used in GoalsState)
 */
export const ALTERNATIVE_MACRO_DISTRIBUTION = {
    protein: 0.25, // 25%
    carbs: 0.45,   // 45%
    fat: 0.30      // 30%
};

/**
 * Formats goals data for display
 * @param {Object} goals - Goals object
 * @returns {Object|null} Formatted goals or null if invalid
 */
export function formatGoalsForDisplay(goals) {
    if (!goals || Object.keys(goals).length === 0) {
        console.warn('formatGoalsForDisplay: No goals data available, returning null');
        return null;
    }

    // Keep original values as floats, only round for display formatting
    const calories = goals.daily_calories;
    const protein = goals.protein_target;
    const carbs = goals.carbs_target;
    const fat = goals.fat_target;

    // Validate that all required properties exist
    if (calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
        console.warn('formatGoalsForDisplay: Incomplete goals data, returning null');
        return null;
    }

    // Calculate macro percentages using total calories
    const proteinCalories = protein * MACRO_CALORIES_PER_GRAM.protein;
    const carbsCalories = carbs * MACRO_CALORIES_PER_GRAM.carbs;
    const fatCalories = fat * MACRO_CALORIES_PER_GRAM.fat;

    const proteinPercentage = (proteinCalories / calories) * 100;
    const carbsPercentage = (carbsCalories / calories) * 100;
    const fatPercentage = (fatCalories / calories) * 100;

    return {
        calories: {
            value: calories,
            formatted: calories % 1 === 0 ? calories.toLocaleString() : calories.toFixed(1)
        },
        protein: {
            value: protein,
            formatted: protein % 1 === 0 ? `${protein}g` : `${protein.toFixed(1)}g`,
            percentage: `${proteinPercentage}%`
        },
        carbs: {
            value: carbs,
            formatted: carbs % 1 === 0 ? `${carbs}g` : `${carbs.toFixed(1)}g`,
            percentage: `${carbsPercentage}%`
        },
        fat: {
            value: fat,
            formatted: fat % 1 === 0 ? `${fat}g` : `${fat.toFixed(1)}g`,
            percentage: `${fatPercentage}%`
        }
    };
}

/**
 * Calculates calories from macro nutrients
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbohydrates in grams
 * @param {number} fat - Fat in grams
 * @returns {number} Total calories
 */
export function calculateCaloriesFromMacros(protein, carbs, fat) {
    return (protein * MACRO_CALORIES_PER_GRAM.protein) + 
           (carbs * MACRO_CALORIES_PER_GRAM.carbs) + 
           (fat * MACRO_CALORIES_PER_GRAM.fat);
}

/**
 * Calculates macro nutrients from calories using proportional distribution
 * @param {number} calories - Total calories
 * @param {number} currentProtein - Current protein in grams
 * @param {number} currentCarbs - Current carbohydrates in grams
 * @param {number} currentFat - Current fat in grams
 * @param {Object} defaultDistribution - Default distribution to use if no current macros
 * @returns {Object} Calculated macro nutrients
 */
export function calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat, defaultDistribution = DEFAULT_MACRO_DISTRIBUTION) {
    // Calculate current macro calories
    const currentProteinCalories = currentProtein * MACRO_CALORIES_PER_GRAM.protein;
    const currentCarbsCalories = currentCarbs * MACRO_CALORIES_PER_GRAM.carbs;
    const currentFatCalories = currentFat * MACRO_CALORIES_PER_GRAM.fat;
    const totalCurrentMacroCalories = currentProteinCalories + currentCarbsCalories + currentFatCalories;

    // If no current macros, use default distribution
    if (totalCurrentMacroCalories === 0) {
        return {
            protein: calories * defaultDistribution.protein / MACRO_CALORIES_PER_GRAM.protein,
            carbs: calories * defaultDistribution.carbs / MACRO_CALORIES_PER_GRAM.carbs,
            fat: calories * defaultDistribution.fat / MACRO_CALORIES_PER_GRAM.fat
        };
    }

    // Calculate new macros maintaining current proportions
    const proteinRatio = currentProteinCalories / totalCurrentMacroCalories;
    const carbsRatio = currentCarbsCalories / totalCurrentMacroCalories;
    const fatRatio = currentFatCalories / totalCurrentMacroCalories;

    return {
        protein: (calories * proteinRatio) / MACRO_CALORIES_PER_GRAM.protein,
        carbs: (calories * carbsRatio) / MACRO_CALORIES_PER_GRAM.carbs,
        fat: (calories * fatRatio) / MACRO_CALORIES_PER_GRAM.fat
    };
}

/**
 * Handles goals API response with fallback
 * @param {Object} response - API response
 * @param {Function} setGoalsCallback - Callback to set goals
 * @param {Function} notifyCallback - Callback to notify listeners
 * @returns {Object} Goals data or fallback
 */
export function handleGoalsApiResponse(response, setGoalsCallback, notifyCallback) {
    if (response && response.success && response.data) {
        console.log('Setting goals from API:', response.data);
        setGoalsCallback(response.data);
        notifyCallback();
        return response.data;
    } else {
        console.log('API response invalid, using fallback goals');
        setGoalsCallback(DEFAULT_GOALS);
        notifyCallback();
        return DEFAULT_GOALS;
    }
}

/**
 * Handles goals API error with fallback
 * @param {Error} error - API error
 * @param {Function} setGoalsCallback - Callback to set goals
 * @param {Function} notifyCallback - Callback to notify listeners
 * @returns {Object} Fallback goals
 */
export function handleGoalsApiError(error, setGoalsCallback, notifyCallback) {
    console.error('Failed to load goals:', error);
    setGoalsCallback(DEFAULT_GOALS);
    notifyCallback();
    return DEFAULT_GOALS;
}
