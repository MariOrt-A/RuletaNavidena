from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pyodbc
import re
import secrets
from rapidfuzz import fuzz
from unidecode import unidecode
from typing import Optional, List

app = FastAPI(title="Sistema de Rifa Anti-Trampas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONNECTION_STRING = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=RifaDB;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

def get_db_connection():
    try:
        return pyodbc.connect(CONNECTION_STRING)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión a BD: {str(e)}")

# Modelo único con SkinConfig
class RegistroInput(BaseModel):
    nombre: str = Field(..., min_length=4, max_length=150)
    numero_empleado: str = Field(..., min_length=2, max_length=30)
    device_hash: str = Field(..., min_length=8, max_length=100)
    skin_config: Optional[str] = "{}"

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

def normalizar_empleado(num_emp: str) -> str:
    return re.sub(r'[\s\-]', '', num_emp).upper()

@app.post("/api/registro")
async def registrar_participante(datos: RegistroInput, request: Request):
    ip_cliente = request.client.host
    nombre_original = datos.nombre.strip()
    nombre_norm = normalizar_para_comparacion(nombre_original)
    codigo_fonetico = normalizar_fonetico(nombre_original)
    emp_limpio = normalizar_empleado(datos.numero_empleado)

    if len(nombre_norm.split()) < 2:
        raise HTTPException(status_code=400, detail="Por favor ingresa tu nombre completo (Nombre y Apellidos).")

    es_valido = True
    motivo_descarte = None

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT Id, NombreOriginal, NombreNormalizado, NumeroEmpleado, DeviceHash, CodigoFonetico 
            FROM Participantes 
            WHERE EsValido = 1
        """)
        existentes = cursor.fetchall()

        for reg in existentes:
            reg_id, reg_orig, reg_norm, reg_emp, reg_hash, reg_fon = reg

            if datos.device_hash == reg_hash:
                es_valido = False
                motivo_descarte = f"Dispositivo duplicado (Coincide con ID {reg_id}: {reg_orig})"
                break

            if emp_limpio and reg_emp and emp_limpio == normalizar_empleado(reg_emp):
                es_valido = False
                motivo_descarte = f"Número de empleado duplicado (Coincide con ID {reg_id}: {reg_orig})"
                break

            similitud_estandar = fuzz.token_set_ratio(nombre_norm, reg_norm)
            similitud_fonetica = fuzz.ratio(codigo_fonetico, reg_fon) if reg_fon else 0

            if similitud_estandar >= 85 or similitud_fonetica >= 88:
                es_valido = False
                motivo_descarte = (
                    f"Nombre muy similar ({max(similitud_estandar, similitud_fonetica):.1f}% con ID {reg_id}: {reg_orig})"
                )
                break

        # Inserción guardando SkinConfig
        cursor.execute("""
            INSERT INTO Participantes 
            (NombreOriginal, NombreNormalizado, NumeroEmpleado, DeviceHash, IPAddress, CodigoFonetico, EsValido, MotivoDescarte, SkinConfig, YaGano)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        """, (
            nombre_original,
            nombre_norm,
            emp_limpio,
            datos.device_hash,
            ip_cliente,
            codigo_fonetico,
            1 if es_valido else 0,
            motivo_descarte,
            datos.skin_config or "{}"
        ))
        conn.commit()

        return {
            "status": "success",
            "mensaje": "¡Registro completado con éxito! Mucha suerte en la rifa."
        }

    finally:
        cursor.close()
        conn.close()

@app.post("/api/sortear")
async def realizar_sorteo():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT Id, NombreOriginal, NumeroEmpleado, SkinConfig 
            FROM Participantes 
            WHERE EsValido = 1 AND YaGano = 0
        """)
        candidatos = cursor.fetchall()

        if not candidatos:
            raise HTTPException(status_code=404, detail="No hay participantes elegibles.")

        ganador_row = secrets.choice(candidatos)
        ganador_id = ganador_row[0]
        ganador_nombre = ganador_row[1]
        ganador_emp = ganador_row[2]
        ganador_skin = ganador_row[3] or "{}"

        cursor.execute("UPDATE Participantes SET YaGano = 1 WHERE Id = ?", (ganador_id,))
        conn.commit()

        otros = [
            {"id": r[0], "nombre": r[1], "numero_empleado": r[2], "skin": r[3] or "{}"}
            for r in candidatos if r[0] != ganador_id
        ]
        pool_urna = secrets.SystemRandom().sample(otros, min(60, len(otros)))

        return {
            "ganador": {
                "id": ganador_id,
                "nombre": ganador_nombre,
                "numero_empleado": ganador_emp,
                "skin": ganador_skin
            },
            "pool_urna": pool_urna,
            "total_restantes": len(candidatos) - 1
        }
    finally:
        cursor.close()
        conn.close()

@app.get("/api/participantes/activos")
async def obtener_participantes_activos():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT Id, NombreOriginal, NumeroEmpleado, SkinConfig 
            FROM Participantes 
            WHERE EsValido = 1 AND YaGano = 0
            ORDER BY Id DESC
        """)
        rows = cursor.fetchall()

        participantes = [
            {
                "id": r[0],
                "nombre": r[1],
                "numero_empleado": r[2],
                "skin": r[3] or "{}"
            }
            for r in rows
        ]

        return {
            "total": len(participantes),
            "participantes": participantes
        }
    except Exception as e:
        print(f"Error al obtener participantes: {e}")
        return {"total": 0, "participantes": []}
    finally:
        cursor.close()
        conn.close()