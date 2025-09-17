// Add Food UI component
import { AppState } from '../state/app_state.js';
import { getMealOptions } from '../data/meal_types.js';
import { goalsState } from '../state/goals_state.js';
import { PortionConverter } from '../utils/portion_converter.js';

export function AddFood(container) {
    if (!container) {
        throw new Error('AddFood requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create main add food section structure
    const addFoodSection = document.createElement('div');
    addFoodSection.className = 'add-food';
    
    // Store reference to current food
    let currentFood = null;
    let currentServings = 1.0;
    let currentMealType = 'morgenmad';
    
    // 1. Food Header
    const foodHeader = createFoodHeader();
    addFoodSection.appendChild(foodHeader);
    
    // 2. Selected Food Section
    const selectedFoodSection = createSelectedFoodSection();
    addFoodSection.appendChild(selectedFoodSection);
    
    // 3. Meal Section
    const mealSection = createMealSection();
    addFoodSection.appendChild(mealSection);
    
    // 4. Portion Size Section
    const portionSection = createPortionSection();
    addFoodSection.appendChild(portionSection);
    
    // 5. Summary Section
    const summarySection = createSummarySection();
    addFoodSection.appendChild(summarySection);
    
    // 6. Daily Goal Summary Section
    const dailyGoalSection = createDailyGoalSection();
    addFoodSection.appendChild(dailyGoalSection);
    
    // 7. Fold Out Section (placeholder)
    const foldOutSection = createFoldOutSection();
    addFoodSection.appendChild(foldOutSection);
    
    // 8. Add Frequently Paired Foods Section
    const pairedFoodsSection = createPairedFoodsSection();
    addFoodSection.appendChild(pairedFoodsSection);
    
    // Setup custom scrollbar
    createCustomScrollbar(addFoodSection);
    
    // Add to container
    container.appendChild(addFoodSection);
    
    // Public methods
    const addFoodComponent = {
        setFood: (food) => {
            currentFood = food;
            // Set currentServings to last_portion from database, default to 1.0 if not available
            currentServings = food.last_portion || 1.0;
            updateServingsDisplay();
            updateSelectedFood();
            updateSummary();
            updateDailyGoals();
            loadPairedFoods();
        },
        getFood: () => currentFood,
        getServings: () => currentServings,
        getMealType: () => currentMealType
    };
    
    function createFoodHeader() {
        const header = document.createElement('div');
        header.className = 'add-food-header';
        
        // Go back button
        const goBackBtn = document.createElement('button');
        goBackBtn.className = 'go-back-btn';
        goBackBtn.innerHTML = '←';
        goBackBtn.addEventListener('click', () => {
            const customEvent = new CustomEvent('onGoBackToFood', {
                bubbles: true
            });
            // Dispatch on the app container instead of document
            const appContainer = document.querySelector('#app');
            if (appContainer) {
                appContainer.dispatchEvent(customEvent);
            } else {
                document.dispatchEvent(customEvent);
            }
        });
        header.appendChild(goBackBtn);
        
        // Title
        const title = document.createElement('h2');
        title.textContent = 'Tilføj fødevare';
        header.appendChild(title);
        
        // Accept button
        const acceptBtn = document.createElement('button');
        acceptBtn.className = 'accept-btn';
        acceptBtn.innerHTML = '✓';
        acceptBtn.addEventListener('click', () => {
            handleAcceptFood();
        });
        header.appendChild(acceptBtn);
        
        return header;
    }
    
    function createSelectedFoodSection() {
        const section = document.createElement('div');
        section.className = 'selected-food-section';
        
        const foodName = document.createElement('div');
        foodName.className = 'selected-food-name';
        foodName.textContent = 'Vælg en fødevare';
        
        section.appendChild(foodName);
        
        return section;
    }
    
    function createMealSection() {
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
            currentMealType = e.target.value;
            updateMealDropdownColor(mealDropdown, currentMealType);
        });
        
        mealSelector.appendChild(mealDropdown);
        
        // Set initial color
        updateMealDropdownColor(mealDropdown, currentMealType);
        
        section.appendChild(mealLabel);
        section.appendChild(mealSelector);
        
        return section;
    }
    
    function updateMealDropdownColor(dropdown, mealType) {
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
    
    function createPortionSection() {
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
            if (currentServings > 0.1) {
                currentServings = Math.max(0.1, currentServings - 0.1);
                updateServingsDisplay();
                updateSummary();
                updateDailyGoals();
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
            const newValue = parseFloat(servingsDisplay.textContent);
            if (!isNaN(newValue) && newValue > 0) {
                currentServings = newValue;
                updateServingsDisplay();
                updateSummary();
                updateDailyGoals();
            } else {
                // Reset to current value if invalid
                updateServingsDisplay();
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
            currentServings = currentServings + 0.1;
            updateServingsDisplay();
            updateSummary();
            updateDailyGoals();
        });
        
        portionControls.appendChild(decreaseBtn);
        portionControls.appendChild(servingsDisplay);
        portionControls.appendChild(increaseBtn);
        
        section.appendChild(portionLabel);
        section.appendChild(portionControls);
        
        return section;
    }
    
    function createSummarySection() {
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
                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-gauge-remaining)" stroke-width="20" 
                        stroke-dasharray="502.4" stroke-dashoffset="0" stroke-linecap="round" 
                        transform="rotate(-90 100 100)" class="calories-remaining"></circle>
                <g text-anchor="middle">
                    <text x="100" y="90" font-size="20" font-weight="bold" fill="var(--color-text)" class="calories-text">0</text>
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
    
    function createMacroItem(label, percentage, amount, colorClass) {
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
    
    function createDailyGoalSection() {
        const section = document.createElement('div');
        section.className = 'daily-goal-section';
        
        const goalTitle = document.createElement('h3');
        goalTitle.textContent = 'Procent af dit daglige mål';
        section.appendChild(goalTitle);
        
        const goalsContainer = document.createElement('div');
        goalsContainer.className = 'goals-container';
        
        // Get goals data or use defaults
        const formattedGoals = goalsState.getFormattedGoals();
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
    
    function createGoalItem(label, percentage, amount, progress) {
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
    
    function createFoldOutSection() {
        const section = document.createElement('div');
        section.className = 'fold-out-section';
        
        const foldOutBtn = document.createElement('button');
        foldOutBtn.className = 'fold-out-btn';
        foldOutBtn.innerHTML = '▼';
        foldOutBtn.addEventListener('click', () => {
            // TODO: Implement fold out functionality
            console.log('Fold out clicked');
        });
        
        section.appendChild(foldOutBtn);
        
        return section;
    }
    
    function createPairedFoodsSection() {
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
    
    function updateSelectedFood() {
        const foodNameElement = addFoodSection.querySelector('.selected-food-name');
        if (currentFood) {
            const brandText = currentFood.brand ? `${currentFood.brand} - ` : '';
            foodNameElement.textContent = `${currentFood.name} (${brandText}${currentFood.category || 'ukendt'})`;
        } else {
            foodNameElement.textContent = 'Vælg en fødevare';
        }
    }
    
    function updateServingsDisplay() {
        const servingsDisplay = addFoodSection.querySelector('.servings-display');
        if (servingsDisplay) {
            servingsDisplay.textContent = currentServings.toFixed(1);
        }
    }
    
    function updateSummary() {
        if (!currentFood) return;
        
        // Convert currentServings (portions) to grams for calculation
        const portionInGrams = PortionConverter.portionToGrams(currentServings);
        const nutrition = PortionConverter.calculateNutritionForGrams(currentFood, portionInGrams);
        
        const totalCalories = Math.round(nutrition.calories);
        const totalCarbs = nutrition.carbohydrates.toFixed(1);
        const totalFat = nutrition.fat.toFixed(1);
        const totalProtein = nutrition.protein.toFixed(1);
        
        // Update calorie gauge
        const caloriesText = addFoodSection.querySelector('.calories-text');
        if (caloriesText) {
            caloriesText.textContent = totalCalories;
        }
        
        // Update macros
        const macroItems = addFoodSection.querySelectorAll('.macro-item');
        if (macroItems.length >= 3) {
            const totalMacros = totalCarbs + totalFat + totalProtein;
            const carbsPercent = totalMacros > 0 ? Math.round((totalCarbs / totalMacros) * 100) : 0;
            const fatPercent = totalMacros > 0 ? Math.round((totalFat / totalMacros) * 100) : 0;
            const proteinPercent = totalMacros > 0 ? Math.round((totalProtein / totalMacros) * 100) : 0;
            
            // Update carbs
            const carbsItem = macroItems[0];
            carbsItem.querySelector('.macro-percentage').textContent = `${carbsPercent}%`;
            carbsItem.querySelector('.macro-amount').textContent = `${totalCarbs}g`;
            
            // Update protein
            const proteinItem = macroItems[1];
            proteinItem.querySelector('.macro-percentage').textContent = `${proteinPercent}%`;
            proteinItem.querySelector('.macro-amount').textContent = `${totalProtein}g`;
            
            // Update fat
            const fatItem = macroItems[2];
            fatItem.querySelector('.macro-percentage').textContent = `${fatPercent}%`;
            fatItem.querySelector('.macro-amount').textContent = `${totalFat}g`;
        }
    }
    
    function updateDailyGoals() {
        if (!currentFood) return;
        
        // Get goals data
        const formattedGoals = goalsState.getFormattedGoals();
        if (!formattedGoals) return;
        
        // Convert currentServings (portions) to grams for calculation
        const portionInGrams = PortionConverter.portionToGrams(currentServings);
        const nutrition = PortionConverter.calculateNutritionForGrams(currentFood, portionInGrams);
        
        const totalCalories = Math.round(nutrition.calories);
        const totalCarbs = nutrition.carbohydrates.toFixed(1);
        const totalFat = nutrition.fat.toFixed(1);
        const totalProtein = nutrition.protein.toFixed(1);
        
        // Calculate percentages
        const caloriesPercentage = Math.round((totalCalories / formattedGoals.calories.value) * 100);
        const carbsPercentage = Math.round((parseFloat(totalCarbs) / formattedGoals.carbs.value) * 100);
        const fatPercentage = Math.round((parseFloat(totalFat) / formattedGoals.fat.value) * 100);
        const proteinPercentage = Math.round((parseFloat(totalProtein) / formattedGoals.protein.value) * 100);
        
        // Update goal items
        const goalItems = addFoodSection.querySelectorAll('.goal-item');
        if (goalItems.length >= 4) {
            // Update calories
            const caloriesItem = goalItems[0];
            caloriesItem.querySelector('.goal-percentage').textContent = `${caloriesPercentage}%`;
            caloriesItem.querySelector('.goal-amount').textContent = formattedGoals.calories.formatted;
            
            // Update carbs
            const carbsItem = goalItems[1];
            carbsItem.querySelector('.goal-percentage').textContent = `${carbsPercentage}%`;
            carbsItem.querySelector('.goal-amount').textContent = formattedGoals.carbs.formatted;
            
            // Update fat
            const fatItem = goalItems[2];
            fatItem.querySelector('.goal-percentage').textContent = `${fatPercentage}%`;
            fatItem.querySelector('.goal-amount').textContent = formattedGoals.fat.formatted;
            
            // Update protein
            const proteinItem = goalItems[3];
            proteinItem.querySelector('.goal-percentage').textContent = `${proteinPercentage}%`;
            proteinItem.querySelector('.goal-amount').textContent = formattedGoals.protein.formatted;
        }
    }
    
    function loadPairedFoods() {
        if (!currentFood) return;
        
        // TODO: Implement paired foods loading based on current food
        const pairedFoodsList = addFoodSection.querySelector('.paired-foods-list');
        if (pairedFoodsList) {
            pairedFoodsList.innerHTML = '<p>Indlæser parrede fødevarer...</p>';
            
            // Simulate loading paired foods
            setTimeout(() => {
                pairedFoodsList.innerHTML = '<p>Ingen parrede fødevarer fundet</p>';
            }, 1000);
        }
    }
    
    function handleAcceptFood() {
        if (!currentFood) {
            console.log('Ingen fødevare valgt');
            return;
        }
        
        // Convert currentServings (portions) to grams for backend
        const portionInGrams = PortionConverter.portionToGrams(currentServings);
        const nutrition = PortionConverter.calculateNutritionForGrams(currentFood, portionInGrams);
        
        const foodData = {
            food: currentFood,
            servings: currentServings,
            mealType: currentMealType,
            amount_grams: portionInGrams, // Send grams to backend
            calories: Math.round(nutrition.calories),
            carbs: nutrition.carbohydrates,
            fat: nutrition.fat,
            protein: nutrition.protein
        };
        
        console.log('Accepting food:', foodData);
        
        // Dispatch event to add food to diary
        const customEvent = new CustomEvent('onAcceptFood', {
            detail: foodData,
            bubbles: true
        });
        // Dispatch on the app container instead of document
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
        
        // Go back to food view
        const goBackEvent = new CustomEvent('onGoBackToFood', {
            bubbles: true
        });
        // Dispatch on the app container instead of document
        if (appContainer) {
            appContainer.dispatchEvent(goBackEvent);
        } else {
            document.dispatchEvent(goBackEvent);
        }
    }
    
    return addFoodComponent;
}

// Custom scrollbar function
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
}
