#!/usr/bin/env python3
"""
Fix database export
"""
import sqlite3
import os
from datetime import datetime

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
            
            for table_tuple in tables:
                table_name = table_tuple[0]  # Fix: table_tuple er en tuple
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
    export_to_sql()

