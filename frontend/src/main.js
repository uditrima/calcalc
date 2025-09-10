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
        console.log('Setting up app...');
        
        // Find app container
        this.appContainer = document.getElementById('app');
        if (!this.appContainer) {
            console.error('App container #app not found');
            return;
        }
        
        // Add app-container class to #app element
        this.appContainer.className = 'app-container';
        
        console.log('App container found:', this.appContainer);
        
        // Create app structure
        this.createAppStructure();
        console.log('App structure created');
        
        // Mount components
        this.mountComponents();
        console.log('Components mounted');
        
        // Setup event listeners
        this.setupEventListeners();
        console.log('Event listeners setup');
        
        // Load initial data
        this.loadInitialData();
        console.log('Initial data loaded');
    }
    
    createAppStructure() {
        this.appContainer.innerHTML = '';
        
        // Create main layout
        const layout = document.createElement('div');
        layout.className = 'app-layout';
        
        // Header
        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = '<h1>I dag</h1>';
        layout.appendChild(header);
        
        // Main content area
        const main = document.createElement('main');
        main.className = 'app-main';
        
        // Dashboard section (main view)
        const dashboardSection = document.createElement('section');
        dashboardSection.id = 'dashboard-section';
        dashboardSection.className = 'main-view';
        main.appendChild(dashboardSection);
        
        // Food form section (slide-in)
        const foodSection = document.createElement('section');
        foodSection.id = 'food-section';
        foodSection.className = 'slide-view food-view';
        main.appendChild(foodSection);
        
        // Diary section (slide-in)
        const diarySection = document.createElement('section');
        diarySection.id = 'diary-section';
        diarySection.className = 'slide-view diary-view';
        main.appendChild(diarySection);
        
        // Exercise section (slide-in)
        const exerciseSection = document.createElement('section');
        exerciseSection.id = 'exercise-section';
        exerciseSection.className = 'slide-view exercise-view';
        main.appendChild(exerciseSection);
        
        // Weight section (slide-in)
        const weightSection = document.createElement('section');
        weightSection.id = 'weight-section';
        weightSection.className = 'slide-view weight-view';
        main.appendChild(weightSection);
        
        layout.appendChild(main);
        
        // Bottom navigation
        const nav = this.createBottomNavigation();
        layout.appendChild(nav);
        
        this.appContainer.appendChild(layout);
    }
    
    createBottomNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'bottom-nav';
        
        nav.innerHTML = `
            <div class="nav-item active" data-view="dashboard">
                <div class="nav-icon">⊞</div>
                <div class="nav-label">Dashboard</div>
            </div>
            <div class="nav-item" data-view="diary">
                <div class="nav-icon">📖</div>
                <div class="nav-label">Dagbog</div>
            </div>
            <div class="nav-item add-btn" data-view="food">
                <div class="nav-icon">+</div>
            </div>
            <div class="nav-item" data-view="progress">
                <div class="nav-icon">📊</div>
                <div class="nav-label">Fremgang</div>
            </div>
            <div class="nav-item" data-view="more">
                <div class="nav-icon">⋯</div>
                <div class="nav-label">Mere</div>
            </div>
        `;
        
        return nav;
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
    }
    
    setupEventListeners() {
        // Navigation events
        this.appContainer.addEventListener('click', (event) => {
            const navItem = event.target.closest('.nav-item');
            if (navItem) {
                const view = navItem.dataset.view;
                this.showView(view);
            }
        });
        
        // Food form events
        this.appContainer.addEventListener('onFoodSave', (event) => {
            console.log('Food saved:', event.detail);
            this.showView('dashboard');
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
    
    showView(viewName) {
        // Hide all views
        const allViews = this.appContainer.querySelectorAll('.main-view, .slide-view');
        allViews.forEach(view => {
            view.classList.remove('active');
        });
        
        // Update navigation
        const navItems = this.appContainer.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected view
        if (viewName === 'dashboard') {
            const dashboardView = this.appContainer.querySelector('.main-view');
            dashboardView.classList.add('active');
            const navItem = this.appContainer.querySelector('[data-view="dashboard"]');
            navItem.classList.add('active');
        } else {
            const slideView = this.appContainer.querySelector(`.${viewName}-view`);
            if (slideView) {
                slideView.classList.add('active');
                const navItem = this.appContainer.querySelector(`[data-view="${viewName}"]`);
                if (navItem) navItem.classList.add('active');
            }
        }
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
