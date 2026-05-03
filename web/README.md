# web/ — Frontend (React PWA)

Interfaz de usuario. Progressive Web App que funciona en cualquier dispositivo: iPhone, Android, desktop, sin instalar nada.

## Estructura

```
web/
├── src/
│   ├── components/
│   │   ├── dynamic/           ← componentes que la AI renderiza
│   │   │   ├── Table.jsx      ← tabla de datos
│   │   │   ├── Chart.jsx      ← gráficas
│   │   │   ├── Form.jsx       ← formularios generados
│   │   │   ├── Document.jsx   ← vista de documentos
│   │   │   ├── Dashboard.jsx  ← panel de métricas
│   │   │   └── Renderer.jsx   ← decide qué componente mostrar
│   │   ├── voice/
│   │   │   ├── VoiceInterface.jsx   ← UI principal: micrófono siempre activo
│   │   │   └── Transcript.jsx       ← muestra lo que escucha en tiempo real
│   │   └── layout/
│   │       └── Shell.jsx      ← estructura base de la app
│   ├── hooks/
│   │   ├── useVoice.js        ← maneja micrófono y Web Speech API
│   │   └── useWebSocket.js    ← conexión al backend
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── manifest.json          ← configuración PWA
├── package.json
└── vite.config.js
```

## UI dinámica

La AI devuelve JSON con el componente a mostrar:
```json
{"component": "Table", "props": {"title": "...", "rows": [...]}}
```
`Renderer.jsx` mapea ese JSON al componente React correcto.
El usuario nunca navega menús — la AI decide qué mostrar.

## PWA

En iPhone: Safari → Compartir → Agregar a pantalla de inicio
En Android: Chrome → Instalar app
Actualizaciones automáticas al hacer deploy — sin reinstalar.
