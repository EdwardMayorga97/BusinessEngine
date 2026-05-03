# Arquitectura General

## Flujo principal

```
Usuario habla
      ↓
Speech-to-Text (Whisper — local)
      ↓
Orquestador (LLM via LiteLLM)
      ↓  interpreta intención
      ↓  consulta permisos del usuario en DB
      ↓  identifica agentes necesarios
      ↓  crea jobs en cola Redis
      ↓
Agentes especializados (Celery workers)
  ├── Inventario
  ├── Facturación
  ├── Email
  ├── Calendario
  ├── Reportes
  └── DevOps (auto-mejora)
      ↓
PostgreSQL (datos de empresa)
      ↓
Orquestador consolida resultado
      ↓
Respuesta en voz (TTS) + UI dinámica (React)
```

## Componentes

### Orquestador
Cerebro central. Único punto de contacto con el usuario. Decide qué agente maneja cada tarea, coordina agentes múltiples para tareas complejas, detecta oportunidades de automatización.

### Agentes
Cada uno es independiente, tiene personalidad, skills y memoria propios. Se comunican SOLO via job queue. Pueden ser creados dinámicamente por la IA.

### AI Router (LiteLLM)
Capa de abstracción sobre todos los modelos AI. Si un modelo falla, cambia al siguiente automáticamente. El resto del sistema no sabe qué modelo se está usando.

### Memoria (3 niveles)
- **Corta** (Redis, 24h): conversación activa
- **Media** (PostgreSQL, 90d): decisiones y patrones recientes
- **Larga** (pgvector, permanente): conocimiento de la empresa

### Base de datos dinámica
No hay tablas fijas por negocio. El AI crea entidades (tablas lógicas) y campos según lo que la empresa necesita. Todo en PostgreSQL con JSONB.

### Frontend dinámico
React PWA. La IA devuelve JSON describiendo qué componente renderizar. El usuario nunca navega menús: la IA decide qué mostrar.

## Reglas fundamentales

1. Todo estado en DB — nunca en archivos
2. Schema PostgreSQL separado por empresa
3. Usuario → Orquestador → Agentes (nunca directo)
4. Agentes se comunican solo via Redis job queue
5. Nunca se eliminan datos — `is_active = False`
6. AI siempre via `engine.core.ai.router`
7. Un agente roto no puede romper el sistema
