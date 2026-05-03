# storage/ — Archivos en runtime

> Este directorio NO se versiona (está en .gitignore).

En desarrollo, MinIO guarda los archivos dentro del contenedor Docker en un volumen.
En producción, apuntar MinIO a un disco persistente o a un bucket S3 compatible.

Los archivos que gestiona el sistema:
- Facturas generadas (PDF)
- Reportes y exportaciones
- Documentos subidos por usuarios
- Contratos y cotizaciones
- Backups de base de datos

Acceso siempre via `engine/core/storage/` — nunca acceder a este directorio directamente.
