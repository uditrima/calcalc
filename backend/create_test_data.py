#!/usr/bin/env python3
"""
Script to create test diary entries for today's date
"""
import sqlite3
from datetime import date, datetime

def create_test_diary_entries():
    """Create test diary entries for today"""
    conn = sqlite3.connect('instance/calorie_tracker.db')
    cursor = conn.cursor()
    
    today = date.today().isoformat()
    print(f"Creating test data for date: {today}")
    
    # Get some sample foods
    cursor.execute("""
        SELECT id, name, calories, protein, carbohydrates, fat 
        FROM foods 
        WHERE name LIKE '%æble%' OR name LIKE '%banan%' OR name LIKE '%brød%' 
        LIMIT 3
    """)
    foods = cursor.fetchall()
    
    if not foods:
        # Fallback to any foods
        cursor.execute("""
            SELECT id, name, calories, protein, carbohydrates, fat 
            FROM foods 
            LIMIT 3
        """)
        foods = cursor.fetchall()
    
    print(f"Found {len(foods)} foods to use")
    
    # Create diary entries
    meal_types = ['morgenmad', 'frokost', 'aftensmad']
    amounts = [150, 200, 300]  # grams
    
    for i, (food_id, name, calories, protein, carbs, fat) in enumerate(foods):
        meal_type = meal_types[i % len(meal_types)]
        amount = amounts[i % len(amounts)]
        
        # Calculate nutritional values based on amount
        multiplier = amount / 100.0
        calc_calories = calories * multiplier
        calc_protein = protein * multiplier
        calc_carbs = carbs * multiplier
        calc_fat = fat * multiplier
        
        print(f"Adding: {name} ({amount}g) - {calc_calories:.1f} cal for {meal_type}")
        
        cursor.execute("""
            INSERT INTO diary_entries 
            (date, meal_type, food_id, grams)
            VALUES (?, ?, ?, ?)
        """, (
            today,
            meal_type,
            food_id,
            amount
        ))
    
    conn.commit()
    
    # Verify entries were created
    cursor.execute("""
        SELECT de.id, f.name, de.grams, f.calories, de.meal_type
        FROM diary_entries de
        JOIN foods f ON de.food_id = f.id
        WHERE de.date = ?
        ORDER BY de.id
    """, (today,))
    
    entries = cursor.fetchall()
    print(f"\nCreated {len(entries)} diary entries:")
    total_calories = 0
    for entry in entries:
        # Calculate calories based on grams
        multiplier = entry[2] / 100.0  # grams / 100
        calc_calories = entry[3] * multiplier  # food calories * multiplier
        print(f"  {entry[0]}: {entry[1]} ({entry[2]}g) - {calc_calories:.1f} cal ({entry[4]})")
        total_calories += calc_calories
    
    print(f"\nTotal calories for {today}: {total_calories:.1f}")
    
    conn.close()
    return total_calories

if __name__ == "__main__":
    create_test_diary_entries()
