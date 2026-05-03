# El Orquestador

## Rol

El orquestador es el cerebro central y el ÚNICO punto de contacto con el usuario. Ningún agente habla directamente con el usuario.

## Responsabilidades

### A — Routing de tareas
1. Recibe intención del usuario (texto del STT)
2. Consulta permisos del usuario en DB
3. Identifica qué agente(s) pueden resolver la tarea
4. Si no existe agente → detecta la necesidad → propone crearlo
5. Crea jobs en la cola Redis

### B — Conocimiento de personas
- Sabe qué puede hacer cada empleado (desde DB, en tiempo real)
- Sabe el estilo de comunicación de cada persona
- Adapta cómo habla según quién sea el interlocutor
- Comunica a los agentes qué contexto de persona tienen

### C — Coordinación multi-agente
Para tareas que requieren varios agentes:

```
Ejemplo: "Envía cotización al cliente Juan"

Orquestador activa en secuencia:
  1. Agente Clientes     → busca datos de Juan
  2. Agente Inventario   → verifica disponibilidad
  3. Agente Precios      → calcula precios y descuentos
  4. Agente Documentos   → genera PDF de cotización
  5. Agente Email        → envía al correo de Juan

Cada resultado alimenta el siguiente job.
Si uno falla → orquestador notifica al usuario.
```

### D — Automatización progresiva

```
NIVEL 0 — Manual
  Usuario pide → agente ejecuta

NIVEL 1 — Detectado (orquestador propone)
  "Noto que cada lunes consultas el inventario bajo.
   ¿Lo automatizo y te notifico solo si hay problema?"

NIVEL 2 — Semi-automático
  Agente ejecuta → notifica resultado

NIVEL 3 — Automático
  Agente ejecuta → resumen semanal solamente
```

**Excepciones permanentes** (siempre piden aprobación, sin importar el nivel):
- Contratos y acuerdos comerciales
- Pagos y transferencias
- Cotizaciones grandes (umbral definido por empresa)
- Eliminación de datos importantes
- Cambios de precios mayores
- Comunicaciones legales

El gerente define qué es "grande" o "importante" en DB.

### E — Auto-mejora del sistema
- Monitorea performance de agentes continuamente
- Detecta tareas sin agente asignado
- Propone al usuario crear nuevos agentes
- Con aprobación: el agente DevOps genera e implementa el cambio

## Permisos

El orquestador consulta permisos en DB antes de ejecutar CUALQUIER acción:

```
permissions table:
  role_id + action + resource + allowed: true/false

El gerente cambia permisos por voz → actualización inmediata en DB
Efecto inmediato, sin reiniciar nada
```
