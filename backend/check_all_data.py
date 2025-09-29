#!/usr/bin/env python3
import sqlite3

def check_all_data():
    conn = sqlite3.connect('instance/calorie_tracker.db')
    cursor = conn.cursor()
    
    # List all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    print("=== DATABASE OVERVIEW ===")
    for table in tables:
        table_name = table[0]
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"{table_name}: {count} rækker")
    
    print("\n=== DETAILED CHECK ===")
    
    # Check foods
    cursor.execute("SELECT COUNT(*) FROM foods")
    foods_count = cursor.fetchone()[0]
    print(f"\nFoods: {foods_count} fødevare")
    if foods_count > 0:
        cursor.execute("SELECT name FROM foods LIMIT 3")
        foods = cursor.fetchall()
        print("Sample foods:")
        for food in foods:
            print(f"  - {food[0]}")
    
    # Check diary_entries
    cursor.execute("SELECT COUNT(*) FROM diary_entries")
    diary_count = cursor.fetchone()[0]
    print(f"\nDiary entries: {diary_count} indgange")
    if diary_count > 0:
        cursor.execute("SELECT date, meal_type, grams FROM diary_entries LIMIT 3")
        entries = cursor.fetchall()
        print("Sample entries:")
        for entry in entries:
            print(f"  - {entry[0]} | {entry[1]} | {entry[2]}g")
    
    # Check user_goals
    cursor.execute("SELECT COUNT(*) FROM user_goals")
    goals_count = cursor.fetchone()[0]
    print(f"\nUser goals: {goals_count} mål")
    if goals_count > 0:
        cursor.execute("SELECT * FROM user_goals")
        goals = cursor.fetchall()
        for goal in goals:
            print(f"  - {goal}")
    
    # Check nutrients
    cursor.execute("SELECT COUNT(*) FROM nutrients")
    nutrients_count = cursor.fetchone()[0]
    print(f"\nNutrients: {nutrients_count} næringsstoffer")
    if nutrients_count > 0:
        cursor.execute("SELECT name FROM nutrients LIMIT 3")
        nutrients = cursor.fetchall()
        print("Sample nutrients:")
        for nutrient in nutrients:
            print(f"  - {nutrient[0]}")
    
    conn.close()

if __name__ == "__main__":
    check_all_data()

