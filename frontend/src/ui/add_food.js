// Add Food UI component - Orchestration layer
import { 
    createFoodHeader, 
    createSelectedFoodSection, 
    createMealSection, 
    createPortionSection, 
    createSummarySection, 
    createDailyGoalSection, 
    createFoldOutSection, 
    createPairedFoodsSection 
} from './add_food/add_food_ui.js';
import { PortionManager } from './add_food/add_food_portions.js';
import { NutritionCalculator } from './add_food/add_food_nutrition.js';
import { CustomScrollbar } from './add_food/add_food_scrollbar.js';
import { AddFoodEventHandler } from './add_food/add_food_events.js';

export function AddFood(container) {
    if (!container) {
        throw new Error('AddFood requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create main add food section structure
    const addFoodSection = document.createElement('div');
    addFoodSection.className = 'add-food';
    
    // Initialize managers
    const portionManager = new PortionManager(addFoodSection, {
        onServingsChange: (servings) => eventHandler.handleServingsChange(servings)
    });
    
    const nutritionCalculator = new NutritionCalculator(addFoodSection);
    
    const eventHandler = new AddFoodEventHandler(addFoodSection, portionManager, nutritionCalculator);
    
    // Create UI sections with callbacks
    const foodHeader = createFoodHeader({
        onGoBack: () => eventHandler.handleGoBack(),
        onAccept: () => eventHandler.handleAcceptFood()
    });
    addFoodSection.appendChild(foodHeader);
    
    const selectedFoodSection = createSelectedFoodSection();
    addFoodSection.appendChild(selectedFoodSection);
    
    const mealSection = createMealSection('morgenmad', {
        onMealChange: (mealType) => eventHandler.handleMealChange(mealType)
    });
    addFoodSection.appendChild(mealSection);
    
    const portionSection = createPortionSection(1.0, {
        onDecrease: () => portionManager.decreaseServings(),
        onIncrease: () => portionManager.increaseServings(),
        onServingsBlur: (value) => portionManager.handleServingsBlur(value)
    });
    addFoodSection.appendChild(portionSection);
    
    const summarySection = createSummarySection();
    addFoodSection.appendChild(summarySection);
    
    const dailyGoalSection = createDailyGoalSection();
    addFoodSection.appendChild(dailyGoalSection);
    
    const foldOutSection = createFoldOutSection({
        onFoldOut: () => eventHandler.handleFoldOut()
    });
    addFoodSection.appendChild(foldOutSection);
    
    const pairedFoodsSection = createPairedFoodsSection();
    addFoodSection.appendChild(pairedFoodsSection);
    
    // Setup custom scrollbar
    new CustomScrollbar(addFoodSection);
    
    // Add to container
    container.appendChild(addFoodSection);
    
    // Public methods
    const addFoodComponent = {
        setFood: (food) => eventHandler.setFood(food),
        getFood: () => eventHandler.getFood(),
        getServings: () => eventHandler.getServings(),
        getMealType: () => eventHandler.getMealType(),
        setMealType: (mealType) => eventHandler.setMealType(mealType),
        setEditMode: (entryId, food, mealType, servings) => eventHandler.setEditMode(entryId, food, mealType, servings),
        clearEditMode: () => eventHandler.clearEditMode(),
        isEditMode: () => eventHandler.isInEditMode(),
        getCurrentEntryId: () => eventHandler.getCurrentEntryId()
    };
    
    return addFoodComponent;
}
