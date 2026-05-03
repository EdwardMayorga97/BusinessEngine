# infra/ — Infraestructura

Docker Compose y scripts de despliegue. Todo el sistema corre en contenedores.

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| engine | 8000 | Backend FastAPI |
| worker | — | Celery workers |
| web | 3000 | Frontend React |
| postgres | 5432 | Base de datos principal |
| redis | 6379 | Cache y job queue |
| minio | 9000/9001 | Almacenamiento de archivos |
| ollama | 11434 | Modelos AI locales |

## Archivos

- `docker-compose.yml` — entorno de desarrollo
- `docker-compose.prod.yml` — producción (con volúmenes persistentes, restart policies)
- `scripts/deploy.sh` — deploy a servidor
- `scripts/backup.sh` — backup de PostgreSQL y MinIO

## Inicio rápido

```bash
# Desarrollo
cp .env.example .env
docker-compose up -d

# Ver logs
docker-compose logs -f engine

# Producción
docker-compose -f infra/docker-compose.prod.yml up -d
```
