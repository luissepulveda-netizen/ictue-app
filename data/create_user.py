#!/usr/bin/env python3
"""
Script para crear usuarios en la BD SQLite de ICTUE
Uso: python create_user.py
"""

import sqlite3
import getpass
import bcrypt
import os

DB_PATH = '../ictue.db'

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
        print("🔌 Conectando a BD SQLite...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Verificar si email ya existe
        cursor.execute("SELECT id FROM usuarios WHERE email = ?", (email,))
        if cursor.fetchone():
            print(f"❌ El email {email} ya existe")
            cursor.close()
            conn.close()
            return

        # Insertar usuario
        cursor.execute(
            """INSERT INTO usuarios (email, nombre, password_hash, rol)
               VALUES (?, ?, ?, ?)""",
            (email, nombre, password_hash, rol)
        )

        conn.commit()
        usuario_id = cursor.lastrowid

        print("\n" + "="*50)
        print("✅ ¡Usuario creado exitosamente!")
        print("="*50)
        print(f"\n📊 Detalles:")
        print(f"   ID: {usuario_id}")
        print(f"   Email: {email}")
        print(f"   Nombre: {nombre}")
        print(f"   Rol: {rol}")
        print(f"\n🔐 Credenciales de Login:")
        print(f"   Email: {email}")
        print(f"   Contraseña: (la que acabas de crear)")
        print("\n💡 Anota estas credenciales en un lugar seguro\n")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")
        return

def list_users():
    """Lista todos los usuarios"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT id, email, nombre, rol FROM usuarios ORDER BY id DESC")
        usuarios = cursor.fetchall()

        if not usuarios:
            print("❌ No hay usuarios")
            return

        print("\n" + "="*70)
        print("  📋 USUARIOS REGISTRADOS")
        print("="*70)
        print(f"{'ID':<5} {'Email':<25} {'Nombre':<20} {'Rol':<10}")
        print("-"*70)

        for u in usuarios:
            print(f"{u[0]:<5} {u[1]:<25} {u[2]:<20} {u[3]:<10}")

        print("="*70 + "\n")

        cursor.close()
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
