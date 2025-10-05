// Live state monitoring for development
// Provides real-time AppState visualization

import { AppState } from '../state/app_state.js';

export class StateMonitor {
    constructor() {
        this.viewer = null;
        this.isEnabled = false;
        this.updateInterval = null;
        
        // Only enable in development
        if (window.location.hostname === 'localhost') {
            this.enable();
        }
    }
    
    enable() {
        this.createStateViewer();
        this.setupKeyboardToggle();
        this.startUpdateInterval();
        this.isEnabled = true;
        console.log('🔍 Live AppState monitoring enabled! Press Ctrl+Shift+S to toggle viewer');
    }
    
    disable() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.viewer) {
            this.viewer.remove();
        }
        this.isEnabled = false;
    }
    
    createStateViewer() {
        // Create live state viewer
        this.viewer = document.createElement('div');
        this.viewer.id = 'state-viewer';
        this.viewer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 400px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            overflow-y: auto;
            border: 1px solid #333;
            display: none;
        `;
        document.body.appendChild(this.viewer);
    }
    
    setupKeyboardToggle() {
        // Toggle with Ctrl+Shift+S
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                this.toggleViewer();
            }
        });
    }
    
    startUpdateInterval() {
        // Update state viewer every 500ms
        this.updateInterval = setInterval(() => {
            this.updateStateDisplay();
        }, 500);
    }
    
    updateStateDisplay() {
        if (this.viewer && this.viewer.style.display !== 'none') {
            const state = AppState.getState();
            const formattedGoals = AppState.getFormattedGoals();
            
            this.viewer.innerHTML = `
                <div style="color: #4CAF50; font-weight: bold; margin-bottom: 10px;">
                    🔍 Live AppState (Ctrl+Shift+S to toggle)
                </div>
                <div><strong>Foods:</strong> ${state.foods.length} items</div>
                <div><strong>Diary:</strong> ${state.diary.entries.length} entries</div>
                <div><strong>Exercises:</strong> ${state.exercises.length} items</div>
                <div><strong>Weights:</strong> ${state.weights.length} items</div>
                <div style="margin-top: 8px; color: #FF9800;">
                    <strong>Goals:</strong>
                </div>
                <div style="margin-left: 10px;">
                    <div>Calories: ${formattedGoals?.calories.formatted || 'N/A'}</div>
                    <div>Protein: ${formattedGoals?.protein.formatted || 'N/A'}</div>
                    <div>Carbs: ${formattedGoals?.carbs.formatted || 'N/A'}</div>
                    <div>Fat: ${formattedGoals?.fat.formatted || 'N/A'}</div>
                </div>
                <div style="margin-top: 10px; color: #FFC107;">
                    <strong>Last Update:</strong> ${new Date().toLocaleTimeString()}
                </div>
                <div style="margin-top: 5px; color: #9E9E9E; font-size: 10px;">
                    Console: AppState.getState() for full data
                </div>
            `;
        }
    }
    
    toggleViewer() {
        if (this.viewer) {
            this.viewer.style.display = this.viewer.style.display === 'none' ? 'block' : 'none';
        }
    }
}
