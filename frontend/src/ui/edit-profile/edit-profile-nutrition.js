// Edit Profile Nutrition Goals Module
export function createNutritionGoalsSection() {
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
