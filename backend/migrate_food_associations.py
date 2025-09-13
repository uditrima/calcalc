#!/usr/bin/env python3
"""
Migration script to create food_associations table
"""

import os
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app import create_app
from db.database import db

def create_food_associations_table():
    """Create the food_associations table"""
    print("🚀 Starting food associations migration...")
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        try:
            # Import the model to ensure it's registered
            from db.models.food_association import FoodAssociation
            
            # Create all tables (this will create the new table)
            db.create_all()
            print("✅ Food associations table created successfully!")
            
            # Verify table exists
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            if 'food_associations' in tables:
                print("✅ Table 'food_associations' verified in database")
                
                # Show table structure
                columns = inspector.get_columns('food_associations')
                print("\n📋 Table structure:")
                for column in columns:
                    print(f"  - {column['name']}: {column['type']}")
            else:
                print("❌ Table 'food_associations' not found in database")
                return False
                
        except Exception as e:
            print(f"❌ Error creating food associations table: {e}")
            return False
    
    return True

if __name__ == "__main__":
    success = create_food_associations_table()
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("\n📖 Usage:")
        print("  - Food associations will be automatically updated when diary entries are added")
        print("  - Use FoodAssociationService to get recommendations and insights")
        print("  - Associations track which foods are often eaten together in the same meal")
        print("\n🔧 API Endpoints:")
        print("  - GET /api/food-associations/recommendations?food_id=123&meal_type=morgenmad")
        print("  - GET /api/food-associations/popular-combinations?meal_type=frokost")
        print("  - GET /api/food-associations/insights?meal_type=aftensmad")
    else:
        print("\n💥 Migration failed!")
        sys.exit(1)
