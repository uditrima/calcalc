// Event handling and management
// Handles all application event listeners and event processing

import { NavigationEvents } from './events/navigation_events.js';
import { FoodEvents } from './events/food_events.js';
import { FoodEventHandlers } from './events/food_event_handlers.js';
import { DiaryEvents } from './events/diary_events.js';
import { ExerciseEvents } from './events/exercise_events.js';
import { WeightEvents } from './events/weight_events.js';

export class EventManager {
    constructor(app) {
        this.app = app;
        this.initializeEventModules();
    }
    
    initializeEventModules() {
        // Initialize all event modules
        this.navigationEvents = new NavigationEvents(this.app);
        this.foodEvents = new FoodEvents(this.app);
        this.foodEventHandlers = new FoodEventHandlers(this.app);
        this.diaryEvents = new DiaryEvents(this.app);
        this.exerciseEvents = new ExerciseEvents(this.app);
        this.weightEvents = new WeightEvents(this.app);
    }
    
    setupEventListeners() {
        // Setup all event listeners through the respective modules
        this.navigationEvents.setupEventListeners();
        this.foodEvents.setupEventListeners();
        this.foodEventHandlers.setupEventListeners();
        this.diaryEvents.setupEventListeners();
        this.exerciseEvents.setupEventListeners();
        this.weightEvents.setupEventListeners();
    }
}
