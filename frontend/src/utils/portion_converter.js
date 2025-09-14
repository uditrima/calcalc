// Portion conversion utilities
// Handles conversion between database portions (1.0 = 100g) and display values

export class PortionConverter {
    /**
     * Convert database portion value to grams for display
     * @param {number} portion - Database portion value (1.0 = 100g)
     * @returns {number} - Grams
     */
    static portionToGrams(portion) {
        return (portion || 1.0) * 100;
    }

    /**
     * Convert grams to database portion value
     * @param {number} grams - Grams
     * @returns {number} - Database portion value
     */
    static gramsToPortion(grams) {
        return (grams || 100) / 100;
    }

    /**
     * Format portion for display with proper unit
     * @param {number} portion - Database portion value
     * @param {boolean} showUnit - Whether to include "gram" unit
     * @returns {string} - Formatted string
     */
    static formatPortion(portion, showUnit = true) {
        const grams = this.portionToGrams(portion);
        const unit = showUnit ? ' gram' : '';
        return `${grams.toFixed(1)}${unit}`;
    }

    /**
     * Calculate nutrition values for a given portion
     * @param {Object} food - Food object with per-100g nutrition values
     * @param {number} portion - Database portion value
     * @returns {Object} - Calculated nutrition values
     */
    static calculateNutritionForPortion(food, portion) {
        const multiplier = portion || 1.0;
        
        return {
            calories: (food.calories || 0) * multiplier,
            protein: (food.protein || 0) * multiplier,
            carbohydrates: (food.carbohydrates || 0) * multiplier,
            fat: (food.fat || 0) * multiplier,
            fiber: (food.fiber || 0) * multiplier,
            sugar: (food.sugar || 0) * multiplier,
            saturated_fat: (food.saturated_fat || 0) * multiplier,
            unsaturated_fat: (food.unsaturated_fat || 0) * multiplier,
            cholesterol: (food.cholesterol || 0) * multiplier,
            sodium: (food.sodium || 0) * multiplier,
            potassium: (food.potassium || 0) * multiplier,
            calcium: (food.calcium || 0) * multiplier,
            iron: (food.iron || 0) * multiplier,
            vitamin_a: (food.vitamin_a || 0) * multiplier,
            vitamin_c: (food.vitamin_c || 0) * multiplier,
            vitamin_d: (food.vitamin_d || 0) * multiplier,
            vitamin_b12: (food.vitamin_b12 || 0) * multiplier,
            magnesium: (food.magnesium || 0) * multiplier
        };
    }

    /**
     * Calculate nutrition values for a given amount in grams
     * @param {Object} food - Food object with per-100g nutrition values
     * @param {number} grams - Amount in grams
     * @returns {Object} - Calculated nutrition values
     */
    static calculateNutritionForGrams(food, grams) {
        const portion = this.gramsToPortion(grams);
        return this.calculateNutritionForPortion(food, portion);
    }
}
