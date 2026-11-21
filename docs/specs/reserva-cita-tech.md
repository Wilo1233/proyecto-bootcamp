---
slug: "reserva-cita-tech"
title: "Diseño técnico: reserva de una cita"
description: "Diseño técnico propuesto de «Reservar cita»: selección de especialidad, día y turno, formulario de datos con Zod y Mantine Form, consultas y mutación de la reserva, y confirmación con el código."
spec_kind: spec-tech
status: approved
created_at: "2026-11-11T01:47:01.091Z"
last_updated: "2026-11-11T02:04:37.057Z"
source_spec: reserva-cita
---
> **Estado:** borrador para la revisión del estudiante. Es un diseño propuesto; nada está implementado ni instalado. Las partes marcadas como **hipótesis (BQ-01)** dependen de un servicio remoto que todavía no existe. Lo común (stack, proveedores, tabla de rutas, layouts, store de sesión y árbol de carpetas) está en `agenda-consultorio-tech` (aprobado) y aquí solo se referencia (D62).

## Fuente y evidencia actual

**Especificación funcional de origen (`sourceSpec`):** `reserva-cita` (aprobada; revisión vigente con `lastUpdated` 2026-11-09T06:02:20.903Z). Caso fuente: `reservar-cita` (aprobado). Usa reglas compartidas de `gestion-cita-codigo`: RN-01, RN-02, RN-04, RN-07, RN-08 y RN-09.

**Base existente (hechos al 2026-11-10):** la plantilla Vite + React 19.2.8 + TypeScript; no hay nada de la reserva implementado. Las librerías de la cohorte no están instaladas. No existe un servicio remoto (BQ-01).

**Ruta:** `/reservar`, en el grupo público, con `?especialidad=…&dia=…` (D65). Ver la tabla de rutas de `agenda-consultorio-tech`.

## Límites, contratos y diseño

### Recorrido técnico (PR-03)

1. **Especialidades.** La pantalla pide las especialidades que tienen turnos reservables. **Hipótesis:** clave `['especialidades-con-turnos']`. Si la lista está vacía, aplica A1 / CA-03.13: «por ahora no hay horarios libres».
2. **Elegir una especialidad.** Se escribe en la URL con `setSearchParams` (D65), lo que agrega una entrada al historial.
3. **Días de la especialidad.** **Hipótesis:** clave `['dias', especialidad]`, con `enabled` solo si la especialidad tiene una forma válida (D68). Cada día viene marcado como libre o completo. Los completos se ven pero no se pueden elegir (RN-04, CA-03.2).
4. **Elegir un día.** Se escribe en la URL (D65).
5. **Turnos libres del día (D72).** Clave `['turnos-libres', especialidad, dia]`, con `enabled` solo si la especialidad y el día son válidos. Cada turno muestra la hora y el médico (RN-04, CA-03.3). Estados en pantalla:
   - cargando;
   - error, con «reintentar»;
   - vacío: los horarios se ocuparon mientras se elegía (A1), y se puede elegir otro día u otra especialidad;
   - éxito.
6. **Elegir un turno.** Se guarda en el estado local de la pantalla (`useState`), no en la URL (D65 solo pone la especialidad y el día).
7. **Formulario de datos (D70, D73, D74).** Ver la sección siguiente.
8. **Confirmar.** `form.onSubmit` ejecuta el schema. Si hay errores, se muestran todos junto a sus campos y no se envía nada (A3, A4). Si el formulario es válido, se lanza la **mutación de reserva** (hipótesis BQ-01), con el turno elegido y los datos.
9. **Mientras se envía.** El botón «Confirmar» muestra que está cargando y queda deshabilitado (`isPending`), para no enviar dos veces (propuesta).
10. **Éxito.** Se muestra la confirmación con los datos que devuelve la mutación: código, especialidad, médico, día, hora y paciente (RN-11, RN-12, RN-13, CA-03.15). El código aparece de forma destacada.
    - Si la respuesta indica que el mensaje no se pudo enviar, se muestra el aviso de A5 / RN-09: la cita sigue confirmada; anota el código.
    - Se invalidan `['turnos-libres', especialidad]` y `['dias', especialidad]`, para que ese turno deje de ofrecerse (CA-03.5 del caso fuente: un horario reservado deja de estar disponible).
11. **Error «turno tomado» (A2) o «ya empezó» (A6), devuelto por el servidor.** Se informa el motivo, se quita la selección del turno y se invalidan `['turnos-libres', especialidad, dia]` y `['dias', especialidad]`, de modo que se muestran los horarios libres restantes. **Decisión D76:** los datos del formulario se conservan y solo se quita el turno elegido, para que el familiar no tenga que escribirlos de nuevo.
12. **Error de red o del servidor.** Se muestra un mensaje con «reintentar» y la cita no se da por registrada. Riesgo: si el servidor registró la cita y la respuesta se perdió, reintentar podría duplicarla. Eso lo debe resolver el servidor (BQ-01).
13. **Salir antes de confirmar (A7).** Los valores viven en Mantine Form, dentro de la pantalla, y se descartan al salir. No se registra nada.

### Propiedad del estado en «Reservar cita»

| Dato | Quién lo administra | Motivo |
|---|---|---|
| Especialidad y día elegidos | URL (`useSearchParams`) | D65; se leen al dibujar, sin `useEffect` |
| Aviso de parámetro inválido | Se calcula al dibujar | D68 |
| Turno elegido | Estado local (`useState`) | Solo lo usa esta pantalla |
| Valores y errores del formulario | Mantine Form | D70, D74 |
| Especialidades, días y turnos libres | TanStack Query (hipótesis) | Datos remotos; no se copian a otro estado |
| Resultado de la reserva (incluido el código) | Datos de `useMutation` | D75: no se copia ni se persiste |
| Sesión de la secretaria | No interviene | El familiar no tiene cuenta (RN-12) |

### Formulario de datos: regla → schema Zod → Mantine Form → respuesta visible

**Campos y reglas aprobadas (RN-14, RN-15, D43–D46, D50):**

| Campo | Regla | Valor inicial (propuesta) |
|---|---|---|
| `pacienteNombre` | Obligatorio | `''` |
| `pacienteMenor` | Obligatorio: «sí» o «no» (menor = menos de 18 años; el producto no lo comprueba) | `''` (sin elegir) |
| `agregarAcompanante` | Opcional si es mayor | `false` |
| `acompananteNombre` | Obligatorio si es menor, o si se agrega un acompañante (RN-14) | `''` |
| `familiarNombre` | Obligatorio (D50) | `''` |
| `familiarTelefono` | Obligatorio: 10 dígitos que empiezan con 09 (D46) | `''` |
| `canal` | Obligatorio: correo o WhatsApp (RN-08) | `''` (sin elegir) |
| `familiarCorreo` | Obligatorio y con forma usuario@dominio **solo si** el canal es correo (D45, RN-15) | `''` |

**Esquema propuesto (D73: un objeto con reglas cruzadas; boceto que no se ejecutó):**

```ts
import { z } from 'zod/v4'

const celularEcuador = /^09\d{8}$/

export const datosReservaSchema = z
  .object({
    pacienteNombre: z.string().trim().min(1, { error: 'Escribe el nombre y apellido del paciente' }),
    pacienteMenor: z.enum(['si', 'no'], { error: 'Indica si el paciente es menor de edad' }),
    agregarAcompanante: z.boolean(),
    acompananteNombre: z.string().trim(),
    familiarNombre: z.string().trim().min(1, { error: 'Escribe tu nombre y apellido' }),
    familiarTelefono: z.string().regex(celularEcuador, { error: 'Escribe un celular de 10 dígitos que empiece con 09' }),
    canal: z.enum(['correo', 'whatsapp'], { error: 'Elige cómo quieres recibir los mensajes' }),
    familiarCorreo: z.string().trim(),
  })
  .refine(
    (d) => !(d.pacienteMenor === 'si' || d.agregarAcompanante) || d.acompananteNombre.length > 0,
    { error: 'Faltan el nombre y apellido del acompañante', path: ['acompananteNombre'] },
  )
  .refine(
    (d) => d.canal !== 'correo' || z.email().safeParse(d.familiarCorreo).success,
    { error: 'Escribe un correo válido, por ejemplo usuario@dominio.com', path: ['familiarCorreo'] },
  )
```

- **Conexión:** `useForm({ mode: 'uncontrolled', initialValues, validate: schemaResolver(datosReservaSchema, { sync: true }) })`. Los errores quedan en `form.errors` y cada campo los muestra con `getInputProps` (D74: solo al confirmar).
- **Mensajes:** los textos son propuestas de redacción, pendientes de revisión.
- **`z.infer`:** se puede usar para el tipo de los valores, pero **no valida**. La validación ocurre solo cuando se ejecuta el schema, a través de `schemaResolver` en el submit o de `safeParse`.
- **Lo que el formulario no garantiza:** que el turno siga libre (RN-01, A2), que no haya empezado (RN-10, A6) y el registro de la cita. Lo garantiza el servidor al confirmar (BQ-01). Que el paciente sea realmente menor tampoco se comprueba (RN-14). Además, el servidor debe **volver a validar RN-14 y RN-15**: la validación del navegador se puede saltar, porque cualquiera podría enviar datos sin pasar por el formulario (igual que la guardia visual de D63; dependencia de BQ-01).

**Ejemplos válidos e inválidos (de los criterios aprobados):**

| Ejemplo | Entrada | Resultado esperado del schema |
|---|---|---|
| Lucía (válido, paso 4 de la fase 2) | Paciente María, «no» menor, sin acompañante; familiar Lucía, `0991234567`, correo, `rosa@correo.com` | Válido |
| Pedro (CA-03.5, A4) | Paciente Mateo, «sí» menor, acompañante vacío | Error en `acompananteNombre`: «Faltan el nombre y apellido del acompañante» |
| Teléfonos (CA-03.7) | `099123456`, `09912345678`, `0891234567`, `09912a4567` / `0991234567` | Error en `familiarTelefono` / válido |
| Correo (CA-03.8) | Canal correo con `rosa.correo.com` o vacío / `rosa@correo.com` | Error en `familiarCorreo` / válido |
| WhatsApp sin correo (CA-03.8) | Canal WhatsApp y correo vacío | Válido |
| Falta un nombre (CA-03.9) | `pacienteNombre` o `familiarNombre` vacío | Error en el campo que falta |
| Mayor sin acompañante (CA-03.6) | «no» menor, `agregarAcompanante` en `false` | Válido |

### Componente reutilizable de días y turnos

`SelectorTurno` recibe por props la especialidad, el día elegido, el turno elegido y los callbacks para cambiarlos. **No lee la URL por su cuenta.** Así sirve en «Reservar cita» (el día viene de la URL, D65) y en «Mi cita» al cambiar una cita (el día vive en el estado local, porque `/mi-cita` no tiene parámetros: D64). El detalle de ese segundo uso está en el `spec-tech` de `gestion-cita-codigo`.

### Archivos previstos (dentro del árbol de `agenda-consultorio-tech`)

```
src/features/reserva/
  ReservarPage.tsx
  SelectorTurno.tsx           # reutilizado en mi-cita
  DatosReservaForm.tsx
  datos-reserva-schema.ts     # schema Zod (D73)
  ConfirmacionReserva.tsx
```

## Dependencias, despliegue, riesgos y validación

**Dependencia bloqueante (BQ-01):** se necesita un servicio que ofrezca:

- las especialidades con turnos;
- los días de una especialidad;
- los turnos libres;
- la reserva, que comprueba RN-01 y RN-10, genera el código, envía el mensaje e informa si falló.

No se inventan endpoints.

**Riesgos y cómo reducirlos:**

1. **Reglas cruzadas que no se ejecutan.** Según la documentación de Zod, un `refine` de objeto no se ejecuta si antes hubo errores que no permiten continuar, como un tipo incorrecto. Para reducirlo, todos los valores iniciales tienen el tipo correcto (texto o booleano) y, si hace falta, se usa la opción `when`. Se comprueba con la prueba «formulario vacío con canal correo y paciente menor: aparecen todos los errores a la vez».
2. **`z.email()` frente a «usuario@dominio».** Puede ser más estricto que la regla aprobada en casos límite. Se comprueba con los ejemplos de CA-03.8 y, si difiere, se usa una expresión acorde con D46.
3. **Respuesta perdida y reintento** (posible cita duplicada). Lo debe resolver el servidor (BQ-01).
4. **Código perdido.** Si el mensaje falló y el familiar recarga sin haberlo anotado, pierde el código. Es un costo aceptado en D75, y no hay recuperación (D40).
5. **Versión de Zod.** Se consultó la documentación de la 4.3.6 y la cohorte usa la 4.4.3. Al implementar, revisar el changelog.

**Verificación prevista (nada ejecutado):**

| Criterio | Comprobación prevista | Herramienta | Límite |
|---|---|---|---|
| RN-14, RN-15 (CA-03.5 a CA-03.9) | Pruebas puras de `datosReservaSchema.safeParse` con la tabla de ejemplos | Vitest (de la cohorte; no instalado) | No prueban la pantalla |
| Riesgo 1 | Prueba pura con el formulario vacío y reglas cruzadas | Vitest | — |
| D74 | Recorrido en el navegador: no se ven errores al escribir; al confirmar aparecen todos; al corregir un campo, su error desaparece | Navegador | Manual |
| D65 | Recargar `/reservar?especialidad=…&dia=…` conserva la especialidad y el día | Navegador | Necesita datos reales (BQ-01) |
| D72, A2, A6, A5 | Reservar, comprobar que el turno desaparece y simular «turno tomado» | Servicio remoto | Bloqueado por BQ-01 |
| RN-14, RN-15 en el servidor | Una petición directa con datos inválidos (por ejemplo, un menor sin acompañante) es rechazada | Servicio remoto | Bloqueado por BQ-01 |
| Build | `pnpm build` | Vite y TypeScript | No demuestra las integraciones |

**Fuentes (2026-11-10):**

- **Zod.** Context7 `/colinhacks/zod` v4.3.6: `safeParse`, el parámetro `error` y que `.superRefine()` está obsoleto (se reemplaza por `.check()`). zod.dev `llms-full`: `.refine` con `path` y `when` (https://zod.dev/llms-full.txt).
- **Mantine Form.** Context7 `/mantinedev/mantine/9.0.0`: `schemaResolver`, `validateInputOnBlur`, `validateInputOnChange` y `clearInputErrorOnChange` (https://github.com/mantinedev/mantine/blob/9.0.0/apps/mantine.dev/src/pages/form/validation.mdx).
- **React Router y TanStack Query:** ver `agenda-consultorio-tech`.

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplica este documento:**

- D64: el código no va en la URL.
- D65: la especialidad y el día van en la URL.
- D68: un parámetro inválido usa el valor por defecto y muestra un aviso.
- D70: este es el formulario documentado en profundidad.
- D72: consulta de turnos libres e invalidación al reservar.
- D73: un objeto con reglas cruzadas en `.refine()`.
- D74: los errores se muestran solo al confirmar.
- D75: el código vive solo en la respuesta de la mutación.
- D76: tras A2 o A6 se conservan los datos del formulario y solo se quita el turno elegido.

**Propuestas del agente pendientes de revisión:**

- los nombres de los campos y de los archivos;
- usar `trim` (un nombre hecho solo de espacios cuenta como vacío);
- el campo `agregarAcompanante`;
- deshabilitar «Confirmar» mientras se envía;
- las claves `['especialidades-con-turnos']` y `['dias', especialidad]`;
- la redacción de los mensajes;
- que `SelectorTurno` se controle por props.

**Preguntas abiertas:**

- BQ-01: el contrato del servicio y cómo evitar duplicados al reintentar.
- ¿Cuándo se quita de la URL un parámetro inválido? Sigue abierta desde `agenda-consultorio-tech`.