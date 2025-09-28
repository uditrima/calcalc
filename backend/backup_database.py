#!/usr/bin/env python3
"""
Database backup script
"""
import sqlite3
import shutil
import os
from datetime import datetime

def backup_database():
    """Backup database fil direkte"""
    
    db_path = 'instance/calorie_tracker.db'
    
    if not os.path.exists(db_path):
        print(f"Database ikke fundet: {db_path}")
        return
    
    # Opret backup
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"calorie_tracker_backup_{timestamp}.db"
    
    try:
        shutil.copy2(db_path, backup_path)
        print(f"✅ Database backup oprettet: {backup_path}")
        
        # Vis filstørrelse
        size = os.path.getsize(backup_path)
        print(f"📁 Størrelse: {size:,} bytes")
        
        return backup_path
        
    except Exception as e:
        print(f"❌ Fejl under backup: {e}")
        return None

def export_to_sql():
    """Eksporter til SQL format"""
    
    db_path = 'instance/calorie_tracker.db'
    
    if not os.path.exists(db_path):
        print(f"Database ikke fundet: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Hent alle tabeller
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"Fundet {len(tables)} tabeller:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Opret SQL fil
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        sql_file = f"database_export_{timestamp}.sql"
        
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write("-- Database eksport\n")
            f.write(f"-- Eksporteret: {datetime.now()}\n\n")
            
            for table_name, in tables:
                table_name = table_name[0]
                print(f"Eksporterer: {table_name}")
                
                # Hent data
                cursor.execute(f"SELECT * FROM {table_name};")
                rows = cursor.fetchall()
                
                if rows:
                    # Hent kolonne navne
                    cursor.execute(f"PRAGMA table_info({table_name});")
                    columns = cursor.fetchall()
                    column_names = [col[1] for col in columns]
                    
                    f.write(f"\n-- Tabel: {table_name}\n")
                    f.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES\n")
                    
                    for i, row in enumerate(rows):
                        # Format værdier
                        formatted_values = []
                        for value in row:
                            if value is None:
                                formatted_values.append('NULL')
                            elif isinstance(value, str):
                                escaped_value = value.replace("'", "''")
                                formatted_values.append(f"'{escaped_value}'")
                            else:
                                formatted_values.append(str(value))
                        
                        values_str = f"({', '.join(formatted_values)})"
                        
                        if i == len(rows) - 1:
                            f.write(f"  {values_str};\n")
                        else:
                            f.write(f"  {values_str},\n")
                    
                    print(f"  -> {len(rows)} rækker")
        
        print(f"\n✅ SQL eksport færdig: {sql_file}")
        return sql_file
        
    except Exception as e:
        print(f"❌ Fejl: {e}")
        return None
    finally:
        conn.close()

if __name__ == "__main__":
    print("=== Database Backup ===")
    backup_path = backup_database()
    
    print("\n=== SQL Export ===")
    sql_path = export_to_sql()
    
    print(f"\n📋 Resultat:")
    if backup_path:
        print(f"  - Database backup: {backup_path}")
    if sql_path:
        print(f"  - SQL eksport: {sql_path}")
    
    print(f"\n🚀 Næste skridt:")
    print(f"  1. Upload filerne til din server")
    print(f"  2. På serveren: sqlite3 calorie_tracker.db < {sql_path}")
    print(f"  3. Eller kopier {backup_path} til serveren")
