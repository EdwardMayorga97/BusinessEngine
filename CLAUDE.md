# CLAUDE.md — Guía completa para AI

> Este archivo es la fuente de verdad para cualquier agente AI que trabaje en este repositorio.

## Proyecto: BusinessEngine AI OS

Sistema operativo empresarial donde agentes de IA manejan todas las operaciones por voz y automatización. Multi-empresa, multi-modelo, auto-configurable y auto-mejorable.

---

## Estructura de carpetas

```
businessengine/
├── CLAUDE.md                  ← este archivo
├── README.md                  ← descripción del proyecto
├── .env.example               ← variables de entorno requeridas
├── .gitignore
│
├── docs/                      ← DOCUMENTACIÓN (no es código)
│   ├── architecture/          ← diseño del sistema
│   ├── agents/                ← guías de agentes
│   ├── api/                   ← referencia de endpoints
│   └── deployment/            ← guías de despliegue
│
├── dev/                       ← SOLO DESARROLLO (no va a producción)
│   ├── scripts/               ← scripts de setup y utilidad
│   ├── seeds/                 ← datos de prueba
│   └── tests/                 ← todos los tests
│
├── engine/                    ← EL SOFTWARE — BACKEND
│   ├── core/                  ← núcleo del sistema
│   │   ├── ai/                ← AI router (LiteLLM)
│   │   ├── orchestrator/      ← orquestador principal
│   │   ├── memory/            ← sistema de memoria (3 niveles)
│   │   ├── voice/             ← STT y TTS
│   │   ├── security/          ← auth, cifrado, audit
│   │   └── storage/           ← cliente MinIO
│   ├── agents/                ← sistema de agentes
│   │   ├── base/              ← clase base de todo agente
│   │   ├── catalog/           ← agentes pre-construidos
│   │   └── factory/           ← generador de agentes nuevos
│   ├── companies/             ← gestión multi-empresa
│   ├── integrations/          ← conectores externos
│   ├── db/                    ← capa de base de datos
│   ├── api/                   ← FastAPI: rutas y websocket
│   └── worker/                ← Celery: tareas en background
│
├── web/                       ← EL SOFTWARE — FRONTEND
│   └── src/
│       ├── components/
│       │   ├── dynamic/       ← componentes que la AI renderiza
│       │   └── voice/         ← interfaz de voz
│       └── hooks/
│
├── config/                    ← CONFIGURACIÓN GLOBAL
│   ├── models/                ← modelos AI disponibles
│   ├── agents/                ← configuración base de agentes
│   └── system.json            ← config global del sistema
│
├── infra/                     ← INFRAESTRUCTURA
│   ├── docker-compose.yml     ← desarrollo
│   ├── docker-compose.prod.yml← producción
│   └── scripts/               ← deploy y backup
│
└── storage/                   ← RUNTIME (gitignored)
    └── .gitkeep
```

---

## Reglas de arquitectura — NUNCA violarlas

1. **Todo estado en DB**: El estado nunca vive en archivos, solo en PostgreSQL o Redis.
2. **Aislamiento por empresa**: Cada empresa tiene schema propio en PostgreSQL. NUNCA mezclar datos entre empresas.
3. **Orquestador = único entry point**: Usuario → Orquestador → Agentes. Nunca hablar con agentes directamente.
4. **Agentes via job queue**: Los agentes se comunican SOLO via Redis/Celery. Nunca llamarlos directamente.
5. **Sin eliminación real**: Siempre `is_active = False`. Audit trail en toda acción.
6. **AI Router obligatorio**: Nunca importar `anthropic`, `openai`, `litellm` directamente en agentes. Usar siempre `engine.core.ai.router`.
7. **Modular**: Un agente roto no puede romper el sistema.
8. **Sin archivos de config por empresa**: La config de cada empresa vive en DB, no en archivos.

---

## Cómo usar el AI Router

```python
# CORRECTO
from engine.core.ai.router import ai_router
response = await ai_router.complete(prompt, model_hint="fast")    # rápido y barato
response = await ai_router.complete(prompt, model_hint="smart")   # razonamiento complejo
response = await ai_router.complete(prompt, model_hint="local")   # datos sensibles, gratis

# INCORRECTO — nunca hacer esto en agentes
import anthropic
import openai
import litellm
```

---

## Cómo crear un nuevo agente

1. Crear carpeta: `engine/agents/catalog/{nombre}/`
2. Crear `agent.py` heredando de `engine.agents.base.agent.BaseAgent`
3. Definir `skills.py` con las funciones que puede ejecutar
4. Crear `config.json` con personalidad, skills y autonomía
5. Registrar el nombre en `config/agents/defaults.json` → `base_agents`
6. El orquestador lo detecta automáticamente al reiniciar

---

## Cómo usar la memoria

```python
# Siempre via el manager, nunca directamente
from engine.core.memory.manager import memory_manager

await memory_manager.save(company_id, key, value, level="short")   # Redis 24h
await memory_manager.save(company_id, key, value, level="medium")  # PostgreSQL 90d
await memory_manager.save(company_id, key, value, level="long")    # pgvector permanente

result = await memory_manager.recall(company_id, query, level="long")
```

---

## Cómo agregar empresa nueva

El onboarding es por voz. El sistema ejecuta automáticamente:
1. Crea schema PostgreSQL para la empresa
2. Activa agentes base definidos en `config/agents/defaults.json`
3. Crea roles y permisos por defecto
4. Inicia monitoreo de las primeras 2 semanas

Ver: `engine/companies/onboarding.py`

---

## Variables de entorno requeridas

Ver `.env.example` — sin esas variables el sistema no arranca.

## Tests

```bash
cd dev/tests
pytest unit/          # tests unitarios (rápidos)
pytest integration/   # tests de integración (requieren Docker)
pytest e2e/           # tests end-to-end
```

## Deploy

```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose -f infra/docker-compose.prod.yml up -d
```
