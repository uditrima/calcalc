// Component mounting and management
// Handles mounting of all UI components

// Import UI components
import { Dashboard } from '../ui/dashboard.js';
import { FoodForm } from '../ui/food_form.js';
import { AddFood } from '../ui/add_food.js';
import { Diary } from '../ui/diary.js';
import { Exercise } from '../ui/exercise.js';
import { AddMenu } from '../ui/add_menu.js';
import { Weight } from '../ui/weight.js';
import { EditSettings } from '../ui/edit-profile-page.js';
import { NutritionGoals } from '../ui/nutrition_goals.js';

export class ComponentManager {
    constructor(app) {
        this.app = app;
        this.components = {};
    }
    
    mountComponents() {
        console.log('Mounting components...');
        
        // Mount Dashboard
        const dashboardContainer = document.getElementById('dashboard-section');
        console.log('Dashboard container:', dashboardContainer);
        if (dashboardContainer) {
            this.components.dashboard = Dashboard(dashboardContainer);
            console.log('Dashboard mounted:', this.components.dashboard);
        }
        
        // Mount FoodForm
        const foodContainer = document.getElementById('food-section');
        console.log('Food container:', foodContainer);
        if (foodContainer) {
            this.components.foodForm = FoodForm(foodContainer);
            console.log('FoodForm mounted:', this.components.foodForm);
        }
        
        // Mount AddFood
        const addFoodContainer = document.getElementById('add-food-section');
        console.log('AddFood container:', addFoodContainer);
        if (addFoodContainer) {
            this.components.addFood = AddFood(addFoodContainer);
            console.log('AddFood mounted:', this.components.addFood);
        }
        
        // Mount Diary
        const diaryContainer = document.getElementById('diary-section');
        console.log('Diary container:', diaryContainer);
        if (diaryContainer) {
            this.components.diary = Diary(diaryContainer);
            console.log('Diary mounted:', this.components.diary);
        }
        
        // Mount Exercise
        const exerciseContainer = document.getElementById('exercise-section');
        console.log('Exercise container:', exerciseContainer);
        if (exerciseContainer) {
            this.components.exercise = Exercise(exerciseContainer);
            console.log('Exercise mounted:', this.components.exercise);
        }
        
        // Mount Weight
        const weightContainer = document.getElementById('weight-section');
        console.log('Weight container:', weightContainer);
        if (weightContainer) {
            this.components.weight = Weight(weightContainer);
            console.log('Weight mounted:', this.components.weight);
        }
        
        // Mount EditSettings
        const settingsContainer = document.getElementById('settings-section');
        console.log('Settings container:', settingsContainer);
        if (settingsContainer) {
            this.components.settings = EditSettings(settingsContainer);
            console.log('Settings mounted:', this.components.settings);
        }
        
        // Mount NutritionGoals
        const nutritionGoalsContainer = document.getElementById('nutrition-goals-section');
        console.log('NutritionGoals container:', nutritionGoalsContainer);
        if (nutritionGoalsContainer) {
            this.components.nutritionGoals = NutritionGoals(nutritionGoalsContainer);
            console.log('NutritionGoals mounted:', this.components.nutritionGoals);
        }
        
        // Mount AddMenu
        const addMenuContainer = document.getElementById('add-menu-section');
        console.log('AddMenu container:', addMenuContainer);
        if (addMenuContainer) {
            this.components.addMenu = AddMenu(addMenuContainer);
            console.log('AddMenu mounted:', this.components.addMenu);
        }
        
        // Store components reference in app
        this.app.components = this.components;
    }
    
    getComponent(name) {
        return this.components[name];
    }
    
    hasComponent(name) {
        return !!this.components[name];
    }
}
