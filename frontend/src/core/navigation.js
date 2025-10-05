// Navigation management system
// Handles view switching and navigation history

export class NavigationManager {
    constructor(app) {
        this.app = app;
        this.navigationHistory = [];
    }
    
    showView(viewName, fromView = null) {
        // Add current view to history if we're navigating from somewhere
        if (fromView && this.navigationHistory.length === 0) {
            this.navigationHistory.push(fromView);
        }
        
        // Hide all views
        this.hideAllViews();
        
        // Update navigation
        this.updateNavigationState(viewName);
        
        // Show selected view
        if (viewName === 'dashboard') {
            const dashboardView = this.app.appContainer.querySelector('.main-view');
            dashboardView.classList.add('active');
            const navItem = this.app.appContainer.querySelector('[data-view="dashboard"]');
            navItem.classList.add('active');
            
            // Dispatch dashboard navigation event to refresh data
            const dashboardEvent = new CustomEvent('dashboardNavigation', {
                bubbles: true,
                detail: { view: 'dashboard' }
            });
            this.app.appContainer.dispatchEvent(dashboardEvent);
        } else if (viewName === 'add-menu') {
            const slideUpView = this.app.appContainer.querySelector('.slide-up-view');
            if (slideUpView) {
                slideUpView.classList.add('active');
                const navItem = this.app.appContainer.querySelector(`[data-view="${viewName}"]`);
                if (navItem) navItem.classList.add('active');
            }
        } else if (viewName === 'add-food') {
            const slideView = this.app.appContainer.querySelector('.add-food-view');
            if (slideView) {
                slideView.classList.add('active');
            }
        } else if (viewName === 'edit-profile') {
            const slideView = this.app.appContainer.querySelector('.settings-view');
            if (slideView) {
                slideView.classList.add('active');
            }
        } else if (viewName === 'nutrition-goals') {
            console.log('Showing nutrition-goals view');
            const slideView = this.app.appContainer.querySelector('.nutrition-goals-view');
            console.log('Found nutrition-goals slideView:', slideView);
            if (slideView) {
                slideView.classList.add('active');
                console.log('Added active class to nutrition-goals view');
            } else {
                console.error('nutrition-goals slideView not found');
            }
        } else {
            const slideView = this.app.appContainer.querySelector(`.${viewName}-view`);
            if (slideView) {
                slideView.classList.add('active');
                const navItem = this.app.appContainer.querySelector(`[data-view="${viewName}"]`);
                if (navItem) navItem.classList.add('active');
            }
        }
    }
    
    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousView = this.navigationHistory.pop();
            this.showView(previousView);
        } else {
            // Default fallback to dashboard
            this.showView('dashboard');
        }
    }
    
    updateNavigationState(viewName) {
        const navItems = this.app.appContainer.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    hideAllViews() {
        const allViews = this.app.appContainer.querySelectorAll('.main-view, .slide-view, .slide-up-view');
        allViews.forEach(view => {
            view.classList.remove('active');
        });
    }
}
