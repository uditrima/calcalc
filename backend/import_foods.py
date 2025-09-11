#!/usr/bin/env python3
"""
Script til at importere fødevare fra foods.json til databasen.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Tilføj backend mappen til Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app import create_app
from db.database import db
from db.models.food import Food

def load_foods_json():
    """Læs foods.json filen."""
    foods_file = Path(__file__).parent.parent / "foods.json"
    
    if not foods_file.exists():
        print(f"❌ foods.json ikke fundet på: {foods_file}")
        return None
    
    try:
        with open(foods_file, 'r', encoding='utf-8') as f:
            foods_data = json.load(f)
        print(f"✅ Læst {len(foods_data)} fødevare fra foods.json")
        return foods_data
    except Exception as e:
        print(f"❌ Fejl ved læsning af foods.json: {e}")
        return None

def convert_food_data(food_name, food_data):
    """Konverter JSON data til Food model format."""
    try:
        # Hent grundlæggende data
        name = food_data.get('name', food_name)
        category = food_data.get('category', 'ukendt')
        brand = food_data.get('brand', '') or None
        
        # Konverter næringsværdier fra string til float
        def safe_float(value, default=0.0):
            if not value or value == '':
                return default
            try:
                return float(value)
            except (ValueError, TypeError):
                return default
        
        # Konverter alle næringsværdier
        calories = safe_float(food_data.get('kcal_100g'))
        protein = safe_float(food_data.get('protein_100g'))
        carbohydrates = safe_float(food_data.get('carbs_100g'))
        fat = safe_float(food_data.get('fat_100g'))
        fiber = safe_float(food_data.get('fiber_100g'))
        sugar = safe_float(food_data.get('sugar_100g'))
        saturated_fat = safe_float(food_data.get('saturated_fat_100g'))
        
        # Beregn unsaturated_fat (total fat - saturated fat)
        unsaturated_fat = max(0, fat - saturated_fat) if fat > 0 else 0
        
        cholesterol = safe_float(food_data.get('cholesterol_mg_100g'))
        sodium = safe_float(food_data.get('salt_mg_100g'))  # salt_mg_100g -> sodium
        potassium = safe_float(food_data.get('potassium_mg_100g'))
        calcium = safe_float(food_data.get('calcium_procent'))  # procent -> mg (omregning nødvendig)
        iron = safe_float(food_data.get('iron_procent'))  # procent -> mg (omregning nødvendig)
        vitamin_a = safe_float(food_data.get('vitamin_a_procent'))
        vitamin_c = safe_float(food_data.get('vitamin_c_procent'))
        
        # Opret Food objekt
        food = Food(
            name=name,
            category=category,
            brand=brand,
            calories=calories,
            protein=protein,
            carbohydrates=carbohydrates,
            fat=fat,
            fiber=fiber,
            sugar=sugar,
            saturated_fat=saturated_fat,
            unsaturated_fat=unsaturated_fat,
            cholesterol=cholesterol,
            sodium=sodium,
            potassium=potassium,
            calcium=calcium,
            iron=iron,
            vitamin_a=vitamin_a,
            vitamin_c=vitamin_c,
            used=0,  # Standard værdi for nye fødevare
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        return food
        
    except Exception as e:
        print(f"❌ Fejl ved konvertering af {food_name}: {e}")
        return None

def import_foods():
    """Hovedfunktion til at importere fødevare."""
    print("🚀 Starter import af fødevare...")
    
    # Opret Flask app
    app = create_app()
    
    with app.app_context():
        # Læs foods.json
        foods_data = load_foods_json()
        if not foods_data:
            return
        
        # Tællere
        imported_count = 0
        skipped_count = 0
        error_count = 0
        
        print(f"📊 Starter import af {len(foods_data)} fødevare...")
        
        # Import hver fødevare
        for food_name, food_data in foods_data.items():
            try:
                # Tjek om fødevaren allerede eksisterer
                existing_food = Food.query.filter_by(name=food_data.get('name', food_name)).first()
                if existing_food:
                    print(f"⏭️  Springet over: {food_name} (allerede i database)")
                    skipped_count += 1
                    continue
                
                # Konverter og gem
                food = convert_food_data(food_name, food_data)
                if food:
                    db.session.add(food)
                    imported_count += 1
                    
                    if imported_count % 100 == 0:
                        print(f"📈 Importeret {imported_count} fødevare...")
                else:
                    error_count += 1
                    
            except Exception as e:
                print(f"❌ Fejl ved import af {food_name}: {e}")
                error_count += 1
        
        # Commit alle ændringer
        try:
            db.session.commit()
            print(f"✅ Import fuldført!")
            print(f"📊 Statistik:")
            print(f"   - Importeret: {imported_count}")
            print(f"   - Springet over: {skipped_count}")
            print(f"   - Fejl: {error_count}")
            print(f"   - Total: {imported_count + skipped_count + error_count}")
            
        except Exception as e:
            print(f"❌ Fejl ved commit til database: {e}")
            db.session.rollback()

if __name__ == "__main__":
    import_foods()
