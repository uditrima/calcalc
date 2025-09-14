#!/usr/bin/env python3
import sqlite3
from datetime import date

def check_today_data():
    conn = sqlite3.connect('instance/calorie_tracker.db')
    cursor = conn.cursor()
    
    today = date.today().isoformat()
    print(f"Checking data for today: {today}")
    
    # Get all diary entries for today
    cursor.execute("""
        SELECT de.id, f.name, de.grams, f.calories, de.meal_type
        FROM diary_entries de
        JOIN foods f ON de.food_id = f.id
        WHERE de.date = ?
        ORDER BY de.id
    """, (today,))
    
    entries = cursor.fetchall()
    print(f"\nFound {len(entries)} diary entries for {today}:")
    
    total_calories = 0
    for entry in entries:
        entry_id, food_name, grams, food_calories, meal_type = entry
        calc_calories = (grams / 100.0) * food_calories
        total_calories += calc_calories
        print(f"  {entry_id}: {food_name} ({grams}g) - {calc_calories:.1f} cal ({meal_type})")
    
    print(f"\nTotal calories for {today}: {total_calories:.1f}")
    
    # Also check what dates exist in the database
    cursor.execute("SELECT DISTINCT date FROM diary_entries ORDER BY date")
    dates = cursor.fetchall()
    print(f"\nAll dates in database:")
    for d in dates:
        print(f"  {d[0]}")
    
    conn.close()
    return total_calories

if __name__ == "__main__":
    check_today_data()
