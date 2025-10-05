// Diary Food Items component
import { PortionConverter } from '../../utils/portion_converter.js';
import { addSwipeToDelete } from './diary_swipe.js';

/**
 * Creates a food item element
 * @param {Object} entry - The diary entry data
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {HTMLElement} The food item element
 */
export function createFoodItem(entry, container) {
    const item = document.createElement('div');
    item.className = 'diary-food-item';
    
    // Add entry ID as data attribute for deletion
    if (entry.id) {
        item.setAttribute('data-entry-id', entry.id);
    }
    
    // Add food ID as data attribute if available
    if (entry.food_id) {
        item.setAttribute('data-food-id', entry.food_id);
    }
    
    // Format grams for display
    const grams = entry.amount_grams || entry.grams || 0;
    const portionGrams = PortionConverter.formatPortion(grams / 100.0, true); // Convert grams to portions
    
    item.innerHTML = `
        <div class="diary-food-item-content">
            <div class="diary-food-name">${entry.food_name || 'Ukendt fødevare'}</div>
            <div class="diary-food-portion">${portionGrams}</div>
            <div class="diary-food-item-calories">${Math.round(entry.calories || 0)} cal</div>
        </div>
    `;
    
    // Add swipe functionality
    addSwipeToDelete(item, container);
    
    // Add click event listener for edit mode
    item.addEventListener('click', (e) => {
        const entryId = item.getAttribute('data-entry-id');
        const foodId = item.getAttribute('data-food-id');
        
        if (entryId && foodId) {
            const customEvent = new CustomEvent('onEditFood', {
                detail: { 
                    entryId: parseInt(entryId),
                    foodId: parseInt(foodId),
                    mealType: entry.meal_type
                },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        }
    });
    
    // Add touch event listener for edit mode (backup for mobile)
    let touchStartTime = 0;
    let touchStartY = 0;
    item.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    item.addEventListener('touchend', (e) => {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchEndY = e.changedTouches[0].clientY;
        const touchDistance = Math.abs(touchEndY - touchStartY);
        
        // Only trigger edit if it was a quick tap (not a swipe) and no swipe was detected
        if (touchDuration < 300 && touchDistance < 10) {
            const entryId = item.getAttribute('data-entry-id');
            const foodId = item.getAttribute('data-food-id');
            
            if (entryId && foodId) {
                const customEvent = new CustomEvent('onEditFood', {
                    detail: { 
                        entryId: parseInt(entryId),
                        foodId: parseInt(foodId),
                        mealType: entry.meal_type
                    },
                    bubbles: true
                });
                container.dispatchEvent(customEvent);
            }
        }
    }, { passive: true });
    
    return item;
}

/**
 * Creates an exercise item element
 * @param {Object} exercise - The exercise data
 * @returns {HTMLElement} The exercise item element
 */
export function createExerciseItem(exercise) {
    const item = document.createElement('div');
    item.className = 'exercise-item';
    item.innerHTML = `
        <div class="exercise-name">${exercise.name || 'Ukendt øvelse'}</div>
        <div class="exercise-duration">${exercise.duration_minutes || 0} min</div>
        <div class="exercise-calories">${Math.round(exercise.calories_burned || 0)} cal</div>
    `;
    return item;
}
