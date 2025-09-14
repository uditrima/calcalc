// Diary UI component
import { AppState } from '../state/app_state.js';

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
    goalCalories.textContent = '1,500';
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
    foodCalories.className = 'summary-number food-calories';
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
    remainingCalories.textContent = '1,500';
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
    
    // Morgenmad
    const morgenmadSection = createMealSection('Morgenmad', 'morgenmad');
    mealsContainer.appendChild(morgenmadSection);
    
    // Frokost
    const frokostSection = createMealSection('Frokost', 'frokost');
    mealsContainer.appendChild(frokostSection);
    
    // Aftensmad
    const aftensmadSection = createMealSection('Aftensmad', 'aftensmad');
    mealsContainer.appendChild(aftensmadSection);
    
    // Mellemmåltid 1
    const mellemmaaltid1Section = createMealSection('Mellemmåltid 1', 'mellemmaaltid1');
    mealsContainer.appendChild(mellemmaaltid1Section);
    
    // Mellemmåltid 2
    const mellemmaaltid2Section = createMealSection('Mellemmåltid 2', 'mellemmaaltid2');
    mealsContainer.appendChild(mellemmaaltid2Section);
    
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
    
    // Initial update
    updateMealSections();
    
    function updateMealSections(state = null) {
        const currentState = state || AppState.getState();
        const entries = currentState.diary.entries || [];
        
        // Update meal calories for each meal type
        const mealTypes = ['morgenmad', 'frokost', 'aftensmad', 'mellemmaaltid1', 'mellemmaaltid2'];
        
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
        const foodElement = document.querySelector('.food-calories');
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
        console.log('Previous day:', formatDate(currentDate));
    });
    
    nextButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        dateDisplay.textContent = formatDate(currentDate);
        loadDiaryForDate(currentDate);
        console.log('Next day:', formatDate(currentDate));
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
            console.log('Loading diary data for date:', dateString);
            
            // Load diary entries for the selected date
            await AppState.loadDiary(dateString);
            
            // Load exercises for the selected date
            await AppState.loadExercises(dateString);
            
            // Get updated state
            const state = AppState.getState();
            console.log('State after loading:', state);
            
            // Update the diary display with new data
            updateDiaryDisplay(dateString);
            
            console.log('Diary data loaded successfully for:', dateString);
        } catch (error) {
            console.error('Error loading diary data:', error);
        }
    }
    
    function updateDiaryDisplay(dateString) {
        const state = AppState.getState();
        console.log('Updating diary display with state:', state);
        
        if (!state) {
            console.log('State is undefined in updateDiaryDisplay');
            return;
        }
        
        // Update summary details with data for selected date
        updateSummaryDetails(state, dateString);
        
        // Update meal sections with diary entries for selected date
        updateMealSections(state);
        
        // Update exercise section with exercises for selected date
        updateExerciseSection(state);
    }
    
    function updateSummaryDetails(state, dateString) {
        if (!state) {
            console.log('State is undefined in updateSummaryDetails');
            return;
        }
        
        // Use the existing updateSummarySection function which has the correct selectors
        updateSummarySection(state);
        
        console.log('Summary details updated for date:', dateString, {
            totalCalories: (state.diary && state.diary.entries) ? state.diary.entries.reduce((sum, entry) => sum + (entry.calories || 0), 0) : 0,
            totalExercise: (state.exercises || []).reduce((sum, ex) => sum + (ex.calories_burned || 0), 0)
        });
    }
    
    function updateMealSections(state, dateString) {
        if (!state) {
            console.log('State is undefined in updateMealSections');
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
        
        // Update each meal section
        Object.keys(entriesByMeal).forEach(mealType => {
            const mealSection = document.querySelector(`[data-meal="${mealType}"]`);
            if (mealSection) {
                updateMealSectionContent(mealSection, entriesByMeal[mealType]);
            }
        });
    }
    
    function updateMealSectionContent(mealSection, entries) {
        // Find the food list container
        const foodList = mealSection.querySelector('.food-list');
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
        const totalElement = mealSection.querySelector('.meal-total');
        if (totalElement) {
            totalElement.textContent = `${Math.round(totalCalories)} cal`;
        }
    }
    
    function updateExerciseSection(state = null) {
        const currentState = state || AppState.getState();
        if (!currentState) {
            console.log('State is undefined in updateExerciseSection');
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
        item.className = 'food-item';
        item.innerHTML = `
            <div class="food-name">${entry.food_name || 'Ukendt fødevare'}</div>
            <div class="food-portion">${entry.servings || 1} portioner</div>
            <div class="food-calories">${Math.round(entry.calories || 0)} cal</div>
        `;
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
        mealTitle.className = 'meal-title';
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
        exerciseTitle.className = 'meal-title';
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
    
    function createCustomScrollbar(container) {
        console.log('Creating custom scrollbar for container:', container);
        
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
            
            console.log('Updating scrollbar:', { scrollTop, scrollHeight, clientHeight });
            
            // Always show scrollbar for testing
            scrollbar.style.display = 'block';
            
            if (scrollHeight <= clientHeight) {
                // If no scrolling needed, make thumb full height
                thumb.style.height = '100%';
                thumb.style.top = '0px';
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
            console.log('Container scrolled, updating scrollbar');
            updateScrollbar();
        });
        
        // Add click event listener to scrollbar track
        scrollbar.addEventListener('click', (e) => {
            console.log('Scrollbar track clicked');
            const rect = scrollbar.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const percentage = clickY / rect.height;
            const scrollTop = percentage * (container.scrollHeight - container.clientHeight);
            console.log('Scrolling to:', scrollTop);
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
            console.log('Thumb mousedown');
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
