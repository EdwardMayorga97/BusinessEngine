# Sistema de Memoria

## Los 3 niveles

### Nivel 1 — Memoria Corta (Redis)
| Atributo | Valor |
|----------|-------|
| Duración | 24 horas, expira automáticamente |
| Motor | Redis |
| Velocidad | < 1ms |
| Contenido | Conversación activa, contexto de sesión |
| Ejemplo | "Mencionó antes que el cliente paga a 30 días" |

### Nivel 2 — Memoria Media (PostgreSQL)
| Atributo | Valor |
|----------|-------|
| Duración | 90 días (configurable por empresa) |
| Motor | PostgreSQL |
| Velocidad | < 100ms |
| Contenido | Decisiones, patrones de uso, errores, correcciones |
| Ejemplo | "Esta semana han preguntado mucho por el producto X" |

### Nivel 3 — Memoria Larga (pgvector)
| Atributo | Valor |
|----------|-------|
| Duración | Permanente |
| Motor | pgvector (dentro de PostgreSQL) |
| Velocidad | Búsqueda semántica |
| Contenido | Conocimiento empresa, procedimientos aprendidos, historial |
| Ejemplo | "Hace 6 meses tuvimos problema con ese proveedor" |

## Memoria por agente

Cada agente tiene su propia memoria, separada de la global:

```
agent_memory_{agent_id}:
  episodic:    qué he hecho, con quién, resultados obtenidos
  procedural:  cómo ejecuto cada tarea (mejora con el uso)
  relational:  qué sé de cada persona y entidad con quien interactúo
```

## API de memoria

Siempre via el manager, nunca acceder directamente a Redis o PostgreSQL:

```python
from engine.core.memory.manager import memory_manager

# Guardar
await memory_manager.save(company_id, key, value, level="short")
await memory_manager.save(company_id, key, value, level="medium")
await memory_manager.save(company_id, key, value, level="long")

# Recuperar por clave exacta
result = await memory_manager.get(company_id, key, level="medium")

# Búsqueda semántica (solo nivel largo)
results = await memory_manager.recall(company_id, query="problema con proveedor")

# Borrar (soft delete — marca inactivo, no elimina)
await memory_manager.forget(company_id, key)
```

## Reglas

1. El orquestador decide qué guardar en memoria larga
2. Los agentes solo escriben en su memoria propia
3. La memoria de empresa A no es accesible desde empresa B
4. Datos sensibles en memoria se cifran en reposo (AES-256)
5. El usuario puede pedir borrar su memoria — se marca inactiva, no se borra físicamente
