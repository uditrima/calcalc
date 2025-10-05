// Add Food Portion Management
import { PortionConverter } from '../../utils/portion_converter.js';

/**
 * Portion management class for handling serving calculations and updates
 */
export class PortionManager {
    constructor(container, callbacks = {}) {
        this.container = container;
        this.callbacks = callbacks;
        this.currentServings = 1.0;
    }

    /**
     * Updates the servings display in the UI
     */
    updateServingsDisplay() {
        const servingsDisplay = this.container.querySelector('.servings-display');
        if (servingsDisplay) {
            servingsDisplay.textContent = this.currentServings.toFixed(1);
        }
    }

    /**
     * Sets the current servings value
     * @param {number} servings - The servings value
     */
    setServings(servings) {
        this.currentServings = servings;
        this.updateServingsDisplay();
    }

    /**
     * Gets the current servings value
     * @returns {number} The current servings
     */
    getServings() {
        return this.currentServings;
    }

    /**
     * Decreases servings by 0.1
     */
    decreaseServings() {
        if (this.currentServings > 0.1) {
            this.currentServings = Math.max(0.1, this.currentServings - 0.1);
            this.updateServingsDisplay();
            this.notifyChange();
        }
    }

    /**
     * Increases servings by 0.1
     */
    increaseServings() {
        this.currentServings = this.currentServings + 0.1;
        this.updateServingsDisplay();
        this.notifyChange();
    }

    /**
     * Handles blur event on servings input
     * @param {string} inputValue - The input value
     */
    handleServingsBlur(inputValue) {
        const newValue = parseFloat(inputValue);
        if (!isNaN(newValue) && newValue > 0) {
            this.currentServings = newValue;
            this.updateServingsDisplay();
            this.notifyChange();
        } else {
            // Reset to current value if invalid
            this.updateServingsDisplay();
        }
    }

    /**
     * Converts current servings to grams
     * @returns {number} The grams equivalent
     */
    getServingsInGrams() {
        return PortionConverter.portionToGrams(this.currentServings);
    }

    /**
     * Calculates the multiplier for nutrition calculations
     * @returns {number} The multiplier (grams / 100.0)
     */
    getNutritionMultiplier() {
        const grams = this.getServingsInGrams();
        return grams / 100.0;
    }

    /**
     * Notifies callbacks of changes
     */
    notifyChange() {
        if (this.callbacks.onServingsChange) {
            this.callbacks.onServingsChange(this.currentServings);
        }
    }

    /**
     * Updates meal dropdown value and color
     * @param {string} mealType - The meal type
     */
    updateMealDropdown(mealType) {
        const mealDropdown = this.container.querySelector('.meal-dropdown');
        if (mealDropdown) {
            mealDropdown.value = mealType;
            this.updateMealDropdownColor(mealDropdown, mealType);
        }
    }

    /**
     * Updates meal dropdown color based on meal type
     * @param {HTMLElement} dropdown - The dropdown element
     * @param {string} mealType - The meal type
     */
    updateMealDropdownColor(dropdown, mealType) {
        const mealColorMap = {
            'morgenmad': 'var(--meal-morgenmad)',
            'frokost': 'var(--meal-frokost)',
            'aftensmad': 'var(--meal-aftensmad)',
            'mellemmaaltid1': 'var(--meal-mellemm1)',
            'mellemmaaltid2': 'var(--meal-mellemm2)'
        };
        
        const mealColor = mealColorMap[mealType];
        if (mealColor) {
            dropdown.style.color = mealColor;
        }
    }
}
