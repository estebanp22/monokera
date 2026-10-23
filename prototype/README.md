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
    ├── data.js         lectura de ../mock-data y ../content, estado de la póliza y formateadores
    ├── components.js   piezas compartidas: mensaje educativo y clausulado oficial
    ├── icons.js        íconos SVG
    └── screens/        una pantalla por capacidad
```

Los datos salen de `mock-data/policy.json` y `mock-data/simulation.json`. El contenido regulado (resumen claro y texto literal de cada cobertura y exclusión, con su versión y aprobación de Legal) vive aparte en `content/policy-content.json`, y los mensajes educativos en `content/education.json`. La aseguradora, las cláusulas y los valores son ficticios.

## Rutas

| Ruta | Capacidad | Historias | Estado |
|------|-----------|-----------|--------|
| `#/resumen` | C1 Resumen | HU-07, HU-08 | navegable |
| `#/detalle` | C2 Mi póliza | HU-12, HU-13, HU-14, HU-17 | navegable |
| `#/vigencia` | C3 Vigencias | HU-15, HU-16 | pendiente |
| `#/simulador` | C4 Simulador | HU-22, HU-24 | navegable |
| `#/avisos` | C6 Notificaciones | HU-23, HU-26 | pendiente |

C5 (educación) no tiene pestaña propia: cada pantalla navegable muestra su mensaje "Aprende".

### Qué se puede hacer en cada pantalla

- **Resumen:** ver el estado de la póliza (activa, próxima a vencer o vencida, con ícono y texto, no solo color), los datos principales enlazados a su detalle y el clausulado oficial.
- **Mi póliza:** pestañas *Lo que cubre*, *Lo que no cubre* y *Lo que pagas* con la misma jerarquía; cada cobertura y exclusión tiene ejemplo y "Ver texto de la póliza" con la versión. La exclusión de mascotas aparece en revisión por Legal, así que no se publica su explicación.
- **Simulador:** elegir una o varias coberturas adicionales y ver el rango de costo y la comparación *Hoy / Con ampliación*. Termina en "Solicitar contacto con un asesor"; no contrata nada.

### Parámetros de demostración

- `#/resumen?estado=por-vencer` y `#/resumen?estado=vencida` muestran los otros dos estados de la póliza (también desde el selector "Solo prototipo" al final del resumen).
- `#/detalle?ver=no-cubre` o `?ver=pagos` abre esa pestaña directamente.

## Agregar una pantalla

1. Crear `js/screens/<nombre>.js` que exporte una función que devuelva HTML, o `{ html, mount }` si necesita interacciones (`mount` recibe la vista ya dibujada).
2. Registrarla en `routes` dentro de `js/app.js`.
3. Si necesita una pestaña, añadir el enlace en `index.html`.
