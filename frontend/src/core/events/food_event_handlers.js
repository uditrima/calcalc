// Complex food event handlers
// Handles edit food and accept food operations

import { AppState } from '../../state/app_state.js';

export class FoodEventHandlers {
    constructor(app) {
        this.app = app;
    }
    
    setupEventListeners() {
        // Edit food event
        this.app.appContainer.addEventListener('onEditFood', async (event) => {
            await this.handleEditFood(event);
        });
        
        // Add food acceptance event
        this.app.appContainer.addEventListener('onAcceptFood', async (event) => {
            await this.handleAcceptFood(event);
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
