#!/usr/bin/env python3
"""
Script til at opdatere databasen med nye kolonner.
"""

import os
import sys
from pathlib import Path

# Tilføj backend mappen til Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app import create_app
from db.database import db

def migrate_database():
    """Opret database med opdaterede modeller."""
    print("🚀 Starter database migration...")
    
    # Opret Flask app
    app = create_app()
    
    with app.app_context():
        try:
            # Opret alle tabeller
            db.create_all()
            print("✅ Database oprettet med opdaterede modeller!")
            
            # Verificer at tabellerne er oprettet
            from db.models.food import Food
            print(f"📊 Foods tabel oprettet med kolonner: {[column.name for column in Food.__table__.columns]}")
            
        except Exception as e:
            print(f"❌ Fejl ved oprettelse af database: {e}")
            return False
    
    return True

if __name__ == "__main__":
    migrate_database()
