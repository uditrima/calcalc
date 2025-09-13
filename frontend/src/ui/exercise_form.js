// Exercise Form UI component
import { AppState } from '../state/app_state.js';
import { ApiClient } from '../data/api.js';

export function ExerciseForm(container) {
    if (!container) {
        throw new Error('ExerciseForm requires a container element');
    }
    
    // Initialize API client
    const api = new ApiClient('http://localhost:5000/api');
    
    // Clear container
    container.innerHTML = '';
    
    // Create exercise form structure
    const exerciseForm = document.createElement('div');
    exerciseForm.className = 'exercise-form';
    
    // Header
    const header = document.createElement('div');
    header.className = 'form-header';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '←';
    backBtn.addEventListener('click', () => {
        const customEvent = new CustomEvent('onGoBack', {
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    header.appendChild(backBtn);
    
    const title = document.createElement('h2');
    title.textContent = 'Tilføj Øvelse';
    header.appendChild(title);
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Gem';
    saveBtn.addEventListener('click', saveExercise);
    header.appendChild(saveBtn);
    
    exerciseForm.appendChild(header);
    
    // Form content
    const formContent = document.createElement('div');
    formContent.className = 'form-content';
    
    // Exercise name input
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Øvelse navn';
    nameLabel.className = 'form-label';
    nameGroup.appendChild(nameLabel);
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-input';
    nameInput.placeholder = 'F.eks. Løb, Vægtløftning, Cykling...';
    nameInput.required = true;
    nameGroup.appendChild(nameInput);
    
    formContent.appendChild(nameGroup);
    
    // Duration input
    const durationGroup = document.createElement('div');
    durationGroup.className = 'form-group';
    
    const durationLabel = document.createElement('label');
    durationLabel.textContent = 'Varighed (minutter)';
    durationLabel.className = 'form-label';
    durationGroup.appendChild(durationLabel);
    
    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.className = 'form-input';
    durationInput.placeholder = '30';
    durationInput.min = '1';
    durationInput.required = true;
    durationGroup.appendChild(durationInput);
    
    formContent.appendChild(durationGroup);
    
    // Calories input
    const caloriesGroup = document.createElement('div');
    caloriesGroup.className = 'form-group';
    
    const caloriesLabel = document.createElement('label');
    caloriesLabel.textContent = 'Kalorier forbrændt';
    caloriesLabel.className = 'form-label';
    caloriesGroup.appendChild(caloriesLabel);
    
    const caloriesInput = document.createElement('input');
    caloriesInput.type = 'number';
    caloriesInput.className = 'form-input';
    caloriesInput.placeholder = '300';
    caloriesInput.min = '1';
    caloriesInput.required = true;
    caloriesGroup.appendChild(caloriesInput);
    
    formContent.appendChild(caloriesGroup);
    
    // Quick exercise buttons
    const quickExercises = document.createElement('div');
    quickExercises.className = 'quick-exercises';
    
    const quickTitle = document.createElement('h3');
    quickTitle.textContent = 'Hurtige valg';
    quickExercises.appendChild(quickTitle);
    
    const quickButtons = document.createElement('div');
    quickButtons.className = 'quick-buttons';
    
    const commonExercises = [
        { name: 'Løb', duration: 30, calories: 300 },
        { name: 'Cykling', duration: 45, calories: 400 },
        { name: 'Vægtløftning', duration: 60, calories: 200 },
        { name: 'Yoga', duration: 30, calories: 150 },
        { name: 'Svømning', duration: 45, calories: 500 },
        { name: 'Gang', duration: 30, calories: 150 }
    ];
    
    commonExercises.forEach(exercise => {
        const btn = document.createElement('button');
        btn.className = 'quick-btn';
        btn.textContent = exercise.name;
        btn.addEventListener('click', () => {
            nameInput.value = exercise.name;
            durationInput.value = exercise.duration;
            caloriesInput.value = exercise.calories;
        });
        quickButtons.appendChild(btn);
    });
    
    quickExercises.appendChild(quickButtons);
    formContent.appendChild(quickExercises);
    
    exerciseForm.appendChild(formContent);
    
    // Add to container
    container.appendChild(exerciseForm);
    
    async function saveExercise() {
        const name = nameInput.value.trim();
        const duration = parseInt(durationInput.value);
        const calories = parseInt(caloriesInput.value);
        
        if (!name || !duration || !calories) {
            alert('Udfyld alle felter');
            return;
        }
        
        try {
            const exerciseData = {
                name: name,
                duration_minutes: duration,
                calories_burned: calories,
                date: new Date().toISOString().split('T')[0]
            };
            
            await api.addExercise(exerciseData);
            await AppState.loadExercises(new Date().toISOString().split('T')[0]);
            
            // Go back to dashboard
            const customEvent = new CustomEvent('onGoBack', {
                bubbles: true
            });
            container.dispatchEvent(customEvent);
            
        } catch (error) {
            console.error('Failed to save exercise:', error);
            alert('Kunne ikke gemme øvelse. Prøv igen.');
        }
    }
    
    // Return the exercise form element for external access
    return exerciseForm;
}
