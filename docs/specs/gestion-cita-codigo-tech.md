---
slug: "gestion-cita-codigo-tech"
title: "Diseño técnico: gestión de una cita con su código"
description: "Diseño técnico propuesto de «Mi cita»: consulta de la cita por código, cancelación con Mantine Modal y cambio de día, hora y médico reutilizando el selector de turnos."
spec_kind: spec-tech
status: approved
created_at: "2026-11-11T02:10:41.080Z"
last_updated: "2026-11-11T02:21:27.752Z"
source_spec: gestion-cita-codigo
---
> **Estado:** borrador para la revisión del estudiante. Es un diseño propuesto; nada está implementado ni instalado. Las partes marcadas como **hipótesis (BQ-01)** dependen de un servicio remoto que todavía no existe. Lo común está en `agenda-consultorio-tech` (rutas, layouts, proveedores y árbol) y el selector de turnos está en `reserva-cita-tech`; ambos están aprobados y aquí solo se referencian.

## Fuente y evidencia actual

**Especificación funcional de origen (`sourceSpec`):** `gestion-cita-codigo` (aprobada; revisión vigente con `lastUpdated` 2026-11-09T06:02:20.351Z). Casos fuente: `consultar-cita-codigo`, `cancelar-cita` y `cambiar-cita` (aprobados). Define las reglas RN-01 a RN-09; algunas se comparten con las otras especificaciones.

**Base existente (hechos al 2026-11-10):** la plantilla Vite + React 19.2.8 + TypeScript; no hay nada de «Mi cita» implementado. Las librerías de la cohorte no están instaladas. No existe un servicio remoto (BQ-01).

**Ruta:** `/mi-cita`, en el grupo público, **sin parámetros** (D64): el código vive solo en la pantalla. Consultar, cancelar y cambiar ocurren dentro de esta misma ruta.

## Límites, contratos y diseño

### PR-04 · Consultar una cita con su código

1. **Ingreso del código.** El familiar escribe el código y pulsa «Consultar». **Propuesta:** un formulario con Mantine Form y un schema de Zod que solo exige que el código no esté vacío (con `trim`). El formato real del código lo define el servidor (BQ-01), así que no se inventa una regla de formato.
2. **Guardar el código consultado.** Al enviar, el código queda en el estado local de la pantalla (`useState`), nunca en la URL (D64).
3. **Consulta de la cita (hipótesis BQ-01):**
   - clave `['cita', codigo]`;
   - `enabled` solo cuando hay un código consultado;
   - **`gcTime: 0`** (D78): al dejar de usarse, la cita y el código se borran de la memoria de Query;
   - propuesta de contrato: el servidor devuelve solo lo que muestra la pantalla (especialidad, médico, día, hora, paciente y acompañante) **y el estado de la cita** (confirmada, pasada o cancelada).
4. **Estados en pantalla:**
   - **Cargando.**
   - **E1 · no encontrada:** el servidor responde que no existe una cita con ese código. Se muestra «No encontramos una cita con ese código», no se muestran datos de ninguna cita y se permite reintentar (CA-04.2).
   - **E2 · pasada:** el estado lo decide **solo el servidor** (D77). Se muestran los datos sin «Cancelar» ni «Cambiar» (CA-04.3).
   - **E3 · cancelada:** se indica que la cita fue cancelada, sin opciones (CA-04.4).
   - **Confirmada:** se muestran los datos y los botones «Cancelar» y «Cambiar» (CA-04.1).
   - **Error de red o del servidor:** se muestra un mensaje con «reintentar».
5. **Botones visibles según el estado.** Se deriva al dibujar, a partir del estado del servidor; no se compara con el reloj del equipo (D77). **Costo aceptado en D77:** si la pantalla queda abierta y llega la hora de inicio, los botones siguen visibles hasta que se vuelva a pedir la cita. Al confirmar, el servidor responde «ya pasó» (CN4, F6).

### PR-05 · Cancelar con Mantine Modal (D71)

- **Quién lo abre:** el botón «Cancelar» de la cita confirmada. El estado de apertura es local, con `useDisclosure` de `@mantine/hooks`.
- **Título y contenido:** título «Cancelar la cita», que también le da al diálogo su nombre accesible. El contenido es un resumen con especialidad, médico, día, hora y paciente, y dos botones: «Sí, cancelar» y «Volver».
- **Cancelar el proceso (CN1):** «Volver», la X, Escape o el clic fuera cierran el Modal. No se envía nada y la cita sigue igual.
- **Al confirmar:** se lanza la **mutación de cancelación** (hipótesis BQ-01) con el código. Mientras está pendiente (`isPending`):
  - el Modal **no se puede cerrar**: `opened` lo controla el código y `onClose` no hace nada durante la operación (documentación de Mantine);
  - los botones quedan deshabilitados, para evitar un doble envío.
- **Éxito:**
  - se cierra el Modal;
  - se invalidan `['cita', codigo]`, que se vuelve a pedir y muestra «cancelada» (E3, CA-05.1), `['turnos-libres', especialidad]` y `['dias', especialidad]`, porque el turno vuelve a quedar libre (RN-01);
  - si la respuesta indica que el aviso no se pudo enviar, se muestra el aviso de CN3 (RN-09).
- **Error «ya pasó» (CN4, D41):** el mensaje se muestra **dentro del Modal** y la cita sigue igual. Al cerrar, se invalida `['cita', codigo]` para que se vea como pasada (D77, D79).
- **Error de red:** el mensaje aparece dentro del Modal, con la opción de reintentar.
- **Al reabrir:** el Modal empieza limpio. El error anterior se borra con `mutation.reset()` en el manejador que lo abre, sin `useEffect` (propuesta).
- **Quién administra cada cosa:**
  - abierto o cerrado: `useDisclosure`;
  - pendiente, error y aviso de mensaje: `useMutation`;
  - la cita: TanStack Query.

  El Modal no usa Zustand.

### PR-06 · Cambiar la cita

1. **Vista de cambio.** «Cambiar» abre la vista de cambio **dentro de `/mi-cita`**, sin una ruta propia (D64). Usa `SelectorTurno` de `reserva-cita-tech`, con la especialidad fija (la de la cita, RN-05). El día elegido y el nuevo turno viven en el estado local, porque `/mi-cita` no tiene parámetros.
2. **Turnos libres.** Se usan las mismas consultas `['dias', especialidad]` y `['turnos-libres', especialidad, dia]` (D72), y se muestran la hora y el médico (RN-04). El médico puede cambiar dentro de la especialidad (RN-05, D37).
3. **Sin horarios libres (F3):** se informa y la cita original sigue igual, con la opción «Volver».
4. **Confirmar el cambio:** un Modal **con el mismo patrón que D71**. Muestra «antes → después» (día, hora y médico) y dos botones: «Confirmar cambio» y «Volver». Volver, la X, Escape o el clic fuera cierran el Modal sin cambios (F2). Mientras se envía, el Modal no se cierra.
5. **Mutación de cambio (hipótesis BQ-01).** El servidor ocupa el nuevo turno y recién después libera el anterior (RN-06). La cita conserva el mismo código. No hay límite de cambios (RN-03).
6. **Éxito:**
   - se cierra el Modal y la vista de cambio;
   - se invalidan `['cita', codigo]`, que muestra el nuevo día, hora y médico con el mismo código, `['turnos-libres', especialidad]` y `['dias', especialidad]`, porque cambian ambos turnos;
   - si el aviso falló, se muestra F5 (RN-09).
7. **Error «horario tomado» (F1):** el mensaje aparece dentro del Modal, la selección del nuevo turno se quita y se invalidan los turnos libres. La cita original sigue igual.
8. **Error «ya pasó» (F6):** el mensaje aparece dentro del Modal; al cerrarlo se invalida `['cita', codigo]` para que se vea como pasada (D79). No hay ningún cambio.

### Propiedad del estado en «Mi cita»

| Dato | Quién lo administra | Motivo |
|---|---|---|
| Texto del campo del código | Mantine Form (propuesta) | Formulario de la pantalla |
| Código consultado | Estado local (`useState`) y la clave de Query | D64: nunca en la URL; D78: `gcTime: 0` |
| La cita y su estado | TanStack Query `['cita', codigo]` | D77: el estado lo decide el servidor |
| Botones disponibles | Se calculan al dibujar a partir del estado | D77 |
| Modal abierto o cerrado | `useDisclosure` (estado local) | D71 |
| Pendiente, error y aviso de una operación | `useMutation` | D71 |
| Vista de cambio, día y nuevo turno | Estado local | D64 |
| Días y turnos libres | TanStack Query | D72 |
| Zustand | No interviene | El familiar no tiene sesión (RN-07) |

### Archivos previstos (dentro del árbol de `agenda-consultorio-tech`)

```
src/features/mi-cita/
  MiCitaPage.tsx
  ConsultarCodigoForm.tsx
  DetalleCita.tsx
  acciones-disponibles.ts     # función pura: estado → botones (D77)
  CancelarCitaModal.tsx       # Mantine Modal (D71)
  CambiarCita.tsx             # usa SelectorTurno de features/reserva
  ConfirmarCambioModal.tsx
```

## Dependencias, despliegue, riesgos y validación

**Dependencia bloqueante (BQ-01):** se necesita un servicio que ofrezca:

- consultar una cita por su código, con su estado;
- cancelarla, aplicando RN-02, CN4, la liberación del turno y el aviso;
- cambiarla de forma atómica, aplicando RN-06, F1, F6 y el aviso;
- definir el formato del código.

No se inventan endpoints.

**Riesgos y cómo reducirlos:**

1. **Botones desactualizados** si la pantalla queda abierta (costo aceptado en D77). El servidor rechaza la operación al confirmar.
2. **Doble envío.** Se deshabilitan los botones y el Modal no se cierra mientras la operación está pendiente.
3. **Formato del código desconocido.** Solo se exige que no esté vacío hasta que BQ-01 defina el formato.
4. **Código en memoria.** Se reduce con `gcTime: 0` (D78). Mientras «Mi cita» está abierta, el código sigue en el estado y en la clave de Query, como corresponde.
5. **Versiones.** Las mismas notas que en `agenda-consultorio-tech`.

**Verificación prevista (nada ejecutado):**

| Criterio | Comprobación prevista | Herramienta | Límite |
|---|---|---|---|
| D77, E2, E3 | Prueba pura de `acciones-disponibles`: confirmada da «Cancelar» y «Cambiar»; pasada y cancelada no dan ninguna acción | Vitest (de la cohorte; no instalado) | No prueba la pantalla |
| D64 | En el navegador: después de consultar, la URL sigue siendo `/mi-cita` | Navegador | Necesita datos (BQ-01) |
| D78 | En el navegador: salir de «Mi cita», volver y escribir el mismo código produce una nueva petición en la pestaña Red | Navegador (herramientas de desarrollo) | Necesita datos (BQ-01) |
| D71, CN1, F2 | En el navegador: Volver, Escape o la X cierran sin cambios; mientras se cancela, el Modal no se cierra | Navegador | La confirmación real necesita BQ-01 |
| CN4, F1, F6, RN-06 | Las respuestas del servidor y sus mensajes | Servicio remoto | Bloqueado por BQ-01 |
| Build | `pnpm build` | Vite y TypeScript | No demuestra las integraciones |

**Fuentes (2026-11-10):**

- **TanStack Query.** Context7 `/websites/tanstack_query_framework_react`: `gcTime` (por defecto, 5 minutos) y `queryClient.removeQueries` (https://tanstack.com/query/latest/docs/framework/react/reference/classes/QueryClient.md), además de `useQuery`, `useMutation` e `invalidateQueries`.
- **Mantine.** Context7 `/mantinedev/mantine/9.0.0`: Modal con `opened`, `onClose` y `title`, `useDisclosure`, y cómo impedir el cierre durante una operación (https://github.com/mantinedev/mantine/blob/9.0.0/apps/mantine.dev/src/pages/core/modal.mdx).

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplica este documento:**

- D64: el código no va en la URL; «Cambiar» se resuelve dentro de `/mi-cita`.
- D71: el Modal de cancelación, y el mismo patrón para el cambio.
- D72: las consultas de turnos libres y sus invalidaciones.
- D77: solo el servidor decide si una cita ya pasó.
- D78: `gcTime: 0` para la consulta de la cita.
- D79: después de un error «ya pasó» (CN4 o F6), al cerrar el Modal se vuelve a pedir la cita para mostrarla como pasada.

**Propuestas del agente pendientes de revisión:**

- el formulario del código con Zod, que solo exige que no esté vacío;
- el contrato con solo los campos visibles y el estado;
- `mutation.reset()` al abrir el Modal;
- la función pura `acciones-disponibles`;
- los textos de botones y mensajes;
- los nombres de los archivos.

**Preguntas abiertas:**

- BQ-01: el contrato, el formato del código y la atomicidad del cambio.