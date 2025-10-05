// Diary Swipe to Delete functionality
import { deleteFoodItem } from './diary_swipe_handlers.js';

/**
 * Adds swipe-to-delete functionality to a food item
 * @param {HTMLElement} item - The food item element
 * @param {HTMLElement} container - The container element for event dispatching
 */
export function addSwipeToDelete(item, container) {
    // Get entry ID from data attribute
    const entryId = item.getAttribute('data-entry-id');
    if (!entryId) {
        return;
    }
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let hasMoved = false;
    let startTime = 0;
    const threshold = 50; // Minimum swipe distance to trigger delete
    const maxSwipe = 80; // Maximum swipe distance
    const minSwipeTime = 100; // Minimum swipe time in ms
    
    function resetItem() {
        item.style.transition = 'all 0.3s ease';
        item.style.transform = 'translateX(0)';
        item.style.backgroundColor = '';
        
        isDragging = false;
        hasMoved = false;
    }
    
    function handleSwipeEnd() {
        if (!isDragging) return;
        
        const deltaX = currentX - startX;
        const swipeTime = Date.now() - startTime;
        
        // Only trigger delete if swiped left enough and took reasonable time
        if (hasMoved && deltaX < -threshold && swipeTime > minSwipeTime) {
            // Start smooth delete animation and let it complete
            item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.transform = 'translateX(-100%)';
            item.style.opacity = '0';
            
            // Wait for animation to complete before starting delete process
            setTimeout(() => {
                deleteFoodItem(item, container);
            }, 400); // Match the animation duration
        } else {
            resetItem();
        }
    }
    
    // Touch events
    item.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
        hasMoved = false;
        item.style.transition = 'none';
        e.preventDefault(); // Prevent scrolling
    }, { passive: false });
    
    item.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        
        // Only allow left swipe (negative deltaX)
        if (deltaX < 0) {
            const swipeDistance = Math.min(Math.abs(deltaX), maxSwipe);
            item.style.transform = `translateX(-${swipeDistance}px)`;
            hasMoved = true;
            
            // Add visual feedback - change background color based on swipe distance
            const swipeProgress = Math.min(swipeDistance / threshold, 1);
            item.style.backgroundColor = `rgba(231, 76, 60, ${swipeProgress * 0.1})`;
            
            e.preventDefault(); // Prevent scrolling
        }
    }, { passive: false });
    
    item.addEventListener('touchend', (e) => {
        // Only prevent default if we actually swiped
        if (hasMoved) {
            e.preventDefault();
        }
        handleSwipeEnd();
    }, { passive: false });
    
    item.addEventListener('touchcancel', (e) => {
        // Only prevent default if we were actually dragging
        if (isDragging) {
            e.preventDefault();
        }
        resetItem();
    }, { passive: false });
    
    // Mouse events for desktop
    item.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startTime = Date.now();
        isDragging = true;
        hasMoved = false;
        item.style.transition = 'none';
        e.preventDefault();
    });
    
    // Use document for mouse events to handle mouse leaving the element
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX;
        const deltaX = currentX - startX;
        
        if (deltaX < 0) {
            const swipeDistance = Math.min(Math.abs(deltaX), maxSwipe);
            item.style.transform = `translateX(-${swipeDistance}px)`;
            hasMoved = true;
            
            // Add visual feedback - change background color based on swipe distance
            const swipeProgress = Math.min(swipeDistance / threshold, 1);
            item.style.backgroundColor = `rgba(231, 76, 60, ${swipeProgress * 0.1})`;
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        handleSwipeEnd();
    });
    
    // Cleanup function to remove document listeners when item is removed
    item._cleanupSwipe = () => {
        document.removeEventListener('mousemove', handleSwipeEnd);
        document.removeEventListener('mouseup', handleSwipeEnd);
    };
}

