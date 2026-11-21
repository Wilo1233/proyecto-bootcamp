# proyecto-bootcamp

Proyecto de curso: reserva de turnos para un consultorio médico privado.

## Qué hay en este repositorio

- **Una demo de reserva de turno** (`src/`), pedida por el docente. Es una sola pantalla con el aspecto de la página de un consultorio ficticio («Consultorio Ejemplo»): cabecera con la marca DEMO, tres pasos numerados y, en pantallas anchas, un resumen «Tu cita» que se mantiene a la vista a la derecha. Sirve para reservar un turno ficticio: se elige especialidad, médico, fecha y hora (cada paso limpia los siguientes), se indica el paciente y su acompañante —o que va solo— y se revisa la reserva en un cuadro antes de confirmarla. Usa React, Mantine y Zod.
- **La demo es solo una demostración:** los datos son ficticios, viven en memoria (se pierden al recargar la página) y no hay servidor ni envío de mensajes. No es el producto aprobado: sus diferencias están registradas en `docs/proceso.md`.
- **La documentación del curso** (`docs/`): casos de uso, especificaciones, entregas y el registro del proceso.

## Requisitos

- Node.js 22.22.0 o superior
- pnpm 11.17.0

## Cómo abrir la demo

```bash
pnpm install
pnpm dev
```

Abre en el navegador la dirección que muestra la terminal (normalmente `http://localhost:5173/`).

## Otros comandos

| Comando | Qué hace |
|---|---|
| `pnpm build` | Revisa los tipos (`tsc -b`) y genera la versión de producción (`vite build`). |
| `pnpm lint` | Ejecuta oxlint. |
| `pnpm preview` | Sirve localmente la versión generada por `pnpm build`. |

## Documentación

Todo está en [`docs/`](docs/). Para saber cómo se demuestra la demo paso a paso y en qué se diferencia de lo aprobado, mira las secciones «Demo de reserva pedida por el docente (tarea 3, 2026-11-12)», «Mejoras de la demo (tarea 4, 2026-11-14)» y «Rediseño visual de la demo (tarea 5, 2026-11-14)» de [`docs/proceso.md`](docs/proceso.md). La última describe el aspecto actual, el recorrido paso a paso actualizado y cómo se comprobó.
