# Sistema de Agentes

## Qué es un agente

Un agente es una entidad especializada que vive en la base de datos y tiene:
- **Identidad**: nombre, rol, empresa
- **Personalidad**: tono, estilo, rasgos de carácter
- **Skills**: lista de acciones que puede ejecutar
- **Memoria**: propia, separada de otros agentes
- **Autonomía**: qué puede hacer solo vs qué necesita aprobación
- **Modelo AI**: qué LLM usa y cuál es su fallback

## Estructura en DB

```json
{
  "id": "uuid",
  "company_id": "uuid",
  "name": "Agente Inventario",
  "role": "inventory_manager",
  "is_active": true,

  "personality": {
    "tone": "formal",
    "style": "conciso",
    "traits": ["preciso", "ordenado", "proactivo"],
    "language": "es"
  },

  "skills": [
    "consultar_stock",
    "actualizar_stock",
    "alertar_stock_bajo",
    "generar_reporte_inventario",
    "gestionar_proveedores"
  ],

  "autonomy": {
    "auto_execute": ["consultar_stock", "alertar_stock_bajo"],
    "notify_after": ["actualizar_stock"],
    "require_approval": ["eliminar_producto", "ajuste_masivo"]
  },

  "model_config": {
    "primary": "claude-sonnet-4-6",
    "fallback": "gpt-4o-mini",
    "local_fallback": "ollama/llama3"
  }
}
```

## Comunicación entre agentes

Los agentes NUNCA se llaman directamente. Solo via job queue:

```json
{
  "job_id": "abc123",
  "agent_target": "inventory",
  "task": "consultar_stock",
  "payload": { "product_id": "..." },
  "timeout_seconds": 30,
  "on_failure": "notify_orchestrator",
  "callback": "orchestrator.handle_result"
}
```

## Catálogo base

| Agente | Responsabilidad | Skills principales |
|--------|----------------|-------------------|
| inventory | Stock y productos | CRUD productos, alertas stock bajo |
| billing | Facturas y cobros | Crear/enviar facturas, seguimiento |
| email | Correos | Leer/redactar/enviar/clasificar |
| calendar | Agenda | Crear/modificar/recordar eventos |
| reports | Informes | Generar PDF, gráficas, resúmenes |
| devops | Auto-mejora del sistema | Monitorear, detectar issues, proponer mejoras |

## Crear un agente nuevo

```
1. engine/agents/catalog/{nombre}/
   ├── agent.py      ← hereda de BaseAgent
   ├── skills.py     ← funciones que puede ejecutar
   └── config.json   ← personalidad y autonomía

2. Registrar en config/agents/defaults.json → "base_agents"
3. Reiniciar el worker — el orquestador lo detecta automáticamente
```

## Agente DevOps (especial)

Monitorea el sistema continuamente:
- Detecta errores repetidos en agentes
- Detecta modelos AI lentos o desactualizados
- Detecta patrones no cubiertos
- Propone mejoras al orquestador
- Con aprobación del usuario: actualiza prompts, configs, código
