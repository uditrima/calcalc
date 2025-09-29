// Diary UI component
import { AppState } from '../state/app_state.js';
import { ApiClient } from '../data/api.js';
import { EXTENDED_MEAL_TYPES, getMealDisplayName } from '../data/meal_types.js';
import { PortionConverter } from '../utils/portion_converter.js';

// Initialize API client
const api = new ApiClient();

export function Diary(container) {
    if (!container) {
        throw new Error('Diary requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create diary structure
    const diary = document.createElement('div');
    diary.className = 'diary';
    
    // Header Section 1
    const header = document.createElement('div');
    header.className = 'diary-header';
    
    const title = document.createElement('h2');
      title.textContent = 'Dagbog';
    header.appendChild(title);
    
    // Right side links
    const linksContainer = document.createElement('div');
    linksContainer.className = 'diary-header-links';
    
    // Lightning link
    const lightningLink = document.createElement('button');
    lightningLink.className = 'diary-link lightning-link';
    lightningLink.innerHTML = '⚡<span class="link-number">2</span>';
    lightningLink.title = 'Hurtig tilføjelse';
    linksContainer.appendChild(lightningLink);
    
    // Nutrition link
    const nutritionLink = document.createElement('button');
    nutritionLink.className = 'diary-link nutrition-link';
    nutritionLink.innerHTML = '📊';
    nutritionLink.title = 'Næringsstoffer';
    linksContainer.appendChild(nutritionLink);
    
    // More menu link
    const moreLink = document.createElement('button');
    moreLink.className = 'diary-link more-link';
    moreLink.innerHTML = '⋮';
    moreLink.title = 'Mere';
    linksContainer.appendChild(moreLink);
    
    header.appendChild(linksContainer);
    
    diary.appendChild(header);
    
    // Sticky Container for Date Navigation and Summary
    const stickyContainer = document.createElement('div');
    stickyContainer.className = 'sticky-container';
    
    // Date Navigation Section
    const dateNav = document.createElement('div');
    dateNav.className = 'date-navigation';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'date-nav-btn prev-btn';
    prevButton.innerHTML = '&lt;';
    prevButton.title = 'Forrige dag';
    dateNav.appendChild(prevButton);
    
    const dateDisplay = document.createElement('div');
    dateDisplay.className = 'date-display';
    dateDisplay.textContent = formatDate(new Date());
    dateNav.appendChild(dateDisplay);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'date-nav-btn next-btn';
    nextButton.innerHTML = '&gt;';
    nextButton.title = 'Næste dag';
    dateNav.appendChild(nextButton);
    
    stickyContainer.appendChild(dateNav);
    
    // Summary Section
    const summarySection = document.createElement('div');
    summarySection.className = 'summary-section';
    
    const summaryHeader = document.createElement('div');
    summaryHeader.className = 'summary-header';
    
    const summaryTitle = document.createElement('h3');
    summaryTitle.textContent = 'Resterende kalorier';
    summaryHeader.appendChild(summaryTitle);
    
    const moreMenuButton = document.createElement('button');
    moreMenuButton.className = 'more-menu-btn';
    moreMenuButton.innerHTML = '⋮';
    moreMenuButton.title = 'Mere menu';
    summaryHeader.appendChild(moreMenuButton);
    
    summarySection.appendChild(summaryHeader);
    
    const summaryDetails = document.createElement('div');
    summaryDetails.className = 'summary-details';
    
    // Base mål
    const goalItem = document.createElement('div');
    goalItem.className = 'summary-item';
    const goalCalories = document.createElement('div');
    goalCalories.className = 'summary-number goal-calories';
    // Get goals data or use default
    const formattedGoals = AppState.getFormattedGoals();
    goalCalories.textContent = formattedGoals?.calories.formatted || '1,500';
    const goalLabel = document.createElement('div');
    goalLabel.className = 'summary-label';
    goalLabel.textContent = 'Base mål';
    goalItem.appendChild(goalCalories);
    goalItem.appendChild(goalLabel);
    summaryDetails.appendChild(goalItem);
    
    const minusOperator = document.createElement('div');
    minusOperator.className = 'operator';
    minusOperator.textContent = '-';
    summaryDetails.appendChild(minusOperator);
    
    // Mad
    const foodItem = document.createElement('div');
    foodItem.className = 'summary-item';
    const foodCalories = document.createElement('div');
    foodCalories.className = 'summary-number diary-food-total-calories';
    foodCalories.textContent = '0';
    const foodLabel = document.createElement('div');
    foodLabel.className = 'summary-label';
    foodLabel.textContent = 'Mad';
    foodItem.appendChild(foodCalories);
    foodItem.appendChild(foodLabel);
    summaryDetails.appendChild(foodItem);
    
    const plusOperator = document.createElement('div');
    plusOperator.className = 'operator';
    plusOperator.textContent = '+';
    summaryDetails.appendChild(plusOperator);
    
    // Motion
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'summary-item';
    const exerciseCalories = document.createElement('div');
    exerciseCalories.className = 'summary-number exercise-calories';
    exerciseCalories.textContent = '0';
    const exerciseLabel = document.createElement('div');
    exerciseLabel.className = 'summary-label';
    exerciseLabel.textContent = 'Motion';
    exerciseItem.appendChild(exerciseCalories);
    exerciseItem.appendChild(exerciseLabel);
    summaryDetails.appendChild(exerciseItem);
    
    const equalsOperator = document.createElement('div');
    equalsOperator.className = 'operator';
    equalsOperator.textContent = '=';
    summaryDetails.appendChild(equalsOperator);
    
    // Resterende kalorier
    const remainingItem = document.createElement('div');
    remainingItem.className = 'summary-item';
    const remainingCalories = document.createElement('div');
    remainingCalories.className = 'summary-number remaining-calories';
    // Get goals data or use default
    const formattedGoalsRemaining = AppState.getFormattedGoals();
    remainingCalories.textContent = formattedGoalsRemaining?.calories.formatted || '1,500';
    const remainingLabel = document.createElement('div');
    remainingLabel.className = 'summary-label';
    remainingLabel.textContent = 'Resterende kalorier';
    remainingItem.appendChild(remainingCalories);
    remainingItem.appendChild(remainingLabel);
    summaryDetails.appendChild(remainingItem);
    
    summarySection.appendChild(summaryDetails);
    
    stickyContainer.appendChild(summarySection);
    diary.appendChild(stickyContainer);
    
    // Meal Sections
    const mealsContainer = document.createElement('div');
    mealsContainer.className = 'meals-container';
    
    // Create meal sections dynamically from central definition
    EXTENDED_MEAL_TYPES.forEach(mealType => {
        const mealSection = createMealSection(getMealDisplayName(mealType), mealType);
        mealsContainer.appendChild(mealSection);
    });
    
    // Motion
    const motionSection = createExerciseSection('Motion', 'motion');
    mealsContainer.appendChild(motionSection);
    
    // Water Section
    const waterSection = createWaterSection();
    mealsContainer.appendChild(waterSection);
    
    diary.appendChild(mealsContainer);
    
    // Add to container
    container.appendChild(diary);
    
    // Create custom scrollbar for the diary container
    createCustomScrollbar(diary);
    
    // Subscribe to state changes for meal sections
    AppState.subscribe('diary', updateMealSections);
    AppState.subscribe('foods', updateMealSections);
    AppState.subscribe('goals', updateSummarySection);
    
    // Listen for goals committed event to refresh data
    const handleGoalsCommitted = async () => {
        console.log('Goals committed, refreshing diary data...');
        // Reload goals to ensure we have the latest data
        await AppState.loadGoals();
        // Force refresh diary data to sync with backend
        await forceRefreshDiary();
    };
    
    window.addEventListener('goalsCommitted', handleGoalsCommitted);
    
    // Initial update
    updateMealSections();
    
    // Force complete refresh on load to ensure clean state
    setTimeout(async () => {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Clear any existing state and reload from backend
        AppState.setDiary({ date: dateString, entries: [] });
        await AppState.loadDiary(dateString);
        
        
        // Check for any UI elements that don't match current state
        const currentState = AppState.getState();
        const stateEntryIds = new Set(currentState.diary.entries.map(e => e.id));
        const uiElements = document.querySelectorAll('[data-entry-id]');
        
        uiElements.forEach(element => {
            const elementEntryId = parseInt(element.getAttribute('data-entry-id'));
            if (!stateEntryIds.has(elementEntryId)) {
                element.remove();
            }
        });
    }, 500);
    
    // Force refresh diary data to sync with backend
    async function forceRefreshDiary() {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            await AppState.loadDiary(dateString);
        } catch (error) {
            console.error('Error force refreshing diary:', error);
        }
    }
    
    // Expose force refresh function for external use
    diary.forceRefresh = forceRefreshDiary;
    
    // Return cleanup function
    return () => {
        AppState.unsubscribe('diary', updateMealSections);
        AppState.unsubscribe('foods', updateMealSections);
        AppState.unsubscribe('goals', updateSummarySection);
        window.removeEventListener('goalsCommitted', handleGoalsCommitted);
    };
    
    // Check for state mismatches and sync with backend
    async function checkAndSyncState() {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Get current frontend state
            const frontendState = AppState.getState();
            const frontendEntries = frontendState.diary.entries || [];
            
            // Get backend data directly
            const backendEntries = await api.getDiaryEntries(dateString);
            
            // Check if there are mismatches
            const frontendIds = new Set(frontendEntries.map(e => e.id));
            const backendIds = new Set(backendEntries.map(e => e.id));
            
            const hasMismatch = frontendIds.size !== backendIds.size || 
                               [...frontendIds].some(id => !backendIds.has(id));
            
            if (hasMismatch) {
                
                // Clear current state and reload from backend
                AppState.setDiary({ date: dateString, entries: [] });
                await AppState.loadDiary(dateString);
                
            }
        } catch (error) {
            console.error('Error checking state sync:', error);
        }
    }
    
    // Expose sync function
    diary.checkAndSyncState = checkAndSyncState;
    
    // Force complete UI cleanup and state sync
    async function forceCompleteSync() {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Clear all UI elements with data-entry-id
            const uiElements = document.querySelectorAll('[data-entry-id]');
            uiElements.forEach(element => {
                if (element._cleanupSwipe) {
                    element._cleanupSwipe();
                }
                element.remove();
            });
            
            // Clear state and reload from backend
            AppState.setDiary({ date: dateString, entries: [] });
            await AppState.loadDiary(dateString);
            
        } catch (error) {
            console.error('Error in force complete sync:', error);
        }
    }
    
    // Expose force complete sync function
    diary.forceCompleteSync = forceCompleteSync;
    
    function updateMealSections(state = null) {
        const currentState = state || AppState.getState();
        const entries = currentState.diary.entries || [];
        
        // Update meal calories for each meal type
        const mealTypes = EXTENDED_MEAL_TYPES;
        
        mealTypes.forEach(mealType => {
            const mealEntries = entries.filter(entry => entry.meal_type === mealType);
            const totalCalories = mealEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
            
            const mealSection = document.querySelector(`[data-meal-type="${mealType}"]`);
            if (mealSection) {
                const caloriesElement = mealSection.querySelector('.meal-calories');
                if (caloriesElement) {
                    caloriesElement.textContent = Math.round(totalCalories);
                }
            }
        });
        
        // Update exercise calories
        const exerciseEntries = currentState.exercises || [];
        const exerciseCalories = exerciseEntries.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        
        const exerciseSection = document.querySelector('[data-exercise-type="motion"]');
        if (exerciseSection) {
            const caloriesElement = exerciseSection.querySelector('.meal-calories');
            if (caloriesElement) {
                caloriesElement.textContent = Math.round(exerciseCalories);
            }
        }
        
        // Update summary section
        updateSummarySection(currentState);
        
        // Update meal section content with actual entries
        updateMealSectionsFromEntries(currentState);
    }
    
    function updateSummarySection(state) {
        const entries = state.diary.entries || [];
        const exercises = state.exercises || [];
        const goals = state.goals || {};
        
        
        const totalFoodCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        const totalExerciseCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        const goalCalories = goals.daily_calories || 2000;
        const remainingCalories = goalCalories - totalFoodCalories + totalExerciseCalories;
        
        
        // Update summary display
        const goalElement = document.querySelector('.goal-calories');
        const foodElement = document.querySelector('.diary-food-total-calories');
        const exerciseElement = document.querySelector('.exercise-calories');
        const remainingElement = document.querySelector('.remaining-calories');
        
        if (goalElement) goalElement.textContent = goalCalories.toLocaleString();
        if (foodElement) foodElement.textContent = Math.round(totalFoodCalories);
        if (exerciseElement) exerciseElement.textContent = Math.round(totalExerciseCalories);
        if (remainingElement) remainingElement.textContent = Math.round(remainingCalories).toLocaleString();
    }
    
    // Date navigation functionality
    let currentDate = new Date();
    
    // Load initial data for today
    loadDiaryForDate(currentDate);
    
    prevButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        dateDisplay.textContent = formatDate(currentDate);
        loadDiaryForDate(currentDate);
    });
    
    nextButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        dateDisplay.textContent = formatDate(currentDate);
        loadDiaryForDate(currentDate);
    });
    
    function formatDate(date) {
        const options = { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('da-DK', options);
    }
    
    async function loadDiaryForDate(date) {
        try {
            const dateString = date.toISOString().split('T')[0];
            
            // Load diary entries for the selected date
            await AppState.loadDiary(dateString);
            
            // Load exercises for the selected date
            await AppState.loadExercises(dateString);
            
            // Get updated state
            const state = AppState.getState();
            
            // Update the diary display with new data
            updateDiaryDisplay(dateString);
            
        } catch (error) {
            console.error('Error loading diary data:', error);
        }
    }
    
    function updateDiaryDisplay(dateString) {
        const state = AppState.getState();
        
        if (!state) {
            return;
        }
        
        // Update summary details with data for selected date
        updateSummaryDetails(state, dateString);
        
        // Update meal sections with diary entries for selected date
        updateMealSectionsFromEntries(state, dateString);
        
        // Update exercise section with exercises for selected date
        updateExerciseSection(state);
    }
    
    function updateSummaryDetails(state, dateString) {
        if (!state) {
            return;
        }
        
        // Use the existing updateSummarySection function which has the correct selectors
        updateSummarySection(state);
        
    }
    
    function updateMealSectionsFromEntries(state, dateString) {
        if (!state) {
            return;
        }
        const diaryEntries = (state.diary && state.diary.entries) || [];
        
        
        
        // Group entries by meal type
        const entriesByMeal = {};
        diaryEntries.forEach(entry => {
            const mealType = entry.meal_type || 'morgenmad';
            if (!entriesByMeal[mealType]) {
                entriesByMeal[mealType] = [];
            }
            entriesByMeal[mealType].push(entry);
        });
        
        // Update all meal sections (including empty ones)
        const allMealSections = document.querySelectorAll('[data-meal]');
        allMealSections.forEach(mealSection => {
            const mealType = mealSection.getAttribute('data-meal');
            const entries = entriesByMeal[mealType] || [];
            updateMealSectionContent(mealSection, entries);
        });
        
        // Clean up any UI elements that don't match current state
        const stateEntryIds = new Set(diaryEntries.map(e => e.id));
        const uiElements = document.querySelectorAll('[data-entry-id]');
        uiElements.forEach(element => {
            const elementEntryId = parseInt(element.getAttribute('data-entry-id'));
            if (!stateEntryIds.has(elementEntryId)) {
                if (element._cleanupSwipe) {
                    element._cleanupSwipe();
                }
                element.remove();
            }
        });
    }
    
    function updateMealSectionContent(mealSection, entries) {
        // Find the food list container
        const foodList = mealSection.querySelector('.diary-food-list');
        if (!foodList) return;
        
        // Clear existing content
        foodList.innerHTML = '';
        
        // Add entries
        entries.forEach(entry => {
            const foodItem = createFoodItem(entry);
            foodList.appendChild(foodItem);
        });
        
        // Update meal totals
        const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        const caloriesElement = mealSection.querySelector('.meal-calories');
        if (caloriesElement) {
            caloriesElement.textContent = `${Math.round(totalCalories)}`;
        }
    }
    
    function updateExerciseSection(state = null) {
        const currentState = state || AppState.getState();
        if (!currentState) {
            return;
        }
        const exercises = currentState.exercises || [];
        
        // Find exercise section
        const exerciseSection = document.querySelector('.exercise-section');
        if (!exerciseSection) return;
        
        // Update exercise list
        const exerciseList = exerciseSection.querySelector('.exercise-list');
        if (exerciseList) {
            exerciseList.innerHTML = '';
            
            exercises.forEach(exercise => {
                const exerciseItem = createExerciseItem(exercise);
                exerciseList.appendChild(exerciseItem);
            });
        }
        
        // Update exercise totals
        const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        const totalElement = exerciseSection.querySelector('.exercise-total');
        if (totalElement) {
            totalElement.textContent = `${Math.round(totalCalories)} cal`;
        }
    }
    
    function createFoodItem(entry) {
        const item = document.createElement('div');
        item.className = 'diary-food-item';
        
        
        // Add entry ID as data attribute for deletion
        if (entry.id) {
            item.setAttribute('data-entry-id', entry.id);
        } else {
        }
        
        // Add food ID as data attribute if available
        if (entry.food_id) {
            item.setAttribute('data-food-id', entry.food_id);
        }
        
        // Format grams for display
        const grams = entry.amount_grams || entry.grams || 0;
        const portionGrams = PortionConverter.formatPortion(grams / 100.0, true); // Convert grams to portions
        
        item.innerHTML = `
            <div class="diary-food-item-content">
                <div class="diary-food-name">${entry.food_name || 'Ukendt fødevare'}</div>
                <div class="diary-food-portion">${portionGrams}</div>
                <div class="diary-food-item-calories">${Math.round(entry.calories || 0)} cal</div>
            </div>
        `;
        
        // Add swipe functionality - pass the item itself so we can get data-entry-id
        addSwipeToDelete(item);
        
        // Add click event listener for edit mode
        item.addEventListener('click', (e) => {
            // Get entry data from the item
            const entryId = item.getAttribute('data-entry-id');
            const foodId = item.getAttribute('data-food-id');
            
            if (entryId && foodId) {
                // Dispatch edit event with entry data
                const customEvent = new CustomEvent('onEditFood', {
                    detail: { 
                        entryId: parseInt(entryId),
                        foodId: parseInt(foodId),
                        mealType: entry.meal_type
                    },
                    bubbles: true
                });
                container.dispatchEvent(customEvent);
            }
        });
        
        // Add touch event listener for edit mode (backup for mobile)
        let touchStartTime = 0;
        let touchStartY = 0;
        item.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchEndY = e.changedTouches[0].clientY;
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            // Only trigger edit if it was a quick tap (not a swipe) and no swipe was detected
            if (touchDuration < 300 && touchDistance < 10 && !hasMoved) {
                const entryId = item.getAttribute('data-entry-id');
                const foodId = item.getAttribute('data-food-id');
                
                if (entryId && foodId) {
                    // Dispatch edit event with entry data
                    const customEvent = new CustomEvent('onEditFood', {
                        detail: { 
                            entryId: parseInt(entryId),
                            foodId: parseInt(foodId),
                            mealType: entry.meal_type
                        },
                        bubbles: true
                    });
                    container.dispatchEvent(customEvent);
                }
            }
        }, { passive: true });
        
        return item;
    }
    
    function createExerciseItem(exercise) {
        const item = document.createElement('div');
        item.className = 'exercise-item';
        item.innerHTML = `
            <div class="exercise-name">${exercise.name || 'Ukendt øvelse'}</div>
            <div class="exercise-duration">${exercise.duration_minutes || 0} min</div>
            <div class="exercise-calories">${Math.round(exercise.calories_burned || 0)} cal</div>
        `;
        return item;
    }
    
    function createMealSection(title, mealType) {
        const section = document.createElement('div');
        section.className = 'meal-section';
        section.setAttribute('data-meal-type', mealType);
        section.setAttribute('data-meal', mealType);
        
        // Line 1: Title, add link, calories and more menu
        const line1 = document.createElement('div');
        line1.className = 'meal-line-1';
        
        const leftSection = document.createElement('div');
        leftSection.className = 'meal-left-section';
        
        const mealTitle = document.createElement('span');
        mealTitle.className = 'meal-title-diary';
        mealTitle.dataset.mealtype = mealType;
        mealTitle.textContent = title;
        leftSection.appendChild(mealTitle);
        
        const addLink = document.createElement('span');
        addLink.className = 'add-food-link';
        addLink.textContent = 'TILFØJ FØDEVARE';
        addLink.addEventListener('click', () => {
            const customEvent = new CustomEvent('onAddFood', {
                detail: { mealType },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        leftSection.appendChild(addLink);
        
        line1.appendChild(leftSection);
        
        const rightSection = document.createElement('div');
        rightSection.className = 'meal-right-section';
        
        const mealCalories = document.createElement('span');
        mealCalories.className = 'meal-calories';
        mealCalories.textContent = '0';
        rightSection.appendChild(mealCalories);
        
        const moreMenu = document.createElement('button');
        moreMenu.className = 'meal-more-menu';
        moreMenu.innerHTML = '⋯';
        moreMenu.title = 'Mere menu';
        rightSection.appendChild(moreMenu);
        
        line1.appendChild(rightSection);
        
        section.appendChild(line1);
        
        // Line 2: Food list container
        const foodList = document.createElement('div');
        foodList.className = 'diary-food-list';
        section.appendChild(foodList);
        
        return section;
    }
    
    function createExerciseSection(title, exerciseType) {
        const section = document.createElement('div');
        section.className = 'meal-section exercise-section';
        section.setAttribute('data-exercise-type', exerciseType);
        
        // Line 1: Title and calories
        const line1 = document.createElement('div');
        line1.className = 'meal-line-1';
        
        const exerciseTitle = document.createElement('span');
        exerciseTitle.className = 'meal-title-diary';
        exerciseTitle.textContent = title;
        line1.appendChild(exerciseTitle);
        
        const exerciseCalories = document.createElement('span');
        exerciseCalories.className = 'meal-calories';
        exerciseCalories.textContent = '0';
        line1.appendChild(exerciseCalories);
        
        section.appendChild(line1);
        
        // Line 2: Add button and more menu
        const line2 = document.createElement('div');
        line2.className = 'meal-line-2';
        
        const addButton = document.createElement('button');
        addButton.className = 'add-exercise-btn';
        addButton.textContent = 'TILFØJ MOTION';
        addButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onAddExercise', {
                detail: { exerciseType },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        line2.appendChild(addButton);
        
        const moreMenu = document.createElement('button');
        moreMenu.className = 'meal-more-menu';
        moreMenu.innerHTML = '⋯';
        moreMenu.title = 'Mere menu';
        line2.appendChild(moreMenu);
        
        section.appendChild(line2);
        
        return section;
    }
    
    function createWaterSection() {
        const section = document.createElement('div');
        section.className = 'meal-section water-section';
        section.setAttribute('data-water-type', 'water');
        
        // Line 1: Title "Vand"
        const line1 = document.createElement('div');
        line1.className = 'water-line-1';
        
        const waterTitle = document.createElement('span');
        waterTitle.className = 'water-title';
        waterTitle.textContent = 'Vand';
        line1.appendChild(waterTitle);
        
        section.appendChild(line1);
        
        // Line 2: Title "Vand" and amount "0 ml"
        const line2 = document.createElement('div');
        line2.className = 'water-line-2';
        
        const waterLabel = document.createElement('div');
        waterLabel.className = 'water-label-container';
        
        const waterLabelText = document.createElement('span');
        waterLabelText.className = 'water-label';
        waterLabelText.textContent = 'Vand';
        waterLabel.appendChild(waterLabelText);
        
        const waterAmount = document.createElement('span');
        waterAmount.className = 'water-amount';
        waterAmount.textContent = '0 ml';
        waterLabel.appendChild(waterAmount);
        
        line2.appendChild(waterLabel);
        
        const separator = document.createElement('div');
        separator.className = 'water-separator';
        line2.appendChild(separator);
        
        section.appendChild(line2);
        
        // Line 3: Add button and more menu
        const line3 = document.createElement('div');
        line3.className = 'water-line-3';
        
        const addButton = document.createElement('button');
        addButton.className = 'add-water-btn';
        addButton.textContent = 'TILFØJ VAND';
        addButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onAddWater', {
                detail: { waterType: 'water' },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        line3.appendChild(addButton);
        
        const moreMenu = document.createElement('button');
        moreMenu.className = 'meal-more-menu';
        moreMenu.innerHTML = '⋯';
        moreMenu.title = 'Mere menu';
        line3.appendChild(moreMenu);
        
        section.appendChild(line3);
        
        return section;
    }
    
    function addSwipeToDelete(item) {
        // Get entry ID from data attribute
        const entryId = item.getAttribute('data-entry-id');
        if (!entryId) {
            return;
        }
        
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let hasMoved = false;
        let startTime = 0;
        const threshold = 50; // Minimum swipe distance to trigger delete
        const maxSwipe = 80; // Maximum swipe distance
        const minSwipeTime = 100; // Minimum swipe time in ms
        
        function resetItem() {
            item.style.transition = 'all 0.3s ease';
            item.style.transform = 'translateX(0)';
            item.style.backgroundColor = '';
            
            isDragging = false;
            hasMoved = false;
        }
        
        function handleSwipeEnd() {
            if (!isDragging) return;
            
            const deltaX = currentX - startX;
            const swipeTime = Date.now() - startTime;
            
            // Only trigger delete if swiped left enough and took reasonable time
            if (hasMoved && deltaX < -threshold && swipeTime > minSwipeTime) {
                // Start smooth delete animation and let it complete
                item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.transform = 'translateX(-100%)';
                item.style.opacity = '0';
                
                // Wait for animation to complete before starting delete process
                setTimeout(() => {
                    deleteFoodItem(item);
                }, 400); // Match the animation duration
            } else {
                resetItem();
            }
        }
        
        // Touch events
        item.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            isDragging = true;
            hasMoved = false;
            item.style.transition = 'none';
            e.preventDefault(); // Prevent scrolling
        }, { passive: false });
        
        item.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            // Only allow left swipe (negative deltaX)
            if (deltaX < 0) {
                const swipeDistance = Math.min(Math.abs(deltaX), maxSwipe);
                item.style.transform = `translateX(-${swipeDistance}px)`;
                hasMoved = true;
                
                // Visual feedback for swipe
                
                // Add visual feedback - change background color based on swipe distance
                const swipeProgress = Math.min(swipeDistance / threshold, 1);
                item.style.backgroundColor = `rgba(231, 76, 60, ${swipeProgress * 0.1})`;
                
                e.preventDefault(); // Prevent scrolling
            }
        }, { passive: false });
        
        item.addEventListener('touchend', (e) => {
            // Only prevent default if we actually swiped
            if (hasMoved) {
                e.preventDefault();
            }
            handleSwipeEnd();
        }, { passive: false });
        
        item.addEventListener('touchcancel', (e) => {
            // Only prevent default if we were actually dragging
            if (isDragging) {
                e.preventDefault();
            }
            resetItem();
        }, { passive: false });
        
        // Mouse events for desktop
        item.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startTime = Date.now();
            isDragging = true;
            hasMoved = false;
            item.style.transition = 'none';
            e.preventDefault();
        });
        
        // Use document for mouse events to handle mouse leaving the element
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            currentX = e.clientX;
            const deltaX = currentX - startX;
            
            if (deltaX < 0) {
                const swipeDistance = Math.min(Math.abs(deltaX), maxSwipe);
                item.style.transform = `translateX(-${swipeDistance}px)`;
                hasMoved = true;
                
                // Visual feedback for swipe
                
                // Add visual feedback - change background color based on swipe distance
                const swipeProgress = Math.min(swipeDistance / threshold, 1);
                item.style.backgroundColor = `rgba(231, 76, 60, ${swipeProgress * 0.1})`;
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            handleSwipeEnd();
        });
        
        // Delete functionality is now only available via swipe
        
        // Cleanup function to remove document listeners when item is removed
        item._cleanupSwipe = () => {
            document.removeEventListener('mousemove', handleSwipeEnd);
            document.removeEventListener('mouseup', handleSwipeEnd);
        };
    }
    
    async function deleteFoodItem(itemElement) {
        try {
            // Get entry ID from data attribute - this is the single source of truth
            const entryId = itemElement.getAttribute('data-entry-id');
            
            
            if (!entryId) {
                throw new Error('No data-entry-id found on food item');
            }
            
            // First, check if entry exists in current state
            const currentState = AppState.getState();
            const entryExists = currentState.diary.entries.some(entry => entry.id === parseInt(entryId));
            
            if (!entryExists) {
                // Entry doesn't exist in state, just remove from UI immediately
                if (itemElement._cleanupSwipe) {
                    itemElement._cleanupSwipe();
                }
                itemElement.remove();
                return;
            }
            
            // Show loading state
            itemElement.style.opacity = '0.5';
            itemElement.style.pointerEvents = 'none';
            
            // Call delete API with the entry ID from data attribute
            const response = await api.deleteDiaryEntry(entryId);
            
            if (response && response.message) {
                // Animation is already running, just wait for it to complete
                
                setTimeout(async () => {
                    // Cleanup swipe listeners
                    if (itemElement._cleanupSwipe) {
                        itemElement._cleanupSwipe();
                    }
                    
                    itemElement.remove();
                    
                    // Force complete reload from backend to ensure state sync
                    const currentDate = new Date();
                    const dateString = currentDate.toISOString().split('T')[0];
                    
                    
                    // Clear current state and reload from backend
                    AppState.setDiary({ date: dateString, entries: [] });
                    await AppState.loadDiary(dateString);
                    
                }, 100); // Short delay to ensure animation is complete
            } else {
                throw new Error(response?.error || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
            
            // If it's a 404 error, the entry might already be deleted
            if (error.message.includes('404')) {
                
                // Animation is already running, just wait for it to complete
                setTimeout(async () => {
                    // Cleanup swipe listeners
                    if (itemElement._cleanupSwipe) {
                        itemElement._cleanupSwipe();
                    }
                    
                    itemElement.remove();
                    
                    // Force complete reload from backend to ensure state sync
                    const currentDate = new Date();
                    const dateString = currentDate.toISOString().split('T')[0];
                    
                    // Get entry ID from data attribute
                    const entryId = itemElement.getAttribute('data-entry-id');
                    
                    
                    // Clear current state and reload from backend
                    AppState.setDiary({ date: dateString, entries: [] });
                    await AppState.loadDiary(dateString);
                    
                }, 100); // Short delay to ensure animation is complete
                
                return;
            }
            
            // Reset item state for other errors
            itemElement.style.opacity = '1';
            itemElement.style.pointerEvents = 'auto';
            itemElement.style.transition = 'transform 0.3s ease';
            itemElement.style.transform = 'translateX(0)';
            
            alert(`Fejl ved sletning: ${error.message}`);
        }
    }

    function createCustomScrollbar(container) {
        
        // Color interpolation function
        function interpolateColor(color1, color2, ratio) {
            // Convert hex to RGB
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            
            const rgb1 = hexToRgb(color1);
            const rgb2 = hexToRgb(color2);
            
            if (!rgb1 || !rgb2) return color1;
            
            const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
            const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
            const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
            
            return `rgb(${r}, ${g}, ${b})`;
        }
        
        // Hide native scrollbar
        container.style.scrollbarWidth = 'none';
        container.style.msOverflowStyle = 'none';
        const style = document.createElement('style');
        style.textContent = `
            ${container.tagName.toLowerCase()}::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        // Create scrollbar track
        const scrollbar = document.createElement('div');
        scrollbar.className = 'custom-scrollbar';
        
        // Create scrollbar thumb
        const thumb = document.createElement('div');
        thumb.className = 'custom-scrollbar-thumb';
        scrollbar.appendChild(thumb);
        
        // Add scrollbar to container
        container.appendChild(scrollbar);
        
        // Update scrollbar on scroll
        function updateScrollbar() {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            
            // Always show scrollbar for testing
            scrollbar.style.display = 'block';
            
            if (scrollHeight <= clientHeight) {
                // If no scrolling needed, hide scrollbar
                scrollbar.style.display = 'none';
                return;
            }
            
            const scrollbarHeight = scrollbar.getBoundingClientRect().height;
            const thumbHeight = scrollbarHeight * 0.07; // Always 7% of scrollbar height
            const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
            
            // Calculate color based on position (0 = top, 1 = bottom)
            const positionRatio = thumbTop / (scrollbarHeight - thumbHeight);
            const color = interpolateColor('#46ae98', '#ae7246', positionRatio);
            
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.top = `${thumbTop}px`;
            thumb.style.background = color;
        }
        
        // Add scroll listener
        container.addEventListener('scroll', () => {
            updateScrollbar();
        });
        
        // Add click event listener to scrollbar track
        scrollbar.addEventListener('click', (e) => {
            const rect = scrollbar.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const percentage = clickY / rect.height;
            const scrollTop = percentage * (container.scrollHeight - container.clientHeight);
            container.scrollTop = scrollTop;
        });
        
        // Add click event listener to scrollbar thumb
        thumb.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent track click
        });
        
        // Add drag functionality to thumb
        let isDragging = false;
        let startY = 0;
        let startScrollTop = 0;
        
        thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startScrollTop = container.scrollTop;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaY = e.clientY - startY;
            const scrollbarHeight = scrollbar.getBoundingClientRect().height;
            const thumbHeight = thumb.getBoundingClientRect().height;
            const maxScrollTop = container.scrollHeight - container.clientHeight;
            const scrollbarTrackHeight = scrollbarHeight - thumbHeight;
            
            const deltaScroll = (deltaY / scrollbarTrackHeight) * maxScrollTop;
            container.scrollTop = startScrollTop + deltaScroll;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Initial update
        updateScrollbar();
        
        // Update on resize
        window.addEventListener('resize', updateScrollbar);
        
        // Click to scroll
        scrollbar.addEventListener('click', (e) => {
            const rect = scrollbar.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const percentage = clickY / rect.height;
            const scrollTop = percentage * (container.scrollHeight - container.clientHeight);
            container.scrollTop = scrollTop;
        });
    }
    
    // Return the diary element for external access
    return diary;
}
