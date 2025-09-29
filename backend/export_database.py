#!/usr/bin/env python3
"""
Script til at eksportere database indhold til SQL filer
"""
import sqlite3
import os
from datetime import datetime

def export_database():
    """Eksporterer database til SQL filer"""
    
    # Database path
    db_path = 'instance/calorie_tracker.db'
    
    if not os.path.exists(db_path):
        print(f"Database ikke fundet: {db_path}")
        return
    
    # Opret output mappe
    output_dir = 'database_export'
    os.makedirs(output_dir, exist_ok=True)
    
    # Timestamp for filnavne
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Hent alle tabeller
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"Eksporterer {len(tables)} tabeller...")
        
        # Eksporter hver tabel
        for table_name, in tables:
            table_name = table_name[0]
            
            # Skip alembic_version tabel
            if table_name == 'alembic_version':
                continue
                
            print(f"Eksporterer tabel: {table_name}")
            
            # Hent tabel struktur
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            
            # Hent alle data
            cursor.execute(f"SELECT * FROM {table_name};")
            rows = cursor.fetchall()
            
            # Opret SQL fil
            sql_file = os.path.join(output_dir, f"{table_name}_{timestamp}.sql")
            
            with open(sql_file, 'w', encoding='utf-8') as f:
                f.write(f"-- Eksport af tabel: {table_name}\n")
                f.write(f"-- Eksporteret: {datetime.now()}\n")
                f.write(f"-- Antal rækker: {len(rows)}\n\n")
                
                if rows:
                    # Opret INSERT statements
                    column_names = [col[1] for col in columns]
                    placeholders = ', '.join(['?' for _ in column_names])
                    
                    f.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES\n")
                    
                    for i, row in enumerate(rows):
                        # Format værdier korrekt
                        formatted_values = []
                        for value in row:
                            if value is None:
                                formatted_values.append('NULL')
                            elif isinstance(value, str):
                                # Escape single quotes
                                escaped_value = value.replace("'", "''")
                                formatted_values.append(f"'{escaped_value}'")
                            else:
                                formatted_values.append(str(value))
                        
                        values_str = f"({', '.join(formatted_values)})"
                        
                        if i == len(rows) - 1:
                            f.write(f"  {values_str};\n")
                        else:
                            f.write(f"  {values_str},\n")
                else:
                    f.write(f"-- Ingen data i tabel {table_name}\n")
            
            print(f"  -> {len(rows)} rækker eksporteret til {sql_file}")
        
        # Opret også en komplet dump fil
        dump_file = os.path.join(output_dir, f"complete_dump_{timestamp}.sql")
        print(f"\nOpretter komplet dump: {dump_file}")
        
        with open(dump_file, 'w', encoding='utf-8') as f:
            f.write("-- Komplet database dump\n")
            f.write(f"-- Eksporteret: {datetime.now()}\n\n")
            
            for table_name, in tables:
                table_name = table_name[0]
                
                if table_name == 'alembic_version':
                    continue
                    
                f.write(f"\n-- Tabel: {table_name}\n")
                
                # Hent tabel struktur
                cursor.execute(f"PRAGMA table_info({table_name});")
                columns = cursor.fetchall()
                
                # Hent alle data
                cursor.execute(f"SELECT * FROM {table_name};")
                rows = cursor.fetchall()
                
                if rows:
                    column_names = [col[1] for col in columns]
                    placeholders = ', '.join(['?' for _ in column_names])
                    
                    f.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES\n")
                    
                    for i, row in enumerate(rows):
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
        
        print(f"\n✅ Database eksport færdig!")
        print(f"📁 Output mappe: {output_dir}")
        print(f"📄 Komplet dump: {dump_file}")
        
    except Exception as e:
        print(f"❌ Fejl under eksport: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    export_database()

