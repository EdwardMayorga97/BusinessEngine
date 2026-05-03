# engine/companies/ — Gestión Multi-Empresa

## Archivos

### manager.py
CRUD de empresas. Crear, activar, suspender. Gestiona la creación del schema PostgreSQL por empresa.

### onboarding.py
Flujo de onboarding por voz para empresa nueva:
1. Recibe descripción del negocio
2. LLM propone estructura (entidades, agentes, roles)
3. Gerente aprueba por voz
4. Crea schema, activa agentes, configura permisos base
5. Inicia período de monitoreo (2 semanas)

### tenant.py
Middleware de aislamiento. Inyecta `company_id` en cada operación de DB. Garantiza que una empresa NUNCA acceda a datos de otra.
