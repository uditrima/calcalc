#!/usr/bin/env python3
"""
Eksempel script til at tilføje en kolonne til en eksisterende tabel
"""

import sys
import os
from sqlalchemy import text

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from db.database import db

def add_column_to_table():
    """Tilføj en kolonne til en eksisterende tabel"""
    
    # Create Flask app context
    app = create_app()
    
    with app.app_context():
        try:
            # Eksempel: Tilføj en 'notes' kolonne til exercises tabellen
            # Først tjek om kolonnen allerede eksisterer
            result = db.session.execute(text("PRAGMA table_info(exercises)"))
            columns = [row[1] for row in result.fetchall()]
            
            if 'notes' not in columns:
                # Tilføj kolonnen
                db.session.execute(text("ALTER TABLE exercises ADD COLUMN notes TEXT"))
                db.session.commit()
                print("Kolonnen 'notes' tilføjet til exercises tabellen")
            else:
                print("Kolonnen 'notes' eksisterer allerede")
                
        except Exception as e:
            print(f"Fejl ved tilføjelse af kolonne: {e}")
            db.session.rollback()
            return False
        
        return True

if __name__ == "__main__":
    print("Tilføjer kolonne til databasen...")
    success = add_column_to_table()
    
    if success:
        print("Kolonnen tilføjet succesfuldt!")
    else:
        print("Fejl ved tilføjelse af kolonne.")
        sys.exit(1)
