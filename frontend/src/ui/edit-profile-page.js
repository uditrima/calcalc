// Edit Settings UI component
import { createSettingsHeader } from './edit-profile/edit-profile-header.js';
import { createPersonalMetricsSection } from './edit-profile/edit-profile-metrics.js';
import { createNutritionGoalsSection } from './edit-profile/edit-profile-nutrition.js';
import { createFitnessGoalsSection } from './edit-profile/edit-profile-fitness.js';
import { createCustomScrollbar } from './edit-profile/edit-profile-scrollbar.js';

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
