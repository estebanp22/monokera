# Prototipo navegable

Base del prototipo de Monokera. HTML, CSS y JavaScript sin dependencias ni paso de build.

## Cómo correrlo

Necesita un servidor estático (los módulos y el `fetch` de los datos mock no funcionan abriendo el archivo directamente). Desde la raíz del repositorio:

```bash
npx serve .
```

Luego abrir `http://localhost:3000/prototype/` (la app) o `http://localhost:3000/prototype/presentacion.html` (modo presentación). Sin Node también sirve `python3 -m http.server` desde la raíz y abrir `http://localhost:8000/prototype/`.

## Modo presentación

`presentacion.html` muestra la app dentro de un marco de teléfono, con el recorrido de la exposición a la izquierda: cada paso indica la capacidad (C1–C6), las historias que cubre y qué mostrar. El teléfono sigue siendo interactivo. "Reiniciar datos" devuelve los avisos y reclamaciones a su estado inicial.

`capturas/` tiene una imagen por pantalla y estado (390 px, @2x) para las diapositivas.

## Estructura

```
prototype/
├── index.html          shell: encabezado, vista y barra de navegación
├── presentacion.html   recorrido para exponer, con la app en un marco de teléfono
├── capturas/           imágenes de cada pantalla para las diapositivas
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

Los datos salen de `mock-data/policy.json`, `mock-data/simulation.json`, `mock-data/notifications.json` y `mock-data/claims.json`. El contenido regulado (resumen claro y texto literal de cada cobertura y exclusión, con su versión y aprobación de Legal) vive aparte en `content/policy-content.json`, y los mensajes educativos en `content/education.json`. La aseguradora, las cláusulas y los valores son ficticios.

## Rutas

| Ruta | Capacidad | Historias | Estado |
|------|-----------|-----------|--------|
| `#/resumen` | C1 Resumen | HU-07, HU-08 | navegable |
| `#/detalle` | C2 Mi póliza | HU-12, HU-13, HU-14, HU-17 | navegable |
| `#/vigencia` | C3 Vigencias | HU-15, HU-16 | navegable |
| `#/simulador` | C4 Simulador | HU-22, HU-24 | navegable |
| `#/avisos` | C6 Notificaciones | HU-23, HU-26 | navegable |
| `#/siniestro?id=…` | C6 Estado de reclamación | HU-23 | navegable |

C5 (educación) no tiene pestaña propia: cada pantalla navegable muestra su mensaje "Aprende".

### Qué se puede hacer en cada pantalla

- **Resumen:** ver el estado de la póliza (activa, próxima a vencer o vencida, con ícono y texto, no solo color), los datos principales enlazados a su detalle y el clausulado oficial.
- **Mi póliza:** pestañas *Lo que cubre*, *Lo que no cubre* y *Lo que pagas* con la misma jerarquía; cada cobertura y exclusión tiene ejemplo y "Ver texto de la póliza" con la versión. La exclusión de mascotas aparece en revisión por Legal, así que no se publica su explicación.
- **Simulador:** elegir una o varias coberturas adicionales y ver el rango de costo y la comparación *Hoy / Con ampliación*. Termina en "Solicitar contacto con un asesor"; no contrata nada.

- **Vigencia:** fechas de inicio y fin completas (desde las 00:00, hasta las 24:00), días restantes, si tiene renovación automática y qué significa, y los tres avisos de vencimiento (30, 15 y 3 días) con su fecha exacta. "Pedir la renovación" abre un resumen y termina en una solicitud; no cobra ni emite nada, y deja un aviso nuevo en Avisos.
- **Avisos:** historial con vencimiento, renovación exitosa, renovación fallida, pagos, reclamaciones y consejos. Cada aviso lleva a la pantalla que lo resuelve y se marca como leído; la pestaña muestra cuántos hay sin leer. *Reclamaciones* lista los siniestros con su estado, y *Preferencias* permite elegir canales y temas (los avisos de cobertura no se pueden apagar).
- **Reclamación:** línea de tiempo con cada etapa completada, en curso o pendiente y su fecha; si falta un documento dice exactamente cuál y permite subirlo. No anticipa el resultado. Si el caso no estuvo cubierto, explica la exclusión aplicada y enlaza a ella.

Los cambios hechos en el prototipo (avisos leídos, solicitudes, preferencias) viven en memoria y se pierden al recargar la página.

### Parámetros de demostración

- `?estado=por-vencer` y `?estado=vencida` en `#/resumen` y `#/vigencia` muestran los otros dos estados de la póliza (también desde el selector "Solo prototipo" al final de esas pantallas).
- `#/avisos?ver=siniestros` o `?ver=preferencias` abre esa pestaña de Avisos.
- `#/detalle?ver=no-cubre` o `?ver=pagos` abre esa pestaña directamente.

## Agregar una pantalla

1. Crear `js/screens/<nombre>.js` que exporte una función que devuelva HTML, o `{ html, mount }` si necesita interacciones (`mount` recibe la vista ya dibujada).
2. Registrarla en `routes` dentro de `js/app.js`.
3. Si necesita una pestaña, añadir el enlace en `index.html`.
