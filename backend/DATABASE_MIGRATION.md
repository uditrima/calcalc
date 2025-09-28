# Database Migration Guide

Denne guide viser hvordan du overfører din lokale database til serveren.

## 📁 Filer der er oprettet

- `calorie_tracker_backup_20250928_135824.db` - Komplet database backup (163KB)
- `database_export_20250928_135846.sql` - SQL eksport med alle data (67KB)
- `import_database.py` - Script til at importere data på serveren

## 🚀 Metode 1: Kopier Database Fil (Anbefalet)

### På din lokale maskine:
```bash
# Upload database backup til serveren
scp calorie_tracker_backup_20250928_135824.db user@server:/path/to/backend/
```

### På serveren:
```bash
# Kopier backup til den rigtige placering
cp calorie_tracker_backup_20250928_135824.db instance/calorie_tracker.db

# Eller brug import scriptet
python import_database.py calorie_tracker_backup_20250928_135824.db
```

## 🚀 Metode 2: SQL Import

### På din lokale maskine:
```bash
# Upload SQL fil til serveren
scp database_export_20250928_135846.sql user@server:/path/to/backend/
```

### På serveren:
```bash
# Importer SQL data
python import_database.py database_export_20250928_135846.sql

# Eller direkte med sqlite3
sqlite3 instance/calorie_tracker.db < database_export_20250928_135846.sql
```

## 📊 Data der bliver overført

- **foods**: 303 fødevare
- **diary_entries**: 19 dagbog indgange
- **nutrients**: 6 næringsstoffer
- **user_goals**: 1 bruger mål
- **exercises**: 1 øvelse
- **weights**: 0 vægt indgange
- **user_settings**: 0 bruger indstillinger

## ✅ Verifikation

Efter import, tjek at data er korrekt:

```bash
# Tjek database indhold
python check_db.py

# Eller direkte med sqlite3
sqlite3 instance/calorie_tracker.db "SELECT COUNT(*) FROM foods;"
sqlite3 instance/calorie_tracker.db "SELECT COUNT(*) FROM diary_entries;"
```

## 🔧 Fejlfinding

Hvis der opstår problemer:

1. **Database locked**: Sørg for at Flask appen er stoppet
2. **Permission denied**: Tjek fil rettigheder på serveren
3. **Import fejler**: Brug database backup i stedet for SQL

## 📝 Noter

- Database backup er den sikreste metode
- SQL import giver mere kontrol over processen
- Sørg for at backup din server database før import
- Test altid på en test server først

## 🎯 Næste skridt

1. Upload filerne til din server
2. Kør import scriptet
3. Test at applikationen fungerer
4. Verificer at alle data er tilgængelige
