// Diary UI component - Main entry point
// This file maintains the original public API while using the refactored modular structure

import { Diary as DiaryMain } from './diary/diary_main.js';

// Re-export the main Diary function to maintain backward compatibility
export { DiaryMain as Diary };
