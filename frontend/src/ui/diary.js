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
    
    // Add test content to make diary scrollable
    const testContent = document.createElement('div');
    testContent.style.padding = '20px';
    testContent.style.margin = '20px';
    testContent.style.background = 'rgba(255,255,255,0.1)';
    testContent.style.borderRadius = '10px';
    testContent.innerHTML = `
        <h3>Test Content for Scrolling</h3>
        <p>This is test content to make the diary scrollable.</p>
        <p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p>
        <p>Line 6</p><p>Line 7</p><p>Line 8</p><p>Line 9</p><p>Line 10</p>
        <p>Line 11</p><p>Line 12</p><p>Line 13</p><p>Line 14</p><p>Line 15</p>
        <p>Line 16</p><p>Line 17</p><p>Line 18</p><p>Line 19</p><p>Line 20</p>
        <p>Line 21</p><p>Line 22</p><p>Line 23</p><p>Line 24</p><p>Line 25</p>
        <p>Line 26</p><p>Line 27</p><p>Line 28</p><p>Line 29</p><p>Line 30</p>
    `;
    mealsContainer.appendChild(testContent);
    
    // Add to container
    container.appendChild(diary);
    
    // Create custom scrollbar for the diary container
    createCustomScrollbar(diary);
    
    // Subscribe to state changes for meal sections
    AppState.subscribe('diary', updateMealSections);
    AppState.subscribe('foods', updateMealSections);
    
    // Initial update
    updateMealSections();
    
    function updateMealSections() {
        const state = AppState.getState();
        const entries = state.diary.entries || [];
        
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
        const exerciseEntries = state.exercises || [];
        const exerciseCalories = exerciseEntries.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        
        const exerciseSection = document.querySelector('[data-exercise-type="motion"]');
        if (exerciseSection) {
            const caloriesElement = exerciseSection.querySelector('.meal-calories');
            if (caloriesElement) {
                caloriesElement.textContent = Math.round(exerciseCalories);
            }
        }
        
        // Update summary section
        updateSummarySection(state);
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
    
    function createCustomScrollbar(container) {
        console.log('Creating custom scrollbar for container:', container);
        
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
            const scrollRatio = clientHeight / scrollHeight;
            const thumbHeight = scrollbarHeight * scrollRatio; // Dynamic height based on scroll ratio
            const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
            
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.top = `${thumbTop}px`;
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
