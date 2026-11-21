---
slug: "agenda-consultorio"
title: "Agenda del consultorio"
description: "La secretaria entra con su usuario, publica por bloques los turnos de un médico para un día, quita turnos libres y consulta las citas reservadas por día, médico o nombre del paciente."
spec_kind: spec
status: approved
created_at: "2026-11-09T05:06:22.218Z"
last_updated: "2026-11-09T06:02:21.247Z"
source_use_cases:
  - publicar-horarios
  - consultar-citas
---
## Casos de uso fuente y alcance

**Casos de uso fuente (aprobados):** publicar-horarios y consultar-citas.

**Alcance:** el trabajo de la secretaria en el producto: entrar con su usuario y contraseña, publicar por bloques los turnos de un médico para un día, quitar turnos que siguen libres y consultar las citas reservadas. La reserva y lo que el familiar hace con su código están en `reserva-cita` y `gestion-cita-codigo` (aprobadas); aquí se indican solo sus efectos en la agenda.

**Actores**

- **Secretaria del consultorio** (actor principal); su cuenta ya existe. (D2, D18)
- **Médicos y especialidades:** son datos ya cargados en el producto, no actores; los médicos no usan el producto. (D2, D20)
- **Familiar:** no interviene aquí; ve los turnos publicados al reservar. (D3, D9)

**Procesos de esta especificación:** PR-01 Publicar horarios de un médico (incluye quitar turnos libres) y PR-02 Consultar citas reservadas. Numeración común: PR-03 en `reserva-cita`; PR-04 a PR-06 en `gestion-cita-codigo`.

**Reglas que usa y que están definidas en otras especificaciones:** RN-01 (un turno, una cita) y RN-02 (criterio de tiempo: cuenta la hora en que se confirma, comparada con la hora de inicio) de `gestion-cita-codigo`; RN-10 (turnos que se pueden reservar) y RN-17 (identificación en recepción) de `reserva-cita`.

## Ingreso de la secretaria (condición previa común de PR-01 y PR-02)

No es un caso de uso separado (D18): es la condición previa de los dos procesos.

1. La secretaria ingresa su usuario y su contraseña.
2. Si son correctos, entra y puede usar «Horarios» y «Citas». (RN-18)
3. Si no lo son, el producto indica «usuario o contraseña incorrectos», sin decir cuál de los dos falla, y permite reintentar. Después de 5 intentos fallidos seguidos con ese usuario, aplica la espera de RN-19.

## Procesos

### PR-01 · Publicar horarios de un médico

- **Caso relacionado:** publicar-horarios.
- **Actor e inicio:** la secretaria conoce el día y las horas en que atenderá un médico y quiere ofrecerlos para reserva.
- **Condiciones previas:** la secretaria ingresó (RN-18); el médico y su especialidad ya están cargados. (D20)
- **Datos de entrada:** médico, un día, hora de inicio, hora de fin y duración de cada turno (elegida de la lista de RN-21).
- **Pasos**
  1. La secretaria entra a «Horarios».
  2. El producto muestra la lista de médicos con su especialidad.
  3. La secretaria elige un médico.
  4. La secretaria indica un día, la hora de inicio y la hora de fin, y elige la duración de cada turno. (RN-20, RN-21)
  5. La secretaria confirma la publicación.
  6. El producto comprueba los datos (B2), divide el rango en turnos completos (RN-22), descarta los turnos que ya empezaron si el día es hoy (RN-23) y los que se superponen con turnos ya publicados de ese médico (RN-24), y publica los demás como libres.
  7. El producto muestra los turnos publicados de ese médico y ese día, y un resumen: cuántos turnos se publicaron, cuántos minutos sobraron y cuántos turnos no se publicaron por haber empezado o por superponerse.
  8. Desde ese momento, los turnos publicados aparecen como libres para los familiares que reservan en la especialidad del médico, cada uno con el nombre del médico (PR-03, RN-04, RN-10).
- **Reglas aplicables:** RN-01, RN-02, RN-10, RN-18, RN-19, RN-20, RN-21, RN-22, RN-23, RN-24 y RN-25.
- **Resultado (éxito):** los turnos nuevos quedan publicados como libres. Los turnos que el médico ya tenía y sus citas no cambian.
- **Alternativas y errores**
  - **B1. Rango superpuesto:** los turnos que se superponen con turnos ya publicados del mismo médico no se publican; los demás sí, y el producto informa cuáles no se publicaron. Si todos se superponen, no se publica nada. (RN-24)
  - **B2. Datos inválidos:** si el día ya pasó, si la hora de fin no es posterior a la de inicio, o si falta el médico, el día, alguna de las horas o la duración, el producto indica qué corregir y no publica nada.
  - **B3. Quitar un turno libre:** la secretaria elige un turno publicado que no tiene cita y lo quita; deja de existir y de aparecer para los familiares. (RN-25)
  - **B4. Intento de quitar un turno con cita:** el producto no lo permite e informa que el turno ya está reservado; el turno y su cita siguen igual. (RN-25)
  - **B5. No entra ningún turno completo:** si la duración es mayor que el rango, el producto indica que no se puede crear ningún turno y no publica nada. (RN-22)
  - **B6. Publicación para hoy en la que todos los turnos ya empezaron:** el producto lo informa y no publica nada. (RN-23)
  - **B7. Turno quitado mientras un familiar lo reservaba:** al confirmar la reserva, el producto informa al familiar que ese horario ya no está disponible, no registra la cita y le muestra los horarios libres restantes (como en A2 de `reserva-cita`). (RN-25)
  - **B8. La secretaria sale antes de confirmar la publicación (cancelación del proceso):** no se publica nada.

### PR-02 · Consultar citas reservadas

- **Caso relacionado:** consultar-citas.
- **Actor e inicio:** la secretaria quiere revisar las citas de un día; o un paciente llega y dice su nombre en recepción (RN-17); o un médico no podrá atender y la secretaria necesita avisar a los familiares. (D14, D21)
- **Condiciones previas:** la secretaria ingresó. (RN-18)
- **Datos de entrada (opcionales):** otro día, un médico para filtrar o parte del nombre del paciente.
- **Pasos**
  1. La secretaria entra a «Citas».
  2. El producto muestra las citas confirmadas de hoy, ordenadas por hora. (RN-26)
  3. Si lo necesita, la secretaria elige otro día, filtra por médico o busca por el nombre del paciente. (RN-27)
  4. El producto muestra las citas que coinciden, con los datos de RN-26.
  5. La secretaria identifica la cita que buscaba.
- **Reglas aplicables:** RN-17, RN-18, RN-19, RN-26, RN-27 y RN-28.
- **Resultado:** la secretaria ve las citas con los datos necesarios para atender al paciente en recepción o llamar al familiar. Consultar no cambia ninguna cita ni ningún turno.
- **Alternativas y errores**
  - **C1. Día sin citas:** el producto indica que no hay citas para ese día.
  - **C2. Búsqueda sin resultados:** la búsqueda se hace sobre el día que se está viendo; si no hay coincidencias, el producto lo indica.
  - **C3. Varias coincidencias:** el producto muestra todas, con hora y médico, para que la secretaria identifique la correcta. (RN-27)
  - **C4. Un médico no podrá atender:** la secretaria filtra por ese médico y usa el nombre y el teléfono de cada familiar para llamarlo por fuera del producto; la cita no se cancela desde el producto. (D21)

## Reglas del negocio

Reglas nuevas de esta especificación. Las compartidas que ya existen se referencian arriba, sin repetirlas.

- **RN-18. Acceso de la secretaria.**
  - Condición: alguien quiere publicar o quitar turnos, o ver la lista de citas.
  - Comportamiento: solo puede hacerlo la secretaria después de ingresar con su usuario y contraseña. Sin ingresar, esas acciones no se pueden usar, aunque alguien conozca la sección; no basta con ocultarlas. El familiar no tiene acceso a ellas.
  - Motivo: D18 (proteger la agenda y los datos de los pacientes).
  - Procesos: PR-01, PR-02.
- **RN-19. Intentos de ingreso.**
  - Condición: la secretaria ingresa un usuario o una contraseña incorrectos.
  - Comportamiento: el producto indica «usuario o contraseña incorrectos», sin decir cuál falla. Después de 5 intentos fallidos seguidos con ese usuario, debe esperar 15 minutos; durante la espera no se acepta ningún intento, ni siquiera el correcto. Al terminar la espera, el conteo vuelve a cero (otros 5 intentos). Un ingreso correcto también reinicia el conteo. La espera es por usuario.
  - Motivo (D56, D57, estudiante): protege los datos de los pacientes sin que nadie tenga que desbloquear la cuenta; un bloqueo permanente no tendría salida porque administrar cuentas está excluido; la regla es fácil de explicar y de comprobar.
  - Límites: con 4 intentos fallidos todavía puede intentar; el 5.º activa la espera; a los 14 minutos de espera, incluso la contraseña correcta se rechaza; a los 15 minutos puede volver a intentar, con el conteo en cero.
  - Procesos: PR-01, PR-02.
- **RN-20. Publicación por bloques de un día.**
  - Condición: la secretaria publica turnos.
  - Comportamiento: indica un médico, un solo día, una hora de inicio, una hora de fin y la duración de cada turno. Para publicar varios días, repite la publicación una vez por día.
  - Motivo: D19 y D54 (estudiante: cada publicación es simple y su resultado se entiende fácil; repetirla para varios días es un costo aceptado).
  - Procesos: PR-01.
- **RN-21. Duraciones permitidas.**
  - Condición: la secretaria elige la duración de los turnos.
  - Comportamiento: elige una de una lista fija: 15, 20, 30, 45 o 60 minutos. No se puede indicar otra duración.
  - Motivo (D53, estudiante): rápido de elegir, sin errores de tipeo, coherente con D19 y con pocos casos límite.
  - Procesos: PR-01.
- **RN-22. División del rango en turnos (cálculo).**
  - Condición: la secretaria confirma una publicación con datos válidos.
  - Comportamiento: desde la hora de inicio, el producto arma turnos consecutivos de la duración elegida mientras el turno completo termine a la hora de fin o antes. Los minutos que sobran al final no se publican. El producto informa cuántos turnos se crearon y cuántos minutos sobraron. Si no entra ningún turno completo, no publica nada (B5).
  - Motivo (D52, estudiante): todos los turnos duran lo mismo y la secretaria no tiene que hacer cuentas antes de publicar.
  - Procesos: PR-01. Detalle y ejemplos en «Cálculos».
- **RN-23. Publicación para el día de hoy.**
  - Condición: el día de la publicación es hoy.
  - Comportamiento: se publican solo los turnos cuya hora de inicio todavía no llegó (mismo criterio de tiempo que RN-02 y RN-10); el producto informa cuántos no se publicaron porque ya empezaron. Si todos ya empezaron, no publica nada (B6). Un día anterior a hoy es un dato inválido (B2).
  - Motivo (D55, estudiante): coherente con RN-10; la secretaria no tiene que corregir nada.
  - Procesos: PR-01.
- **RN-24. Sin turnos superpuestos.**
  - Condición: un turno nuevo se superpone con un turno ya publicado del mismo médico ese día (empieza antes de que el otro termine y termina después de que el otro empieza), tenga o no cita.
  - Comportamiento: ese turno no se publica; los turnos nuevos que no se superponen sí. El producto informa cuáles no se publicaron. Un turno que empieza exactamente cuando termina otro no se superpone con él. (D59)
  - Motivo: B1 aprobada (D22): un médico no atiende dos turnos a la vez. La publicación parcial y el límite «empieza justo cuando termina el otro» los confirmó el estudiante con su ejemplo (D59).
  - Ejemplo (D59, del estudiante): el Dr. Andrade ya tiene el miércoles turnos de 20 minutos de 14:00 a 17:20; se publica el mismo día de 16:00 a 18:00 con turnos de 20 minutos → 16:00, 16:20, 16:40 y 17:00 no se publican por superponerse; se publican 17:20 y 17:40; sobran 0 minutos.
  - Procesos: PR-01.
- **RN-25. Solo se quitan turnos libres.**
  - Condición: la secretaria quiere quitar un turno publicado.
  - Comportamiento: si el turno está libre, se quita y deja de aparecer para los familiares; si tiene cita, no se puede quitar y el producto informa que ya está reservado. Si un familiar estaba reservando un turno que se quitó, al confirmar no se registra la cita (B7).
  - Motivo: D21 (corregir errores sin sumar una cancelación por parte del consultorio).
  - Procesos: PR-01, PR-03.
- **RN-26. Contenido de la lista de citas.**
  - Condición: la secretaria ve la lista de citas.
  - Comportamiento: se muestran las citas confirmadas del día elegido (hoy, por defecto), ordenadas por hora. De cada una: hora, médico y especialidad, nombre y apellido del paciente, si es menor de edad, acompañante (si lo hay) y nombre y teléfono del familiar. No se muestran el código de reserva, el correo ni el canal de mensajes. Las citas canceladas no aparecen; las citas cambiadas aparecen en su nuevo día, hora y médico.
  - Motivo: D23, D26, D28 y D51 (estudiante: la secretaria ve lo mínimo que necesita para atender y llamar).
  - Procesos: PR-02.
- **RN-27. Búsqueda por nombre del paciente.**
  - Condición: la secretaria escribe un texto para buscar.
  - Comportamiento: la búsqueda se hace sobre el día que se está viendo. Una cita coincide si el texto escrito aparece en cualquier parte del nombre y apellido del paciente, sin importar mayúsculas ni tildes. Si hay varias coincidencias, se muestran todas, con hora y médico (C3).
  - Motivo (D58, estudiante): los nombres se escriben distinto («Jose» o «José») y en recepción hay que encontrar al paciente rápido.
  - Procesos: PR-02.
- **RN-28. La lista es de consulta.**
  - Condición: la secretaria está en la lista de citas.
  - Comportamiento: no puede crear, asignar, cambiar ni cancelar citas desde ahí.
  - Motivo: D3 y D21.
  - Procesos: PR-02.

## Datos necesarios

| Dato | Lo aporta | Significado y valores permitidos | Obligatorio | Quién lo ve o lo modifica |
|---|---|---|---|---|
| Usuario y contraseña | La secretaria | Los de su cuenta, que ya existe | Sí, para ingresar | Solo la secretaria. No se administran en el producto (D18). |
| Intentos fallidos seguidos y fin de la espera | Los conoce el producto | De 0 a 5 intentos; espera de 15 minutos | — | Nadie los modifica a mano. |
| Médico | La secretaria lo elige | Uno de los médicos cargados, con su especialidad | Sí, para publicar | Lo ven la secretaria y, junto a cada horario, el familiar. No se edita (D20). |
| Día | La secretaria lo indica | Hoy o un día futuro | Sí, para publicar | La secretaria. |
| Hora de inicio y hora de fin | La secretaria las indica | Horas del día; la de fin debe ser posterior a la de inicio | Sí, para publicar | La secretaria. |
| Duración | La secretaria la elige | 15, 20, 30, 45 o 60 minutos | Sí, para publicar | La secretaria. |
| Turno | Lo calcula el producto | Médico, especialidad, día, hora de inicio y de fin; libre u ocupado | — | Los turnos libres los ve el familiar al reservar; la secretaria ve los publicados y puede quitar los libres. |
| Resumen de la publicación | Lo calcula el producto | Turnos publicados, minutos sobrantes, turnos no publicados por haber empezado o por superponerse | — | La secretaria. |
| Día de la lista, filtro por médico y texto de búsqueda | La secretaria | Día (hoy por defecto); un médico; parte de un nombre | No | La secretaria. |
| Datos de cada cita en la lista | Vienen de la reserva | Ver RN-26 | — | Solo la secretaria; no los modifica (RN-28). |

## Estados y cambios permitidos

**Turno**

| Desde | Hacia | Quién lo inicia | Condición | Efecto |
|---|---|---|---|---|
| — | Libre | Secretaria (publicar) | RN-20 a RN-24 | Aparece para los familiares mientras su hora de inicio no llegue (RN-10). |
| Libre | Ocupado | Familiar (reservar o cambiar hacia ese turno) | RN-01, RN-10 | Deja de aparecer como libre. |
| Ocupado | Libre | Familiar (cancelar o cambiar desde ese turno) | El familiar confirma antes de la hora de inicio (RN-02) | Vuelve a aparecer como libre si su hora de inicio no llegó. |
| Libre | Quitado | Secretaria | El turno no tiene cita (RN-25) | Deja de existir y de aparecer para los familiares. |
| Ocupado | Quitado | — | No permitido (RN-25, B4) | — |

Un turno libre cuya hora de inicio llegó deja de ofrecerse (RN-10); no se trata como un estado aparte.

**Ingreso de la secretaria**

| Desde | Hacia | Condición | Efecto |
|---|---|---|---|
| Sin ingresar | Ingresada | Usuario y contraseña correctos, fuera de una espera | Puede usar «Horarios» y «Citas»; el conteo vuelve a cero. |
| Sin ingresar | En espera | 5.º intento fallido seguido | Durante 15 minutos no se acepta ningún intento. |
| En espera | Sin ingresar | Pasan 15 minutos | Conteo en cero; puede volver a intentar. |

Mensajes como «usuario o contraseña incorrectos», «publicando» o «no hay citas para este día» son respuestas temporales, no estados.

## Cálculos

**División del rango en turnos (RN-22, con RN-23 y RN-24)**

- **Entradas:** hora de inicio, hora de fin y duración (15, 20, 30, 45 o 60 minutos).
- **Unidad:** minutos.
- **Regla en palabras:** cantidad de turnos = cuántas veces entra la duración completa entre la hora de inicio y la de fin; los minutos sobrantes no se publican. No hay redondeo: un turno incompleto nunca se crea. Después se descartan los turnos que ya empezaron (si es hoy) y los que se superponen.
- **Ejemplo exacto:** de 8:00 a 12:00 con turnos de 30 minutos → 240 minutos ÷ 30 = 8 turnos (8:00, 8:30, …, 11:30); sobran 0 minutos.
- **Ejemplo con sobrante:** de 8:00 a 12:00 con turnos de 45 minutos → 5 turnos (8:00, 8:45, 9:30, 10:15 y 11:00, que termina a las 11:45); sobran 15 minutos.
- **Límite, ningún turno:** de 8:00 a 8:30 con turnos de 45 minutos → 0 turnos; no se publica nada (B5).
- **Límite, publicación para hoy:** son las 10:00 y se publica para hoy de 8:00 a 12:00 con turnos de 30 minutos → se calculan 8 turnos; 5 ya empezaron (8:00, 8:30, 9:00, 9:30 y 10:00, porque a las 10:00 su hora de inicio ya llegó); se publican 3 (10:30, 11:00 y 11:30) y se informa que 5 no se publicaron.
- **Superposición:** el médico ya tiene turnos de 8:00 a 10:00 de 30 minutos; se publica de 9:00 a 12:00 con turnos de 45 minutos → se calculan 9:00, 9:45, 10:30 y 11:15; 9:00 y 9:45 se superponen con turnos existentes (9:00–9:30 y 9:30–10:00) y no se publican; se publican 10:30 y 11:15.

## Exclusiones y límites de esta versión

- Crear o administrar cuentas del personal, lo que incluye desbloquear, recuperar o cambiar la contraseña. (D18)
- Agregar, editar o quitar médicos y especialidades. (D20)
- Cancelar citas por parte del consultorio; si un médico falta, la secretaria llama a los familiares por fuera del producto. (D21)
- Publicar varios días de una vez. (D54)
- Duraciones fuera de la lista y turnos de distinta duración dentro de un mismo bloque. (D52, D53)

## Criterios de aceptación

**Ingreso de la secretaria (PR-01 y PR-02)**

- **CA-01.1** (RN-18). Condición: nadie ingresó. Acción: se intenta publicar o quitar turnos, o ver la lista de citas. Resultado: no se puede; el producto pide ingresar.
- **CA-01.2** (RN-19). Condición: la secretaria lleva 4 intentos fallidos seguidos. Acción: falla el 5.º. Resultado: hasta el 4.º, el producto indica «usuario o contraseña incorrectos», sin decir cuál falla, y permite reintentar; con el 5.º, indica que debe esperar 15 minutos.
- **CA-01.3** (RN-19). Condición: la secretaria está en espera desde hace 14 minutos. Acción: ingresa usuario y contraseña correctos. Resultado: no entra. A los 15 minutos, con los datos correctos, entra.
- **CA-01.4** (RN-19). Condición: la secretaria lleva 3 intentos fallidos. Acción: ingresa bien. Resultado: entra y el conteo vuelve a cero.

**PR-01 · Publicar horarios de un médico**

- **CA-01.5** (RN-20, RN-21, RN-22). Condición: el Médico 1 de Medicina general no tiene turnos el martes. Acción: la secretaria publica el martes de 8:00 a 12:00 con turnos de 30 minutos. Resultado: se publican 8 turnos libres; el resumen indica 8 turnos y 0 minutos sobrantes; los familiares ven esos turnos en Medicina general, cada uno con el nombre del Médico 1.
- **CA-01.6** (RN-22). Condición: igual. Acción: publica de 8:00 a 12:00 con turnos de 45 minutos. Resultado: se publican 5 turnos (8:00, 8:45, 9:30, 10:15 y 11:00) y el resumen indica que sobraron 15 minutos.
- **CA-01.7** (RN-22; B5). Acción: publica de 8:00 a 8:30 con turnos de 45 minutos. Resultado: no se publica ningún turno y el producto indica que no entra ninguno.
- **CA-01.8** (RN-21). Acción: la secretaria elige la duración. Resultado: solo puede elegir 15, 20, 30, 45 o 60 minutos.
- **CA-01.9** (RN-23). Condición: hoy son las 10:00. Acción: publica para hoy de 8:00 a 12:00 con turnos de 30 minutos. Resultado: se publican 10:30, 11:00 y 11:30, y el producto informa que 5 turnos no se publicaron porque ya empezaron.
- **CA-01.10** (RN-23; B2). Acción: intenta publicar para un día anterior a hoy, o con la hora de fin igual o anterior a la de inicio, o sin duración. Resultado: el producto indica qué corregir y no publica nada.
- **CA-01.11** (RN-24; B1). Condición: el Médico 1 ya tiene turnos de 8:00 a 10:00 de 30 minutos ese día. Acción: publica de 9:00 a 12:00 con turnos de 45 minutos. Resultado: se publican 10:30 y 11:15; el producto informa que 9:00 y 9:45 no se publicaron por superponerse; los turnos que ya existían no cambian.
- **CA-01.12** (RN-25; B3). Condición: el turno del martes a las 11:30 está libre. Acción: la secretaria lo quita. Resultado: deja de aparecer para los familiares.
- **CA-01.13** (RN-25; B4). Condición: el turno del martes a las 10:00 tiene cita. Acción: la secretaria intenta quitarlo. Resultado: el producto no lo permite, informa que está reservado y la cita sigue igual.
- **CA-01.14** (RN-25; B7). Condición: un familiar eligió el turno de las 11:30 y está llenando los datos. Acción: la secretaria quita ese turno y luego el familiar confirma. Resultado: no se registra la cita; el familiar ve que ese horario ya no está disponible y los horarios libres restantes.
- **CA-01.15** (RN-20, RN-21, RN-22, RN-04). Condición: es lunes a las 8:00 y el Dr. Andrade, de Cardiología, no tiene turnos el miércoles por la tarde. Acción: la secretaria publica el miércoles de 14:00 a 17:30 con turnos de 20 minutos. Resultado: el resumen indica «10 turnos publicados, 10 minutos sobrantes», sin turnos descartados (de 14:00 a 17:00; el último termina a las 17:20); un familiar que reserva en Cardiología ve esos 10 turnos libres del miércoles con el nombre del Dr. Andrade, y la secretaria puede quitar los que sigan libres.
- **CA-01.16** (RN-24; B1, límite de superposición). Condición: después de CA-01.15. Acción: la secretaria publica el mismo miércoles, con el Dr. Andrade, de 16:00 a 18:00 con turnos de 20 minutos. Resultado: se publican solo 17:20 y 17:40; el resumen indica «2 turnos publicados, 0 minutos sobrantes, 4 no publicados por superponerse» (16:00, 16:20, 16:40 y 17:00); el turno de las 17:20 se publica porque empieza justo cuando termina el anterior; los turnos que ya había no cambian.

**PR-02 · Consultar citas reservadas**

- **CA-02.1** (RN-26). Acción: la secretaria entra a «Citas». Resultado: ve las citas confirmadas de hoy, ordenadas por hora.
- **CA-02.2** (RN-26). Condición: Lucía reservó para su abuela María el miércoles a las 11:30 con el Dr. Andrade, eligiendo correo. Acción: la secretaria ve el miércoles. Resultado: la cita muestra 11:30, Dr. Andrade y Cardiología, María (no menor de edad), sin acompañante, y el nombre y teléfono de Lucía; no muestra el código, el correo ni el canal.
- **CA-02.3** (RN-26). Acción: la secretaria cambia de día o filtra por un médico. Resultado: solo se ven las citas de ese día o de ese médico.
- **CA-02.4** (RN-27; C3). Condición: ese día hay citas de «José Pérez» y de «Josefina Ruiz». Acción: busca «jose perez» y luego «jose». Resultado: con «jose perez» aparece José Pérez; con «jose» aparecen los dos, cada uno con hora y médico.
- **CA-02.5** (RN-27; C2). Condición: José Pérez tiene cita el jueves; la secretaria está viendo el miércoles. Acción: busca «jose perez». Resultado: el producto indica que no hay coincidencias en ese día.
- **CA-02.6** (C1). Condición: el día elegido no tiene citas. Resultado: el producto indica que no hay citas para ese día.
- **CA-02.7** (RN-26). Condición: una cita fue cancelada y otra se cambió del jueves 15:30 con el Dr. Paredes al viernes 9:00 con la Dra. Salazar. Resultado: la cancelada no aparece; la cambiada aparece el viernes a las 9:00 con la Dra. Salazar y ya no aparece el jueves.
- **CA-02.8** (RN-28). Acción: la secretaria intenta crear, cambiar o cancelar una cita desde la lista. Resultado: la lista no ofrece esas acciones.
- **CA-02.9** (C4). Condición: el Médico 1 no podrá atender el martes. Acción: la secretaria ve el martes y filtra por el Médico 1. Resultado: ve todas sus citas con el nombre y teléfono de cada familiar para llamarlos; ninguna cita se cancela desde el producto.

## Decisiones y preguntas abiertas

**Decisiones que aplican:** de la fase 1, D2, D3, D14, D17, D18, D19, D20, D21, D22, D23, D24, D26 y D28; de la fase 2, D41, D42, D47, D51, D52 a D59 y D60 (corrección de redacción, sin cambios de reglas). El detalle está en `docs/proceso.md`.

**Preguntas abiertas:** ninguna.

**Puntos redactados por el agente para revisar:** el mensaje «usuario o contraseña incorrectos» sin decir cuál falla (RN-19); B7 (turno quitado mientras un familiar lo reservaba); B8; y que «administrar cuentas» incluye desbloquear, recuperar o cambiar la contraseña. La lectura de B1 como publicación parcial y el límite de superposición quedaron confirmados por el estudiante (D59).

**Preguntas abiertas de los casos fuente y dónde se resuelven (D42)**

| Pregunta abierta en el caso fuente | Caso | Se resuelve en |
|---|---|---|
| ¿Se pueden publicar varios días de una vez? | publicar-horarios | RN-20 (D54) |
| ¿Qué pasa si el rango de horas no se divide exacto por la duración de la cita? | publicar-horarios | RN-22 y «Cálculos» (D52, D53) |

**Supuestos por validar**

- La cuenta de la secretaria ya existe y solo ella conoce su contraseña.
- Los médicos y especialidades cargados están al día.

**Relación con otras especificaciones:** usa RN-01 y RN-02 de `gestion-cita-codigo` y RN-10 y RN-17 de `reserva-cita` (aprobadas); los turnos que publica son los que se reservan en PR-03 y se cambian en PR-06; la lista muestra el resultado de PR-03, PR-05 y PR-06.