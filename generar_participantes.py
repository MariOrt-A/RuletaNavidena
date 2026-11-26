import random
import re
import uuid
from supabase import create_client, Client

# 1. Configura tus credenciales de Supabase (Settings > API)
SUPABASE_URL = "https://TU_PROYECTO.supabase.co"
# Usa la service_role key (solo en tu PC local, nunca en GitHub) para saltar RLS al insertar pruebas
SUPABASE_SERVICE_KEY = "TU_SERVICE_ROLE_KEY"

COLORES_SKIN = [
    "#e11d48",  # Rojo Carmesí
    "#16a34a",  # Verde Duende
    "#f59e0b",  # Dorado
    "#0284c7",  # Azul Hielo
    "#9333ea",  # Uva Navideña
    "#f8fafc",  # Muñeco de Nieve
]

ACCESORIOS_SKIN = ["santa", "reno", "corona", "bufanda", "ninguno"]
EXPRESIONES_SKIN = ["feliz", "cool", "tierno"]


def limpiar_codigo(valor: str) -> str:
    return re.sub(r"[\s\-]", "", str(valor or "").strip()).upper()


def generar_datos_prueba(total: int = 30, limpiar_antes: bool = True):
    print("[*] Conectando a Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    if limpiar_antes:
        print("[*] Limpiando tabla 'participantes'...")
        supabase.table("participantes").delete().neq("id", 0).execute()

    # Obtener empleados reales y válidos desde padron_empleados
    resp_padron = (
        supabase.table("padron_empleados")
        .select("numero_empleado, nombre, valido")
        .eq("valido", "1")
        .limit(max(total * 2, 100))
        .execute()
    )

    empleados_validos = resp_padron.data or []
    if not empleados_validos:
        print("[!] No se encontraron empleados con valido = '1' en padron_empleados.")
        return

    seleccionados = random.sample(empleados_validos, min(total, len(empleados_validos)))
    print(f"[*] Generando {len(seleccionados)} participantes de prueba desde el padrón oficial...")

    registros = []
    for idx, emp in enumerate(seleccionados, start=1):
        num_emp = limpiar_codigo(emp["numero_empleado"])
        nombre_oficial = str(emp["nombre"]).strip()
        folio_brazalete = f"RC{idx:04d}"

        skin_dict = {
            "color": random.choice(COLORES_SKIN),
            "accesorio": random.choice(ACCESORIOS_SKIN),
            "expresion": random.choice(EXPRESIONES_SKIN),
        }

        registros.append({
            "nombre": nombre_oficial,
            "nombre_normalizado": nombre_oficial.upper(),
            "numero_empleado": num_emp,
            "folio_brazalete": folio_brazalete,
            "device_hash": f"test_{uuid.uuid4().hex[:12]}",
            "skin": skin_dict,
            "es_valido": True,
            "ganador": False,
            "descartado": False,
        })

    # Inserción en lotes hacia Supabase
    supabase.table("participantes").insert(registros).execute()

    print(f"\n[OK] Se insertaron {len(registros)} participantes de prueba en Supabase.")
    print("[i] Ejemplo de registros listos en la urna:")
    for r in registros[:5]:
        print(f"    - Emp: {r['numero_empleado']} | Folio: {r['folio_brazalete']} | {r['nombre']}")


if __name__ == "__main__":
    generar_datos_prueba(total=25, limpiar_antes=True)