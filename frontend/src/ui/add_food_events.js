// Add Food Event Handling and API Calls
import { AppState } from '../state/app_state.js';
import { ApiClient } from '../data/api.js';
import { PortionConverter } from '../utils/portion_converter.js';

/**
 * Event handler class for managing add food events and API calls
 */
export class AddFoodEventHandler {
    constructor(container, portionManager, nutritionCalculator) {
        this.container = container;
        this.portionManager = portionManager;
        this.nutritionCalculator = nutritionCalculator;
        this.api = new ApiClient();
        
        // State variables
        this.currentFood = null;
        this.currentMealType = 'morgenmad';
        this.isEditMode = false;
        this.currentEntryId = null;
        this.cameFromDiary = false;
    }

    /**
     * Sets the current food
     * @param {Object} food - The food object
     */
    setFood(food) {
        this.currentFood = food;
        // Set currentServings to last_portion from database, default to 1.0 if not available
        this.portionManager.setServings(food.last_portion || 1.0);
        this.updateAllDisplays();
    }

    /**
     * Gets the current food
     * @returns {Object} The current food
     */
    getFood() {
        return this.currentFood;
    }

    /**
     * Gets the current servings
     * @returns {number} The current servings
     */
    getServings() {
        return this.portionManager.getServings();
    }

    /**
     * Gets the current meal type
     * @returns {string} The current meal type
     */
    getMealType() {
        return this.currentMealType;
    }

    /**
     * Sets the meal type
     * @param {string} mealType - The meal type
     */
    setMealType(mealType) {
        this.currentMealType = mealType;
        this.portionManager.updateMealDropdown(mealType);
    }

    /**
     * Sets edit mode
     * @param {string} entryId - The entry ID
     * @param {Object} food - The food object
     * @param {string} mealType - The meal type
     * @param {number} servings - The servings
     */
    setEditMode(entryId, food, mealType, servings) {
        this.isEditMode = true;
        this.currentEntryId = entryId;
        this.currentFood = food;
        this.currentMealType = mealType;
        this.portionManager.setServings(servings);
        this.cameFromDiary = true;
        this.nutritionCalculator.updateHeaderForEditMode();
        this.updateAllDisplays();
    }

    /**
     * Clears edit mode
     */
    clearEditMode() {
        this.isEditMode = false;
        this.currentEntryId = null;
        this.cameFromDiary = false;
        this.nutritionCalculator.updateHeaderForAddMode();
    }

    /**
     * Checks if in edit mode
     * @returns {boolean} True if in edit mode
     */
    isInEditMode() {
        return this.isEditMode;
    }

    /**
     * Gets the current entry ID
     * @returns {string} The current entry ID
     */
    getCurrentEntryId() {
        return this.currentEntryId;
    }

    /**
     * Updates all displays
     */
    updateAllDisplays() {
        this.nutritionCalculator.updateSelectedFood(this.currentFood);
        const multiplier = this.portionManager.getNutritionMultiplier();
        this.nutritionCalculator.updateSummary(this.currentFood, multiplier);
        this.nutritionCalculator.updateDailyGoals(this.currentFood, multiplier);
        this.nutritionCalculator.loadPairedFoods(this.currentFood);
    }

    /**
     * Handles meal type change
     * @param {string} mealType - The new meal type
     */
    handleMealChange(mealType) {
        this.currentMealType = mealType;
    }

    /**
     * Handles servings change
     * @param {number} servings - The new servings
     */
    handleServingsChange(servings) {
        const multiplier = this.portionManager.getNutritionMultiplier();
        this.nutritionCalculator.updateSummary(this.currentFood, multiplier);
        this.nutritionCalculator.updateDailyGoals(this.currentFood, multiplier);
    }

    /**
     * Handles go back action
     */
    handleGoBack() {
        if (this.cameFromDiary) {
            // If we came from diary, go back to diary
            this.dispatchCustomEvent('onGoBackToDiary');
        } else {
            // Normal navigation back to food
            this.dispatchCustomEvent('onGoBackToFood');
        }
    }

    /**
     * Handles accept food action
     */
    async handleAcceptFood() {
        if (!this.currentFood) {
            console.log('Ingen fødevare valgt');
            return;
        }
        
        // Convert currentServings (portions) to grams for backend
        const portionInGrams = this.portionManager.getServingsInGrams();
        
        // Get selected date from AppState (not today's date)
        const state = AppState.getState();
        const selectedDate = state.diary.date || new Date().toISOString().split('T')[0];
        console.log('Using selected date for food operation:', selectedDate);
        
        try {
            let response;
            
            if (this.isEditMode && this.currentEntryId) {
                // Edit existing entry
                const updateData = {
                    food_id: this.currentFood.id,
                    amount_grams: portionInGrams,
                    meal_type: this.currentMealType
                };
                
                console.log('Updating diary entry:', this.currentEntryId, updateData);
                response = await this.api.updateDiaryEntry(this.currentEntryId, updateData);
            } else {
                // Add new entry
                const diaryEntryData = {
                    food_id: this.currentFood.id,
                    amount_grams: portionInGrams,
                    meal_type: this.currentMealType,
                    date: selectedDate
                };
                
                console.log('Saving new diary entry:', diaryEntryData);
                response = await this.api.addDiaryEntry(diaryEntryData);
            }
            
            console.log('API response:', response);
            
            if (response && response.success) {
                console.log('Diary entry saved/updated successfully:', response);
                
                // Reload diary data to show updated entries for the selected date
                await AppState.loadDiary(selectedDate);
                
                // Update last_used timestamp, last_portion, and used counter for the food
                await this.updateFoodUsage();
                
                // Go back to appropriate view based on where we came from
                this.handleGoBack();
                
                // Clear edit mode if we were in it (after navigation)
                if (this.isEditMode) {
                    this.clearEditMode();
                }
                
            } else {
                console.error('Failed to save/update diary entry - no success flag:', response);
                alert(`Fejl ved gemning af fødevare: ${response?.error || 'Ukendt fejl'}`);
            }
        } catch (error) {
            console.error('Error saving/updating diary entry:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            alert(`Fejl ved gemning af fødevare: ${error.message}`);
        }
    }

    /**
     * Updates food usage statistics
     */
    async updateFoodUsage() {
        if (this.currentFood.id) {
            try {
                const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp
                const newUsedCount = (this.currentFood.used || 0) + 1;
                await this.api.updateFood(this.currentFood.id, { 
                    last_used: currentTime,
                    last_portion: this.portionManager.getServings(),
                    used: newUsedCount
                });
                
                // Reload foods to get updated data
                await AppState.loadFoods();
            } catch (error) {
                console.error('Failed to update food last_used, last_portion, and used count:', error);
            }
        }
    }

    /**
     * Dispatches a custom event
     * @param {string} eventName - The event name
     * @param {Object} detail - The event detail
     */
    dispatchCustomEvent(eventName, detail = {}) {
        const customEvent = new CustomEvent(eventName, {
            bubbles: true,
            detail: detail
        });
        
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
    }

    /**
     * Handles fold out action
     */
    handleFoldOut() {
        // TODO: Implement fold out functionality
        console.log('Fold out clicked');
    }
}
