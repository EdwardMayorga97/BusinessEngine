# engine/agents/ — Sistema de Agentes

## Estructura

```
agents/
├── base/       ← clase base: todo agente hereda de aquí
├── catalog/    ← agentes pre-construidos listos para usar
└── factory/    ← genera nuevos agentes dinámicamente via AI
```

## base/

Define `BaseAgent` con toda la lógica común:
- Carga su config desde DB al iniciar
- Conecta con su memoria propia
- Recibe y procesa jobs de la cola Redis
- Reporta resultados al orquestador
- Maneja errores y fallbacks de modelo AI

## catalog/

Agentes pre-construidos listos para activar en cualquier empresa:
`inventory`, `billing`, `email`, `calendar`, `reports`, `devops`

Ver [docs/agents/catalog.md](../../docs/agents/catalog.md) para descripción completa.

## factory/

Cuando el orquestador detecta que falta un agente:
1. `generator.py` — LLM genera el código del agente
2. `validator.py` — valida que el código es seguro y correcto
3. `deployer.py` — registra el agente en DB y lo activa
