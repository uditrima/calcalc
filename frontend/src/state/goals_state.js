// Goals State Management
import { ApiClient } from '../data/api.js';
import { AppState } from './app_state.js';
import { 
    formatGoalsForDisplay, 
    calculateCaloriesFromMacros,
    calculateMacrosFromCalories, 
    handleGoalsApiResponse, 
    handleGoalsApiError,
    DEFAULT_GOALS,
    ALTERNATIVE_MACRO_DISTRIBUTION 
} from '../utils/goals_utils.js';

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
            
            const goalsData = handleGoalsApiResponse(
                response, 
                (goals) => {
                    this.goals = goals;
                    this.error = null;
                    // Also update AppState to keep dashboard in sync
                    AppState.setGoals(goals);
                },
                () => this.notify()
            );
        } catch (error) {
            console.log('API error, using fallback goals:', error);
            handleGoalsApiError(
                error,
                (goals) => {
                    this.goals = goals;
                    this.error = null;
                    // Also update AppState to keep dashboard in sync
                    AppState.setGoals(goals);
                },
                () => this.notify()
            );
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
        return formatGoalsForDisplay(this.goals);
    }

    // Calculate calories from macros
    calculateCaloriesFromMacros(protein, carbs, fat) {
        return calculateCaloriesFromMacros(protein, carbs, fat);
    }

    // Calculate macros from calories (distribute proportionally)
    calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat) {
        return calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat, ALTERNATIVE_MACRO_DISTRIBUTION);
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
