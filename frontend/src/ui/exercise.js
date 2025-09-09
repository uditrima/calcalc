// Exercise UI component
import { AppState } from '../state/app_state.js';

export function Exercise(container) {
    if (!container) {
        throw new Error('Exercise requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create exercise structure
    const exercise = document.createElement('div');
    exercise.className = 'exercise';
    
    // Header
    const header = document.createElement('div');
    header.className = 'exercise-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Dagens Øvelser';
    header.appendChild(title);
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Exercise';
    addButton.className = 'btn-add-exercise';
    addButton.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddExercise', {
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    header.appendChild(addButton);
    
    exercise.appendChild(header);
    
    // Exercises container
    const exercisesContainer = document.createElement('div');
    exercisesContainer.className = 'exercise-entries';
    exercise.appendChild(exercisesContainer);
    
    // Summary section
    const summary = document.createElement('div');
    summary.className = 'exercise-summary';
    exercise.appendChild(summary);
    
    // Add to container
    container.appendChild(exercise);
    
    // Subscribe to state changes
    AppState.subscribe('exercises', updateExercises);
    
    // Initial update
    updateExercises();
    
    function updateExercises() {
        const state = AppState.getState();
        const exercises = state.exercises || [];
        
        // Clear existing exercises
        exercisesContainer.innerHTML = '';
        
        if (exercises.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<p>Ingen øvelser registreret i dag. Klik "Add Exercise" for at tilføje øvelser.</p>';
            exercisesContainer.appendChild(emptyMessage);
        } else {
            // Render each exercise
            exercises.forEach(exerciseItem => {
                const exerciseElement = createExerciseElement(exerciseItem);
                exercisesContainer.appendChild(exerciseElement);
            });
        }
        
        // Update summary
        updateSummary(exercises);
    }
    
    function createExerciseElement(exerciseItem) {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-entry';
        exerciseDiv.setAttribute('data-exercise-id', exerciseItem.id);
        
        // Exercise content
        const content = document.createElement('div');
        content.className = 'exercise-content';
        
        const name = document.createElement('div');
        name.className = 'exercise-name';
        name.textContent = exerciseItem.name;
        content.appendChild(name);
        
        const duration = document.createElement('div');
        duration.className = 'exercise-duration';
        duration.textContent = `${exerciseItem.duration_minutes} min`;
        content.appendChild(duration);
        
        const calories = document.createElement('div');
        calories.className = 'exercise-calories';
        calories.textContent = `${Math.round(exerciseItem.calories_burned)} kcal`;
        content.appendChild(calories);
        
        exerciseDiv.appendChild(content);
        
        // Exercise actions
        const actions = document.createElement('div');
        actions.className = 'exercise-actions';
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn-edit';
        editButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onEditExercise', {
                detail: { exercise: exerciseItem },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(editButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn-delete';
        deleteButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onDeleteExercise', {
                detail: { exerciseId: exerciseItem.id },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(deleteButton);
        
        exerciseDiv.appendChild(actions);
        
        return exerciseDiv;
    }
    
    function updateSummary(exercises) {
        // Calculate totals
        const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration_minutes || 0), 0);
        const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        
        // Update summary display
        summary.innerHTML = `
            <div class="summary-title">
                <h3>Dagens Total</h3>
            </div>
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-label">Antal øvelser:</span>
                    <span class="stat-value">${exercises.length}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Total varighed:</span>
                    <span class="stat-value">${Math.round(totalDuration)} min</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Kalorier forbrændt:</span>
                    <span class="stat-value">${Math.round(totalCalories)}</span>
                </div>
            </div>
        `;
    }
}
