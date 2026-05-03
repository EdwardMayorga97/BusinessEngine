# Flujo de Datos

## Voz → Acción → Respuesta

```
[Usuario habla]
     ↓
[STT: Whisper local]
     ↓  texto transcrito
[WebSocket → API (FastAPI)]
     ↓  payload: {user_id, company_id, text, session_id}
[Orquestador]
     ↓  consulta memoria corta (Redis) — contexto de conversación
     ↓  consulta permisos del usuario (PostgreSQL)
     ↓  LLM interpreta intención via AI Router
     ↓  crea job(s) en Redis queue
[Celery Worker(s)] — uno o varios agentes en paralelo
     ↓  cada agente ejecuta su skill
     ↓  accede a PostgreSQL (datos de empresa)
     ↓  guarda resultado en Redis (memoria corta)
[Orquestador consolida]
     ↓  guarda en memoria media/larga si es relevante
     ↓  genera respuesta final via LLM
     ↓  genera instrucción de UI (JSON de componente)
[WebSocket → Frontend]
     ↓  texto de respuesta → TTS → audio al usuario
     ↓  JSON de componente → React renderiza UI dinámica
```

## Formato de mensajes WebSocket

### Cliente → Servidor
```json
{"type": "voice_chunk", "data": "base64_audio", "session_id": "..."}
{"type": "text", "data": "texto del usuario", "session_id": "..."}
```

### Servidor → Cliente
```json
{
  "type": "response",
  "text": "Se encontraron 3 productos con stock bajo",
  "audio": "base64_tts_audio",
  "ui": {
    "component": "Table",
    "props": {
      "title": "Productos con stock bajo",
      "columns": ["Producto", "Stock", "Mínimo"],
      "rows": [["Arroz", 2, 10], ["Azúcar", 5, 20]]
    }
  }
}
```

## Jobs entre agentes

```json
{
  "job_id": "uuid",
  "created_by": "orchestrator",
  "agent_target": "inventory",
  "company_id": "uuid",
  "task": "consultar_stock_bajo",
  "payload": {"threshold": 10},
  "timeout_seconds": 30,
  "priority": "normal",
  "on_success": "orchestrator.handle_result",
  "on_failure": "orchestrator.handle_error"
}
```
