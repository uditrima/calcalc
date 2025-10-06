// Food-related event handlers
// Handles food form, add food, and food selection events

import { AppState } from '../../state/app_state.js';

export class FoodEvents {
    constructor(app) {
        this.app = app;
    }
    
    setupEventListeners() {
        // Food form events
        this.app.appContainer.addEventListener('onFoodSave', (event) => {
            console.log('Food saved:', event.detail);
            this.app.showView('dashboard');
        });
        
        // Add food events
        this.app.appContainer.addEventListener('onAddFood', (event) => {
            console.log('Add food clicked:', event.detail);
            // Determine where we came from based on the event detail
            const fromView = event.detail && event.detail.mealType ? 'diary' : 'dashboard';
            this.app.showView('food', fromView);
            
            // If mealType is provided, set it in the food form
            if (event.detail && event.detail.mealType && this.app.components.foodForm) {
                this.app.components.foodForm.setMealType(event.detail.mealType);
            }
            
            // Also set meal type in add-food component if available
            if (event.detail && event.detail.mealType && this.app.components.addFood) {
                this.app.components.addFood.setMealType(event.detail.mealType);
            }
        });
        
        this.app.appContainer.addEventListener('onFoodSelect', (event) => {
            console.log('Food selected:', event.detail);
            // Navigate to add food view with selected food
            if (this.app.components.addFood) {
                this.app.components.addFood.setFood(event.detail);
                this.app.showView('add-food', 'food');
            }
        });
        
        this.app.appContainer.addEventListener('onAddFoodItem', async (event) => {
            console.log('Add food item:', event.detail);
            const food = event.detail;
            
            // Get current meal type from food-section title
            const foodSection = document.getElementById('food-section');
            let mealType = 'morgenmad'; // default
            
            if (foodSection) {
                const mealTitle = foodSection.querySelector('.meal-title');
                if (mealTitle) {
                    const titleText = mealTitle.textContent.toLowerCase();
                    // Map Danish meal titles to meal types
                    const mealTypeMap = {
                        'morgenmad': 'morgenmad',
                        'frokost': 'frokost', 
                        'aftensmad': 'aftensmad',
                        'mellemmaaltid 1': 'mellemmaaltid1',
                        'mellemmaaltid 2': 'mellemmaaltid2'
                    };
                    mealType = mealTypeMap[titleText] || 'morgenmad';
                }
            }
            
            // Navigate to add food view with selected food and meal type
            if (this.app.components.addFood) {
                this.app.components.addFood.setFood(food);
                this.app.components.addFood.setMealType(mealType);
                this.app.showView('add-food', 'food');
            }
        });
    }
}
