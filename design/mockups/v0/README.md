# Mockups v0

Primera versión de los mockups de todas las vistas de la app, para revisión del equipo.

## Pantallas

| Imagen | Vista | Capacidad |
|--------|-------|-----------|
| `img/01-inicio.png` | Inicio | C1 |
| `img/02-inicio-poliza-vencida.png` | Inicio con póliza vencida | C1 · C3 |
| `img/03-condiciones.png` | Condiciones de la póliza | C2 |
| `img/04-fechas.png` | Fechas | C3 |
| `img/05-cotizador.png` | Cotizador | C4 |
| `img/06-mensajes.png` | Mensajes y siniestros | C6 |
| `img/07-configuracion.png` | Configuración de avisos | C6 |

`img/00-overview.png` reúne todas las pantallas en una sola imagen.

## Ver en el navegador

Abrir `index.html`. Cada pantalla se elige con el parámetro `s`, por ejemplo `index.html?s=05-cotizador`.

## Archivos

```
v0/
├── index.html   página que dibuja la pantalla elegida
├── styles.css   estilos
├── render.js    una función por pantalla
├── mock.js      datos de ejemplo
└── img/         capturas a 390 px de ancho (@2x)
```
