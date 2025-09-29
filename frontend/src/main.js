// Main application entry point
import { AppState } from './state/app_state.js';

// Make AppState globally available for debugging
window.AppState = AppState;

// Development: Live state monitoring
if (window.location.hostname === 'localhost') {
    // Create live state viewer
    const stateViewer = document.createElement('div');
    stateViewer.id = 'state-viewer';
    stateViewer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        max-height: 400px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        overflow-y: auto;
        border: 1px solid #333;
        display: none;
    `;
    document.body.appendChild(stateViewer);
    
    // Toggle with Ctrl+Shift+S
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            const viewer = document.getElementById('state-viewer');
            viewer.style.display = viewer.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    // Update state viewer every 500ms
    setInterval(() => {
        const viewer = document.getElementById('state-viewer');
        if (viewer.style.display !== 'none') {
            const state = AppState.getState();
            const formattedGoals = AppState.getFormattedGoals();
            
            viewer.innerHTML = `
                <div style="color: #4CAF50; font-weight: bold; margin-bottom: 10px;">
                    🔍 Live AppState (Ctrl+Shift+S to toggle)
                </div>
                <div><strong>Foods:</strong> ${state.foods.length} items</div>
                <div><strong>Diary:</strong> ${state.diary.entries.length} entries</div>
                <div><strong>Exercises:</strong> ${state.exercises.length} items</div>
                <div><strong>Weights:</strong> ${state.weights.length} items</div>
                <div style="margin-top: 8px; color: #FF9800;">
                    <strong>Goals:</strong>
                </div>
                <div style="margin-left: 10px;">
                    <div>Calories: ${formattedGoals?.calories.formatted || 'N/A'}</div>
                    <div>Protein: ${formattedGoals?.protein.formatted || 'N/A'}</div>
                    <div>Carbs: ${formattedGoals?.carbs.formatted || 'N/A'}</div>
                    <div>Fat: ${formattedGoals?.fat.formatted || 'N/A'}</div>
                </div>
                <div style="margin-top: 10px; color: #FFC107;">
                    <strong>Last Update:</strong> ${new Date().toLocaleTimeString()}
                </div>
                <div style="margin-top: 5px; color: #9E9E9E; font-size: 10px;">
                    Console: AppState.getState() for full data
                </div>
            `;
        }
    }, 500);
    
    console.log('🔍 Live AppState monitoring enabled! Press Ctrl+Shift+S to toggle viewer');
}
import { ApiClient } from './data/api.js';
import { Dashboard } from './ui/dashboard.js';
import { FoodForm } from './ui/food_form.js';
import { AddFood } from './ui/add_food.js';
import { Diary } from './ui/diary.js';
import { Exercise } from './ui/exercise.js';
import { AddMenu } from './ui/add_menu.js';
import { Weight } from './ui/weight.js';
import { EditSettings } from './ui/edit-profile-page.js';
import { NutritionGoals } from './ui/nutrition_goals.js';


class CalorieTrackerApp {
    constructor() {
        this.appContainer = null;
        this.components = {};
        this.api = new ApiClient();
        this.navigationHistory = [];
        this.setupGlobalErrorHandling();
        this.init();
    }
    
    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.warn('Unhandled promise rejection:', event.reason);
            // Prevent the default behavior (which would log to console)
            event.preventDefault();
        });
        
        // Handle general errors
        window.addEventListener('error', (event) => {
            // Only log errors that are not related to browser extensions
            if (!event.message.includes('message channel closed') && 
                !event.message.includes('listener indicated an asynchronous response')) {
                console.error('Global error:', event.error);
            }
        });
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
        
        // Skip service worker registration for now (PWA works without it)
        // this.registerServiceWorker();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Try to register external service worker first
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                        
                        // Fallback: Create inline service worker if external fails
                        this.createInlineServiceWorker();
                    });
            });
        }
    }
    
    createInlineServiceWorker() {
        try {
            // Create service worker code as blob
            const swCode = `
                const CACHE_NAME = 'kalorie-tracker-v1';
                const urlsToCache = [
                    '/',
                    '/index.html',
                    '/src/main.js',
                    '/styles/colors.css',
                    '/styles/theme.css',
                    '/styles/layout.css',
                    '/styles/forms.css',
                    '/styles/common.css',
                    '/styles/gauge.css',
                    '/styles/dashboard.css',
                    '/styles/diary.css',
                    '/styles/food.css',
                    '/styles/meal-dropdown.css',
                    '/styles/add-food.css',
                    '/styles/add-menu.css',
                    '/styles/settings.css',
                    '/styles/edit-profile-page.css',
                    '/styles/nutrition-goals.css',
                    '/styles/animations.css',
                    '/styles/data-tags.css',
                    '/styles/types.css'
                ];

                self.addEventListener('install', (event) => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                console.log('Opened cache');
                                return cache.addAll(urlsToCache);
                            })
                    );
                });

                self.addEventListener('fetch', (event) => {
                    event.respondWith(
                        caches.match(event.request)
                            .then((response) => {
                                return response || fetch(event.request);
                            }
                        )
                    );
                });

                self.addEventListener('activate', (event) => {
                    event.waitUntil(
                        caches.keys().then((cacheNames) => {
                            return Promise.all(
                                cacheNames.map((cacheName) => {
                                    if (cacheName !== CACHE_NAME) {
                                        console.log('Deleting old cache:', cacheName);
                                        return caches.delete(cacheName);
                                    }
                                })
                            );
                        })
                    );
                });
            `;
            
            // Create blob URL for service worker
            const swBlob = new Blob([swCode], { type: 'text/javascript' });
            const swUrl = URL.createObjectURL(swBlob);
            
            // Register inline service worker
            navigator.serviceWorker.register(swUrl)
                .then((registration) => {
                    console.log('Inline SW registered: ', registration);
                })
                .catch((error) => {
                    console.log('Inline SW registration also failed: ', error);
                });
                
        } catch (error) {
            console.log('Failed to create inline service worker: ', error);
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
        
        // Setup PWA install prompt
        this.setupPWAInstallPrompt();
    }
    
    setupPWAInstallPrompt() {
        let deferredPrompt;
        
        // Detect Android
        const isAndroid = /Android/i.test(navigator.userAgent);
        console.log('Android detected:', isAndroid);
        
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            
            // Show install button or banner
            this.showInstallPrompt(deferredPrompt, isAndroid);
        });
        
        // Listen for the appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            // Hide install prompt
            this.hideInstallPrompt();
        });
        
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('App is running in standalone mode');
        }
        
        // Show manual install instructions for Android if no prompt appears
        if (isAndroid && !deferredPrompt) {
            setTimeout(() => {
                this.showManualInstallInstructions();
            }, 3000); // Show after 3 seconds if no prompt
        }
        
        // Also show manual instructions for desktop if no prompt appears
        if (!isAndroid && !deferredPrompt) {
            setTimeout(() => {
                this.showDesktopInstallInstructions();
            }, 5000); // Show after 5 seconds if no prompt
        }
    }
    
    showInstallPrompt(deferredPrompt, isAndroid = false) {
        // Create install banner
        const installBanner = document.createElement('div');
        installBanner.id = 'install-banner';
        installBanner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-md);
            z-index: 1000;
            box-shadow: var(--shadow-glass);
            backdrop-filter: var(--blur-glass);
            -webkit-backdrop-filter: var(--blur-glass);
        `;
        
        installBanner.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                <div style="font-size: 24px;">🍎</div>
                <div style="flex: 1;">
                    <div style="color: var(--color-text); font-weight: 600; margin-bottom: 4px;">
                        Installer Kalorie Tracker
                    </div>
                    <div style="color: var(--color-text-muted); font-size: 14px;">
                        Få hurtig adgang til appen på din hjemmeskærm
                        ${isAndroid ? `
                        <br><small style="color: var(--color-text-muted); opacity: 0.8;">
                            Android: Menu → "Tilføj til startskærm" eller "Installer app"
                        </small>` : ''}
                    </div>
                </div>
                <button id="install-btn" style="
                    background: var(--color-primary);
                    color: var(--color-bg);
                    border: none;
                    border-radius: var(--radius-md);
                    padding: var(--space-sm) var(--space-md);
                    font-weight: 600;
                    cursor: pointer;
                ">Installer</button>
                <button id="dismiss-install" style="
                    background: none;
                    border: none;
                    color: var(--color-text-muted);
                    font-size: 20px;
                    cursor: pointer;
                    padding: var(--space-xs);
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        // Add event listeners
        document.getElementById('install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                // Clear the deferredPrompt
                deferredPrompt = null;
                // Hide the install banner
                this.hideInstallPrompt();
            }
        });
        
        document.getElementById('dismiss-install').addEventListener('click', () => {
            this.hideInstallPrompt();
        });
    }
    
    hideInstallPrompt() {
        const installBanner = document.getElementById('install-banner');
        if (installBanner) {
            installBanner.remove();
        }
    }
    
    showManualInstallInstructions() {
        // Only show if not already installed and no other banner is showing
        if (window.matchMedia('(display-mode: standalone)').matches || 
            document.getElementById('install-banner') || 
            document.getElementById('manual-install-banner')) {
            return;
        }
        
        const manualBanner = document.createElement('div');
        manualBanner.id = 'manual-install-banner';
        manualBanner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-md);
            z-index: 1000;
            box-shadow: var(--shadow-glass);
            backdrop-filter: var(--blur-glass);
            -webkit-backdrop-filter: var(--blur-glass);
        `;
        
        manualBanner.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                <div style="font-size: 24px;">📱</div>
                <div style="flex: 1;">
                    <div style="color: var(--color-text); font-weight: 600; margin-bottom: 8px;">
                        Installer app på Android
                    </div>
                    <div style="color: var(--color-text-muted); font-size: 14px; line-height: 1.4;">
                        1. Tryk på menu (⋮) i browseren<br>
                        2. Vælg "Tilføj til startskærm"<br>
                        3. Tryk "Tilføj" for at installere
                    </div>
                </div>
                <button id="dismiss-manual-install" style="
                    background: none;
                    border: none;
                    color: var(--color-text-muted);
                    font-size: 20px;
                    cursor: pointer;
                    padding: var(--space-xs);
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(manualBanner);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hideManualInstallInstructions();
        }, 10000);
        
        // Add dismiss event listener
        document.getElementById('dismiss-manual-install').addEventListener('click', () => {
            this.hideManualInstallInstructions();
        });
    }
    
    hideManualInstallInstructions() {
        const manualBanner = document.getElementById('manual-install-banner');
        if (manualBanner) {
            manualBanner.remove();
        }
    }
    
    showDesktopInstallInstructions() {
        // Only show if not already installed and no other banner is showing
        if (window.matchMedia('(display-mode: standalone)').matches || 
            document.getElementById('install-banner') || 
            document.getElementById('manual-install-banner') ||
            document.getElementById('desktop-install-banner')) {
            return;
        }
        
        const desktopBanner = document.createElement('div');
        desktopBanner.id = 'desktop-install-banner';
        desktopBanner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-md);
            z-index: 1000;
            box-shadow: var(--shadow-glass);
            backdrop-filter: var(--blur-glass);
            -webkit-backdrop-filter: var(--blur-glass);
        `;
        
        desktopBanner.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                <div style="font-size: 24px;">💻</div>
                <div style="flex: 1;">
                    <div style="color: var(--color-text); font-weight: 600; margin-bottom: 8px;">
                        Installer app på computer
                    </div>
                    <div style="color: var(--color-text-muted); font-size: 14px; line-height: 1.4;">
                        Chrome/Edge: Klik på install ikon i adressebaren<br>
                        Firefox: Menu → "Install"<br>
                        Safari: Del → "Add to Home Screen"
                    </div>
                </div>
                <button id="dismiss-desktop-install" style="
                    background: none;
                    border: none;
                    color: var(--color-text-muted);
                    font-size: 20px;
                    cursor: pointer;
                    padding: var(--space-xs);
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(desktopBanner);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            this.hideDesktopInstallInstructions();
        }, 15000);
        
        // Add dismiss event listener
        document.getElementById('dismiss-desktop-install').addEventListener('click', () => {
            this.hideDesktopInstallInstructions();
        });
    }
    
    hideDesktopInstallInstructions() {
        const desktopBanner = document.getElementById('desktop-install-banner');
        if (desktopBanner) {
            desktopBanner.remove();
        }
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
        
        // Nutrition goals section (slide-in)
        const nutritionGoalsSection = document.createElement('section');
        nutritionGoalsSection.id = 'nutrition-goals-section';
        nutritionGoalsSection.className = 'slide-view nutrition-goals-view';
        main.appendChild(nutritionGoalsSection);
        
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
            
            // Also set meal type in add-food component if available
            if (event.detail && event.detail.mealType && this.components.addFood) {
                this.components.addFood.setMealType(event.detail.mealType);
            }
        });
        
        // Food section events
        this.appContainer.addEventListener('onGoBack', (event) => {
            console.log('Go back clicked');
            this.goBack();
        });
        
        this.appContainer.addEventListener('onGoBackToFood', (event) => {
            console.log('Go back to food clicked');
            console.log('Current state before going back to food:', AppState.getState());
            this.showView('food');
        });
        
        this.appContainer.addEventListener('onGoBackToDiary', (event) => {
            console.log('Go back to diary clicked');
            this.showView('diary');
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
            if (this.components.addFood) {
                this.components.addFood.setFood(food);
                this.components.addFood.setMealType(mealType);
                this.showView('add-food', 'food');
            }
        });
        
        // Edit food event
        this.appContainer.addEventListener('onEditFood', async (event) => {
            console.log('Edit food clicked:', event.detail);
            const { entryId, foodId, mealType } = event.detail;
            
            try {
                // Load food data from database
                const food = await this.api.getFoodById(foodId);
                console.log('Loaded food for edit:', food);
                
                // Get current diary entry to get servings
                const currentDate = new Date().toISOString().split('T')[0];
                const diaryEntries = await this.api.getDiaryEntries(currentDate);
                const entry = diaryEntries.find(e => e.id === entryId);
                
                if (entry && food) {
                    // Convert grams to portions for display
                    const servings = entry.amount_grams / 100.0; // Assuming 100g = 1 portion
                    
                    // Set edit mode in add-food component
                    if (this.components.addFood) {
                        this.components.addFood.setEditMode(entryId, food, mealType, servings);
                        this.showView('add-food', 'diary');
                    }
                } else {
                    console.error('Could not find entry or food data for edit');
                    alert('Kunne ikke indlæse fødevare data til redigering');
                }
            } catch (error) {
                console.error('Error loading food for edit:', error);
                alert(`Fejl ved indlæsning af fødevare: ${error.message}`);
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
        } else if (viewName === 'nutrition-goals') {
            console.log('Showing nutrition-goals view');
            const slideView = this.appContainer.querySelector('.nutrition-goals-view');
            console.log('Found nutrition-goals slideView:', slideView);
            if (slideView) {
                slideView.classList.add('active');
                console.log('Added active class to nutrition-goals view');
            } else {
                console.error('nutrition-goals slideView not found');
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
    window.calorieTrackerApp = new CalorieTrackerApp();
});
