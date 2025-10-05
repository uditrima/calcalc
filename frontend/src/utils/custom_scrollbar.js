// Custom Scrollbar Utility
// Unified implementation for all custom scrollbars across the application

/**
 * Color interpolation utility
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color  
 * @param {number} ratio - Interpolation ratio (0-1)
 * @returns {string} Interpolated RGB color
 */
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

/**
 * Custom Scrollbar Configuration
 */
export const ScrollbarConfig = {
    DEFAULT: {
        colors: {
            start: '#46ae98',
            end: '#ae7246'
        },
        thumbHeight: 0.07, // 7% of scrollbar height
        enableDrag: true,
        enableClick: true,
        enableResize: true,
        enableMutationObserver: false
    },
    
    DASHBOARD: {
        colors: {
            start: '#46ae98',
            end: '#ae7246'
        },
        thumbHeight: 0.07,
        enableDrag: true,
        enableClick: true,
        enableResize: true,
        enableMutationObserver: false
    },
    
    DIARY: {
        colors: {
            start: '#46ae98',
            end: '#ae7246'
        },
        thumbHeight: 0.07,
        enableDrag: true,
        enableClick: true,
        enableResize: true,
        enableMutationObserver: false
    },
    
    ADD_FOOD: {
        colors: {
            start: '#46ae98',
            end: '#ae7246'
        },
        thumbHeight: 0.07,
        enableDrag: true,
        enableClick: true,
        enableResize: true,
        enableMutationObserver: true
    }
};

/**
 * Custom Scrollbar Class - Unified implementation
 */
export class CustomScrollbar {
    constructor(container, config = ScrollbarConfig.DEFAULT) {
        this.container = container;
        this.config = { ...ScrollbarConfig.DEFAULT, ...config };
        this.scrollbar = null;
        this.thumb = null;
        this.isDragging = false;
        this.startY = 0;
        this.startScrollTop = 0;
        this.mutationObserver = null;
        
        this.init();
    }

    /**
     * Initializes the custom scrollbar
     */
    init() {
        console.log('Creating custom scrollbar for container:', this.container);
        
        // Hide native scrollbar
        this.hideNativeScrollbar();
        
        // Create scrollbar elements
        this.createScrollbarElements();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial update
        this.scheduleUpdate();
    }

    /**
     * Hides the native scrollbar
     */
    hideNativeScrollbar() {
        this.container.style.scrollbarWidth = 'none';
        this.container.style.msOverflowStyle = 'none';
        
        const style = document.createElement('style');
        style.textContent = `
            ${this.container.tagName.toLowerCase()}::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates scrollbar DOM elements
     */
    createScrollbarElements() {
        // Create scrollbar track
        this.scrollbar = document.createElement('div');
        this.scrollbar.className = 'custom-scrollbar';
        
        // Create scrollbar thumb
        this.thumb = document.createElement('div');
        this.thumb.className = 'custom-scrollbar-thumb';
        this.scrollbar.appendChild(this.thumb);
        
        // Add scrollbar to container
        this.container.appendChild(this.scrollbar);
    }

    /**
     * Adds event listeners for scrollbar functionality
     */
    addEventListeners() {
        // Add scroll listener
        this.container.addEventListener('scroll', () => {
            console.log('Container scrolled, updating scrollbar');
            this.updateScrollbar();
        });
        
        if (this.config.enableClick) {
            // Add click event listener to scrollbar track
            this.scrollbar.addEventListener('click', (e) => {
                console.log('Scrollbar track clicked');
                this.handleTrackClick(e);
            });
            
            // Add click event listener to scrollbar thumb
            this.thumb.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent track click
            });
        }
        
        if (this.config.enableDrag) {
            // Add drag functionality to thumb
            this.addDragListeners();
        }
        
        if (this.config.enableResize) {
            // Update on resize
            window.addEventListener('resize', () => this.updateScrollbar());
        }
        
        if (this.config.enableMutationObserver) {
            // Update when content changes
            this.addMutationObserver();
        }
    }

    /**
     * Adds drag event listeners to the thumb
     */
    addDragListeners() {
        this.thumb.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startY = e.clientY;
            this.startScrollTop = this.container.scrollTop;
            
            document.addEventListener('mousemove', this.handleDrag);
            document.addEventListener('mouseup', this.handleDragEnd);
            
            e.preventDefault();
        });
    }

    /**
     * Handles drag movement
     */
    handleDrag = (e) => {
        if (!this.isDragging) return;
        
        const deltaY = e.clientY - this.startY;
        const scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
        const scrollHeight = this.container.scrollHeight - this.container.clientHeight;
        const scrollDelta = (deltaY / scrollbarHeight) * scrollHeight;
        
        this.container.scrollTop = this.startScrollTop + scrollDelta;
    }

    /**
     * Handles drag end
     */
    handleDragEnd = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
    }

    /**
     * Handles track click
     */
    handleTrackClick(e) {
        const rect = this.scrollbar.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const percentage = clickY / rect.height;
        const scrollTop = percentage * (this.container.scrollHeight - this.container.clientHeight);
        console.log('Scrolling to:', scrollTop);
        this.container.scrollTop = scrollTop;
    }

    /**
     * Updates scrollbar position and appearance
     */
    updateScrollbar() {
        const scrollTop = this.container.scrollTop;
        const scrollHeight = this.container.scrollHeight;
        const clientHeight = this.container.clientHeight;
        
        console.log('Updating scrollbar:', { scrollTop, scrollHeight, clientHeight });
        
        // Always show scrollbar for testing
        this.scrollbar.style.display = 'block';
        
        if (scrollHeight <= clientHeight) {
            // If no scrolling needed, hide scrollbar
            this.scrollbar.style.display = 'none';
            return;
        }
        
        const scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
        const thumbHeight = scrollbarHeight * this.config.thumbHeight;
        const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
        
        // Calculate color based on position (0 = top, 1 = bottom)
        const positionRatio = thumbTop / (scrollbarHeight - thumbHeight);
        const color = interpolateColor(
            this.config.colors.start, 
            this.config.colors.end, 
            positionRatio
        );
        
        this.thumb.style.height = `${thumbHeight}px`;
        this.thumb.style.top = `${thumbTop}px`;
        this.thumb.style.background = color;
    }

    /**
     * Schedules scrollbar update
     */
    scheduleUpdate() {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => this.updateScrollbar());
    }

    /**
     * Adds mutation observer for content changes
     */
    addMutationObserver() {
        this.mutationObserver = new MutationObserver(() => {
            this.scheduleUpdate();
        });
        
        this.mutationObserver.observe(this.container, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    /**
     * Destroys the scrollbar and cleans up
     */
    destroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        if (this.scrollbar && this.scrollbar.parentNode) {
            this.scrollbar.parentNode.removeChild(this.scrollbar);
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
    }
}

/**
 * Function-based API for backward compatibility
 * @param {HTMLElement} container - The container element
 * @param {Object} config - Configuration object
 * @returns {CustomScrollbar} The scrollbar instance
 */
export function createCustomScrollbar(container, config = ScrollbarConfig.DEFAULT) {
    return new CustomScrollbar(container, config);
}
