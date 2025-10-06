// Exercise-related event handlers
// Handles exercise events

export class ExerciseEvents {
    constructor(app) {
        this.app = app;
    }
    
    setupEventListeners() {
        // Exercise events
        this.app.appContainer.addEventListener('onAddExercise', (event) => {
            console.log('Add exercise clicked');
            // TODO: Handle add exercise
        });
        
        this.app.appContainer.addEventListener('onEditExercise', (event) => {
            console.log('Edit exercise:', event.detail);
            // TODO: Handle edit exercise
        });
        
        this.app.appContainer.addEventListener('onDeleteExercise', (event) => {
            console.log('Delete exercise:', event.detail.exerciseId);
            // TODO: Handle delete exercise
        });
    }
}
