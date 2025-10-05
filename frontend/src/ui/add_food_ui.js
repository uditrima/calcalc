// Add Food UI Creation Functions
import { getMealOptions } from '../data/meal_types.js';
import { AppState } from '../state/app_state.js';

/**
 * Creates the food header section with back button, title and accept button
 * @param {Object} callbacks - Object containing callback functions
 * @returns {HTMLElement} The header element
 */
export function createFoodHeader(callbacks = {}) {
    const header = document.createElement('div');
    header.className = 'add-food-header';
    
    // Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.className = 'go-back-btn';
    goBackBtn.innerHTML = '←';
    goBackBtn.addEventListener('click', callbacks.onGoBack || (() => {}));
    header.appendChild(goBackBtn);
    
    // Title
    const title = document.createElement('h2');
    title.className = 'add-food-title';
    title.textContent = 'Tilføj fødevare';
    header.appendChild(title);
    
    // Accept button
    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'accept-btn';
    acceptBtn.innerHTML = '✓';
    acceptBtn.addEventListener('click', callbacks.onAccept || (() => {}));
    header.appendChild(acceptBtn);
    
    return header;
}

/**
 * Creates the selected food section
 * @returns {HTMLElement} The selected food section element
 */
export function createSelectedFoodSection() {
    const section = document.createElement('div');
    section.className = 'selected-food-section';
    
    const foodName = document.createElement('div');
    foodName.className = 'selected-food-name';
    foodName.textContent = 'Vælg en fødevare';
    section.appendChild(foodName);
    
    return section;
}

/**
 * Creates the meal selection section
 * @param {string} currentMealType - Currently selected meal type
 * @param {Object} callbacks - Object containing callback functions
 * @returns {HTMLElement} The meal section element
 */
export function createMealSection(currentMealType = 'morgenmad', callbacks = {}) {
    const section = document.createElement('div');
    section.className = 'select-meal-section';
    
    const mealLabel = document.createElement('div');
    mealLabel.className = 'meal-label';
    mealLabel.textContent = 'Måltid';
    
    const mealSelector = document.createElement('div');
    mealSelector.className = 'meal-selector';
    
    const mealTypes = getMealOptions(false); // false = extended (5 meals)
    
    const mealDropdown = document.createElement('select');
    mealDropdown.className = 'meal-dropdown';
    
    mealTypes.forEach(meal => {
        const option = document.createElement('option');
        option.value = meal.value;
        option.textContent = meal.label;
        
        // Add theme colors based on meal type
        const mealColorMap = {
            'morgenmad': 'var(--meal-morgenmad)',
            'frokost': 'var(--meal-frokost)',
            'aftensmad': 'var(--meal-aftensmad)',
            'mellemmaaltid1': 'var(--meal-mellemm1)',
            'mellemmaaltid2': 'var(--meal-mellemm2)'
        };
        
        const mealColor = mealColorMap[meal.value];
        if (mealColor) {
            option.style.color = mealColor;
            option.style.backgroundColor = 'var(--color-bg)';
        }
        
        if (meal.value === currentMealType) {
            option.selected = true;
        }
        mealDropdown.appendChild(option);
    });
    
    mealDropdown.addEventListener('change', (e) => {
        if (callbacks.onMealChange) {
            callbacks.onMealChange(e.target.value);
        }
    });
    
    mealSelector.appendChild(mealDropdown);
    
    // Set initial color
    updateMealDropdownColor(mealDropdown, currentMealType);
    
    section.appendChild(mealLabel);
    section.appendChild(mealSelector);
    
    return section;
}

/**
 * Updates meal dropdown color based on meal type
 * @param {HTMLElement} dropdown - The dropdown element
 * @param {string} mealType - The meal type
 */
export function updateMealDropdownColor(dropdown, mealType) {
    const mealColorMap = {
        'morgenmad': 'var(--meal-morgenmad)',
        'frokost': 'var(--meal-frokost)',
        'aftensmad': 'var(--meal-aftensmad)',
        'mellemmaaltid1': 'var(--meal-mellemm1)',
        'mellemmaaltid2': 'var(--meal-mellemm2)'
    };
    
    const mealColor = mealColorMap[mealType];
    if (mealColor) {
        dropdown.style.color = mealColor;
    }
}

/**
 * Creates the portion section with controls
 * @param {number} currentServings - Current servings value
 * @param {Object} callbacks - Object containing callback functions
 * @returns {HTMLElement} The portion section element
 */
export function createPortionSection(currentServings = 1.0, callbacks = {}) {
    const section = document.createElement('div');
    section.className = 'portion-section';
    
    const portionLabel = document.createElement('div');
    portionLabel.className = 'portion-label';
    portionLabel.textContent = 'Antal portioner';
    
    const portionControls = document.createElement('div');
    portionControls.className = 'portion-controls';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'portion-btn decrease-btn';
    decreaseBtn.innerHTML = '−';
    decreaseBtn.addEventListener('click', () => {
        if (callbacks.onDecrease) {
            callbacks.onDecrease();
        }
    });
    
    const servingsDisplay = document.createElement('div');
    servingsDisplay.className = 'servings-display';
    servingsDisplay.textContent = currentServings.toFixed(1);
    servingsDisplay.setAttribute('contenteditable', 'true');
    servingsDisplay.addEventListener('click', () => {
        servingsDisplay.focus();
    });
    servingsDisplay.addEventListener('blur', () => {
        if (callbacks.onServingsBlur) {
            callbacks.onServingsBlur(servingsDisplay.textContent);
        }
    });
    servingsDisplay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            servingsDisplay.blur();
        }
    });
    
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'portion-btn increase-btn';
    increaseBtn.innerHTML = '+';
    increaseBtn.addEventListener('click', () => {
        if (callbacks.onIncrease) {
            callbacks.onIncrease();
        }
    });
    
    portionControls.appendChild(decreaseBtn);
    portionControls.appendChild(servingsDisplay);
    portionControls.appendChild(increaseBtn);
    
    section.appendChild(portionLabel);
    section.appendChild(portionControls);
    
    return section;
}

/**
 * Creates the summary section with calorie gauge and macros
 * @returns {HTMLElement} The summary section element
 */
export function createSummarySection() {
    const section = document.createElement('div');
    section.className = 'add-food-summary-section';
    
    const summaryTitle = document.createElement('h3');
    summaryTitle.textContent = 'Oversigt';
    section.appendChild(summaryTitle);
    
    const summaryContent = document.createElement('div');
    summaryContent.className = 'summary-content';
    
    // Calorie gauge
    const gaugeContainer = document.createElement('div');
    gaugeContainer.className = 'calorie-gauge-container';
    
    const gauge = document.createElement('div');
    gauge.className = 'calorie-gauge';
    gauge.innerHTML = `
        <svg width="120" height="120" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-bg-secondary)" stroke-width="20"></circle>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-calories)" stroke-width="20" 
                    stroke-dasharray="502.4" stroke-dashoffset="0" stroke-linecap="round" 
                    transform="rotate(-90 100 100)" class="calories-remaining"></circle>
            <g text-anchor="middle">
                <text x="100" y="90" font-size="20" font-weight="bold" fill="var(--color-calories)" class="calories-text">0</text>
                <text x="100" y="115" font-size="12" fill="var(--color-text-muted)">Cal</text>
            </g>
        </svg>
    `;
    gaugeContainer.appendChild(gauge);
    
    // Macronutrients
    const macrosContainer = document.createElement('div');
    macrosContainer.className = 'macros-container';
    
    const carbsMacro = createMacroItem('Carbs', '15%', '0.4g', 'carbs');
    const proteinMacro = createMacroItem('Protein', '63%', '1.6g', 'protein');
    const fatMacro = createMacroItem('Fedt', '22%', '0.3g', 'fat');
    
    macrosContainer.appendChild(carbsMacro);
    macrosContainer.appendChild(proteinMacro);
    macrosContainer.appendChild(fatMacro);
    
    summaryContent.appendChild(gaugeContainer);
    summaryContent.appendChild(macrosContainer);
    
    section.appendChild(summaryContent);
    
    return section;
}

/**
 * Creates a macro item element
 * @param {string} label - The macro label
 * @param {string} percentage - The percentage value
 * @param {string} amount - The amount value
 * @param {string} colorClass - The color class
 * @returns {HTMLElement} The macro item element
 */
export function createMacroItem(label, percentage, amount, colorClass) {
    const item = document.createElement('div');
    item.className = 'macro-item';
    
    const macroLabel = document.createElement('div');
    macroLabel.className = 'macro-label';
    macroLabel.textContent = label;
    
    const macroPercentage = document.createElement('div');
    macroPercentage.className = 'macro-percentage';
    macroPercentage.textContent = percentage;
    
    const macroAmount = document.createElement('div');
    macroAmount.className = 'macro-amount';
    macroAmount.textContent = amount;
    
    const macroIndicator = document.createElement('div');
    macroIndicator.className = `macro-indicator ${colorClass}`;
    
    item.appendChild(macroLabel);
    item.appendChild(macroPercentage);
    item.appendChild(macroAmount);
    item.appendChild(macroIndicator);
    
    return item;
}

/**
 * Creates the daily goal section
 * @returns {HTMLElement} The daily goal section element
 */
export function createDailyGoalSection() {
    const section = document.createElement('div');
    section.className = 'daily-goal-section';
    
    const goalTitle = document.createElement('h3');
    goalTitle.textContent = 'Procent af dit daglige mål';
    section.appendChild(goalTitle);
    
    const goalsContainer = document.createElement('div');
    goalsContainer.className = 'goals-container';
    
    // Get goals data or use defaults
    const formattedGoals = AppState.getFormattedGoals();
    const caloriesGoal = createGoalItem('Calories', '0%', formattedGoals?.calories.formatted || '1,500', 0);
    const carbsGoal = createGoalItem('Carbs', '0%', formattedGoals?.carbs.formatted || '1.6g', 0);
    const proteinGoal = createGoalItem('Protein', '0%', formattedGoals?.protein.formatted || '1.6g', 0);
    const fatGoal = createGoalItem('Fedt', '0%', formattedGoals?.fat.formatted || '1.6g', 0);
    
    goalsContainer.appendChild(caloriesGoal);
    goalsContainer.appendChild(carbsGoal);
    goalsContainer.appendChild(proteinGoal);
    goalsContainer.appendChild(fatGoal);
    
    section.appendChild(goalsContainer);

    return section;
}

/**
 * Creates a goal item element
 * @param {string} label - The goal label
 * @param {string} percentage - The percentage value
 * @param {string} amount - The amount value
 * @param {number} progress - The progress value (0-100)
 * @returns {HTMLElement} The goal item element
 */
export function createGoalItem(label, percentage, amount, progress) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
    const goalLabel = document.createElement('div');
    goalLabel.className = 'goal-label';
    goalLabel.textContent = label;
    
    const goalPercentage = document.createElement('div');
    goalPercentage.className = 'goal-percentage';
    goalPercentage.textContent = percentage;
    
    const goalAmount = document.createElement('div');
    goalAmount.className = 'goal-amount';
    goalAmount.textContent = amount;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.style.width = `${progress}%`;
    progressBar.appendChild(progressFill);
    
    item.appendChild(goalLabel);
    item.appendChild(goalPercentage);
    item.appendChild(goalAmount);
    item.appendChild(progressBar);
    
    return item;
}

/**
 * Creates the fold out section
 * @param {Object} callbacks - Object containing callback functions
 * @returns {HTMLElement} The fold out section element
 */
export function createFoldOutSection(callbacks = {}) {
    const section = document.createElement('div');
    section.className = 'fold-out-section';
    
    const foldOutBtn = document.createElement('button');
    foldOutBtn.className = 'fold-out-btn';
    foldOutBtn.innerHTML = '▼';
    foldOutBtn.addEventListener('click', () => {
        if (callbacks.onFoldOut) {
            callbacks.onFoldOut();
        }
    });
    
    section.appendChild(foldOutBtn);
    
    return section;
}

/**
 * Creates the paired foods section
 * @returns {HTMLElement} The paired foods section element
 */
export function createPairedFoodsSection() {
    const section = document.createElement('div');
    section.className = 'paired-foods-section';
    
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = 'Tilføj ofte parrede fødevarer';
    section.appendChild(sectionTitle);
    
    const pairedFoodsList = document.createElement('div');
    pairedFoodsList.className = 'paired-foods-list';
    pairedFoodsList.innerHTML = '<p>Ingen parrede fødevarer fundet</p>';
    
    section.appendChild(pairedFoodsList);
    
    return section;
}
