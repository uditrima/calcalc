// Add Food Custom Scrollbar Implementation
import { CustomScrollbar as BaseCustomScrollbar, ScrollbarConfig } from '../../utils/custom_scrollbar.js';

/**
 * Custom scrollbar class for handling scrollbar functionality
 * Extends the base CustomScrollbar with add-food specific configuration
 */
export class CustomScrollbar extends BaseCustomScrollbar {
    constructor(container) {
        super(container, ScrollbarConfig.ADD_FOOD);
    }
}