# engine/core/ — Núcleo del sistema

Contiene los servicios fundamentales que todo el sistema usa. No tiene lógica de negocio, solo infraestructura.

## Módulos

### ai/
AI Router via LiteLLM. Abstrae todos los modelos AI. El resto del sistema solo llama `ai_router.complete(prompt, model_hint=...)` y no sabe qué modelo se está usando.

### orchestrator/
Cerebro central. Recibe intención del usuario, coordina agentes, gestiona la automatización progresiva.

### memory/
Sistema de memoria en 3 niveles (Redis + PostgreSQL + pgvector). API unificada via `memory_manager`.

### voice/
Speech-to-Text (Whisper local) y Text-to-Speech (Kokoro local). Sin dependencias de APIs externas de pago.

### security/
Autenticación JWT, cifrado de datos sensibles (AES-256), audit trail inmutable.

### storage/
Cliente MinIO para archivos (facturas, reportes, documentos). Self-hosted, compatible con S3.
