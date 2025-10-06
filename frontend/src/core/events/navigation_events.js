// Navigation event handlers
// Handles navigation-related events

export class NavigationEvents {
    constructor(app) {
        this.app = app;
    }
    
    setupEventListeners() {
        // Navigation events
        this.app.appContainer.addEventListener('click', (event) => {
            const navItem = event.target.closest('.nav-item');
            if (navItem) {
                const view = navItem.dataset.view;
                this.app.showView(view);
            }
        });
        
        // Food section events
        this.app.appContainer.addEventListener('onGoBack', (event) => {
            console.log('Go back clicked');
            this.app.goBack();
        });
        
        this.app.appContainer.addEventListener('onGoBackToFood', (event) => {
            console.log('Go back to food clicked');
            console.log('Current state before going back to food:', this.app.state?.getState());
            this.app.showView('food');
        });
        
        this.app.appContainer.addEventListener('onGoBackToDiary', (event) => {
            console.log('Go back to diary clicked');
            this.app.showView('diary');
        });
    }
}
