// Goals State Management
import { ApiClient } from '../data/api.js';

class GoalsState {
    constructor() {
        this.goals = null;
        this.isLoading = false;
        this.error = null;
        this.apiClient = new ApiClient();
        this.listeners = [];
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
        
        this.isLoading = true;
        this.error = null;
        this.notify();

        try {
            const response = await this.apiClient.getGoals();
            
            if (response && response.success && response.data) {
                this.goals = response.data;
                this.error = null;
            } else {
                // Fallback to default goals if API fails
                this.goals = {
                    daily_calories: 2000,
                    protein_target: 150,
                    carbs_target: 250,
                    fat_target: 70
                };
                this.error = null;
            }
        } catch (error) {
            // Fallback to default goals if API fails
            this.goals = {
                daily_calories: 2000,
                protein_target: 150,
                carbs_target: 250,
                fat_target: 70
            };
            this.error = null;
        } finally {
            this.isLoading = false;
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

    // Get formatted goals for display
    getFormattedGoals() {
        if (!this.goals) return null;

        // Keep original values as floats, only round for display formatting
        const calories = this.goals.daily_calories;
        const protein = this.goals.protein_target;
        const carbs = this.goals.carbs_target;
        const fat = this.goals.fat_target;

        // Calculate macro percentages using original values
        const proteinCalories = protein * 4;
        const carbsCalories = carbs * 4;
        const fatCalories = fat * 9;
        const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

        const proteinPercentage = Math.round((proteinCalories / totalMacroCalories) * 100);
        const carbsPercentage = Math.round((carbsCalories / totalMacroCalories) * 100);
        const fatPercentage = Math.round((fatCalories / totalMacroCalories) * 100);

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
