# engine/db/ — Capa de base de datos

## Estructura

```
db/
├── models/
│   ├── company.py      ← empresas
│   ├── user.py         ← usuarios y perfiles
│   ├── agent.py        ← definición de agentes (en DB)
│   ├── role.py         ← roles de usuario
│   ├── permission.py   ← permisos por rol y agente
│   ├── memory.py       ← memoria media y larga
│   ├── entity.py       ← entidades dinámicas ("tablas" de empresa)
│   ├── field.py        ← campos de cada entidad
│   ├── record.py       ← datos reales en JSONB
│   └── audit.py        ← audit trail inmutable
├── migrations/         ← Alembic: historial de cambios de schema
├── dynamic/
│   ├── schema_manager.py  ← crea/modifica entidades y campos via AI
│   └── query_builder.py   ← construye queries dinámicos desde lenguaje natural
└── session.py          ← conexión y pool de conexiones
```

## Reglas

- Todo acceso a DB pasa por los modelos SQLAlchemy — nunca SQL raw directo
- Las migraciones se generan con Alembic — nunca modificar tablas manualmente
- `audit.py` es append-only — nunca eliminar registros de audit
- Los datos de empresa van en su schema propio — `company_{id}.{tabla}`
- `is_active = False` en lugar de DELETE en cualquier tabla
