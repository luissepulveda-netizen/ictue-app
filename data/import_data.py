#!/usr/bin/env python3
"""
Script para importar datos históricos de Excel a PostgreSQL
Uso: python import_data.py
"""

import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('../backend/.env')

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost/ictue_db')

def read_excel_data(filepath):
    """Lee datos de Excel"""
    print(f"📖 Leyendo {filepath}...")
    excel_file = pd.ExcelFile(filepath)

    all_data = []
    for sheet_name in excel_file.sheet_names:
        df = pd.read_excel(filepath, sheet_name=sheet_name)
        all_data.append(df)

    return pd.concat(all_data, ignore_index=True)

def map_reunion_type(tipo_str, dia_str, hora_str, seccion):
    """Mapea tipo de reunión a ID de BD"""
    tipo = str(tipo_str).strip().lower() if pd.notna(tipo_str) else 'culto'
    dia = str(dia_str).strip().upper() if pd.notna(dia_str) else 'DOM'
    hora = str(hora_str).strip() if pd.notna(hora_str) else '11:00:00'

    # Mapeo simplificado
    if 'culto' in tipo or pd.isna(tipo_str):
        if dia == 'MAR':
            return 1  # Martes Culto
        elif dia == 'JUE':
            return 2  # Jueves Culto
        elif dia == 'DOM':
            return 3 if '11' in hora else 4  # Domingo 11:00 o 18:30
    elif 'kids' in tipo.lower():
        return 5 if '11' in hora else 6
    elif 'teens' in tipo.lower():
        return 7 if '11' in hora else 8

    return 1  # Default

def insert_data_to_db(df):
    """Inserta datos en la BD"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    try:
        rows = []
        skipped = 0

        for _, row in df.iterrows():
            try:
                fecha = pd.to_datetime(row['Fecha']).date() if pd.notna(row['Fecha']) else None
                asistentes = int(row['Asistentes']) if pd.notna(row['Asistentes']) and str(row['Asistentes']).isdigit() else 0

                if not fecha or asistentes == 0:
                    skipped += 1
                    continue

                reunion_id = map_reunion_type(
                    row.get('Tipo'),
                    row.get('Día'),
                    row.get('HORA'),
                    row.get('Sección')
                )

                expositor = str(row.get('Expositor', '')).strip() if pd.notna(row.get('Expositor')) else None
                observaciones = str(row.get('Observaciones', '')).strip() if pd.notna(row.get('Observaciones')) else None

                rows.append((
                    reunion_id,
                    fecha,
                    asistentes,
                    expositor,
                    observaciones,
                    None  # registrado_por
                ))
            except Exception as e:
                skipped += 1
                continue

        if rows:
            print(f"💾 Insertando {len(rows)} registros...")
            execute_values(
                cur,
                "INSERT INTO asistencia (reunion_id, fecha, num_asistentes, expositor, observaciones, registrado_por) VALUES %s",
                rows
            )
            conn.commit()
            print(f"✅ {len(rows)} registros insertados exitosamente")

        if skipped > 0:
            print(f"⚠️ {skipped} registros omitidos (datos incompletos)")

    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def main():
    print("🏰 ICTUE - Importador de Datos Históricos")
    print("=" * 50)

    # Ruta del archivo Excel
    excel_path = os.path.join(
        os.path.dirname(__file__),
        '../Ingreso_Datos/Conteo ICTUE 2026-01.xlsx'
    )

    if not os.path.exists(excel_path):
        print(f"❌ Archivo no encontrado: {excel_path}")
        return

    try:
        df = read_excel_data(excel_path)
        print(f"📊 {len(df)} registros leídos")

        # Normalizar nombres de columnas
        df.columns = [col.strip() for col in df.columns]

        insert_data_to_db(df)
        print("✨ ¡Importación completada!")

    except Exception as e:
        print(f"❌ Error general: {e}")

if __name__ == '__main__':
    main()
