import pyodbc
import random
import re
import uuid
import json
from unidecode import unidecode

# 1. Configuración de conexión (Ajusta tus credenciales o usa Trusted_Connection)
CONNECTION_STRING = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"  # o localhost\SQLEXPRESS
    "DATABASE=RifaDB;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

# 2. Catálogo de nombres y apellidos
NOMBRES = [
    "Juan", "Carlos", "Luis", "José", "Miguel", "Jesús", "Alejandro", "Manuel", 
    "Francisco", "David", "Jorge", "Pedro", "Fernando", "Ricardo", "Eduardo", 
    "Javier", "Roberto", "Daniel", "Mario", "Ángel", "Raúl", "Arturo", "Marco", 
    "Rodrigo", "Gabriel", "Hugo", "Salvador", "Ignacio", "Alfonso", "Guillermo",
    "María", "Guadalupe", "Ana", "Carmen", "Rosa", "Patricia", "Lucía", "Adriana", 
    "Sofía", "Teresa", "Alejandra", "Verónica", "Gabriela", "Martha", "Elizabeth", 
    "Claudia", "Laura", "Daniela", "Brenda", "Paola", "Mariana", "Fernanda", 
    "Andrea", "Diana", "Karla", "Jessica", "Monica", "Silvia", "Erika", "Valeria"
]

APELLIDOS = [
    "Hernández", "García", "Martínez", "López", "González", "Pérez", "Rodríguez", 
    "Sánchez", "Ramírez", "Cruz", "Flores", "Gómez", "Morales", "Vázquez", "Jiménez", 
    "Reyes", "Díaz", "Torres", "Gutiérrez", "Ruiz", "Mendoza", "Aguilar", "Ortiz", 
    "Moreno", "Castillo", "Romero", "Álvarez", "Méndez", "Chávez", "Rivera", "Juárez", 
    "Domínguez", "Herrera", "Medina", "Castro", "Vargas", "Guzmán", "Velázquez", 
    "Ramos", "Salazar", "Rojas", "Ortega", "Guerrero", "Estrada", "Bautista", "Cortés", 
    "Soto", "Alvarado", "Espinoza", "Lara", "Avila", "Rios", "Silva", "Delgado"
]

# 3. Catálogos para generación de Skins Pixel Art
COLORES_SKIN = [
    "#e11d48",  # Rojo Carmesí
    "#16a34a",  # Verde Duende
    "#f59e0b",  # Dorado
    "#0284c7",  # Azul Hielo
    "#9333ea",  # Uva Navideña
    "#f8fafc"   # Muñeco de Nieve
]

ACCESORIOS_SKIN = ["santa", "reno", "corona", "bufanda", "ninguno"]
EXPRESIONES_SKIN = ["feliz", "cool", "tierno"]

LEET_MAP = str.maketrans({'0': 'O', '1': 'I', '3': 'E', '4': 'A', '5': 'S', '7': 'T', '8': 'B'})

def normalizar_para_comparacion(nombre: str) -> str:
    texto = unidecode(nombre).upper()
    texto = texto.translate(LEET_MAP)
    texto = re.sub(r'[^A-Z\s]', '', texto)
    palabras = sorted(texto.split())
    return " ".join(palabras)

def normalizar_fonetico(nombre: str) -> str:
    texto = normalizar_para_comparacion(nombre)
    texto = texto.replace('H', '')
    texto = texto.replace('V', 'B')
    texto = texto.replace('Z', 'S').replace('C', 'S')
    texto = texto.replace('LL', 'Y')
    texto = texto.replace('J', 'G')
    texto = texto.replace('K', 'Q')
    texto = re.sub(r'(.)\1+', r'\1', texto)
    return texto

def reiniciar_tabla(cursor, conn):
    """Vacía la tabla y reinicia el contador autoincremental (IDENTITY) a 0/1"""
    try:
        cursor.execute("TRUNCATE TABLE Participantes")
        conn.commit()
    except pyodbc.Error:
        cursor.execute("DELETE FROM Participantes")
        cursor.execute("DBCC CHECKIDENT ('Participantes', RESEED, 0)")
        conn.commit()
    print("[+] Base de datos vaciada y contador autoincremental reiniciado a 0.")

def generar_datos_prueba(total=800):
    print("[*] Conectando a la base de datos SQL Server...")
    conn = pyodbc.connect(CONNECTION_STRING)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Participantes")
    conteo_actual = cursor.fetchone()[0]

    if conteo_actual > 0:
        print(f"[i] La tabla contiene actualmente {conteo_actual} registros.")
        opcion = input("¿Deseas reiniciar la tabla y comenzar los IDs desde cero? (s/n): ").strip().lower()
        if opcion == 's':
            reiniciar_tabla(cursor, conn)
    else:
        cursor.execute("DBCC CHECKIDENT ('Participantes', RESEED, 0)")
        conn.commit()

    print(f"[*] Generando {total} participantes con skins personalizadas y números de empleado...")

    registros = []
    empleados_generados = set()

    for _ in range(total):
        # 1. Nombre completo
        if random.random() > 0.4:
            nombre = f"{random.choice(NOMBRES)} {random.choice(NOMBRES)}"
        else:
            nombre = random.choice(NOMBRES)

        apellido1 = random.choice(APELLIDOS)
        apellido2 = random.choice(APELLIDOS)
        nombre_completo = f"{nombre} {apellido1} {apellido2}"

        # 2. Número de empleado numérico único (8 a 10 dígitos)
        while True:
            longitud = random.choice([8, 9, 10])
            primer_digito = str(random.randint(1, 9))
            resto_digitos = "".join([str(random.randint(0, 9)) for _ in range(longitud - 1)])
            num_empleado = primer_digito + resto_digitos

            if num_empleado not in empleados_generados:
                empleados_generados.add(num_empleado)
                break

        # 3. Metadatos simulados
        device_hash = uuid.uuid4().hex[:16]
        ip_simulada = f"192.168.1.{random.randint(10, 250)}"
        norm = normalizar_para_comparacion(nombre_completo)
        fon = normalizar_fonetico(nombre_completo)

        # 4. Configuración aleatoria de Skin en formato JSON
        skin_dict = {
            "color": random.choice(COLORES_SKIN),
            "accesorio": random.choice(ACCESORIOS_SKIN),
            "expresion": random.choice(EXPRESIONES_SKIN)
        }
        skin_json = json.dumps(skin_dict)

        registros.append((
            nombre_completo,
            norm,
            num_empleado,
            device_hash,
            ip_simulada,
            fon,
            1,          # EsValido
            None,       # MotivoDescarte
            0,          # YaGano
            skin_json   # SkinConfig
        ))

    # Inserción masiva optimizada
    print("[*] Guardando registros en SQL Server...")
    cursor.fast_executemany = True

    sql_insert = """
        INSERT INTO Participantes 
        (NombreOriginal, NombreNormalizado, NumeroEmpleado, DeviceHash, IPAddress, CodigoFonetico, EsValido, MotivoDescarte, YaGano, SkinConfig)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    cursor.executemany(sql_insert, registros)
    conn.commit()

    cursor.execute("SELECT MIN(Id), MAX(Id), COUNT(*) FROM Participantes WHERE EsValido = 1 AND YaGano = 0")
    min_id, max_id, total_db = cursor.fetchone()

    cursor.close()
    conn.close()

    print(f"\n[OK] Inserción completada con éxito.")
    print(f"[i] Rango de IDs generados: {min_id} a {max_id}")
    print(f"[i] Total de participantes listos con skins en la urna: {total_db}")

if __name__ == "__main__":
    generar_datos_prueba(5)