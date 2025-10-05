// Diary State Updates component
import { AppState } from '../../state/app_state.js';
import { EXTENDED_MEAL_TYPES } from '../../data/meal_types.js';
import { createFoodItem, createExerciseItem } from './diary_food_items.js';

/**
 * Updates meal sections with current state data
 * @param {Object} state - The current app state
 */
export function updateMealSections(state = null) {
    const currentState = state || AppState.getState();
    const entries = currentState.diary.entries || [];
    
    // Update meal calories for each meal type
    const mealTypes = EXTENDED_MEAL_TYPES;
    
    mealTypes.forEach(mealType => {
        const mealEntries = entries.filter(entry => entry.meal_type === mealType);
        const totalCalories = mealEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        
        const mealSection = document.querySelector(`[data-meal-type="${mealType}"]`);
        if (mealSection) {
            const caloriesElement = mealSection.querySelector('.meal-calories');
            if (caloriesElement) {
                caloriesElement.textContent = Math.round(totalCalories);
            }
        }
    });
    
    // Update exercise calories
    const exerciseEntries = currentState.exercises || [];
    const exerciseCalories = exerciseEntries.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
    
    const exerciseSection = document.querySelector('[data-exercise-type="motion"]');
    if (exerciseSection) {
        const caloriesElement = exerciseSection.querySelector('.meal-calories');
        if (caloriesElement) {
            caloriesElement.textContent = Math.round(exerciseCalories);
        }
    }
    
    // Update meal section content with actual entries
    updateMealSectionsFromEntries(currentState);
}

/**
 * Updates meal sections from diary entries
 * @param {Object} state - The current app state
 * @param {string} dateString - The date string (optional)
 */
export function updateMealSectionsFromEntries(state, dateString) {
    if (!state) {
        return;
    }
    const diaryEntries = (state.diary && state.diary.entries) || [];
    
    // Group entries by meal type
    const entriesByMeal = {};
    diaryEntries.forEach(entry => {
        const mealType = entry.meal_type || 'morgenmad';
        if (!entriesByMeal[mealType]) {
            entriesByMeal[mealType] = [];
        }
        entriesByMeal[mealType].push(entry);
    });
    
    // Update all meal sections (including empty ones)
    const allMealSections = document.querySelectorAll('[data-meal]');
    allMealSections.forEach(mealSection => {
        const mealType = mealSection.getAttribute('data-meal');
        const entries = entriesByMeal[mealType] || [];
        updateMealSectionContent(mealSection, entries);
    });
    
    // Clean up any UI elements that don't match current state
    const stateEntryIds = new Set(diaryEntries.map(e => e.id));
    const uiElements = document.querySelectorAll('[data-entry-id]');
    uiElements.forEach(element => {
        const elementEntryId = parseInt(element.getAttribute('data-entry-id'));
        if (!stateEntryIds.has(elementEntryId)) {
            if (element._cleanupSwipe) {
                element._cleanupSwipe();
            }
            element.remove();
        }
    });
}

/**
 * Updates a meal section's content
 * @param {HTMLElement} mealSection - The meal section element
 * @param {Array} entries - The diary entries for this meal
 */
export function updateMealSectionContent(mealSection, entries) {
    // Find the food list container
    const foodList = mealSection.querySelector('.diary-food-list');
    if (!foodList) return;
    
    // Clear existing content
    foodList.innerHTML = '';
    
    // Add entries
    entries.forEach(entry => {
        const foodItem = createFoodItem(entry, document.querySelector('.diary'));
        foodList.appendChild(foodItem);
    });
    
    // Update meal totals
    const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const caloriesElement = mealSection.querySelector('.meal-calories');
    if (caloriesElement) {
        caloriesElement.textContent = `${Math.round(totalCalories)}`;
    }
}

/**
 * Updates the exercise section
 * @param {Object} state - The current app state
 */
export function updateExerciseSection(state = null) {
    const currentState = state || AppState.getState();
    if (!currentState) {
        return;
    }
    const exercises = currentState.exercises || [];
    
    // Find exercise section
    const exerciseSection = document.querySelector('.exercise-section');
    if (!exerciseSection) return;
    
    // Update exercise list
    const exerciseList = exerciseSection.querySelector('.exercise-list');
    if (exerciseList) {
        exerciseList.innerHTML = '';
        
        exercises.forEach(exercise => {
            const exerciseItem = createExerciseItem(exercise);
            exerciseList.appendChild(exerciseItem);
        });
    }
    
    // Update exercise totals
    const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
    const totalElement = exerciseSection.querySelector('.exercise-total');
    if (totalElement) {
        totalElement.textContent = `${Math.round(totalCalories)} cal`;
    }
}
