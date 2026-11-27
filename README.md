# proyecto-bootcamp

[![CI](https://github.com/Wilo1233/proyecto-bootcamp/actions/workflows/ci.yml/badge.svg)](https://github.com/Wilo1233/proyecto-bootcamp/actions/workflows/ci.yml)

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

## Integración continua

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta en cada `push` y en cada `pull_request`. Instala las dependencias con `pnpm install --frozen-lockfile` (Node 24; la versión de pnpm sale de `packageManager`) y ejecuta `pnpm build`, que incluye la revisión de tipos. Si hay un error de tipos o de compilación, la ejecución falla y GitHub marca el commit en rojo. Las ejecuciones se ven en la pestaña [Actions](https://github.com/Wilo1233/proyecto-bootcamp/actions). La entrega del Taller 5, con las capturas de una ejecución fallida a propósito y de su corrección, está en [`docs/entregas/taller-05-ci.pdf`](docs/entregas/taller-05-ci.pdf).

### Despliegue continuo a Amazon S3

Tras compilar, el trabajo «Build» guarda la carpeta `dist/` como artefacto (`react-build`) y el trabajo «Deploy AWS S3» la publica en un bucket de Amazon S3 con `aws s3 sync`. Solo se despliega en un `push` a `main` y si «Build» terminó bien; en otras ramas y en `pull_request` solo se compila. Para que funcione hay que configurar en GitHub («Settings» → «Secrets and variables» → «Actions») los secretos `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `AWS_SESSION_TOKEN` y las variables `AWS_REGION` y `S3_BUCKET_NAME`; sus valores no se guardan en el repositorio. Las credenciales de AWS Academy son temporales: caducan al terminar cada sesión del laboratorio y hay que renovar los tres secretos antes de volver a desplegar. El sitio se sirve por HTTP en `http://<bucket>.s3-website-<región>.amazonaws.com`. La preparación del bucket, los límites conocidos y la evidencia pendiente están en [`docs/entregas/taller-07-cd.md`](docs/entregas/taller-07-cd.md).

## Documentación

Todo está en [`docs/`](docs/). Para saber cómo se demuestra la demo paso a paso y en qué se diferencia de lo aprobado, mira las secciones «Demo de reserva pedida por el docente (tarea 3, 2026-11-12)», «Mejoras de la demo (tarea 4, 2026-11-14)» y «Rediseño visual de la demo (tarea 5, 2026-11-14)» de [`docs/proceso.md`](docs/proceso.md). La última describe el aspecto actual, el recorrido paso a paso actualizado y cómo se comprobó. La sección «Taller 5: integración continua con GitHub Actions (tarea 6, 2026-11-24)» explica el pipeline y la prueba con error. La sección «Taller 7: despliegue continuo a Amazon S3 (tarea 7, 2026-11-26)» explica el trabajo de despliegue, los secretos y variables necesarios y cómo comprobarlo.
