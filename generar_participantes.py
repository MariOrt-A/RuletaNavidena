import random
import re
import uuid
from urllib.parse import urlparse
from supabase import create_client, Client

# 1. Configura tus credenciales de Supabase (Settings > API)
SUPABASE_URL = "https://wktbivtzoujhhqocpulz.supabase.co/rest/v1/"
# Usa la service_role key (solo en tu PC local, nunca en GitHub) para saltar RLS al insertar pruebas
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGJpdnR6b3VqaGhxb2NwdWx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTQ3OTQwNywiZXhwIjoyMTExMDU1NDA3fQ.kxoV0jUUD3Jh1_qdOqQYjXrnHNnk3ilRwA5WdrfQM6c"

# Normaliza la URL automáticamente por si tiene "/" o rutas extra al final
_parsed = urlparse(SUPABASE_URL.strip())
_URL_LIMPIA = f"{_parsed.scheme}://{_parsed.netloc}" if _parsed.scheme else SUPABASE_URL.strip().rstrip("/")

COLORES_SKIN = ["#e11d48", "#16a34a", "#f59e0b", "#0284c7", "#9333ea", "#f8fafc"]
ACCESORIOS_SKIN = ["santa", "reno", "corona", "bufanda", "ninguno"]
EXPRESIONES_SKIN = ["feliz", "cool", "tierno"]


def limpiar_codigo(valor: str) -> str:
    return re.sub(r"[\s\-]", "", str(valor or "").strip()).upper()


def generar_datos_prueba(total: int = 300, limpiar_antes: bool = True):
    print(f"[*] Conectando a {_URL_LIMPIA}...")
    supabase: Client = create_client(_URL_LIMPIA, SUPABASE_SERVICE_KEY.strip())

    if limpiar_antes:
        print("[*] Limpiando tabla 'participantes'...")
        # Obtenemos los IDs existentes y los borramos por lista para evitar errores PGRST125 de filtros
        existentes = supabase.table("participantes").select("id").execute()
        ids = [fila["id"] for fila in (existentes.data or [])]
        if ids:
            supabase.table("participantes").delete().in_("id", ids).execute()

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

        registros.append({
            "nombre": nombre_oficial,
            "nombre_normalizado": nombre_oficial.upper(),
            "numero_empleado": num_emp,
            "folio_brazalete": folio_brazalete,
            "fingerprint": f"test_{uuid.uuid4().hex[:12]}",
            "skin": {
                "color": random.choice(COLORES_SKIN),
                "accesorio": random.choice(ACCESORIOS_SKIN),
                "expresion": random.choice(EXPRESIONES_SKIN),
            },
            "es_valido": True,
            "ganador": False,
            "descartado": False,
        })

    supabase.table("participantes").insert(registros).execute()

    print(f"\n[OK] Se insertaron {len(registros)} participantes de prueba en Supabase.")
    for r in registros[:5]:
        print(f"    - Emp: {r['numero_empleado']} | Folio: {r['folio_brazalete']} | {r['nombre']}")


if __name__ == "__main__":
    generar_datos_prueba(total=100, limpiar_antes=True)