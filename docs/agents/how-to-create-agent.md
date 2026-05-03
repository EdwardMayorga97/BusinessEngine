# Cómo crear un nuevo agente

## Estructura de archivos

```
engine/agents/catalog/{nombre_agente}/
├── agent.py      ← lógica del agente
├── skills.py     ← funciones que puede ejecutar
└── config.json   ← personalidad, autonomía, modelo AI
```

## 1. config.json

```json
{
  "name": "Nombre del Agente",
  "role": "rol_unico",
  "description": "Qué hace este agente",
  "personality": {
    "tone": "formal",
    "style": "conciso",
    "traits": ["preciso", "confiable"]
  },
  "skills": ["skill_uno", "skill_dos"],
  "autonomy": {
    "auto_execute": ["skill_uno"],
    "notify_after": ["skill_dos"],
    "require_approval": []
  },
  "model_config": {
    "primary": "claude-sonnet-4-6",
    "fallback": "gpt-4o-mini",
    "local_fallback": "ollama/llama3"
  }
}
```

## 2. skills.py

```python
from engine.agents.base.skills import skill

@skill(name="skill_uno", description="Qué hace esta skill")
async def skill_uno(payload: dict, context: dict) -> dict:
    # lógica de la skill
    return {"result": "...", "success": True}
```

## 3. agent.py

```python
from engine.agents.base.agent import BaseAgent
from .skills import skill_uno, skill_dos

class MiAgente(BaseAgent):
    skills = [skill_uno, skill_dos]
```

## 4. Registrar en config/agents/defaults.json

Agregar el nombre del directorio a la lista `base_agents`.

## 5. Activar

El worker detecta el agente automáticamente al reiniciar:
```bash
docker-compose restart worker
```
