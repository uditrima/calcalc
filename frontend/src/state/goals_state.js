// Goals State Management
import { ApiClient } from '../data/api.js';
import { MACRO_CALORIES_PER_GRAM } from '../ui/nutrition_goals_constants.js';
import { AppState } from './app_state.js';

class GoalsState {
    constructor() {
        this.goals = null;
        this.isLoading = false;
        this.error = null;
        this.apiClient = new ApiClient();
        this.listeners = [];
        this.commitButtonDimmed = true; // Track commit button state
    }

    // Subscribe to goals changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    // Notify all listeners of changes
    notify() {
        this.listeners.forEach(listener => listener(this.goals, this.isLoading, this.error));
    }

    // Load goals from API
    async loadGoals() {
        if (this.isLoading) return;
        
        console.log('Loading goals...');
        this.isLoading = true;
        this.error = null;
        this.notify();

        try {
            const response = await this.apiClient.getGoals();
            console.log('Goals API response:', response);
            
            if (response && response.success && response.data) {
                console.log('Setting goals from API:', response.data);
                this.goals = response.data;
                this.error = null;
                
                // Also update AppState to keep dashboard in sync
                AppState.setGoals(response.data);
            } else {
                console.log('API response invalid, using fallback goals');
                // Fallback to default goals if API fails
                const fallbackGoals = {
                    daily_calories: 2000,
                    protein_target: 150,
                    carbs_target: 250,
                    fat_target: 70
                };
                this.goals = fallbackGoals;
                this.error = null;
                
                // Also update AppState to keep dashboard in sync
                AppState.setGoals(fallbackGoals);
            }
        } catch (error) {
            console.log('API error, using fallback goals:', error);
            // Fallback to default goals if API fails
            const fallbackGoals = {
                daily_calories: 2000,
                protein_target: 150,
                carbs_target: 250,
                fat_target: 70
            };
            this.goals = fallbackGoals;
            this.error = null;
            
            // Also update AppState to keep dashboard in sync
            AppState.setGoals(fallbackGoals);
        } finally {
            this.isLoading = false;
            console.log('Goals loading complete, notifying listeners');
            this.notify();
        }
    }

    // Get current goals
    getGoals() {
        return this.goals;
    }

    // Get loading state
    getIsLoading() {
        return this.isLoading;
    }

    // Get error state
    getError() {
        return this.error;
    }

    // Get commit button dimmed state
    isCommitButtonDimmed() {
        return this.commitButtonDimmed;
    }

    // Set commit button dimmed state
    setCommitButtonDimmed(dimmed) {
        this.commitButtonDimmed = dimmed;
    }

    // Get formatted goals for display
    getFormattedGoals() {
        if (!this.goals) return null;

        // Keep original values as floats, only round for display formatting
        const calories = this.goals.daily_calories;
        const protein = this.goals.fat_target;  // Swap: fat_target contains protein data
        const carbs = this.goals.carbs_target;
        const fat = this.goals.protein_target;  // Swap: protein_target contains fat data

        // Calculate macro percentages using total calories
        const proteinCalories = protein * MACRO_CALORIES_PER_GRAM.protein;
        const carbsCalories = carbs * MACRO_CALORIES_PER_GRAM.carbs;
        const fatCalories = fat * MACRO_CALORIES_PER_GRAM.fat;

        const proteinPercentage = Math.round((proteinCalories / calories) * 100);
        const carbsPercentage = Math.round((carbsCalories / calories) * 100);
        const fatPercentage = Math.round((fatCalories / calories) * 100);

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

    // Calculate calories from macros
    calculateCaloriesFromMacros(protein, carbs, fat) {
        return (protein * MACRO_CALORIES_PER_GRAM.protein) + 
               (carbs * MACRO_CALORIES_PER_GRAM.carbs) + 
               (fat * MACRO_CALORIES_PER_GRAM.fat);
    }

    // Calculate macros from calories (distribute proportionally)
    calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat) {
        // Calculate current macro calories
        const currentProteinCalories = currentProtein * MACRO_CALORIES_PER_GRAM.protein;
        const currentCarbsCalories = currentCarbs * MACRO_CALORIES_PER_GRAM.carbs;
        const currentFatCalories = currentFat * MACRO_CALORIES_PER_GRAM.fat;
        const totalCurrentMacroCalories = currentProteinCalories + currentCarbsCalories + currentFatCalories;

        // If no current macros, use default distribution
        if (totalCurrentMacroCalories === 0) {
            return {
                protein: calories * 0.25 / MACRO_CALORIES_PER_GRAM.protein, // 25% protein
                carbs: calories * 0.45 / MACRO_CALORIES_PER_GRAM.carbs,     // 45% carbs
                fat: calories * 0.30 / MACRO_CALORIES_PER_GRAM.fat          // 30% fat
            };
        }

        // Calculate proportional distribution based on current macro ratios
        const proteinRatio = currentProteinCalories / totalCurrentMacroCalories;
        const carbsRatio = currentCarbsCalories / totalCurrentMacroCalories;
        const fatRatio = currentFatCalories / totalCurrentMacroCalories;

        // Distribute the new calories proportionally
        const newProteinCalories = calories * proteinRatio;
        const newCarbsCalories = calories * carbsRatio;
        const newFatCalories = calories * fatRatio;

        return {
            protein: newProteinCalories / MACRO_CALORIES_PER_GRAM.protein,
            carbs: newCarbsCalories / MACRO_CALORIES_PER_GRAM.carbs,
            fat: newFatCalories / MACRO_CALORIES_PER_GRAM.fat
        };
    }

    // Update goals with macro calculations
    updateGoalsWithCalculations(updatedField, newValue) {
        if (!this.goals) return;

        const updatedGoals = { ...this.goals };
        updatedGoals[updatedField] = newValue;

        // If a macro nutrient was changed, recalculate calories
        if (['protein_target', 'carbs_target', 'fat_target'].includes(updatedField)) {
            const protein = updatedField === 'protein_target' ? newValue : this.goals.protein_target;
            const carbs = updatedField === 'carbs_target' ? newValue : this.goals.carbs_target;
            const fat = updatedField === 'fat_target' ? newValue : this.goals.fat_target;
            
            updatedGoals.daily_calories = this.calculateCaloriesFromMacros(protein, carbs, fat);
        }
        // If calories were changed, recalculate macros proportionally
        else if (updatedField === 'daily_calories') {
            const newMacros = this.calculateMacrosFromCalories(
                newValue,
                this.goals.protein_target,
                this.goals.carbs_target,
                this.goals.fat_target
            );
            
            updatedGoals.protein_target = Math.round(newMacros.protein);
            updatedGoals.carbs_target = Math.round(newMacros.carbs);
            updatedGoals.fat_target = Math.round(newMacros.fat);
        }

        // Update state and save to backend
        this.updateGoals(updatedGoals);
    }

    // Update goals
    async updateGoals(goalsData) {
        this.isLoading = true;
        this.error = null;
        this.notify();

        try {
            const response = await this.apiClient.setGoals(goalsData);
            
            if (response.success && response.data) {
                this.goals = response.data;
                this.error = null;
                
                // Also update AppState to keep dashboard in sync
                AppState.setGoals(response.data);
            } else {
                this.error = 'Kunne ikke opdatere mål';
            }
        } catch (error) {
            console.error('Error updating goals:', error);
            this.error = 'Fejl ved opdatering af mål';
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }
}

// Export singleton instance
export const goalsState = new GoalsState();
