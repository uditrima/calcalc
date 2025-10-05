// Dashboard UI component - refactored to use modular architecture
import { Dashboard as ModularDashboard } from './dashboard/dashboard.js';

// Re-export the modular dashboard to maintain backward compatibility
export const Dashboard = ModularDashboard;
