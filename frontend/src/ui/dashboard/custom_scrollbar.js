// Custom scrollbar component for dashboard
/**
 * Creates a custom scrollbar for the given container
 * @param {HTMLElement} container - The container element to add scrollbar to
 */
export function createCustomScrollbar(container) {
    console.log('Creating custom scrollbar for container:', container);
    
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
        
        console.log('Updating scrollbar:', { scrollTop, scrollHeight, clientHeight });
        
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
        console.log('Container scrolled, updating scrollbar');
        updateScrollbar();
    });
    
    // Add click event listener to scrollbar track
    scrollbar.addEventListener('click', (e) => {
        console.log('Scrollbar track clicked');
        const rect = scrollbar.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const percentage = clickY / rect.height;
        const scrollTop = percentage * (container.scrollHeight - container.clientHeight);
        console.log('Scrolling to:', scrollTop);
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
        console.log('Thumb mousedown');
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
