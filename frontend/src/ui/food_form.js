// Food form UI component
import { AppState } from '../state/app_state.js';
import { getMealOptions } from '../data/meal_types.js';
import { PortionConverter } from '../utils/portion_converter.js';

export function FoodForm(container) {
    if (!container) {
        throw new Error('FoodForm requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create main food section structure
    const foodSection = document.createElement('div');
    foodSection.className = 'food-section';
    
    // 1. Food Header
    const foodHeader = createFoodHeader();
    foodSection.appendChild(foodHeader);
    
    // 2. Menu Section
    const menuSection = createMenuSection();
    foodSection.appendChild(menuSection);
    
    // 3. Search Section
    const searchSection = createSearchSection();
    foodSection.appendChild(searchSection);
    
    // 4. Sort By Section
    const sortBySection = createSortBySection();
    foodSection.appendChild(sortBySection);
    
    // 5. Food Items Section
    const foodItemsSection = createFoodItemsSection();
    foodSection.appendChild(foodItemsSection);
    
    // Load foods from database
    loadFoodsFromDatabase();
    
    // Subscribe to foods state changes
    AppState.subscribe('foods', (state) => {
        renderFoodItems(state.foods, 'frequent');
    });
    
    // Add to container
    container.appendChild(foodSection);
    
    // Public methods
    const foodFormComponent = {
        setMealType: (mealType) => {
            const mealOptions = getMealOptions(false);
            const selectedMeal = mealOptions.find(meal => meal.value === mealType);
            if (selectedMeal) {
                const title = foodSection.querySelector('.meal-title');
                if (title) {
                    title.textContent = selectedMeal.label;
                }
                // Set data attribute for CSS styling
                foodSection.setAttribute('data-current-meal', mealType);
                // Store current meal type
                window.currentMealType = mealType;
            }
        }
    };
    
    // Return the food form component for external access
    return foodFormComponent;
}

function createFoodHeader() {
    const header = document.createElement('div');
    header.className = 'food-header';
    
    // Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.className = 'go-back-btn';
    goBackBtn.innerHTML = '←';
    goBackBtn.addEventListener('click', () => {
        const customEvent = new CustomEvent('onGoBack', {
            bubbles: true
        });
        // Dispatch on the app container instead of document
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
    });
    header.appendChild(goBackBtn);
    
    // Title with dropdown
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Morgenmad';
    title.className = 'meal-title-addFood';
    title.dataset.mealtype = 'morgenmad';
    titleContainer.appendChild(title);
    
    const dropdownArrow = document.createElement('span');
    dropdownArrow.className = 'dropdown-arrow';
    dropdownArrow.innerHTML = '▼';
    dropdownArrow.addEventListener('click', toggleMealDropdown);
    titleContainer.appendChild(dropdownArrow);
    
    header.appendChild(titleContainer);
    
    // Meal dropdown menu
    const mealDropdown = document.createElement('div');
    mealDropdown.className = 'meal-dropdown-menu';
    mealDropdown.style.display = 'none';
    
    const mealOptions = getMealOptions(false); // false = extended (5 meals)
    
    mealOptions.forEach(meal => {
        const option = document.createElement('div');
        option.className = 'meal-option';
        option.textContent = meal.label;
        option.dataset.value = meal.value;
        option.dataset.mealtype = meal.value;
        option.addEventListener('click', () => selectMeal(meal.value, meal.label));
        mealDropdown.appendChild(option);
    });
    
    header.appendChild(mealDropdown);
    
    // Dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    
    const dropdownBtn = document.createElement('button');
    dropdownBtn.className = 'dropdown-btn';
    dropdownBtn.innerHTML = '⋮';
    dropdownBtn.addEventListener('click', toggleDropdown);
    dropdown.appendChild(dropdownBtn);
    
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    dropdownContent.innerHTML = `
        <a href="#" class="dropdown-item">Indstillinger</a>
        <a href="#" class="dropdown-item">Eksporter</a>
        <a href="#" class="dropdown-item">Hjælp</a>
    `;
    dropdown.appendChild(dropdownContent);
    
    header.appendChild(dropdown);
    
    function toggleDropdown() {
        dropdownContent.classList.toggle('show');
    }
    
    function toggleMealDropdown() {
        const isVisible = mealDropdown.style.display !== 'none';
        mealDropdown.style.display = isVisible ? 'none' : 'block';
        
        // Rotate arrow
        dropdownArrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        
        // Add/remove dropdown-open class to food-section for fade effect
        const foodSection = document.querySelector('.food-section');
        if (foodSection) {
            if (isVisible) {
                foodSection.classList.remove('dropdown-open');
            } else {
                foodSection.classList.add('dropdown-open');
            }
        }
    }
    
    function selectMeal(mealValue, mealLabel) {
        // Update title
        title.textContent = mealLabel;
        
        // Hide dropdown
        mealDropdown.style.display = 'none';
        dropdownArrow.style.transform = 'rotate(0deg)';
        
        // Remove dropdown-open class to restore normal opacity
        const mealTitleAddFood = document.querySelector('.meal-title-addFood');
        const foodSection = document.querySelector('.food-section');
        if (mealTitleAddFood) {
            foodSection.classList.remove('dropdown-open');
            // Set data attribute for CSS styling
            mealTitleAddFood.setAttribute('data-mealtype', mealValue);
        }
        
        // Store current meal type for later use
        window.currentMealType = mealValue;
        
        // Dispatch event for other components to listen to
        const mealChangeEvent = new CustomEvent('mealTypeChanged', {
            detail: { mealType: mealValue, mealLabel: mealLabel }
        });
        document.dispatchEvent(mealChangeEvent);
        
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
        if (!mealDropdown.contains(e.target) && !titleContainer.contains(e.target)) {
            mealDropdown.style.display = 'none';
            dropdownArrow.style.transform = 'rotate(0deg)';
            
            // Remove dropdown-open class to restore normal opacity
            const foodSection = document.querySelector('.food-section');
            if (foodSection) {
                foodSection.classList.remove('dropdown-open');
            }
        }
    });
    
    return header;
}

function createSearchSection() {
    const section = document.createElement('div');
    section.className = 'search-section';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchIcon = document.createElement('div');
    searchIcon.className = 'search-icon';
    searchIcon.innerHTML = '🔍';
    searchContainer.appendChild(searchIcon);
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Search for a food';
    
    // Add debounced search to improve performance
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e), 300);
    });
    
    searchContainer.appendChild(searchInput);
    
    section.appendChild(searchContainer);
    
    // Add category filters
    const categoryFilters = createCategoryFilters();
    section.appendChild(categoryFilters);
    
    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        // Get selected categories
        const selectedCategories = Array.from(
            document.querySelectorAll('.category-checkbox:checked')
        ).map(checkbox => checkbox.value);
        
        // Apply both search and category filters
        applyFilters(query, selectedCategories);
    }
    
    return section;
}

function createCategoryFilters() {
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'category-filters';
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'category-toggle-btn';
    toggleButton.innerHTML = `
        <span class="toggle-icon">▼</span>
        <span class="toggle-text">Kategorier</span>
    `;
    
    // Create collapsible content
    const collapsibleContent = document.createElement('div');
    collapsibleContent.className = 'category-content';
    collapsibleContent.style.display = 'none'; // Initially hidden
    
    // Define categories based on database
    const categories = [
        'bagværk', 'brød', 'condiments', 'frost', 'frugt', 'grønt', 
        'konserves', 'korn og gryn', 'krydderier', 'kød', 'fisk', 
        'mejeri', 'pålæg', 'ris og pasta', 'slik og kager', 'snacks', 
        'take away', 'vin og øl'
    ];
    
    // Create filter row
    const filterRow = document.createElement('div');
    filterRow.className = 'filter-row';
    
    categories.forEach(category => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-${category.replace(/\s+/g, '-')}`;
        checkbox.value = category;
        checkbox.className = 'category-checkbox';
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = category;
        const categoryClass = category.replace(/\s+/g, '-').replace(/ø/g, 'o').replace(/æ/g, 'ae').replace(/å/g, 'aa');
        label.className = `category-label category-${categoryClass}`;
        
        // Add change event listener
        checkbox.addEventListener('change', handleCategoryFilter);
        
        filterItem.appendChild(checkbox);
        filterItem.appendChild(label);
        filterRow.appendChild(filterItem);
    });
    
    collapsibleContent.appendChild(filterRow);
    
    // Add toggle functionality
    toggleButton.addEventListener('click', () => {
        const isVisible = collapsibleContent.style.display !== 'none';
        collapsibleContent.style.display = isVisible ? 'none' : 'block';
        
        const toggleIcon = toggleButton.querySelector('.toggle-icon');
        toggleIcon.textContent = isVisible ? '▼' : '▲';
        
        // Add/remove expanded class for styling
        filtersContainer.classList.toggle('expanded', !isVisible);
    });
    
    // Assemble the container
    filtersContainer.appendChild(toggleButton);
    filtersContainer.appendChild(collapsibleContent);
    
    function handleCategoryFilter() {
        const selectedCategories = Array.from(
            filtersContainer.querySelectorAll('.category-checkbox:checked')
        ).map(checkbox => checkbox.value);
        
        
        // Get current search query
        const searchInput = document.querySelector('.search-input');
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        // Apply both search and category filters
        applyFilters(searchQuery, selectedCategories);
    }
    
    return filtersContainer;
}

// Function to apply both search and category filters
function applyFilters(searchQuery, selectedCategories) {
    // Get all foods from state
    const allFoods = AppState.getFoods();
    
    let filteredFoods = allFoods;
    
    // Apply search filter if query exists
    if (searchQuery) {
        const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
        filteredFoods = filteredFoods.filter(food => {
            const foodName = (food.name || '').toLowerCase();
            // At least one search word must be found in the food name
            return searchWords.some(word => foodName.includes(word));
        });
    }
    
    // Apply category filter if categories are selected
    if (selectedCategories.length > 0) {
        filteredFoods = filteredFoods.filter(food => {
            const foodCategory = (food.category || '').toLowerCase();
            // Food must be in one of the selected categories
            return selectedCategories.some(category => 
                foodCategory === category.toLowerCase()
            );
        });
    }
    
    
    // Render filtered foods
    if (filteredFoods.length === 0) {
        renderNoResults(searchQuery || 'selected categories');
    } else {
        renderFoodItems(filteredFoods, 'frequent');
    }
}

// Function to render no results message
function renderNoResults(query) {
    if (!window.foodItemsSection) {
        return;
    }
    
    // Find and preserve custom scrollbar
    const existingScrollbar = window.foodItemsSection.querySelector('.custom-scrollbar');
    
    // Clear existing items but preserve scrollbar
    const foodItems = window.foodItemsSection.querySelectorAll('.food-item');
    foodItems.forEach(item => item.remove());
    
    // Also clear any existing no-results message
    const existingNoResults = window.foodItemsSection.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    // Create no results message
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results';
    noResultsDiv.innerHTML = `
        <div class="no-results-icon">🔍</div>
        <div class="no-results-title">Ingen resultater fundet</div>
        <div class="no-results-message">Ingen fødevare matcher "${query}"</div>
    `;
    
    window.foodItemsSection.appendChild(noResultsDiv);
    
    // Re-add scrollbar if it was removed
    if (!existingScrollbar) {
        createCustomScrollbar(window.foodItemsSection);
    } else {
        // Trigger scrollbar update for existing scrollbar
        const scrollEvent = new Event('scroll');
        window.foodItemsSection.dispatchEvent(scrollEvent);
    }
}

function createMenuSection() {
    const section = document.createElement('div');
    section.className = 'menu-section';
    
    const menuItems = [
        { label: 'All', active: true },
        { label: 'My Meals' },
        { label: 'My Recipes' },
        { label: 'My Foods' }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('button');
        menuItem.className = `menu-item ${item.active ? 'active' : ''}`;
        menuItem.textContent = item.label;
        menuItem.addEventListener('click', () => selectMenu(item.label));
        section.appendChild(menuItem);
    });
    
    function selectMenu(label) {
        // Remove active class from all items
        section.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        // Add active class to clicked item
        event.target.classList.add('active');
    }
    
    return section;
}


function createSortBySection() {
    const section = document.createElement('div');
    section.className = 'sort-by-section';
    
    const title = document.createElement('h3');
    title.textContent = 'History';
    section.appendChild(title);
    
    const dropdown = document.createElement('div');
    dropdown.className = 'sort-dropdown';
    
    const dropdownBtn = document.createElement('button');
    dropdownBtn.className = 'sort-dropdown-btn';
    dropdownBtn.innerHTML = 'Most Used <span class="dropdown-arrow">⋮</span>';
    dropdownBtn.addEventListener('click', toggleSortDropdown);
    dropdown.appendChild(dropdownBtn);
    
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'sort-dropdown-content';
    dropdownContent.innerHTML = `
        <a href="#" class="sort-option" data-sort="recent">Most Recent</a>
        <a href="#" class="sort-option" data-sort="name">Name A-Z</a>
        <a href="#" class="sort-option" data-sort="calories">Calories</a>
        <a href="#" class="sort-option" data-sort="frequent">Most Used</a>
    `;
    dropdown.appendChild(dropdownContent);
    
    section.appendChild(dropdown);
    
    function toggleSortDropdown() {
        dropdownContent.classList.toggle('show');
    }
    
    // Handle sort option selection
    dropdownContent.addEventListener('click', (e) => {
        e.preventDefault();
        const sortOption = e.target.closest('.sort-option');
        if (sortOption) {
            const sortBy = sortOption.dataset.sort;
            dropdownBtn.innerHTML = `${sortOption.textContent} <span class="dropdown-arrow">⋮</span>`;
            dropdownContent.classList.remove('show');
            
            // Re-render food items with new sort order
            const foods = AppState.getFoods();
            renderFoodItems(foods, sortBy);
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });
    
    return section;
}

function createFoodItemsSection() {
    const section = document.createElement('div');
    section.className = 'food-items-section';
    
    // Store reference to section for updates
    window.foodItemsSection = section;
    
    // Setup custom scrollbar
    createCustomScrollbar(section);
    
    return section;
}

// Function to load foods from database
async function loadFoodsFromDatabase() {
    try {
        await AppState.loadFoods();
        const foods = AppState.getFoods();
        renderFoodItems(foods, 'frequent');
    } catch (error) {
        console.error('Failed to load foods:', error);
        // Show error message or fallback
        if (window.foodItemsSection) {
            window.foodItemsSection.innerHTML = '<div class="error-message">Kunne ikke indlæse fødevare</div>';
        }
    }
}

// Function to render food items
function renderFoodItems(foods, sortBy = 'frequent') {
    if (!window.foodItemsSection) {
        return;
    }
    
    // Find and preserve custom scrollbar
    const existingScrollbar = window.foodItemsSection.querySelector('.custom-scrollbar');
    
    // Clear existing items but preserve scrollbar
    const foodItems = window.foodItemsSection.querySelectorAll('.food-item');
    foodItems.forEach(item => item.remove());
    
    // Also clear any no-results message
    const noResults = window.foodItemsSection.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
    
    // Sort foods based on sortBy parameter
    const sortedFoods = sortFoods(foods, sortBy);
    
    // Render each food item
    sortedFoods.forEach(food => {
        const foodItem = createFoodItem(food);
        window.foodItemsSection.appendChild(foodItem);
    });
    
    // Re-add scrollbar if it was removed
    if (!existingScrollbar) {
        createCustomScrollbar(window.foodItemsSection);
    } else {
        // Trigger scrollbar update for existing scrollbar
        const scrollEvent = new Event('scroll');
        window.foodItemsSection.dispatchEvent(scrollEvent);
    }
}

// Function to sort foods
function sortFoods(foods, sortBy) {
    const sorted = [...foods];
    
    switch (sortBy) {
        case 'recent':
            // Sort by last_used (most recent first), then by name
            return sorted.sort((a, b) => {
                if (a.last_used && b.last_used) {
                    return b.last_used - a.last_used; // Descending order
                }
                if (a.last_used && !b.last_used) return -1;
                if (!a.last_used && b.last_used) return 1;
                // If both have no last_used, sort alphabetically
                return a.name.localeCompare(b.name, 'da-DK');
            });
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name, 'da-DK'));
        case 'calories':
            return sorted.sort((a, b) => b.calories - a.calories);
        case 'frequent':
            return sorted.sort((a, b) => (b.used || 0) - (a.used || 0));
        default:
            return sorted;
    }
}

function createFoodItem(food) {
    const foodItem = document.createElement('div');
    foodItem.className = 'food-item';
    
    // Add food ID as data attribute
    if (food.id) {
        foodItem.setAttribute('data-food-id', food.id);
    }
    
    // Format food details for display
    const brandText = food.brand ? `${food.brand} - ` : '';
    // Calculate calories for the actual portion size instead of 100g
    const portionNutrition = PortionConverter.calculateNutritionForPortion(food, food.last_portion || 1.0);
    const calories = Math.round(portionNutrition.calories);
    const lastPortionGrams = PortionConverter.formatPortion(food.last_portion || 1.0, true);
    const category = food.category || 'ukendt';
    
    
    foodItem.innerHTML = `
        <div class="food-item-content">
            <div class="food-details">
                <div class="food-name">${food.name}</div>
                <div class="food-info">
                    <span class="food-calories">${calories}</span>
                    <span class="food-calories-suffix">cal</span>
                    <span class="food-category food-category-${category.replaceAll(' ', '-')}">${category}</span>
                    <span class="food-amount">${lastPortionGrams}</span>
                </div>
            </div>
        </div>
        <div class="food-actions">
            <button class="add-food-btn">+</button>
        </div>
    `;
    
    // Add click handler for the food item (only on food-details, not the add button)
    const foodDetails = foodItem.querySelector('.food-details');
    foodDetails.addEventListener('click', () => {
        const customEvent = new CustomEvent('onFoodSelect', {
            detail: food,
            bubbles: true
        });
        foodItem.dispatchEvent(customEvent);
    });
    
    // Add click handler for the add button
    const addBtn = foodItem.querySelector('.add-food-btn');
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const customEvent = new CustomEvent('onAddFoodItem', {
            detail: food,
            bubbles: true
        });
        foodItem.dispatchEvent(customEvent);
    });
    
    return foodItem;
}

// Custom scrollbar function
function createCustomScrollbar(container) {
    
    // Color interpolation function
    function interpolateColor(color1, color2, ratio) {
        // Convert hex to RGB
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;
        
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Hide native scrollbar
    container.style.scrollbarWidth = 'none';
    container.style.msOverflowStyle = 'none';
    const style = document.createElement('style');
    style.textContent = `
        ${container.tagName.toLowerCase()}::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Create scrollbar track
    const scrollbar = document.createElement('div');
    scrollbar.className = 'custom-scrollbar';
    
    // Create scrollbar thumb
    const thumb = document.createElement('div');
    thumb.className = 'custom-scrollbar-thumb';
    scrollbar.appendChild(thumb);
    
    // Add scrollbar to container
    container.appendChild(scrollbar);
    
    // Update scrollbar on scroll
    function updateScrollbar() {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        
        // Always show scrollbar for testing
        scrollbar.style.display = 'block';
        
        if (scrollHeight <= clientHeight) {
            // If no scrolling needed, hide scrollbar
            scrollbar.style.display = 'none';
            return;
        }
        
        const scrollbarHeight = scrollbar.getBoundingClientRect().height;
        const thumbHeight = scrollbarHeight * 0.07; // Always 7% of scrollbar height
        const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
        
        // Calculate color based on position (0 = top, 1 = bottom)
        const positionRatio = thumbTop / (scrollbarHeight - thumbHeight);
        const color = interpolateColor('#46ae98', '#ae7246', positionRatio);
        
        thumb.style.height = `${thumbHeight}px`;
        thumb.style.top = `${thumbTop}px`;
        thumb.style.background = color;
    }
    
    // Add scroll listener
    container.addEventListener('scroll', () => {
        updateScrollbar();
    });
    
    // Add click event listener to scrollbar track
    scrollbar.addEventListener('click', (e) => {
        const rect = scrollbar.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const percentage = clickY / rect.height;
        const scrollTop = percentage * (container.scrollHeight - container.clientHeight);
        container.scrollTop = scrollTop;
    });
    
    // Add click event listener to scrollbar thumb
    thumb.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent track click
    });
    
    // Add drag functionality to thumb
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;
    
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = container.scrollTop;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        const scrollbarHeight = scrollbar.getBoundingClientRect().height;
        const thumbHeight = thumb.getBoundingClientRect().height;
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        const scrollbarTrackHeight = scrollbarHeight - thumbHeight;
        
        const deltaScroll = (deltaY / scrollbarTrackHeight) * maxScrollTop;
        container.scrollTop = startScrollTop + deltaScroll;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Initial update
    updateScrollbar();
    
    // Update on resize
    window.addEventListener('resize', updateScrollbar);
}