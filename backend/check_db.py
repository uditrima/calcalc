#!/usr/bin/env python3
import sqlite3

def check_database():
    conn = sqlite3.connect('instance/calorie_tracker.db')
    cursor = conn.cursor()
    
    # List all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"  - {table[0]}")
    
    # Check diary_entries structure
    print("\ndiary_entries structure:")
    cursor.execute("PRAGMA table_info(diary_entries)")
    columns = cursor.fetchall()
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    
    # Check if there are any entries
    cursor.execute("SELECT COUNT(*) FROM diary_entries")
    count = cursor.fetchone()[0]
    print(f"\nDiary entries count: {count}")
    
    if count > 0:
        cursor.execute("SELECT * FROM diary_entries LIMIT 3")
        entries = cursor.fetchall()
        print("Sample entries:")
        for entry in entries:
            print(f"  {entry}")
    
    conn.close()

if __name__ == "__main__":
    check_database()
