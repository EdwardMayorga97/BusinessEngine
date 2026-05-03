# Multi-Empresa (Multi-Tenant)

## Aislamiento de datos

Cada empresa tiene su propio schema en PostgreSQL:

```sql
-- Schema del sistema (compartido, solo sistema puede acceder)
public.companies
public.users
public.agents
public.roles
public.permissions
public.user_roles
public.agent_assignments

-- Schema por empresa (completamente aislado)
company_{id}.entities       -- "tablas" dinámicas de la empresa
company_{id}.fields         -- columnas de cada entidad
company_{id}.records        -- datos reales en JSONB
company_{id}.memories       -- memoria de la empresa
company_{id}.automations    -- tareas automáticas configuradas
company_{id}.audit_log      -- historial inmutable de acciones
```

El middleware de la API inyecta el `company_id` en cada request. Es imposible que una empresa acceda a datos de otra.

## Base de datos dinámica

No hay tablas fijas por tipo de negocio. La IA crea la estructura:

```sql
-- Ejemplo: empresa crea entidad "Inventario"
entities: id | company_id | name="Inventario" | description

-- Campos de esa entidad
fields: id | entity_id | name="sku"      | type="text"    | required=true
fields: id | entity_id | name="stock"    | type="number"  | required=true
fields: id | entity_id | name="precio"   | type="decimal" | required=true
fields: id | entity_id | name="categoria"| type="select"  | options=[...]

-- Los datos reales
records: id | entity_id | data={"sku":"A001", "stock":50, "precio":9.99} | is_active=true
```

La IA puede agregar nuevas entidades y campos sin modificar código.

## Permisos en DB

```sql
roles:            id | company_id | name | description
permissions:      id | role_id | action | resource | allowed
user_roles:       user_id | role_id
agent_assignments:agent_id | user_id | permissions_override JSONB
```

El gerente modifica permisos por voz → DB se actualiza → efecto inmediato.

## Onboarding empresa nueva

```
Paso 1: Gerente describe su negocio por voz
        "Somos una distribuidora de alimentos, 12 empleados,
         manejamos inventario, ventas y despacho"

Paso 2: Orquestador analiza y propone (en DB):
        - Entidades sugeridas: Inventario, Clientes, Ventas, Despachos
        - Agentes sugeridos: inventory, billing, email, reports
        - Roles: gerente, vendedor, bodeguero

Paso 3: Gerente aprueba, ajusta o modifica por voz

Paso 4: Sistema crea el schema automáticamente

Paso 5: Orquestador monitorea las primeras 2 semanas
        y propone agentes adicionales según lo que detecta
```
