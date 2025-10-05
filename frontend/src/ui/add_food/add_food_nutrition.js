// Add Food Nutrition Calculations
import { AppState } from '../../state/app_state.js';

/**
 * Nutrition calculation class for handling macro calculations and goal updates
 */
export class NutritionCalculator {
    constructor(container) {
        this.container = container;
    }

    /**
     * Updates the selected food display
     * @param {Object} currentFood - The current food object
     */
    updateSelectedFood(currentFood) {
        const foodNameElement = this.container.querySelector('.selected-food-name');
        const foodCategoryElement = this.container.querySelector('.food-category');

        if (currentFood) {
            const brandText = currentFood.brand ? `(${currentFood.brand}) ` : '';
            foodNameElement.textContent = `${currentFood.name} - ${brandText}`;

            // Create span element for category
            const span = document.createElement('span');
            span.className = `text-subtitle food-category-${currentFood.category.replaceAll(' ', '-')} || ''}`;
            span.textContent = currentFood.category || 'ukendt';
            foodNameElement.appendChild(span);
        } else {
            foodNameElement.textContent = 'Vælg en fødevare';
        }
    }

    /**
     * Updates the summary section with nutrition data
     * @param {Object} currentFood - The current food object
     * @param {number} multiplier - The nutrition multiplier
     */
    updateSummary(currentFood, multiplier) {
        if (!currentFood) return;
        
        const totalCalories = Math.round((currentFood.calories || 0) * multiplier);
        const totalCarbs = ((currentFood.carbohydrates || 0) * multiplier).toFixed(1);
        const totalFat = ((currentFood.fat || 0) * multiplier).toFixed(1);
        const totalProtein = ((currentFood.protein || 0) * multiplier).toFixed(1);
        
        // Update calorie gauge
        const caloriesText = this.container.querySelector('.calories-text');
        if (caloriesText) {
            caloriesText.textContent = totalCalories;
        }
        
        // Update macros
        const macroItems = this.container.querySelectorAll('.macro-item');
        if (macroItems.length >= 3) {
            const totalMacros = parseFloat(totalCarbs) + parseFloat(totalFat) + parseFloat(totalProtein);
            const carbsPercent = totalMacros > 0 ? Math.round((parseFloat(totalCarbs) / totalMacros) * 100) : 0;
            const fatPercent = totalMacros > 0 ? Math.round((parseFloat(totalFat) / totalMacros) * 100) : 0;
            const proteinPercent = totalMacros > 0 ? Math.round((parseFloat(totalProtein) / totalMacros) * 100) : 0;
            
            // Update carbs
            const carbsItem = macroItems[0];
            carbsItem.querySelector('.macro-percentage').textContent = `${carbsPercent}%`;
            carbsItem.querySelector('.macro-amount').textContent = `${totalCarbs}g`;
            
            // Update protein
            const proteinItem = macroItems[1];
            proteinItem.querySelector('.macro-percentage').textContent = `${proteinPercent}%`;
            proteinItem.querySelector('.macro-amount').textContent = `${totalProtein}g`;
            
            // Update fat
            const fatItem = macroItems[2];
            fatItem.querySelector('.macro-percentage').textContent = `${fatPercent}%`;
            fatItem.querySelector('.macro-amount').textContent = `${totalFat}g`;
        }
    }

    /**
     * Updates the daily goals section
     * @param {Object} currentFood - The current food object
     * @param {number} multiplier - The nutrition multiplier
     */
    updateDailyGoals(currentFood, multiplier) {
        if (!currentFood) return;
        
        // Get goals data
        const formattedGoals = AppState.getFormattedGoals();
        if (!formattedGoals) return;
        
        const totalCalories = Math.round((currentFood.calories || 0) * multiplier);
        const totalCarbs = ((currentFood.carbohydrates || 0) * multiplier).toFixed(1);
        const totalFat = ((currentFood.fat || 0) * multiplier).toFixed(1);
        const totalProtein = ((currentFood.protein || 0) * multiplier).toFixed(1);
        
        // Calculate percentages
        const caloriesPercentage = Math.round((totalCalories / formattedGoals.calories.value) * 100);
        const carbsPercentage = Math.round((parseFloat(totalCarbs) / formattedGoals.carbs.value) * 100);
        const fatPercentage = Math.round((parseFloat(totalFat) / formattedGoals.fat.value) * 100);
        const proteinPercentage = Math.round((parseFloat(totalProtein) / formattedGoals.protein.value) * 100);

        // Update goal items
        const goalItems = this.container.querySelectorAll('.goal-item');
        if (goalItems.length >= 4) {
            // Update calories
            const caloriesItem = goalItems[0];
            caloriesItem.querySelector('.goal-percentage').textContent = `${caloriesPercentage}%`;
            caloriesItem.querySelector('.goal-amount').textContent = formattedGoals.calories.formatted;
            const caloriesProgressFill = caloriesItem.querySelector('.progress-fill');
            caloriesProgressFill.style.width = `${Math.min(caloriesPercentage, 100)}%`;
            caloriesProgressFill.style.background = 'var(--color-calories)';
            
            // Update carbs
            const carbsItem = goalItems[1];
            carbsItem.querySelector('.goal-percentage').textContent = `${carbsPercentage}%`;
            carbsItem.querySelector('.goal-amount').textContent = formattedGoals.carbs.formatted;
            const carbsProgressFill = carbsItem.querySelector('.progress-fill');
            carbsProgressFill.style.width = `${Math.min(carbsPercentage, 100)}%`;
            carbsProgressFill.style.background = 'var(--color-carbs)';
            
            // Update protein (index 2)
            const proteinItem = goalItems[2];
            proteinItem.querySelector('.goal-percentage').textContent = `${proteinPercentage}%`;
            proteinItem.querySelector('.goal-amount').textContent = formattedGoals.protein.formatted;
            const proteinProgressFill = proteinItem.querySelector('.progress-fill');
            proteinProgressFill.style.width = `${Math.min(proteinPercentage, 100)}%`;
            proteinProgressFill.style.background = 'var(--color-protein)';
            
            // Update fat (index 3)
            const fatItem = goalItems[3];
            fatItem.querySelector('.goal-percentage').textContent = `${fatPercentage}%`;
            fatItem.querySelector('.goal-amount').textContent = formattedGoals.fat.formatted;
            const fatProgressFill = fatItem.querySelector('.progress-fill');
            fatProgressFill.style.width = `${Math.min(fatPercentage, 100)}%`;
            fatProgressFill.style.background = 'var(--color-fat)';
        }
    }

    /**
     * Loads paired foods for the current food
     * @param {Object} currentFood - The current food object
     */
    loadPairedFoods(currentFood) {
        if (!currentFood) return;
        
        // TODO: Implement paired foods loading based on current food
        const pairedFoodsList = this.container.querySelector('.paired-foods-list');
        if (pairedFoodsList) {
            pairedFoodsList.innerHTML = '<p>Indlæser parrede fødevarer...</p>';
            
            // Simulate loading paired foods
            setTimeout(() => {
                pairedFoodsList.innerHTML = '<p>Ingen parrede fødevarer fundet</p>';
            }, 1000);
        }
    }

    /**
     * Updates header for edit mode
     */
    updateHeaderForEditMode() {
        const title = this.container.querySelector('.add-food-title');
        if (title) {
            title.textContent = 'Rediger fødevare';
        }
    }

    /**
     * Updates header for add mode
     */
    updateHeaderForAddMode() {
        const title = this.container.querySelector('.add-food-title');
        if (title) {
            title.textContent = 'Tilføj fødevare';
        }
    }
}
