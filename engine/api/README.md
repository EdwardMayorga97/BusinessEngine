# engine/api/ — API REST y WebSocket

## Estructura

```
api/
├── routes/
│   ├── voice.py        ← recibir audio y texto del usuario
│   ├── agents.py       ← gestionar agentes (CRUD, activar/desactivar)
│   ├── companies.py    ← gestionar empresas y onboarding
│   ├── users.py        ← gestionar usuarios y permisos
│   └── data.py         ← CRUD dinámico de entidades de empresa
├── websocket/
│   ├── voice_stream.py ← stream de voz en tiempo real
│   └── events.py       ← eventos del sistema hacia el frontend
├── middleware/
│   ├── auth.py         ← validación JWT
│   ├── tenant.py       ← inyecta company_id, aislamiento
│   └── rate_limit.py   ← límites por empresa y usuario
└── main.py             ← FastAPI app, registro de routers
```

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| WS | `/ws/{session_id}` | Conexión principal de voz |
| POST | `/api/voice` | Enviar audio (alternativa HTTP) |
| GET | `/api/agents` | Listar agentes de la empresa |
| POST | `/api/agents` | Crear agente nuevo |
| GET | `/api/data/{entity}` | Consultar datos de entidad |
| POST | `/api/data/{entity}` | Crear registro |
| PUT | `/api/data/{entity}/{id}` | Actualizar registro |

Documentación completa: [docs/api/endpoints.md](../../docs/api/endpoints.md)
