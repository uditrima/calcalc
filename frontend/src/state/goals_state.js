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
            } else {
                console.log('API response invalid, using fallback goals');
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
            console.log('API error, using fallback goals:', error);
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

    // Get formatted goals for display
    getFormattedGoals() {
        if (!this.goals) return null;

        // Keep original values as floats, only round for display formatting
        const calories = this.goals.daily_calories;
        const protein = this.goals.protein_target;
        const carbs = this.goals.carbs_target;
        const fat = this.goals.fat_target;

        // Calculate macro percentages using total calories
        const proteinCalories = protein * 4;
        const carbsCalories = carbs * 4;
        const fatCalories = fat * 4;

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
        return (protein * 4) + (carbs * 4) + (fat * 4);
    }

    // Calculate macros from calories (distribute proportionally)
    calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat) {
        // Calculate current macro calories
        const currentProteinCalories = currentProtein * 4;
        const currentCarbsCalories = currentCarbs * 4;
        const currentFatCalories = currentFat * 4;
        const totalCurrentMacroCalories = currentProteinCalories + currentCarbsCalories + currentFatCalories;

        // If no current macros, use default distribution
        if (totalCurrentMacroCalories === 0) {
            return {
                protein: calories * 0.25 / 4, // 25% protein
                carbs: calories * 0.45 / 4,   // 45% carbs
                fat: calories * 0.30 / 4      // 30% fat
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
            protein: newProteinCalories / 4,
            carbs: newCarbsCalories / 4,
            fat: newFatCalories / 4
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
