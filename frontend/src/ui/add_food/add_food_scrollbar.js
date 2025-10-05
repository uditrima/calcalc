// Add Food Custom Scrollbar Implementation

/**
 * Custom scrollbar class for handling scrollbar functionality
 */
export class CustomScrollbar {
    constructor(container) {
        this.container = container;
        this.scrollbar = null;
        this.thumb = null;
        this.isDragging = false;
        this.startY = 0;
        this.startScrollTop = 0;
        
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
     * Creates scrollbar track and thumb elements
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
        
        // Add click event listener to scrollbar track
        this.scrollbar.addEventListener('click', (e) => {
            console.log('Scrollbar track clicked');
            this.handleTrackClick(e);
        });
        
        // Add click event listener to scrollbar thumb
        this.thumb.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent track click
        });
        
        // Add drag functionality to thumb
        this.addDragListeners();
        
        // Update on resize
        window.addEventListener('resize', () => this.updateScrollbar());
        
        // Update when content changes
        this.addMutationObserver();
    }

    /**
     * Adds drag event listeners to the thumb
     */
    addDragListeners() {
        this.thumb.addEventListener('mousedown', (e) => {
            console.log('Thumb mousedown');
            this.isDragging = true;
            this.startY = e.clientY;
            this.startScrollTop = this.container.scrollTop;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.handleDrag(e);
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    /**
     * Adds mutation observer for content changes
     */
    addMutationObserver() {
        const observer = new MutationObserver(() => {
            setTimeout(() => this.updateScrollbar(), 50);
        });
        
        observer.observe(this.container, { 
            childList: true, 
            subtree: true, 
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    /**
     * Handles track click events
     * @param {Event} e - The click event
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
     * Handles drag events
     * @param {Event} e - The mouse move event
     */
    handleDrag(e) {
        const deltaY = e.clientY - this.startY;
        const scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
        const thumbHeight = this.thumb.getBoundingClientRect().height;
        const maxScrollTop = this.container.scrollHeight - this.container.clientHeight;
        const scrollbarTrackHeight = scrollbarHeight - thumbHeight;
        
        const deltaScroll = (deltaY / scrollbarTrackHeight) * maxScrollTop;
        this.container.scrollTop = this.startScrollTop + deltaScroll;
    }

    /**
     * Updates the scrollbar appearance and position
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
        const thumbHeight = scrollbarHeight * 0.07; // Always 7% of scrollbar height
        const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
        
        // Calculate color based on position (0 = top, 1 = bottom)
        const positionRatio = thumbTop / (scrollbarHeight - thumbHeight);
        const color = this.interpolateColor('#46ae98', '#ae7246', positionRatio);
        
        this.thumb.style.height = `${thumbHeight}px`;
        this.thumb.style.top = `${thumbTop}px`;
        this.thumb.style.background = color;
    }

    /**
     * Color interpolation function
     * @param {string} color1 - First color (hex)
     * @param {string} color2 - Second color (hex)
     * @param {number} ratio - Interpolation ratio (0-1)
     * @returns {string} Interpolated color
     */
    interpolateColor(color1, color2, ratio) {
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
     * Schedules an update with a delay
     */
    scheduleUpdate() {
        // Initial update - delay to ensure content is rendered
        setTimeout(() => {
            this.updateScrollbar();
        }, 100);
    }

    /**
     * Destroys the scrollbar and removes event listeners
     */
    destroy() {
        if (this.scrollbar && this.scrollbar.parentNode) {
            this.scrollbar.parentNode.removeChild(this.scrollbar);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.updateScrollbar);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', () => { this.isDragging = false; });
    }
}
