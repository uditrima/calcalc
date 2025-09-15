#!/usr/bin/env python3
"""
Script to initialize the database with default nutrient values.
Run this script to populate the nutrients table with standard nutritional data.
"""

from app import create_app
from services.nutrient_service import NutrientService

def main():
    """Initialize database with default nutrients."""
    app = create_app()
    
    with app.app_context():
        nutrient_service = NutrientService()
        
        print("Initializing default nutrients...")
        nutrient_service.initialize_default_nutrients()
        
        # Verify the data was created
        nutrients = nutrient_service.get_all_nutrients()
        print(f"\nCreated {len(nutrients)} nutrients:")
        
        for nutrient in nutrients:
            print(f"  - {nutrient.name}: {nutrient.calories_per_gram} cal/g")
            if nutrient.description:
                print(f"    {nutrient.description}")
        
        print("\nNutrient initialization completed successfully!")

if __name__ == "__main__":
    main()
