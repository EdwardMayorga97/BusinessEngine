# BusinessEngine AI OS

Sistema operativo empresarial impulsado por inteligencia artificial. Agentes autónomos gestionan todas las operaciones del negocio mediante voz y automatización progresiva.

## Características

- **Voz-first** — Interfaz principal por voz, siempre escuchando
- **Multi-empresa** — Múltiples empresas completamente aisladas
- **Multi-modelo** — Compatible con cualquier proveedor AI (Claude, GPT, Gemini, modelos locales)
- **Agentes autónomos** — Cada área del negocio tiene su propio agente especializado
- **Auto-configurable** — El sistema se adapta y mejora solo
- **OTA updates** — El código se actualiza sin reinstalar

## Estructura

```
businessengine/
├── docs/        → Documentación completa del sistema
├── dev/         → Herramientas solo para desarrollo
├── engine/      → Backend: núcleo del software
├── web/         → Frontend: React PWA
├── config/      → Configuración global del sistema
├── infra/       → Docker e infraestructura
└── storage/     → Archivos en runtime (no versionado)
```

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Python + FastAPI |
| AI Router | LiteLLM (multi-modelo) |
| Agentes | LangGraph |
| Base de datos | PostgreSQL + pgvector |
| Cache / Queue | Redis + Celery |
| Frontend | React + Vite (PWA) |
| Voz STT | Whisper (local) |
| Voz TTS | Kokoro TTS (local) |
| Archivos | MinIO (self-hosted) |
| Deploy | Docker Compose |

## Inicio rápido

```bash
cp .env.example .env
# Editar .env con tus API keys
docker-compose up -d
```

Ver [docs/deployment/local.md](docs/deployment/local.md) para guía completa.
