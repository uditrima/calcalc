// Application structure creation
// Handles DOM structure and layout creation

import { getCurrentDateInDanish } from '../utils/date_utils.js';

export class AppStructureManager {
    constructor(app) {
        this.app = app;
    }
    
    createAppStructure() {
        this.app.appContainer.innerHTML = '';
        
        // Create main layout
        const layout = document.createElement('div');
        layout.className = 'app-layout';
        
        // Main content area
        const main = document.createElement('main');
        main.className = 'app-main';
        
        // Dashboard section (main view)
        const dashboardSection = document.createElement('section');
        dashboardSection.id = 'dashboard-section';
        dashboardSection.className = 'main-view';
        
        // Dashboard header (inside dashboard-section at the top)
        const header = document.createElement('header');
        header.className = 'dashboard-header';
        
        // Create h1 with current date
        const h1 = document.createElement('h1');
        h1.textContent = getCurrentDateInDanish();
        header.appendChild(h1);
        
        // Settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Indstillinger';
        settingsBtn.addEventListener('click', () => {
            this.app.showView('edit-profile');
        });
        header.appendChild(settingsBtn);
        
        // Add header to dashboard-section first (at the top)
        dashboardSection.appendChild(header);
        
        // Add dashboard-section to main
        main.appendChild(dashboardSection);
        
        // Food form section (slide-in)
        const foodSection = document.createElement('section');
        foodSection.id = 'food-section';
        foodSection.className = 'slide-view food-view';
        main.appendChild(foodSection);
        
        // Add food section (slide-in)
        const addFoodSection = document.createElement('section');
        addFoodSection.id = 'add-food-section';
        addFoodSection.className = 'slide-view add-food-view';
        main.appendChild(addFoodSection);
        
        // Diary section (slide-in)
        const diarySection = document.createElement('section');
        diarySection.id = 'diary-section';
        diarySection.className = 'slide-view diary-view';
        main.appendChild(diarySection);
        
        // Exercise section (slide-in)
        const exerciseSection = document.createElement('section');
        exerciseSection.id = 'exercise-section';
        exerciseSection.className = 'slide-view exercise-view';
        main.appendChild(exerciseSection);
        
        // Weight section (slide-in)
        const weightSection = document.createElement('section');
        weightSection.id = 'weight-section';
        weightSection.className = 'slide-view weight-view';
        main.appendChild(weightSection);
        
        // Settings section (slide-in)
        const settingsSection = document.createElement('section');
        settingsSection.id = 'settings-section';
        settingsSection.className = 'slide-view settings-view';
        main.appendChild(settingsSection);
        
        // Nutrition goals section (slide-in)
        const nutritionGoalsSection = document.createElement('section');
        nutritionGoalsSection.id = 'nutrition-goals-section';
        nutritionGoalsSection.className = 'slide-view nutrition-goals-view';
        main.appendChild(nutritionGoalsSection);
        
        // Add menu section (slide-up from bottom)
        const addMenuSection = document.createElement('section');
        addMenuSection.id = 'add-menu-section';
        addMenuSection.className = 'slide-up-view add-menu-view';
        main.appendChild(addMenuSection);
        
        layout.appendChild(main);
        
        // Bottom navigation
        const nav = this.createBottomNavigation();
        layout.appendChild(nav);
        
        this.app.appContainer.appendChild(layout);
    }
    
    createBottomNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'bottom-nav';
        
        nav.innerHTML = `
            <div class="nav-item active" data-view="dashboard">
                <div class="nav-icon">⊞</div>
                <div class="nav-label">Dashboard</div>
            </div>
            <div class="nav-item" data-view="diary">
                <div class="nav-icon">📖</div>
                <div class="nav-label">Dagbog</div>
            </div>
            <div class="nav-item add-btn" data-view="add-menu">
                <div class="nav-icon">+</div>
            </div>
            <div class="nav-item" data-view="progress">
                <div class="nav-icon">📊</div>
                <div class="nav-label">Fremgang</div>
            </div>
            <div class="nav-item" data-view="more">
                <div class="nav-icon">⋯</div>
                <div class="nav-label">Mere</div>
            </div>
        `;
        
        return nav;
    }
}
