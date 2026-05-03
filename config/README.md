# config/ — Configuración global del sistema

Archivos de configuración que aplican a todo el sistema, no a una empresa específica. La config por empresa vive en DB.

## Archivos

### models/available_models.json
Todos los modelos AI disponibles, organizados por capacidad (fast, smart, local). El AI Router usa esto para decidir qué modelo usar según la tarea.

### agents/defaults.json
Configuración base para agentes nuevos: personalidad default, niveles de autonomía, qué agentes se activan en una empresa nueva.

### system.json
Configuración global: voz, seguridad, límites, automatización, mantenimiento.
