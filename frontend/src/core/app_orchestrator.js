// Core application orchestrator
// Handles main app initialization and component coordination

import { AppState } from '../state/app_state.js';
import { ApiClient } from '../data/api.js';
import { NavigationManager } from './navigation.js';
import { ErrorHandler } from './error_handler.js';
import { ServiceWorkerManager } from '../services/service_worker.js';
import { StateMonitor } from '../services/state_monitor.js';
import { AppStructureManager } from './app_structure.js';
import { ComponentManager } from './component_manager.js';
import { EventManager } from './event_manager.js';
import { DataLoader } from './data_loader.js';

export class CalorieTrackerApp {
    constructor() {
        this.appContainer = null;
        this.components = {};
        this.api = new ApiClient();
        
        // Initialize managers
        this.navigation = new NavigationManager(this);
        this.errorHandler = new ErrorHandler();
        this.serviceWorker = new ServiceWorkerManager();
        this.stateMonitor = new StateMonitor();
        this.appStructure = new AppStructureManager(this);
        this.componentManager = new ComponentManager(this);
        this.eventManager = new EventManager(this);
        this.dataLoader = new DataLoader(this);
        
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
        this.appStructure.createAppStructure();
        console.log('App structure created');
        
        // Mount components
        this.componentManager.mountComponents();
        console.log('Components mounted');
        
        // Setup event listeners
        this.eventManager.setupEventListeners();
        console.log('Event listeners setup');
        
        // Load initial data
        this.dataLoader.loadInitialData();
        console.log('Initial data loaded');
    }
    
    // Public methods for external access
    getComponent(name) {
        return this.componentManager.getComponent(name);
    }
    
    hasComponent(name) {
        return this.componentManager.hasComponent(name);
    }
    
    async reloadData() {
        return this.dataLoader.reloadData();
    }
    
    async loadDataForDate(date) {
        return this.dataLoader.loadDataForDate(date);
    }
    
    // Public methods for navigation
    showView(viewName, fromView = null) {
        this.navigation.showView(viewName, fromView);
    }
    
    goBack() {
        this.navigation.goBack();
    }
}

// Export for global access
export default CalorieTrackerApp;
