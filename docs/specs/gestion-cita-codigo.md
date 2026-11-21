---
slug: "gestion-cita-codigo"
title: "Gestión de una cita con su código"
description: "El familiar consulta su cita con el código y, antes de la hora de inicio, puede cancelarla o cambiarla de día, hora y médico dentro de la misma especialidad."
spec_kind: spec
status: approved
created_at: "2026-11-09T04:14:45.334Z"
last_updated: "2026-11-09T06:02:20.351Z"
source_use_cases:
  - consultar-cita-codigo
  - cancelar-cita
  - cambiar-cita
---
## Casos de uso fuente y alcance

**Casos de uso fuente (aprobados):** consultar-cita-codigo, cancelar-cita y cambiar-cita.

**Alcance:** lo que el familiar hace con una cita ya reservada usando su código de reserva: consultarla, cancelarla o cambiarla de día, hora y médico dentro de la misma especialidad. La reserva (de donde sale el código) y la agenda de la secretaria se describen en las especificaciones «Reserva» y «Agenda del consultorio»; aquí solo se indican sus efectos.

**Actores**

- **Familiar responsable que reservó la cita** (actor principal). No tiene cuenta; el código es lo único que necesita. (D1, D5, D11)
- **Servicio de mensajes** (actor secundario): entrega los avisos de cancelación y de cambio por correo electrónico o WhatsApp. (D6, D16)
- **Secretaria:** no actúa en estos procesos; ve sus efectos en su lista de citas. (D23)

**Procesos de esta especificación:** PR-04 Consultar una cita con su código, PR-05 Cancelar una cita y PR-06 Cambiar una cita. La numeración es común a las tres especificaciones: PR-01 Publicar horarios y PR-02 Consultar citas reservadas (en «Agenda del consultorio»), PR-03 Reservar una cita (en «Reserva»).

## Procesos

### PR-04 · Consultar una cita con su código

- **Caso relacionado:** consultar-cita-codigo.
- **Actor e inicio:** el familiar quiere revisar una cita que reservó.
- **Condiciones previas:** tiene el código de reserva, que recibió por mensaje y vio en pantalla al reservar (especificación «Reserva»). No necesita cuenta ni inicio de sesión.
- **Datos de entrada:** el código de reserva.
- **Pasos**
  1. El familiar entra a «Mi cita».
  2. El producto le pide el código de reserva.
  3. El familiar ingresa el código.
  4. El producto muestra los datos de la cita de ese código: especialidad, médico, día, hora, nombre del paciente y acompañante (si lo hay). (D36)
  5. Si la cita está confirmada y su hora de inicio todavía no llegó, el producto ofrece cancelarla (PR-05) o cambiarla (PR-06). (RN-02)
- **Decisiones del producto:** si el código no corresponde a ninguna cita, aplica E1; si la hora de inicio ya llegó, E2; si la cita fue cancelada, E3.
- **Reglas aplicables:** RN-02, RN-07.
- **Resultado:** el familiar ve los datos de su cita. Consultar no cambia nada: la cita y su turno siguen igual.
- **Alternativas y errores**
  - **E1. Código incorrecto o inexistente:** el producto indica que no encuentra una cita con ese código, no muestra datos de ninguna cita y permite intentarlo de nuevo.
  - **E2. Cita pasada:** el producto la muestra como pasada y no ofrece cancelarla ni cambiarla.
  - **E3. Cita cancelada:** el producto indica que esa cita fue cancelada y no ofrece opciones.

### PR-05 · Cancelar una cita

- **Caso relacionado:** cancelar-cita.
- **Actor e inicio:** al familiar le surge un percance y el paciente no podrá ir a la cita.
- **Condiciones previas:** el familiar consultó la cita (PR-04); la cita está confirmada y su hora de inicio todavía no llegó. (RN-02)
- **Datos de entrada:** ninguno nuevo; solo la confirmación del familiar.
- **Pasos**
  1. Desde la cita consultada, el familiar elige «Cancelar».
  2. El producto pide confirmar la cancelación.
  3. El familiar confirma.
  4. El producto comprueba que la hora de inicio todavía no llegó, cancela la cita y deja su turno libre para otras reservas. (RN-01, RN-02)
  5. El producto muestra que la cita fue cancelada.
  6. El servicio de mensajes envía al familiar un aviso de cancelación por el canal que eligió al reservar. (RN-08)
- **Reglas aplicables:** RN-01, RN-02, RN-07, RN-08, RN-09.
- **Resultado (éxito):** la cita queda cancelada; su turno vuelve a estar libre; el código ya no permite cancelar ni cambiar (al ingresarlo se ve E3); la cita deja de aparecer en la lista de la secretaria. Los datos del paciente y del acompañante no cambian.
- **Alternativas y errores**
  - **CN1. El familiar no confirma (cancelación del proceso):** la cita sigue confirmada y sin cambios; el turno sigue ocupado.
  - **CN2. La hora de inicio ya llegó:** no se ofrece cancelar (E2).
  - **CN3. El aviso no se puede enviar:** la cita queda cancelada igual y el producto avisa en pantalla que no pudo enviar el aviso. (RN-09)
  - **CN4. La hora de inicio llega antes de que el familiar confirme:** el producto indica que la cita ya pasó y no la cancela; la cita, el turno, el código y la lista de la secretaria siguen igual y no se envía ningún aviso. (RN-02, D41)

### PR-06 · Cambiar una cita

- **Caso relacionado:** cambiar-cita.
- **Actor e inicio:** surge un percance y el paciente no puede ir el día u hora reservados, pero sí en otro momento.
- **Condiciones previas:** el familiar consultó la cita (PR-04); la cita está confirmada y su hora de inicio todavía no llegó. (RN-02)
- **Datos de entrada:** el nuevo día y el nuevo horario (con su médico), elegidos entre los libres de la misma especialidad.
- **Pasos**
  1. Desde la cita consultada, el familiar elige «Cambiar».
  2. El producto muestra los días de la misma especialidad; los días sin horarios libres aparecen como completos y no se pueden elegir. (RN-04)
  3. El familiar elige un día con horarios libres.
  4. El producto muestra solo los horarios libres de ese día, cada uno con el médico que atiende; pueden ser de cualquier médico de la especialidad. (RN-04, RN-05)
  5. El familiar elige el nuevo horario.
  6. El producto muestra el nuevo día, hora y médico y pide confirmar el cambio. (RN-05)
  7. El familiar confirma.
  8. El producto comprueba que la hora de inicio de la cita todavía no llegó y que el nuevo horario siga libre; lo ocupa con la cita y recién entonces libera el horario anterior. (RN-01, RN-02, RN-06)
  9. El producto muestra la cita con su nuevo día, hora y médico; el código sigue siendo el mismo. (RN-06)
  10. El servicio de mensajes envía al familiar un aviso del cambio con el nuevo día, hora y médico, por el canal que eligió al reservar. (RN-08)
- **Reglas aplicables:** RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-07, RN-08, RN-09.
- **Resultado (éxito):** la cita sigue confirmada en su nuevo día, hora y médico; el nuevo turno deja de estar libre y el anterior vuelve a estarlo; el código es el mismo; en la lista de la secretaria la cita aparece en su nuevo día y hora con el nuevo médico. Los datos del paciente y del acompañante no cambian.
- **Alternativas y errores**
  - **F1. Horario tomado mientras se cambiaba:** el producto informa que ese horario ya no está libre y la cita original sigue igual.
  - **F2. El familiar no confirma (cancelación del proceso):** la cita original sigue igual.
  - **F3. Sin otros horarios libres en la especialidad:** el producto lo informa y la cita original sigue igual.
  - **F4. La hora de inicio ya llegó:** no se ofrece cambiar (E2).
  - **F5. El aviso no se puede enviar:** el cambio se mantiene y el producto avisa en pantalla que no pudo enviar el aviso. (RN-09)
  - **F6. La hora de inicio llega antes de que el familiar confirme:** el producto indica que la cita ya pasó y no hace ningún cambio; la cita, ambos turnos, el código y la lista de la secretaria siguen igual y no se envía ningún aviso. (RN-02, D41)

## Reglas del negocio

Cada regla se define una sola vez. Las reglas marcadas como compartidas también las usan las especificaciones «Reserva» y «Agenda del consultorio», que las referencian por su identificador.

- **RN-01. Un turno, una cita (compartida).**
  - Condición: un turno ya tiene una cita confirmada.
  - Comportamiento: ese turno no se ofrece ni se puede ocupar con otra cita. Cuando la cita se cancela o se cambia a otro turno, el turno anterior vuelve a quedar libre.
  - Motivo: cada turno es la atención de un médico a un paciente (regla propuesta por el agente y aceptada en D17).
  - Procesos: PR-01, PR-03, PR-05, PR-06.
- **RN-02. Plazo para cancelar o cambiar.**
  - Condición: la hora de inicio de la cita todavía no llegó.
  - Comportamiento: se ofrece cancelar o cambiar, sin anticipación mínima. Desde la hora de inicio, la cita se muestra como pasada y no se ofrece ninguna de las dos opciones. Lo que cuenta es la hora en que el familiar **confirma**: si confirma desde la hora de inicio en adelante, el producto indica que la cita ya pasó y no hace ningún cambio; la cita, el turno, el código y la lista de la secretaria siguen igual y no se envía ningún aviso. (D41)
  - Motivo (D34, estudiante): que la persona no se estrese y siempre tenga una salida dentro del producto.
  - Ejemplos (D41, del estudiante): cita del jueves a las 15:30 → a las 15:30 en punto ya figura como pasada y no se ofrece cancelar ni cambiar; si el familiar empieza el cambio a las 15:28 y confirma a las 15:31, el producto le dice que la cita ya pasó y no hace ningún cambio.
  - Procesos: PR-04, PR-05, PR-06.
- **RN-03. Sin límite de cambios.**
  - Condición: la cita está dentro del plazo de RN-02.
  - Comportamiento: puede cambiarse las veces que el familiar necesite, aunque ya se haya cambiado antes.
  - Motivo (D35, estudiante): que sea accesible y la persona no se estrese; no agrega reglas ni datos.
  - Procesos: PR-06.
- **RN-04. Elección de día y horario (compartida).**
  - Condición: el familiar elige un turno para reservar o para cambiar una cita.
  - Comportamiento: elige primero la especialidad (al cambiar, es la de la cita), después el día y por último el horario. Los días sin horarios libres aparecen como completos y no se pueden elegir. Dentro de un día solo se muestran los horarios libres, y cada uno muestra el médico que atiende.
  - Motivo: D7, D9 y D36 (estudiante: los turnos se publican por médico, así que el familiar sabe desde el principio con quién será y no hace falta una regla para asignar médico).
  - Procesos: PR-03, PR-06.
- **RN-05. Cambio de médico dentro de la especialidad.**
  - Condición: el familiar cambia una cita.
  - Comportamiento: puede elegir un horario libre de cualquier médico de la misma especialidad; antes de confirmar se muestra con qué médico quedará la cita. No se puede cambiar de especialidad: para eso se cancela y se reserva de nuevo.
  - Motivo (D37, estudiante): coincide con «misma especialidad» del caso aprobado y da más opciones para resolver el percance.
  - Procesos: PR-06.
- **RN-06. Cambio sin quedarse sin cita.**
  - Condición: el familiar confirma un cambio.
  - Comportamiento: el horario anterior se libera solo cuando el nuevo quedó ocupado; si el nuevo no se puede ocupar, la cita original sigue igual. Se mantiene el mismo código. Los datos del paciente y del acompañante no se modifican.
  - Motivo: D28 (el familiar nunca se queda sin cita durante el cambio).
  - Procesos: PR-06.
- **RN-07. Acceso por código.**
  - Condición: alguien ingresa un código en «Mi cita».
  - Comportamiento: cada código da acceso a una sola cita; no hay cuenta ni lista de «todas mis citas». El producto no comprueba quién ingresa el código: conocerlo basta para consultar, cancelar o cambiar esa cita.
  - Motivo: D5 y D25 (sin cuenta, con un código por cita). Depende del supuesto «solo quien reservó conoce el código».
  - Procesos: PR-04, PR-05, PR-06.
- **RN-08. Mensajes solo al familiar (compartida).**
  - Condición: se confirma una reserva, una cancelación o un cambio.
  - Comportamiento: el mensaje se envía solo al familiar que reservó, por el canal que eligió al reservar (correo electrónico o WhatsApp). El paciente y el acompañante no reciben mensajes. El aviso de cambio incluye el nuevo día, hora y médico.
  - Motivo: D6, D13, D16, D26, D28 y D37.
  - Procesos: PR-03, PR-05, PR-06.
- **RN-09. Mensaje que no se puede enviar (compartida).**
  - Condición: el producto no logra enviar el mensaje de una reserva, una cancelación o un cambio.
  - Comportamiento: la operación se mantiene igual y el producto avisa en pantalla que no pudo enviar el mensaje; en la reserva, además, recuerda anotar el código que se muestra en pantalla.
  - Motivo (D39, estudiante): la cita debe quedar confirmada al instante (D3) y siempre debe haber una salida.
  - Procesos: PR-03, PR-05, PR-06.

## Datos necesarios

| Dato | Origen | Significado y valores | Quién lo ve o lo modifica |
|---|---|---|---|
| Código de reserva | Lo genera el producto al reservar; el familiar lo ingresa en «Mi cita» | Identifica una sola cita. Obligatorio para consultar. | Lo conoce el familiar (pantalla y mensaje al reservar). No aparece en la lista de la secretaria (D23). Nadie lo modifica; se mantiene al cambiar. |
| Especialidad | De la reserva | Una de las especialidades cargadas en el producto. | La ven el familiar (con el código) y la secretaria. No se modifica (cambiar de especialidad = cancelar y reservar). |
| Médico | Del turno elegido | Médico que atiende ese turno. | Lo ven el familiar y la secretaria. Cambia solo al cambiar la cita (RN-05). |
| Día y hora | Del turno elegido | Día y hora de inicio de la cita. | Los ven el familiar y la secretaria. Cambian solo con PR-06. |
| Paciente y acompañante (si lo hay) | De la reserva | Datos registrados al reservar (detalle en «Reserva»). | Los ven el familiar y la secretaria. No se modifican (RN-06). |
| Canal y contacto del familiar | De la reserva | Correo electrónico o WhatsApp elegido al reservar. | El producto lo usa para los avisos; en su lista, la secretaria ve solo el nombre y el teléfono del familiar, no el correo ni el canal (D23, D51; RN-26 de `agenda-consultorio`). |
| Estado de la cita | Lo conoce el producto | Confirmada, cancelada o pasada. | Lo ve el familiar en «Mi cita». |
| Hora actual | La conoce el producto | Se compara con la hora de inicio para aplicar RN-02. | — |
| Confirmación del familiar | La aporta el familiar | Sí o no, antes de cancelar o cambiar. | — |

## Estados y cambios permitidos

**Cita**

| Desde | Hacia | Quién lo inicia | Condición | Efecto |
|---|---|---|---|---|
| — (reserva, PR-03) | Confirmada | Familiar | Ver «Reserva» | El turno queda ocupado. |
| Confirmada | Confirmada, en nuevo día, hora y médico | Familiar | Confirma antes de la hora de inicio; el nuevo horario sigue libre | Nuevo turno ocupado, anterior libre, mismo código, aviso de cambio. |
| Confirmada | Cancelada | Familiar | Confirma antes de la hora de inicio | Turno libre; el código muestra «cancelada»; sale de la lista de la secretaria; aviso de cancelación. |
| Confirmada | Pasada | Nadie: ocurre al llegar la hora de inicio | — | Ya no se ofrece cancelar ni cambiar. |

Cancelada y pasada son estados finales: no admiten cambios.

**Turno:** libre → ocupado (al reservar o al cambiar hacia él) → libre (al cancelar o al cambiar desde él). Publicar y quitar turnos se describe en «Agenda del consultorio».

Mensajes como «buscando la cita» o «no encontramos una cita con ese código» son respuestas temporales, no estados de la cita.

## Cálculos

No aplica en esta especificación: solo se compara la hora actual con la hora de inicio de la cita (RN-02); no hay importes, cantidades ni redondeos. La división de un rango en turnos se trata en «Agenda del consultorio».

## Exclusiones

- Recuperar o reenviar un código perdido. (D40)
- Cambiar de especialidad dentro de PR-06; se cancela y se reserva de nuevo. (D28)
- Modificar los datos del paciente o del acompañante. (D28)
- Cancelar citas por parte del consultorio. (D21)
- Cuenta del familiar o lista de «todas mis citas». (D5, D25)

## Criterios de aceptación

**PR-04 · Consultar una cita con su código**

- **CA-04.1** (RN-02, RN-07). Condición: hay una cita confirmada el martes a las 10:00 con el Médico 1 en Medicina general y son las 8:00 de ese martes. Acción: el familiar ingresa su código en «Mi cita». Resultado: ve especialidad, médico, día, hora, paciente y acompañante (si lo hay), y se le ofrecen «Cancelar» y «Cambiar», sin pedirle cuenta ni inicio de sesión.
- **CA-04.2** (RN-07; E1). Condición: el código no corresponde a ninguna cita. Acción: el familiar lo ingresa. Resultado: el producto indica que no encuentra una cita con ese código, no muestra datos de ninguna cita y permite reintentar.
- **CA-04.3** (RN-02; E2). Condición: la cita era el martes a las 10:00 y ya son las 10:00 o más tarde. Acción: el familiar ingresa su código. Resultado: la cita se muestra como pasada y no se ofrecen «Cancelar» ni «Cambiar».
- **CA-04.4** (RN-07; E3). Condición: la cita fue cancelada. Acción: el familiar ingresa su código. Resultado: el producto indica que la cita fue cancelada y no ofrece opciones.

**PR-05 · Cancelar una cita**

- **CA-05.1** (RN-01, RN-02, RN-08). Condición: cita confirmada el martes a las 10:00 con el Médico 1; son las 9:59. Acción: el familiar elige «Cancelar» y confirma. Resultado: el producto muestra que la cita fue cancelada; el turno del martes a las 10:00 con el Médico 1 vuelve a estar libre para otras reservas; la cita ya no aparece en la lista de la secretaria; el familiar recibe un aviso de cancelación por el canal que eligió al reservar.
- **CA-05.2** (CN1). Condición: el producto pide confirmar la cancelación. Acción: el familiar no confirma. Resultado: la cita sigue confirmada y el turno sigue ocupado.
- **CA-05.3** (RN-09; CN3). Condición: el aviso de cancelación no se puede enviar. Acción: el familiar confirma la cancelación. Resultado: la cita queda cancelada igual y el producto avisa en pantalla que no pudo enviar el aviso.
- **CA-05.4** (RN-02; CN4). Condición: cita del jueves a las 15:30; el familiar abrió «Mi cita» y eligió «Cancelar» a las 15:28. Acción: confirma a las 15:31. Resultado: el producto indica que la cita ya pasó y no la cancela; el turno sigue ocupado, el código sigue mostrando la cita, la lista de la secretaria no cambia y no se envía ningún aviso.

**PR-06 · Cambiar una cita**

- **CA-06.1** (RN-04, RN-05). Condición: la cita es de Medicina general; el miércoles no hay horarios libres de Medicina general; Cardiología sí tiene horarios libres. Acción: el familiar elige «Cambiar». Resultado: solo ve días de Medicina general; el miércoles aparece completo y no se puede elegir; al elegir un día ve solo horarios libres, cada uno con su médico; no aparece ningún horario de Cardiología.
- **CA-06.2** (RN-01, RN-05, RN-06, RN-08). Condición: cita el martes a las 10:00 con el Médico 1; el jueves a las 11:00 el Médico 2, de la misma especialidad, está libre; la hora de la cita no llegó. Acción: el familiar elige el jueves a las 11:00, ve que es con el Médico 2 y confirma. Resultado: con el mismo código ve la cita del jueves a las 11:00 con el Médico 2; el martes a las 10:00 con el Médico 1 vuelve a estar libre; el jueves a las 11:00 deja de estar libre; en la lista de la secretaria la cita aparece el jueves a las 11:00 con el Médico 2; el familiar recibe un aviso con el nuevo día, hora y médico; los datos del paciente y del acompañante siguen iguales.
- **CA-06.3** (RN-01, RN-06; F1). Condición: mientras el familiar cambiaba, otra persona reservó el jueves a las 11:00. Acción: el familiar confirma el cambio. Resultado: el producto informa que ese horario ya no está libre y la cita sigue el martes a las 10:00 con el Médico 1.
- **CA-06.4** (F2). Condición: el producto pide confirmar el cambio. Acción: el familiar no confirma. Resultado: la cita sigue igual.
- **CA-06.5** (F3). Condición: no hay otros horarios libres en la especialidad de la cita. Acción: el familiar elige «Cambiar». Resultado: el producto informa que no hay otros horarios libres y la cita sigue igual.
- **CA-06.6** (RN-03). Condición: la cita ya se cambió dos veces y su hora de inicio no llegó. Acción: el familiar elige «Cambiar» otra vez. Resultado: el producto lo permite igual que la primera vez.
- **CA-06.7** (RN-09; F5). Condición: el aviso del cambio no se puede enviar. Acción: el familiar confirma el cambio. Resultado: el cambio se mantiene y el producto avisa en pantalla que no pudo enviar el aviso.
- **CA-06.8** (RN-02; F6). Condición: cita de Pediatría del jueves a las 15:30; el familiar empezó el cambio a las 15:28 y eligió el viernes a las 9:00. Acción: confirma a las 15:31. Resultado: el producto indica que la cita ya pasó y no hace ningún cambio; la cita sigue el jueves a las 15:30, el viernes a las 9:00 sigue libre, el código y la lista de la secretaria no cambian y no se envía ningún aviso.

## Decisiones y preguntas abiertas

**Decisiones que aplican:** de la fase 1, D1, D5, D6, D8, D9, D11, D13, D16, D17, D21, D23 y D25 a D29; de la fase 2, D33 a D42 y D60 (corrección de redacción, sin cambios de reglas). El detalle está en `docs/proceso.md`. En la fase 2, el agente presentó alternativas sin recomendar una y el estudiante eligió y escribió su motivo.

**Preguntas abiertas**

Ninguna. El límite exacto de RN-02 quedó resuelto en la revisión (D41). Los casos fuente no se modifican (D42): siguen listando como abiertas preguntas que esta especificación resuelve, y la entrega las marca como «resuelta en Dxx / RN-xx».

**Preguntas abiertas de los casos fuente y dónde se resuelven**

| Pregunta abierta en el caso fuente | Caso | Se resuelve en |
|---|---|---|
| ¿Cuánta anticipación mínima se exige para cancelar? (y R1: «un posible límite de anticipación se definirá en la fase 2») | cancelar-cita | RN-02 (D34, D41) |
| ¿Hay un límite de cambios por cita o una anticipación mínima para cambiar? | cambiar-cita | RN-02 y RN-03 (D34, D35, D41) |
| ¿Se muestra el nombre del médico o solo la especialidad? | consultar-cita-codigo | RN-04 y PR-04 (D36) |
| ¿Qué ocurre si el familiar pierde el código? | consultar-cita-codigo | Exclusión (D40) |
| ¿Qué ocurre si el aviso de cancelación no se puede entregar? | cancelar-cita | RN-09 y CN3 (D39) |
| ¿Qué ocurre si el aviso del cambio no se puede entregar? | cambiar-cita | RN-09 y F5 (D39) |

**Supuestos por validar**

- Solo quien reservó conoce el código (RN-07 depende de esto).

**Relación con otras especificaciones:** `reserva-cita` (aprobada) usa RN-01, RN-02, RN-04, RN-07, RN-08 y RN-09; `agenda-consultorio` (aprobada) usa RN-01 y RN-02.