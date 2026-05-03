# engine/worker/ — Tareas en background (Celery)

Procesa los jobs que el orquestador pone en la cola Redis. Cada agente corre como un worker independiente.

## Estructura

```
worker/
├── tasks/
│   ├── agent_jobs.py    ← ejecuta jobs de agentes
│   ├── automation.py    ← tareas automáticas programadas
│   └── maintenance.py   ← backups, limpieza de memoria, health checks
└── celery_app.py        ← configuración de Celery
```

## Cómo funciona

```
Orquestador → pone job en Redis → Celery Worker lo levanta
→ instancia el agente correcto → ejecuta la skill
→ guarda resultado en Redis → Orquestador lo recoge
→ consolida respuesta → WebSocket → Frontend
```

## Escalar workers

Para procesar más jobs en paralelo, se pueden agregar más workers:
```bash
# docker-compose.prod.yml
worker:
  deploy:
    replicas: 4  # 4 workers en paralelo
```
