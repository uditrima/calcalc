# Data Layer

This directory contains centralized data definitions and constants used across the application.

## Meal Types (`meal_types.js`)

Central definition of meal types - the single source of truth for meal types across the application.

### Usage

```javascript
import { MEAL_TYPES, getMealOptions, getMealDisplayName } from '../data/meal_types.js';

// Get core meal options (4 meals) for food header dropdown
const coreMeals = getMealOptions(true);

// Get extended meal options (5 meals) for add food and diary
const extendedMeals = getMealOptions(false);

// Get display name for a meal type
const displayName = getMealDisplayName(MEAL_TYPES.BREAKFAST); // "Morgenmad"
```

### Meal Types

- **Core Meals** (4): Used in food header dropdown
  - `morgenmad` - Morgenmad
  - `frokost` - Frokost  
  - `aftensmad` - Aftensmad
  - `snack` - Snack

- **Extended Meals** (5): Used in add food and diary
  - `morgenmad` - Morgenmad
  - `frokost` - Frokost
  - `aftensmad` - Aftensmad
  - `mellemmaaltid1` - Mellemmåltid 1
  - `mellemmaaltid2` - Mellemmåltid 2

### Benefits

- **Single source of truth**: All meal types defined in one place
- **Consistency**: Same meal types used across all components
- **Maintainability**: Easy to add/remove meal types
- **Type safety**: Centralized validation and display names
