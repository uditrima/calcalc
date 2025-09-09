// Main application entry point
import { AppState } from './state/app_state.js';
import { Dashboard } from './ui/dashboard.js';
import { FoodForm } from './ui/food_form.js';
import { Diary } from './ui/diary.js';
import { Exercise } from './ui/exercise.js';
import { Weight } from './ui/weight.js';

class CalorieTrackerApp {
    constructor() {
        this.appContainer = null;
        this.components = {};
        this.init();
    }
    
    async init() {
        console.log('Kalorie Tracker App initialiseret');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    setupApp() {
        // Find app container
        this.appContainer = document.getElementById('app');
        if (!this.appContainer) {
            console.error('App container #app not found');
            return;
        }
        
        // Create app structure
        this.createAppStructure();
        
        // Mount components
        this.mountComponents();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadInitialData();
    }
    
    createAppStructure() {
        this.appContainer.innerHTML = '';
        
        // Create main layout
        const layout = document.createElement('div');
        layout.className = 'app-layout';
        
        // Header
        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = '<h1>Kalorie Tracker</h1>';
        layout.appendChild(header);
        
        // Main content area
        const main = document.createElement('main');
        main.className = 'app-main';
        
        // Dashboard section
        const dashboardSection = document.createElement('section');
        dashboardSection.id = 'dashboard-section';
        dashboardSection.className = 'section';
        main.appendChild(dashboardSection);
        
        // Food management section
        const foodSection = document.createElement('section');
        foodSection.id = 'food-section';
        foodSection.className = 'section';
        main.appendChild(foodSection);
        
        // Diary section
        const diarySection = document.createElement('section');
        diarySection.id = 'diary-section';
        diarySection.className = 'section';
        main.appendChild(diarySection);
        
        // Exercise section
        const exerciseSection = document.createElement('section');
        exerciseSection.id = 'exercise-section';
        exerciseSection.className = 'section';
        main.appendChild(exerciseSection);
        
        // Weight section
        const weightSection = document.createElement('section');
        weightSection.id = 'weight-section';
        weightSection.className = 'section';
        main.appendChild(weightSection);
        
        layout.appendChild(main);
        this.appContainer.appendChild(layout);
    }
    
    mountComponents() {
        // Mount Dashboard
        const dashboardContainer = document.getElementById('dashboard-section');
        this.components.dashboard = Dashboard(dashboardContainer);
        
        // Mount FoodForm
        const foodContainer = document.getElementById('food-section');
        this.components.foodForm = FoodForm(foodContainer);
        
        // Mount Diary
        const diaryContainer = document.getElementById('diary-section');
        this.components.diary = Diary(diaryContainer);
        
        // Mount Exercise
        const exerciseContainer = document.getElementById('exercise-section');
        this.components.exercise = Exercise(exerciseContainer);
        
        // Mount Weight
        const weightContainer = document.getElementById('weight-section');
        this.components.weight = Weight(weightContainer);
    }
    
    setupEventListeners() {
        // Food form events
        this.appContainer.addEventListener('onFoodSave', (event) => {
            console.log('Food saved:', event.detail);
            // TODO: Handle food save via API
        });
        
        // Diary events
        this.appContainer.addEventListener('onAddEntry', (event) => {
            console.log('Add diary entry clicked');
            // TODO: Handle add diary entry
        });
        
        this.appContainer.addEventListener('onEditEntry', (event) => {
            console.log('Edit diary entry:', event.detail);
            // TODO: Handle edit diary entry
        });
        
        this.appContainer.addEventListener('onDeleteEntry', (event) => {
            console.log('Delete diary entry:', event.detail.entryId);
            // TODO: Handle delete diary entry
        });
        
        // Exercise events
        this.appContainer.addEventListener('onAddExercise', (event) => {
            console.log('Add exercise clicked');
            // TODO: Handle add exercise
        });
        
        this.appContainer.addEventListener('onEditExercise', (event) => {
            console.log('Edit exercise:', event.detail);
            // TODO: Handle edit exercise
        });
        
        this.appContainer.addEventListener('onDeleteExercise', (event) => {
            console.log('Delete exercise:', event.detail.exerciseId);
            // TODO: Handle delete exercise
        });
        
        // Weight events
        this.appContainer.addEventListener('onAddWeight', (event) => {
            console.log('Add weight:', event.detail);
            // TODO: Handle add weight via API
        });
        
        this.appContainer.addEventListener('onEditWeight', (event) => {
            console.log('Edit weight:', event.detail);
            // TODO: Handle edit weight
        });
        
        this.appContainer.addEventListener('onDeleteWeight', (event) => {
            console.log('Delete weight:', event.detail.weightId);
            // TODO: Handle delete weight
        });
    }
    
    async loadInitialData() {
        try {
            console.log('Loading initial data...');
            
            // Load all data in parallel
            await Promise.all([
                AppState.loadFoods(),
                AppState.loadDiary(new Date().toISOString().split('T')[0]),
                AppState.loadExercises(new Date().toISOString().split('T')[0]),
                AppState.loadWeights(),
                AppState.loadGoals()
            ]);
            
            console.log('Initial data loaded successfully');
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CalorieTrackerApp();
});
