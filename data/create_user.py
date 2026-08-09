#!/usr/bin/env python3
"""
Script para crear usuarios en la BD de ICTUE
Uso: python create_user.py
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import getpass
import os
from dotenv import load_dotenv

# Intentar importar bcrypt, si no está disponible, decirle al usuario
try:
    import bcrypt
except ImportError:
    print("❌ Instala bcrypt primero:")
    print("   pip install bcrypt")
    exit(1)

# Cargar variables de entorno
load_dotenv('../backend/.env')

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ DATABASE_URL no está configurada")
    print("   Asegúrate de tener .env en la carpeta backend")
    exit(1)

def hash_password(password: str) -> str:
    """Genera hash bcrypt de una contraseña"""
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_user():
    """Crea un nuevo usuario en la BD"""
    print("\n" + "="*50)
    print("  🏰 ICTUE - Creador de Usuarios")
    print("="*50 + "\n")

    # Pedir datos
    email = input("📧 Email (ej: pastor@ictue.cl): ").strip()
    nombre = input("👤 Nombre completo: ").strip()

    # Verificar email válido
    if '@' not in email:
        print("❌ Email inválido")
        return

    # Pedir contraseña
    while True:
        password = getpass.getpass("🔑 Contraseña: ")
        password_confirm = getpass.getpass("🔑 Confirmar contraseña: ")

        if password != password_confirm:
            print("❌ Las contraseñas no coinciden")
            continue

        if len(password) < 6:
            print("❌ Contraseña debe tener al menos 6 caracteres")
            continue

        break

    # Rol
    print("\n¿Qué rol?")
    print("1. Pastor")
    print("2. Líder")
    rol_choice = input("Selecciona (1 o 2): ").strip()
    rol = 'pastor' if rol_choice == '1' else 'lider'

    # Hash password
    print("\n⏳ Generando hash de contraseña...")
    password_hash = hash_password(password)

    # Conectar a BD
    try:
        print("🔌 Conectando a BD...")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Verificar si email ya existe
        cur.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
        if cur.fetchone():
            print(f"❌ El email {email} ya existe")
            cur.close()
            conn.close()
            return

        # Insertar usuario
        cur.execute(
            """INSERT INTO usuarios (email, nombre, password_hash, rol)
               VALUES (%s, %s, %s, %s)
               RETURNING id, email, nombre, rol""",
            (email, nombre, password_hash, rol)
        )

        usuario = cur.fetchone()
        conn.commit()

        print("\n" + "="*50)
        print("✅ ¡Usuario creado exitosamente!")
        print("="*50)
        print(f"\n📊 Detalles:")
        print(f"   ID: {usuario['id']}")
        print(f"   Email: {usuario['email']}")
        print(f"   Nombre: {usuario['nombre']}")
        print(f"   Rol: {usuario['rol']}")
        print(f"\n🔐 Credenciales de Login:")
        print(f"   Email: {email}")
        print(f"   Contraseña: (la que acabas de crear)")
        print("\n💡 Anota estas credenciales en un lugar seguro\n")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")
        return

def list_users():
    """Lista todos los usuarios"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT id, email, nombre, rol, created_at FROM usuarios ORDER BY created_at DESC")
        usuarios = cur.fetchall()

        if not usuarios:
            print("❌ No hay usuarios")
            return

        print("\n" + "="*70)
        print("  📋 USUARIOS REGISTRADOS")
        print("="*70)
        print(f"{'ID':<5} {'Email':<25} {'Nombre':<20} {'Rol':<10}")
        print("-"*70)

        for u in usuarios:
            print(f"{u['id']:<5} {u['email']:<25} {u['nombre']:<20} {u['rol']:<10}")

        print("="*70 + "\n")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    while True:
        print("\n¿Qué deseas hacer?")
        print("1. Crear nuevo usuario")
        print("2. Listar usuarios")
        print("3. Salir")

        choice = input("\nSelecciona (1, 2 o 3): ").strip()

        if choice == '1':
            create_user()
        elif choice == '2':
            list_users()
        elif choice == '3':
            print("\n👋 ¡Hasta luego!")
            break
        else:
            print("❌ Opción inválida")

if __name__ == '__main__':
    main()
