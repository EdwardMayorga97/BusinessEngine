# engine/integrations/ — Conectores externos

Cada integración es un conector independiente. Si un conector falla, el resto del sistema sigue funcionando.

## Estructura

```
integrations/
├── base/
│   └── connector.py   ← clase base para todos los conectores
├── email/
│   ├── gmail.py
│   └── outlook.py
├── calendar/
│   ├── google.py
│   └── outlook.py
├── payments/
│   ├── stripe.py
│   └── mercadopago.py
└── whatsapp/
    └── business.py
```

## Prioridades de implementación

| Prioridad | Conector | Estado |
|-----------|----------|--------|
| 1 | Gmail / Outlook | Pendiente |
| 1 | Google Calendar | Pendiente |
| 1 | WhatsApp Business | Pendiente |
| 2 | Stripe | Pendiente |
| 2 | MercadoPago | Pendiente |
| 3 | QuickBooks | Pendiente |
| 3 | Twilio (llamadas) | Pendiente |

## Agregar una integración nueva

1. Crear carpeta `integrations/{nombre}/`
2. Crear clase heredando de `base/connector.py`
3. Implementar: `connect()`, `disconnect()`, `health_check()`
4. Agregar variables en `.env.example`
5. El orquestador la detecta automáticamente
