// Global error handling system
// Manages unhandled errors and promise rejections

export class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handlePromiseRejection(event.reason);
            // Prevent the default behavior (which would log to console)
            event.preventDefault();
        });
        
        // Handle general errors
        window.addEventListener('error', (event) => {
            // Only log errors that are not related to browser extensions
            if (!event.message.includes('message channel closed') && 
                !event.message.includes('listener indicated an asynchronous response')) {
                this.handleError(event.error, 'Global error');
            }
        });
    }
    
    handleError(error, context = '') {
        console.error(`[ErrorHandler] ${context}:`, error);
    }
    
    handlePromiseRejection(reason) {
        console.warn('Unhandled promise rejection:', reason);
    }
}
