// Event handling and management
// Handles all application event listeners and event processing

import { AppState } from '../state/app_state.js';

export class EventManager {
    constructor(app) {
        this.app = app;
    }
    
    setupEventListeners() {
        // Navigation events
        this.app.appContainer.addEventListener('click', (event) => {
            const navItem = event.target.closest('.nav-item');
            if (navItem) {
                const view = navItem.dataset.view;
                this.app.showView(view);
            }
        });
        
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
        
        // Food section events
        this.app.appContainer.addEventListener('onGoBack', (event) => {
            console.log('Go back clicked');
            this.app.goBack();
        });
        
        this.app.appContainer.addEventListener('onGoBackToFood', (event) => {
            console.log('Go back to food clicked');
            console.log('Current state before going back to food:', AppState.getState());
            this.app.showView('food');
        });
        
        this.app.appContainer.addEventListener('onGoBackToDiary', (event) => {
            console.log('Go back to diary clicked');
            this.app.showView('diary');
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
        
        // Edit food event
        this.app.appContainer.addEventListener('onEditFood', async (event) => {
            await this.handleEditFood(event);
        });
        
        // Add food acceptance event
        this.app.appContainer.addEventListener('onAcceptFood', async (event) => {
            await this.handleAcceptFood(event);
        });
        
        // Add water events
        this.app.appContainer.addEventListener('onAddWater', (event) => {
            console.log('Add water clicked:', event.detail);
            // TODO: Handle add water
        });
        
        // Add weight events
        this.app.appContainer.addEventListener('onAddWeight', (event) => {
            console.log('Add weight clicked:', event.detail);
            this.app.showView('weight');
        });
        
        // Diary events
        this.app.appContainer.addEventListener('onAddEntry', (event) => {
            console.log('Add diary entry clicked');
            // TODO: Handle add diary entry
        });
        
        this.app.appContainer.addEventListener('onEditEntry', (event) => {
            console.log('Edit diary entry:', event.detail);
            // TODO: Handle edit diary entry
        });
        
        this.app.appContainer.addEventListener('onDeleteEntry', (event) => {
            console.log('Delete diary entry:', event.detail.entryId);
            // TODO: Handle delete diary entry
        });
        
        // Exercise events
        this.app.appContainer.addEventListener('onAddExercise', (event) => {
            console.log('Add exercise clicked');
            // TODO: Handle add exercise
        });
        
        this.app.appContainer.addEventListener('onEditExercise', (event) => {
            console.log('Edit exercise:', event.detail);
            // TODO: Handle edit exercise
        });
        
        this.app.appContainer.addEventListener('onDeleteExercise', (event) => {
            console.log('Delete exercise:', event.detail.exerciseId);
            // TODO: Handle delete exercise
        });
        
        // Weight events
        this.app.appContainer.addEventListener('onAddWeight', (event) => {
            console.log('Add weight:', event.detail);
            // TODO: Handle add weight via API
        });
        
        this.app.appContainer.addEventListener('onEditWeight', (event) => {
            console.log('Edit weight:', event.detail);
            // TODO: Handle edit weight
        });
        
        this.app.appContainer.addEventListener('onDeleteWeight', (event) => {
            console.log('Delete weight:', event.detail.weightId);
            // TODO: Handle delete weight
        });
        
        // Sticky state change events (from diary to dashboard)
        this.app.appContainer.addEventListener('onStickyStateChange', (event) => {
            console.log('Sticky state changed:', event.detail);
            // Event is handled by dashboard component directly
            // This is just for logging and potential global handling
        });
    }
    
    async handleEditFood(event) {
        console.log('Edit food clicked:', event.detail);
        const { entryId, foodId, mealType } = event.detail;
        
        try {
            console.log('Loading food data for edit - entryId:', entryId, 'foodId:', foodId, 'mealType:', mealType);
            
            // Load food data from database
            const food = await this.app.api.getFoodById(foodId);
            console.log('Loaded food for edit:', food);
            
            // Get current diary entry to get servings - use the selected date from AppState
            const state = AppState.getState();
            const selectedDate = state.diary.date || new Date().toISOString().split('T')[0];
            console.log('Loading diary entries for selected date:', selectedDate);
            const diaryEntries = await this.app.api.getDiaryEntries(selectedDate);
            console.log('Loaded diary entries:', diaryEntries);
            console.log('Looking for entry with ID:', entryId, 'Type:', typeof entryId);
            
            // Log all entry IDs for debugging
            const entryIds = diaryEntries.map(e => ({ id: e.id, type: typeof e.id }));
            console.log('Available entry IDs:', entryIds);
            
            const entry = diaryEntries.find(e => e.id === entryId);
            console.log('Found entry for edit:', entry);
            
            // Try alternative lookup methods
            if (!entry) {
                console.log('Trying alternative lookup methods...');
                const entryByStringId = diaryEntries.find(e => e.id === String(entryId));
                console.log('Entry by string ID:', entryByStringId);
                
                const entryByNumberId = diaryEntries.find(e => e.id === Number(entryId));
                console.log('Entry by number ID:', entryByNumberId);
                
                const entryByLooseId = diaryEntries.find(e => e.id == entryId);
                console.log('Entry by loose comparison:', entryByLooseId);
            }
            
            if (entry && food) {
                console.log('Both entry and food found, proceeding with edit');
                // Convert grams to portions for display
                const servings = entry.amount_grams / 100.0; // Assuming 100g = 1 portion
                console.log('Calculated servings:', servings);
                
                // Set edit mode in add-food component
                if (this.app.components.addFood) {
                    console.log('Setting edit mode in add-food component');
                    this.app.components.addFood.setEditMode(entryId, food, mealType, servings);
                    this.app.showView('add-food', 'diary');
                } else {
                    console.error('addFood component not available');
                }
            } else {
                console.error('Could not find entry or food data for edit');
                console.error('Entry found:', !!entry, 'Food found:', !!food);
                if (!entry) console.error('Entry not found for entryId:', entryId);
                if (!food) console.error('Food not found for foodId:', foodId);
                alert('Kunne ikke indlæse fødevare data til redigering');
            }
        } catch (error) {
            console.error('Error loading food for edit:', error);
            alert(`Fejl ved indlæsning af fødevare: ${error.message}`);
        }
    }
    
    async handleAcceptFood(event) {
        console.log('Accept food:', event.detail);
        const foodData = event.detail;
        
        // Update last_used timestamp for the food
        if (foodData.food.id) {
            try {
                const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp
                await this.app.api.updateFood(foodData.food.id, { last_used: currentTime });
                
                // Reload foods to get updated data
                await AppState.loadFoods();
            } catch (error) {
                console.error('Failed to update food last_used:', error);
            }
        }
        
        // TODO: Handle adding food item to diary
        console.log('Food added to diary:', foodData);
    }
}
