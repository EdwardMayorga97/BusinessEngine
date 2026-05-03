# dev/ — Herramientas de Desarrollo

> Este directorio NO se despliega en producción. Contiene solo herramientas para desarrollar y probar el sistema.

## Estructura

```
dev/
├── scripts/     ← scripts de setup, generación y utilidad
├── seeds/       ← datos de prueba para desarrollo local
└── tests/
    ├── unit/        ← tests unitarios (sin dependencias externas)
    ├── integration/ ← tests con DB y Redis reales
    └── e2e/         ← tests end-to-end del flujo completo
```

## Comandos

```bash
# Setup inicial del entorno de desarrollo
bash dev/scripts/setup.sh

# Cargar datos de prueba
python dev/scripts/seed_db.py

# Generar scaffold de un agente nuevo
python dev/scripts/generate_agent.py --name mi_agente

# Tests
pytest dev/tests/unit/
pytest dev/tests/integration/
pytest dev/tests/e2e/
```
