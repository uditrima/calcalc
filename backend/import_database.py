#!/usr/bin/env python3
"""
Script til at importere database på serveren
"""
import sqlite3
import os
import sys
from datetime import datetime

def import_sql_file(sql_file, db_path='calorie_trackerImport.db'):
    """Importerer SQL fil til database"""
    
    if not os.path.exists(sql_file):
        print(f"❌ SQL fil ikke fundet: {sql_file}")
        return False
    
    try:
        # Opret forbindelse til database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print(f"📖 Læser SQL fil: {sql_file}")
        
        # Læs og udfør SQL kommandoer
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Split i individuelle statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
        
        print(f"🔧 Udfører {len(statements)} SQL statements...")
        
        for i, statement in enumerate(statements):
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                    print(f"  ✅ Statement {i+1} udført")
                except Exception as e:
                    print(f"  ⚠️  Statement {i+1} fejlede: {e}")
        
        # Commit ændringer
        conn.commit()
        print(f"💾 Ændringer gemt til database")
        
        # Verificer import
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📊 Database indeholder nu {len(tables)} tabeller:")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            print(f"  - {table_name}: {count} rækker")
        
        conn.close()
        print(f"\n✅ Import færdig!")
        return True
        
    except Exception as e:
        print(f"❌ Fejl under import: {e}")
        return False

def copy_database_file(backup_file, db_path='calorie_tracker.db'):
    """Kopierer database fil direkte"""
    
    if not os.path.exists(backup_file):
        print(f"❌ Backup fil ikke fundet: {backup_file}")
        return False
    
    try:
        import shutil
        
        # Kopier fil
        shutil.copy2(backup_file, db_path)
        
        print(f"✅ Database kopieret: {backup_file} -> {db_path}")
        
        # Verificer
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📊 Database indeholder {len(tables)} tabeller:")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            print(f"  - {table_name}: {count} rækker")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Fejl under kopiering: {e}")
        return False

def main():
    """Hovedfunktion"""
    
    print("=== Database Import ===")
    print(f"Tid: {datetime.now()}")
    
    # Tjek om der er argumenter
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        
        if file_path.endswith('.sql'):
            print(f"📄 Importerer SQL fil: {file_path}")
            success = import_sql_file(file_path)
        elif file_path.endswith('.db'):
            print(f"📁 Kopierer database fil: {file_path}")
            success = copy_database_file(file_path)
        else:
            print(f"❌ Ukendt filtype: {file_path}")
            success = False
    else:
        print("❌ Ingen fil angivet")
        print("Brug: python import_database.py <fil.sql eller fil.db>")
        success = False
    
    if success:
        print(f"\n🎉 Database import færdig!")
        print(f"🚀 Din applikation kan nu bruge den importerede data")
    else:
        print(f"\n💥 Import fejlede")
        sys.exit(1)

if __name__ == "__main__":
    main()
