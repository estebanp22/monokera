# Prototipo navegable

Base del prototipo de Monokera. HTML, CSS y JavaScript sin dependencias ni paso de build.

## Cómo correrlo

Necesita un servidor estático (los módulos y el `fetch` de los datos mock no funcionan abriendo el archivo directamente). Desde la raíz del repositorio:

```bash
npx serve .
```

Luego abrir `http://localhost:3000/prototype/`.

## Estructura

```
prototype/
├── index.html          shell: encabezado, vista y barra de navegación
├── css/
│   ├── tokens.css      colores, espaciado y tipografía
│   └── base.css        layout y componentes base (card, badge, tabbar)
└── js/
    ├── app.js          router por hash (#/resumen, #/detalle, ...)
    ├── data.js         lectura de ../mock-data y formateadores
    └── screens/        una pantalla por capacidad
```

## Rutas

| Ruta | Capacidad | Estado |
|------|-----------|--------|
| `#/resumen` | C1 Resumen | base implementada |
| `#/detalle` | C2 Detalle | pendiente |
| `#/vigencia` | C3 Vigencias | pendiente |
| `#/simulador` | C4 Simulador | pendiente |
| `#/avisos` | C6 Notificaciones | pendiente |

C5 (educación) no tiene pestaña propia: sus mensajes se mostrarán dentro de las otras pantallas.

## Agregar una pantalla

1. Crear `js/screens/<nombre>.js` que exporte una función que devuelva HTML.
2. Registrarla en `routes` dentro de `js/app.js`.
3. Si necesita una pestaña, añadir el enlace en `index.html`.
