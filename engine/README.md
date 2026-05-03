# engine/ — Backend del sistema

Núcleo del software. Todo el código que corre en el servidor.

## Estructura

```
engine/
├── core/           ← núcleo del sistema (no tocar sin entender bien)
│   ├── ai/         ← AI router via LiteLLM
│   ├── orchestrator/← orquestador principal
│   ├── memory/     ← sistema de memoria (3 niveles)
│   ├── voice/      ← STT y TTS
│   ├── security/   ← auth, cifrado, audit trail
│   └── storage/    ← cliente MinIO para archivos
├── agents/         ← sistema completo de agentes
│   ├── base/       ← clase base: toda la lógica común
│   ├── catalog/    ← agentes pre-construidos
│   └── factory/    ← generador dinámico de agentes
├── companies/      ← gestión multi-empresa y onboarding
├── integrations/   ← conectores externos (email, calendario, etc.)
├── db/             ← modelos, migraciones, schema dinámico
├── api/            ← FastAPI: rutas REST y WebSocket
└── worker/         ← Celery: tareas en background
```

## Regla de importaciones

Jerarquía estricta — módulos de abajo NO importan de arriba:
```
core → (nada interno)
agents → core
companies → core
integrations → core
db → (nada interno)
api → core, agents, companies, integrations, db
worker → core, agents, db
```
