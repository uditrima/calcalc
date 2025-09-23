#!/usr/bin/env python3
"""
Tilføj notes kolonne til diary_entries tabellen
"""

import sqlite3
import os

def add_notes_column():
    """Tilføj notes kolonne til diary_entries tabellen"""
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'calorie_tracker.db')
    
    try:
        # Opret forbindelse til database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Tjek om kolonnen eksisterer
        cursor.execute("PRAGMA table_info(diary_entries)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'notes' not in columns:
            # Tilføj kolonnen
            cursor.execute("ALTER TABLE diary_entries ADD COLUMN notes TEXT")
            conn.commit()
            print("Kolonnen 'notes' tilføjet til diary_entries tabellen")
        else:
            print("Kolonnen 'notes' eksisterer allerede")
            
        # Luk forbindelse
        conn.close()
        return True
        
    except Exception as e:
        print(f"Fejl ved tilføjelse af kolonne: {e}")
        return False

if __name__ == "__main__":
    print("Tilføjer notes kolonne til diary_entries tabellen...")
    success = add_notes_column()
    
    if success:
        print("Kolonnen tilføjet succesfuldt!")
    else:
        print("Fejl ved tilføjelse af kolonne.")
