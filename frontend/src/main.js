// Main application entry point
import { AppState } from './state/app_state.js';
import { ApiClient } from './data/api.js';
import { Dashboard } from './ui/dashboard.js';
import { FoodForm } from './ui/food_form.js';
import { AddFood } from './ui/add_food.js';
import { Diary } from './ui/diary.js';
import { Exercise } from './ui/exercise.js';
import { AddMenu } from './ui/add_menu.js';
import { Weight } from './ui/weight.js';
import { EditSettings } from './ui/edit-profile-page.js';

class CalorieTrackerApp {
    constructor() {
        this.appContainer = null;
        this.components = {};
        this.api = new ApiClient('http://localhost:5000/api');
        this.navigationHistory = [];
        this.init();
    }
    
    getCurrentDateInDanish() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        
        const danishMonths = [
            'januar', 'februar', 'marts', 'april', 'maj', 'juni',
            'juli', 'august', 'september', 'oktober', 'november', 'december'
        ];
        
        return `${day}. ${danishMonths[month]} ${year}`;
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
        
        // Create h1 with current date
        const h1 = document.createElement('h1');
        h1.textContent = this.getCurrentDateInDanish();
        header.appendChild(h1);
        
        // Settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Indstillinger';
        settingsBtn.addEventListener('click', () => {
            this.showView('edit-profile');
        });
        header.appendChild(settingsBtn);
        
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
        
        // Add food section (slide-in)
        const addFoodSection = document.createElement('section');
        addFoodSection.id = 'add-food-section';
        addFoodSection.className = 'slide-view add-food-view';
        main.appendChild(addFoodSection);
        
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
        
        // Settings section (slide-in)
        const settingsSection = document.createElement('section');
        settingsSection.id = 'settings-section';
        settingsSection.className = 'slide-view settings-view';
        main.appendChild(settingsSection);
        
        // Add menu section (slide-up from bottom)
        const addMenuSection = document.createElement('section');
        addMenuSection.id = 'add-menu-section';
        addMenuSection.className = 'slide-up-view add-menu-view';
        main.appendChild(addMenuSection);
        
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
            <div class="nav-item add-btn" data-view="add-menu">
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
        
        // Mount AddMenu
        const addMenuContainer = document.getElementById('add-menu-section');
        console.log('AddMenu container:', addMenuContainer);
        if (addMenuContainer) {
            this.components.addMenu = AddMenu(addMenuContainer);
            console.log('AddMenu mounted:', this.components.addMenu);
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
        
        // Add food events
        this.appContainer.addEventListener('onAddFood', (event) => {
            console.log('Add food clicked:', event.detail);
            // Determine where we came from based on the event detail
            const fromView = event.detail && event.detail.mealType ? 'diary' : 'dashboard';
            this.showView('food', fromView);
            
            // If mealType is provided, set it in the food form
            if (event.detail && event.detail.mealType && this.components.foodForm) {
                this.components.foodForm.setMealType(event.detail.mealType);
            }
        });
        
        // Food section events
        this.appContainer.addEventListener('onGoBack', (event) => {
            console.log('Go back clicked');
            this.goBack();
        });
        
        this.appContainer.addEventListener('onGoBackToFood', (event) => {
            console.log('Go back to food clicked');
            this.showView('food');
        });
        
        this.appContainer.addEventListener('onFoodSelect', (event) => {
            console.log('Food selected:', event.detail);
            // Navigate to add food view with selected food
            if (this.components.addFood) {
                this.components.addFood.setFood(event.detail);
                this.showView('add-food', 'food');
            }
        });
        
        this.appContainer.addEventListener('onAddFoodItem', async (event) => {
            console.log('Add food item:', event.detail);
            const food = event.detail;
            
            // Navigate to add food view with selected food
            if (this.components.addFood) {
                this.components.addFood.setFood(food);
                this.showView('add-food', 'food');
            }
        });
        
        // Add food acceptance event
        this.appContainer.addEventListener('onAcceptFood', async (event) => {
            console.log('Accept food:', event.detail);
            const foodData = event.detail;
            
            // Update last_used timestamp for the food
            if (foodData.food.id) {
                try {
                    const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp
                    await this.api.updateFood(foodData.food.id, { last_used: currentTime });
                    
                    // Reload foods to get updated data
                    await AppState.loadFoods();
                } catch (error) {
                    console.error('Failed to update food last_used:', error);
                }
            }
            
            // TODO: Handle adding food item to diary
            console.log('Food added to diary:', foodData);
        });
        
        // Add water events
        this.appContainer.addEventListener('onAddWater', (event) => {
            console.log('Add water clicked:', event.detail);
            // TODO: Handle add water
        });
        
        // Add weight events
        this.appContainer.addEventListener('onAddWeight', (event) => {
            console.log('Add weight clicked:', event.detail);
            this.showView('weight');
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
    
    showView(viewName, fromView = null) {
        // Add current view to history if we're navigating from somewhere
        if (fromView && this.navigationHistory.length === 0) {
            this.navigationHistory.push(fromView);
        }
        
        // Hide all views
        const allViews = this.appContainer.querySelectorAll('.main-view, .slide-view, .slide-up-view');
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
        } else if (viewName === 'add-menu') {
            const slideUpView = this.appContainer.querySelector('.slide-up-view');
            if (slideUpView) {
                slideUpView.classList.add('active');
                const navItem = this.appContainer.querySelector(`[data-view="${viewName}"]`);
                if (navItem) navItem.classList.add('active');
            }
        } else if (viewName === 'add-food') {
            const slideView = this.appContainer.querySelector('.add-food-view');
            if (slideView) {
                slideView.classList.add('active');
            }
        } else if (viewName === 'edit-profile') {
            const slideView = this.appContainer.querySelector('.settings-view');
            if (slideView) {
                slideView.classList.add('active');
            }
        } else {
            const slideView = this.appContainer.querySelector(`.${viewName}-view`);
            if (slideView) {
                slideView.classList.add('active');
                const navItem = this.appContainer.querySelector(`[data-view="${viewName}"]`);
                if (navItem) navItem.classList.add('active');
            }
        }
    }
    
    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousView = this.navigationHistory.pop();
            this.showView(previousView);
        } else {
            // Default fallback to dashboard
            this.showView('dashboard');
        }
    }
    
    async loadInitialData() {
        try {
            console.log('Loading initial data...');
            
            const today = new Date().toISOString().split('T')[0];
            console.log('Loading data for date:', today);
            
            // Load all data in parallel
            await Promise.all([
                AppState.loadFoods(),
                AppState.loadDiary(today),
                AppState.loadExercises(today),
                AppState.loadWeights(),
                AppState.loadGoals()
            ]);
            
            console.log('Initial data loaded successfully');
            console.log('Current state:', AppState.getState());
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CalorieTrackerApp();
});
