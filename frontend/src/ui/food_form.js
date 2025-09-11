// Food form UI component
import { AppState } from '../state/app_state.js';

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
    
    // 2. Search Section
    const searchSection = createSearchSection();
    foodSection.appendChild(searchSection);
    
    // 3. Menu Section
    const menuSection = createMenuSection();
    foodSection.appendChild(menuSection);
    
    // 4. Carousel Menu Section
    const carouselSection = createCarouselSection();
    foodSection.appendChild(carouselSection);
    
    // 5. Sort By Section
    const sortBySection = createSortBySection();
    foodSection.appendChild(sortBySection);
    
    // 6. Food Items Section
    const foodItemsSection = createFoodItemsSection();
    foodSection.appendChild(foodItemsSection);
    
    // Load foods from database
    loadFoodsFromDatabase();
    
    // Subscribe to foods state changes
    AppState.subscribe('foods', (state) => {
        renderFoodItems(state.foods, 'recent');
    });
    
    // Add to container
    container.appendChild(foodSection);
    
    // Return the food section element for external access
    return foodSection;
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
        document.dispatchEvent(customEvent);
    });
    header.appendChild(goBackBtn);
    
    // Title with dropdown
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Morgenmad';
    title.className = 'meal-title';
    titleContainer.appendChild(title);
    
    const dropdownArrow = document.createElement('span');
    dropdownArrow.className = 'dropdown-arrow';
    dropdownArrow.innerHTML = '▼';
    titleContainer.appendChild(dropdownArrow);
    
    header.appendChild(titleContainer);
    
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
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownContent.classList.remove('show');
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
    searchInput.addEventListener('input', handleSearch);
    searchContainer.appendChild(searchInput);
    
    section.appendChild(searchContainer);
    
    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        // TODO: Implement search functionality
        console.log('Searching for:', query);
    }
    
    return section;
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
        console.log('Selected menu:', label);
    }
    
    return section;
}

function createCarouselSection() {
    const section = document.createElement('div');
    section.className = 'carousel-section';
    
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    
    const carouselItems = [
        { icon: '🎤', label: 'Voice Log', new: true },
        { icon: '📱', label: 'Scan a Barcode' }
    ];
    
    carouselItems.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <div class="carousel-icon">${item.icon}</div>
            <div class="carousel-label">${item.label}</div>
            ${item.new ? '<div class="new-badge">NEW</div>' : ''}
        `;
        carouselItem.addEventListener('click', () => selectCarouselItem(item.label));
        carouselContainer.appendChild(carouselItem);
    });
    
    section.appendChild(carouselContainer);
    
    function selectCarouselItem(label) {
        console.log('Selected carousel item:', label);
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
    dropdownBtn.innerHTML = 'Most Recent <span class="dropdown-arrow">⋮</span>';
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
    
    return section;
}

// Function to load foods from database
async function loadFoodsFromDatabase() {
    try {
        await AppState.loadFoods();
        const foods = AppState.getFoods();
        renderFoodItems(foods, 'recent');
    } catch (error) {
        console.error('Failed to load foods:', error);
        // Show error message or fallback
        if (window.foodItemsSection) {
            window.foodItemsSection.innerHTML = '<div class="error-message">Kunne ikke indlæse fødevare</div>';
        }
    }
}

// Function to render food items
function renderFoodItems(foods, sortBy = 'recent') {
    if (!window.foodItemsSection) {
        return;
    }
    
    // Clear existing items
    window.foodItemsSection.innerHTML = '';
    
    // Sort foods based on sortBy parameter
    const sortedFoods = sortFoods(foods, sortBy);
    
    // Render each food item
    sortedFoods.forEach(food => {
        const foodItem = createFoodItem(food);
        window.foodItemsSection.appendChild(foodItem);
    });
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
                return a.name.localeCompare(b.name);
            });
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
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
    
    // Format food details for display
    const brandText = food.brand ? `${food.brand} - ` : '';
    const calories = Math.round(food.calories || 0);
    const details = `${calories} cal, ${brandText}${food.category || 'ukendt'}, 100.0 gram`;
    
    foodItem.innerHTML = `
        <div class="food-item-content">
            <div class="food-details">
                <div class="food-name">${food.name}</div>
                <div class="food-info">${details}</div>
            </div>
        </div>
        <div class="food-actions">
            <button class="add-food-btn">+</button>
        </div>
    `;
    
    // Add click handler for the food item
    foodItem.addEventListener('click', () => {
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