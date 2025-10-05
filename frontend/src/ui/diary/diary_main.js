// Diary UI component - Refactored modular version
import { AppState } from '../../state/app_state.js';
import { createDiaryHeader, createDateNavigation } from './diary_header.js';
import { createSummarySection, updateSummarySection } from './diary_summary.js';
import { createMealsContainer } from './diary_meal_sections.js';
import { updateMealSections } from './diary_state_updates.js';
import { createCustomScrollbar } from './diary_scrollbar.js';
import { setupScrollHandler } from './diary_scroll_handler.js';
import { setupStateManager } from './diary_state_manager.js';
import { loadDiaryForDate } from './diary_data_loader.js';


export function Diary(container) {
    console.log('Diary component called with container:', container);
    if (!container) {
        throw new Error('Diary requires a container element');
    }
    
    try {
        // Clear container
        container.innerHTML = '';
        console.log('Diary: Container cleared, creating structure...');
        
        // Create diary structure
        const diary = document.createElement('div');
        diary.className = 'diary';
        
        // Create header
        const header = createDiaryHeader(container);
        diary.appendChild(header);
        
        // Sticky Container for Date Navigation and Summary
        const stickyContainer = document.createElement('div');
        stickyContainer.className = 'sticky-container';
        
        // Create date navigation
        const dateNav = createDateNavigation(container, loadDiaryForDate);
        stickyContainer.appendChild(dateNav.element);
        console.log('Diary: Date navigation added to sticky container');
        
        // Create summary section
        const summarySection = createSummarySection();
        stickyContainer.appendChild(summarySection);
        diary.appendChild(stickyContainer);
        console.log('Diary: Summary section added to sticky container');
        
        // Create meals container
        const mealsContainer = createMealsContainer(container);
        diary.appendChild(mealsContainer);
        console.log('Diary: Meal sections added to diary');
        
        // Add to container
        container.appendChild(diary);
        console.log('Diary: Diary added to container');
        
        // Create custom scrollbar for the diary container
        createCustomScrollbar(diary);
        
        // Setup scroll handler
        const scrollHandler = setupScrollHandler(diary, container);
        
        // Setup state manager
        const stateManager = setupStateManager(diary);
        
        // Initial update
        updateMealSections();
        console.log('Diary: Initial meal sections update completed');
        
        // Force complete refresh on load to ensure clean state
        setTimeout(async () => {
            console.log('Diary: Starting setTimeout refresh...');
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            console.log('Diary: Date string:', dateString);
            
            // Clear any existing state and reload from backend
            AppState.setDiary({ date: dateString, entries: [] });
            console.log('Diary: State cleared, loading diary...');
            await AppState.loadDiary(dateString);
            console.log('Diary: Diary loaded');
            
            console.log('Diary: Getting current state...');
            // Check for any UI elements that don't match current state
            const currentState = AppState.getState();
            console.log('Diary: Current state:', currentState);
            const stateEntryIds = new Set(currentState.diary.entries.map(e => e.id));
            console.log('Diary: State entry IDs:', stateEntryIds);
            const uiElements = document.querySelectorAll('[data-entry-id]');
            console.log('Diary: UI elements found:', uiElements.length);
            
            uiElements.forEach(element => {
                const elementEntryId = parseInt(element.getAttribute('data-entry-id'));
                if (!stateEntryIds.has(elementEntryId)) {
                    element.remove();
                }
            });
            console.log('Diary: UI cleanup completed');
        }, 500);
        console.log('Diary: setTimeout scheduled');
        
        // Load initial data for today
        loadDiaryForDate(dateNav.currentDate());
        
        // Return cleanup function
        return () => {
            scrollHandler.cleanup();
            stateManager.cleanup();
        };
        
    } catch (error) {
        console.error('Diary component error:', error);
        throw error;
    }
}

