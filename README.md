# Monokera — Arquitectura base

> Caso 10 · Prototipo navegable de alta fidelidad para la gestión de pólizas.
> Proyecto Integrador · Ingeniería de Software VIII · IU EAM · Entrega final: 19 de noviembre de 2026.

**Estado:** documento inicial (Fase 2 · Diseño). Es la base para discutir y refinar; no hay código todavía.

> **Nota sobre las fuentes.** Este documento se construyó a partir de la presentación *Seguimiento 1* y del guion de David Torres. El chat compartido de Claude no pudo leerse (el enlace requiere renderizado y no devolvió contenido). Cualquier decisión tomada allí debe incorporarse en la sección [Decisiones](#8-decisiones-de-arquitectura-adr) y en [Preguntas abiertas](#10-preguntas-abiertas).

---

## 1. Contexto

Monokera es una startup colombiana (2020) de *Insurance-as-a-Service*: terceros venden seguros embebidos vía API. Tiene más de 1 millón de pólizas emitidas en Colombia, Perú, Chile y Bolivia.

**Problema:** la póliza se vende bien pero se entiende mal después de emitirla. El asegurado no comprende cobertura, exclusiones ni vigencia; hay cancelaciones por falta de alertas; confusión sobre primas, deducibles y copagos; más consultas a soporte, abandono y siniestros no reportados.

**Producto:** un prototipo navegable (no un sistema productivo) que muestra cómo el asegurado entendería y gestionaría su póliza.

## 2. Alcance

### Capacidades del MVP
| # | Capacidad |
|---|-----------|
| C1 | Resumen de la póliza activa y estado de cobertura |
| C2 | Detalle de primas, coberturas y exclusiones |
| C3 | Vigencias y alertas de renovación |
| C4 | Simulador de cambio o ampliación de plan |
| C5 | Mensajes educativos sobre uso del seguro |
| C6 | Notificaciones de vencimiento y estado de siniestros |

### Fuera de alcance (alcance futuro documentado)
- Programación productiva: el entregable es un prototipo navegable.
- Integración productiva con la plataforma existente.
- Modificar el modelo actuarial o las tarifas reales.
- Contratación o venta de seguros desde la app.

## 3. Principios y restricciones de arquitectura

1. **Cumplimiento primero.** Ante un conflicto se recorta alcance, nunca la exactitud de la información que ve el asegurado.
2. **Doble capa de información.** Resumen en lenguaje claro por defecto + clausulado literal en un segundo nivel, **siempre de la misma versión** (HU-13).
3. **Contenido modular y versionado.** Todo microcopy vive en unidades aisladas, para que una circular de la SFC afecte componentes concretos (mitiga R-01).
4. **Aprobación de Legal trazable.** Ningún texto contractual se publica sin estado de aprobación registrado.
5. **El simulador no toca tarifas reales.** Opera solo sobre rangos referenciales validados por el consultor actuarial (mitiga R-03).
6. **Datos simulados.** Sin integraciones reales; todo sale de una capa de datos *mock* con la forma del contrato futuro.
7. **Trazabilidad.** Cada pantalla se vincula a una capacidad (C1–C6) y a historias de usuario (HU-xx).

## 4. Arquitectura lógica

Aunque el entregable es un prototipo, se diseña en capas para que el paso a producto sea una sustitución de adaptadores y no un rediseño.

```
┌──────────────────────────────────────────────────────────┐
│  Presentación (prototipo navegable)                      │
│  Pantallas C1–C6 · design system · componentes de copy   │
├──────────────────────────────────────────────────────────┤
│  Aplicación (casos de uso)                               │
│  ver póliza · ver exclusiones · alertas · simular ·      │
│  contenido educativo · notificaciones                    │
├──────────────────────────────────────────────────────────┤
│  Dominio                                                 │
│  Póliza · Cobertura · Exclusión · Prima · Vigencia ·     │
│  Siniestro · Alerta · Escenario de simulación            │
├──────────────────────────────────────────────────────────┤
│  Contenido regulado                                      │
│  Textos versionados: resumen claro ↔ clausulado literal  │
│  + estado de aprobación Legal                            │
├──────────────────────────────────────────────────────────┤
│  Adaptadores (hoy mock · mañana API Monokera)            │
│  PolicyProvider · ContentProvider · SimulationProvider · │
│  NotificationProvider                                    │
└──────────────────────────────────────────────────────────┘
```

Regla de dependencia: las capas superiores dependen de las inferiores solo mediante interfaces; el dominio no conoce la presentación ni los adaptadores.

## 5. Módulos por capacidad

| Capacidad | Módulo | Notas de diseño |
|-----------|--------|-----------------|
| C1 Resumen | `policy-summary` | Vista inicial; estado de cobertura (vigente, por vencer, vencida). |
| C2 Detalle | `policy-detail` | Primas, deducibles y copagos explicados; exclusiones con la **misma jerarquía visual** que las coberturas, cada una con ejemplo concreto. Toggle claro ↔ literal. |
| C3 Vigencias | `renewals` | Línea de tiempo de vigencia y alertas de renovación. |
| C4 Simulador | `plan-simulator` | Solo rangos referenciales; aviso visible de que es una estimación no vinculante. |
| C5 Educación | `education` | Mensajes breves sobre uso del seguro, desacoplados del dominio y reutilizables. |
| C6 Notificaciones | `notifications` | Vencimiento y estado de siniestros; centro de notificaciones + preferencias. |

Transversales: `content` (microcopy versionado), `design-system`, `mock-data`.

## 6. Modelo de datos inicial (conceptual)

```
Asegurado 1───* Póliza 1───* Cobertura
                  │  1───* Exclusión
                  │  1───1 Vigencia
                  │  1───* Prima/Deducible/Copago
                  └─ 1───* Siniestro

UnidadDeContenido (id, tipo, resumenClaro, textoLiteral, versión,
                   estadoAprobaciónLegal, aprobadoPor, fechaAprobación)
        ▲ referenciada por Cobertura y Exclusión

Alerta / Notificación (tipo, póliza, fechaDisparo, canal, leída)
EscenarioSimulación (planActual, planObjetivo, rangoReferencial*, disclaimer)
        * nunca tarifa productiva
```

Invariante clave: `resumenClaro` y `textoLiteral` de una misma unidad **comparten versión**; no puede publicarse uno sin el otro.

## 7. Estructura propuesta del repositorio

```
monokera/
├── README.md                 ← este documento
├── docs/
│   ├── planeacion/           actas, plan, cronograma, costos
│   ├── analisis/             stakeholders, historias, backlog, riesgos
│   ├── diseno/               arquitectura, diagramas, modelo de datos
│   └── seguimiento/          reportes de corte, incidentes (INC-xx)
├── design/                   fuentes del prototipo (design system, flujos)
├── content/                  microcopy versionado + estado de aprobación
├── mock-data/                pólizas, siniestros y alertas de ejemplo
└── prototype/                prototipo navegable
```

La carpeta `prototype/` queda sin definir hasta decidir la herramienta (ver preguntas abiertas).

## 8. Decisiones de arquitectura (ADR)

| ID | Decisión | Motivo |
|----|----------|--------|
| ADR-01 | Doble capa de información (claro + literal, misma versión) | Resuelve en la interfaz la tensión Legal ↔ comprensión. |
| ADR-02 | Contenido regulado separado del código/diseño | Un cambio de la SFC afecta unidades aisladas. |
| ADR-03 | Simulador solo con rangos referenciales | Actuaría prohíbe tocar tarifas reales. |
| ADR-04 | Datos mock tras interfaces de adaptador | Evita integración productiva ahora, facilita migrar después. |
| ADR-05 | Metodología híbrida: predictiva gobierna, iterativa ejecuta | Trazabilidad para Legal + absorción de cambios. |

## 9. Riesgos que condicionan la arquitectura

| Riesgo | Respuesta arquitectónica |
|--------|--------------------------|
| R-01 Circular nueva de la SFC | Microcopy modular y versionado; holgura de 2 días y reserva de $9.990.000. |
| R-02 Revisiones sucesivas de Legal (materializado, INC-01) | Estado de aprobación explícito por unidad; punto de control único con lista de verificación. |
| R-03 Simulador expone o altera tarifas | ADR-03; validación obligatoria del consultor actuarial. |

## 10. Preguntas abiertas

1. **Herramienta del prototipo** (Figma, código front-end, otra). La presentación dice "prototipo navegable" y excluye programación; confirmar.
2. **Contenido del chat compartido**: incorporar sus decisiones aquí.
3. **Idioma, moneda y normativa por país** (CO, PE, CL, BO): ¿el MVP cubre solo Colombia?
4. **Canales de notificación** a representar (push, correo, SMS, in-app).
5. **Criterios de usabilidad**: pruebas con 12 asegurados y meta ≥ 80 % de éxito en tareas de comprensión; definir tareas.

## 11. Hitos relacionados

- 15 de octubre: cierre de Fase 2 (arquitectura, diagramas, modelo de datos, interfaz aprobada por Legal) — lidera Esteban Pineda.
- 19–24 de octubre: Seguimiento 2.
- 19 de noviembre: entrega final.

## 12. Equipo

| Integrante | Rol |
|------------|-----|
| Santiago Arias Mosquera | Gerencia y Análisis |
| Esteban Pineda Ardila | Diseño e Implantación |
| Marlon Andrés Campo | Seguimiento e Implementación |
| David Mauricio Torres | Cliente y Pruebas |
