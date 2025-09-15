// Edit Settings UI component
export function EditSettings(container) {
    if (!container) {
        throw new Error('EditSettings requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create edit settings structure
    const editSettings = document.createElement('div');
    editSettings.className = 'edit-settings';
    
    // 1. Header
    const header = createSettingsHeader();
    editSettings.appendChild(header);
    
    // 2. Personal Metrics Section
    const personalMetricsSection = createPersonalMetricsSection();
    editSettings.appendChild(personalMetricsSection);
    
    // 3. Nutrition Goals Section
    const nutritionGoalsSection = createNutritionGoalsSection();
    editSettings.appendChild(nutritionGoalsSection);
    
    // 4. Fitness Goals Section
    const fitnessGoalsSection = createFitnessGoalsSection();
    editSettings.appendChild(fitnessGoalsSection);
    
    // Add to container
    container.appendChild(editSettings);
    
    // Create custom scrollbar
    createCustomScrollbar(editSettings);
    
    return editSettings;
}

function createSettingsHeader() {
    const header = document.createElement('div');
    header.className = 'settings-header';
    
    // Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.className = 'go-back-btn';
    goBackBtn.innerHTML = '←';
    goBackBtn.addEventListener('click', () => {
        const customEvent = new CustomEvent('onGoBack', {
            bubbles: true
        });
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
    });
    header.appendChild(goBackBtn);
    
    // Title
    const title = document.createElement('h1');
    title.textContent = 'Rediger Profil';
    header.appendChild(title);
    
    return header;
}

function createPersonalMetricsSection() {
    const section = document.createElement('div');
    section.className = 'personal-metrics-section';
    
    const heightItem = createMetricItem('Højde', '179 cm');
    section.appendChild(heightItem);
    
    const startingWeightItem = createMetricItem('Startvægt', '97 kg den 7. jun 2021');
    section.appendChild(startingWeightItem);
    
    const currentWeightItem = createMetricItem('Nuværende vægt', '101.5 kg');
    section.appendChild(currentWeightItem);
    
    const goalWeightItem = createMetricItem('Målvægt', '85 kg');
    section.appendChild(goalWeightItem);
    
    const weeklyGoalItem = createMetricItem('Ugentligt mål', 'Tab 0.5 kg per uge');
    section.appendChild(weeklyGoalItem);
    
    return section;
}

function createNutritionGoalsSection() {
    const section = document.createElement('div');
    section.className = 'goals-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Kostmålsætning';
    section.appendChild(title);
    
    const calorieGoalsItem = createGoalItem(
        'Kalorie, kulhydrat, protein og fedt mål',
        'Tilpas dine standard- eller daglige mål.'
    );
    section.appendChild(calorieGoalsItem);
    
    const mealGoalsItem = createGoalItem(
        'Kaloriemål pr. måltid',
        'Hold dig på rette vej med et kaloriemål for hvert måltid.'
    );
    section.appendChild(mealGoalsItem);
    
    const showNutrientsItem = createGoalItem(
        'Vis kulhydrater, protein og fedt pr. måltid',
        'Se kulhydrater, protein og fedt i gram eller procent.'
    );
    section.appendChild(showNutrientsItem);
    
    const additionalNutrientsItem = createGoalItem(
        'Yderligere næringsstoffer mål',
        ''
    );
    section.appendChild(additionalNutrientsItem);
    
    return section;
}

function createFitnessGoalsSection() {
    const section = document.createElement('div');
    section.className = 'goals-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Fitness mål';
    section.appendChild(title);
    
    const workoutsItem = createFitnessItem('Træninger / uge', '0');
    section.appendChild(workoutsItem);
    
    const minutesItem = createFitnessItem('Minutter / træning', '0');
    section.appendChild(minutesItem);
    
    const exerciseCaloriesItem = createGoalItem(
        'Trænings kalorier',
        'Beslut om du vil justere daglige mål når du træner'
    );
    section.appendChild(exerciseCaloriesItem);
    
    return section;
}

function createMetricItem(label, value) {
    const item = document.createElement('div');
    item.className = 'metric-item';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'metric-label';
    labelEl.textContent = label;
    item.appendChild(labelEl);
    
    const valueEl = document.createElement('div');
    valueEl.className = 'metric-value';
    valueEl.textContent = value;
    item.appendChild(valueEl);
    
    return item;
}

function createGoalItem(title, description) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'goal-title';
    titleEl.textContent = title;
    item.appendChild(titleEl);
    
    if (description) {
        const descEl = document.createElement('div');
        descEl.className = 'goal-description';
        descEl.textContent = description;
        item.appendChild(descEl);
    }
    
    // Make specific goal items clickable
    if (title === 'Kalorie, kulhydrat, protein og fedt mål') {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            console.log('Calorie, carbs, protein and fat goals clicked');
            console.log('window.calorieTrackerApp:', window.calorieTrackerApp);
            // Navigate to nutrition goals section
            if (window.calorieTrackerApp) {
                console.log('Navigating to nutrition-goals view');
                window.calorieTrackerApp.showView('nutrition-goals');
            } else {
                console.error('calorieTrackerApp not found on window object');
            }
        });
    }
    
    return item;
}

function createFitnessItem(label, value) {
    const item = document.createElement('div');
    item.className = 'fitness-item';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'fitness-label';
    labelEl.textContent = label;
    item.appendChild(labelEl);
    
    const valueEl = document.createElement('div');
    valueEl.className = 'fitness-value';
    valueEl.textContent = value;
    item.appendChild(valueEl);
    
    return item;
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
        isDragging = true;
        startY = e.clientY;
        startScrollTop = container.scrollTop;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        const scrollbarHeight = scrollbar.getBoundingClientRect().height;
        const scrollRatio = deltaY / scrollbarHeight;
        const scrollDelta = scrollRatio * (container.scrollHeight - container.clientHeight);
        
        container.scrollTop = startScrollTop + scrollDelta;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Initial update
    updateScrollbar();
}
