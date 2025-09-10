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
    
    diary.appendChild(dateNav);
    
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
    
    diary.appendChild(summarySection);
    
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
    
    // Entries container
    const entriesContainer = document.createElement('div');
    entriesContainer.className = 'diary-entries';
    diary.appendChild(entriesContainer);
    
    // Summary section
    const summary = document.createElement('div');
    summary.className = 'diary-summary';
    diary.appendChild(summary);
    
    // Add to container
    container.appendChild(diary);
    
    // Subscribe to state changes
    AppState.subscribe('diary', updateDiary);
    AppState.subscribe('foods', updateDiary);
    
    // Initial update
    updateDiary();
    
    function updateDiary() {
        const state = AppState.getState();
        const entries = state.diary.entries || [];
        const foods = state.foods || [];
        
        // Clear existing entries (but keep header)
        entriesContainer.innerHTML = '';
        
        if (entries.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<p>Ingen entries i dag. Klik "Add Entry" for at tilføje fødevarer.</p>';
            entriesContainer.appendChild(emptyMessage);
        } else {
            // Render each entry
            entries.forEach(entry => {
                const food = foods.find(f => f.id === entry.food_id);
                if (food) {
                    const entryElement = createEntryElement(entry, food);
                    entriesContainer.appendChild(entryElement);
                }
            });
        }
        
        // Update summary
        updateSummary(entries, foods);
    }
    
    function createEntryElement(entry, food) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'diary-entry';
        entryDiv.setAttribute('data-entry-id', entry.id);
        
        // Calculate calories
        const calories = (entry.grams / 100) * food.calories;
        
        // Entry content
        const content = document.createElement('div');
        content.className = 'entry-content';
        
        const foodName = document.createElement('div');
        foodName.className = 'food-name';
        foodName.textContent = food.name;
        content.appendChild(foodName);
        
        const amount = document.createElement('div');
        amount.className = 'entry-amount';
        amount.textContent = `${entry.grams}g`;
        content.appendChild(amount);
        
        const caloriesDisplay = document.createElement('div');
        caloriesDisplay.className = 'entry-calories';
        caloriesDisplay.textContent = `${Math.round(calories)} kcal`;
        content.appendChild(caloriesDisplay);
        
        entryDiv.appendChild(content);
        
        // Entry actions
        const actions = document.createElement('div');
        actions.className = 'entry-actions';
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn-edit';
        editButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onEditEntry', {
                detail: { entry, food },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(editButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn-delete';
        deleteButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onDeleteEntry', {
                detail: { entryId: entry.id },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(deleteButton);
        
        entryDiv.appendChild(actions);
        
        return entryDiv;
    }
    
    function updateSummary(entries, foods) {
        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        entries.forEach(entry => {
            const food = foods.find(f => f.id === entry.food_id);
            if (food) {
                const multiplier = entry.grams / 100;
                totalCalories += food.calories * multiplier;
                totalProtein += (food.protein || 0) * multiplier;
                totalCarbs += (food.carbohydrates || 0) * multiplier;
                totalFat += (food.fat || 0) * multiplier;
            }
        });
        
        // Update summary display
        summary.innerHTML = `
            <div class="summary-title">
                <h3>Dagens Total</h3>
            </div>
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-label">Kalorier:</span>
                    <span class="stat-value">${Math.round(totalCalories)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Protein:</span>
                    <span class="stat-value">${Math.round(totalProtein)}g</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Kulhydrater:</span>
                    <span class="stat-value">${Math.round(totalCarbs)}g</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Fedt:</span>
                    <span class="stat-value">${Math.round(totalFat)}g</span>
                </div>
            </div>
        `;
    }
    
    // Date navigation functionality
    let currentDate = new Date();
    
    prevButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        dateDisplay.textContent = formatDate(currentDate);
        // TODO: Load diary for new date
        console.log('Previous day:', formatDate(currentDate));
    });
    
    nextButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        dateDisplay.textContent = formatDate(currentDate);
        // TODO: Load diary for new date
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
    
    function createMealSection(title, mealType) {
        const section = document.createElement('div');
        section.className = 'meal-section';
        section.setAttribute('data-meal-type', mealType);
        
        // Line 1: Title and calories
        const line1 = document.createElement('div');
        line1.className = 'meal-line-1';
        
        const mealTitle = document.createElement('span');
        mealTitle.className = 'meal-title';
        mealTitle.textContent = title;
        line1.appendChild(mealTitle);
        
        const mealCalories = document.createElement('span');
        mealCalories.className = 'meal-calories';
        mealCalories.textContent = '0';
        line1.appendChild(mealCalories);
        
        section.appendChild(line1);
        
        // Line 2: Add button and more menu
        const line2 = document.createElement('div');
        line2.className = 'meal-line-2';
        
        const addButton = document.createElement('button');
        addButton.className = 'add-food-btn';
        addButton.textContent = 'TILFØJ FØDEVARE';
        addButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onAddFood', {
                detail: { mealType },
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
    
    // Return the diary element for external access
    return diary;
}
