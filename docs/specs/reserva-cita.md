---
slug: "reserva-cita"
title: "Reserva de una cita médica"
description: "El familiar elige especialidad, día y horario con su médico, ingresa los datos del paciente, del acompañante y su contacto, y recibe la confirmación con el código en pantalla y por mensaje."
spec_kind: spec
status: approved
created_at: "2026-11-09T04:41:31.867Z"
last_updated: "2026-11-09T06:02:20.903Z"
source_use_cases:
  - reservar-cita
---
## Casos de uso fuente y alcance

**Caso de uso fuente (aprobado):** reservar-cita. En la fase 2 se corrigió su condición previa de contacto para que coincida con D45 (D49), y el estudiante lo aprobó de nuevo (revisión 2026-11-09T04:44:52.623Z).

**Alcance:** cómo el familiar reserva una cita para el paciente: elige especialidad, día y horario con su médico, ingresa los datos necesarios y recibe la confirmación con el código de reserva en pantalla y por mensaje. Lo que se hace después con el código (consultar, cancelar o cambiar) está en «Gestión de una cita con su código» (`gestion-cita-codigo`, aprobada); la publicación de turnos y la lista de la secretaria, en «Agenda del consultorio».

**Actores**

- **Familiar responsable** (actor principal): siempre es quien reserva, en nombre del paciente; no necesita cuenta. (D1, D5, D11)
- **Servicio de mensajes** (actor secundario): entrega la confirmación con el código por correo electrónico o WhatsApp. (D6, D16)
- **Personas registradas que no usan el producto:** el paciente (recibe la atención; no recibe mensajes) y el acompañante (irá con el paciente; no recibe mensajes). (D10, D13, D15)
- **Secretaria:** no interviene en la reserva; ve la cita en su lista. (D3, D8, D23)

**Proceso de esta especificación:** PR-03 Reservar una cita. Numeración común: PR-01 y PR-02 en «Agenda del consultorio»; PR-04 a PR-06 en `gestion-cita-codigo`.

**Reglas que usa y que están definidas en `gestion-cita-codigo`:** RN-01 (un turno, una cita), RN-02 (criterio de tiempo: cuenta la hora en que se confirma), RN-04 (elección de día y horario, con el médico de cada horario), RN-07 (acceso por código), RN-08 (mensajes solo al familiar) y RN-09 (mensaje que no se puede enviar).

## Proceso

### PR-03 · Reservar una cita

- **Caso relacionado:** reservar-cita.
- **Actor e inicio:** el paciente necesita atención en una especialidad y el familiar decide reservarle una cita.
- **Condiciones previas:** la secretaria publicó turnos libres (PR-01); el familiar tiene un celular, y un correo si quiere recibir los mensajes por correo. No necesita cuenta.
- **Datos de entrada:** especialidad, día y horario (con su médico); nombre y apellido del paciente y si es menor de edad; nombre y apellido del acompañante (si lo hay); nombre y apellido del familiar, su teléfono, el canal elegido y, si elige correo, su correo. (RN-15)
- **Pasos**
  1. El familiar entra a «Reservar cita».
  2. El producto muestra las especialidades que tienen turnos que se pueden reservar. (RN-10)
  3. El familiar elige una especialidad.
  4. El producto muestra los días de esa especialidad; los días sin horarios libres aparecen como completos y no se pueden elegir. (RN-04)
  5. El familiar elige un día con horarios libres.
  6. El producto muestra solo los horarios libres de ese día que todavía se pueden reservar, cada uno con el médico que atiende. (RN-04, RN-10)
  7. El familiar elige un horario.
  8. El familiar ingresa el nombre y apellido del paciente e indica si es menor de edad.
  9. Si el paciente es menor de edad, el familiar ingresa el nombre y apellido del acompañante; si es mayor, puede agregarlo o no. (RN-14)
  10. El familiar ingresa su nombre y apellido y su teléfono, y elige recibir los mensajes por correo electrónico o por WhatsApp; si elige correo, ingresa también su correo. (RN-15)
  11. El familiar confirma la reserva.
  12. El producto comprueba los datos obligatorios y su formato (RN-14, RN-15), que el turno siga libre (RN-01) y que su hora de inicio no haya llegado (RN-10). Si todo se cumple, registra la cita como confirmada, sin intervención de la secretaria. (RN-11)
  13. El producto muestra que la reserva se completó, con la especialidad, el médico, el día, la hora, el paciente y el código de reserva. (RN-13)
  14. El servicio de mensajes envía al familiar, por el canal elegido, la confirmación con el código y los datos de la cita, incluido el médico. (RN-08, RN-13)
- **Reglas aplicables:** RN-01, RN-02, RN-04, RN-07, RN-08, RN-09, RN-10, RN-11, RN-12, RN-13, RN-14, RN-15 y RN-16.
- **Resultado (éxito):** la cita queda confirmada; el turno deja de aparecer como libre; el familiar ve el código en pantalla y lo recibe por mensaje; con ese código puede consultar, cancelar o cambiar la cita (`gestion-cita-codigo`); la cita aparece en la lista de la secretaria del día correspondiente.
- **Alternativas y errores**
  - **A1. Sin horarios libres:** si ninguna especialidad tiene turnos que se puedan reservar, el producto informa que por ahora no hay horarios libres. Si los horarios de la especialidad elegida se ocupan mientras el familiar elige, el producto informa que no hay horarios libres en esa especialidad y permite elegir otra.
  - **A2. Horario tomado mientras se reservaba:** al confirmar, el producto informa que el horario ya fue reservado por otra persona, no registra la cita y muestra los horarios libres restantes. (RN-01)
  - **A3. Datos incompletos o con formato inválido:** el producto indica qué dato corregir y no registra la cita; el familiar puede corregirlo y volver a confirmar. (RN-15)
  - **A4. Paciente menor de edad sin acompañante:** el producto indica que faltan los datos del acompañante, obligatorios porque el paciente es menor, y no registra la cita: el turno sigue libre, no se genera código, no se envía ningún mensaje y la cita no aparece en la lista de la secretaria. El familiar puede agregar al acompañante y volver a confirmar; si mientras tanto otra persona tomó el turno, aplica A2. (RN-14)
  - **A5. El mensaje no se puede enviar:** la cita queda confirmada; el producto avisa en pantalla que no pudo enviar el mensaje y recuerda anotar el código que se muestra. (RN-09, RN-13)
  - **A6. La hora de inicio llega antes de confirmar:** el producto informa que ese horario ya no se puede reservar, no registra la cita y muestra los horarios libres restantes. (RN-10)
  - **A7. El familiar sale antes de confirmar (cancelación del proceso):** no se registra nada y el turno sigue libre.

## Reglas del negocio

Reglas nuevas de esta especificación. Las compartidas que ya existen se referencian arriba, sin repetirlas.

- **RN-10. Turnos que se pueden reservar.**
  - Condición: un turno está libre.
  - Comportamiento: se muestra y se puede reservar mientras su hora de inicio no haya llegado, con el mismo criterio de tiempo de RN-02 (cuenta la hora en que el familiar confirma). Desde la hora de inicio deja de mostrarse. No hay anticipación mínima. Hasta cuándo hacia adelante se puede reservar depende solo de los turnos que publica la secretaria.
  - Motivo (D47, estudiante): una sola regla de tiempo para reservar, cancelar y cambiar; se aprovechan los turnos liberados a último momento.
  - Ejemplo: turno libre de las 10:00 → a las 9:55 aparece y se puede reservar; a las 10:00 ya no aparece; si el familiar empieza a las 9:58 y confirma a las 10:01, no se registra (A6).
  - Procesos: PR-03.
- **RN-11. Confirmación inmediata.**
  - Condición: el familiar confirma la reserva y se cumplen RN-01, RN-10, RN-14 y RN-15.
  - Comportamiento: la cita queda confirmada en ese momento; la secretaria no la aprueba ni la asigna.
  - Motivo: D3 y D8 (el familiar elige su fecha; el producto comprueba la disponibilidad).
  - Procesos: PR-03.
- **RN-12. Sin cuenta, un código por cita.**
  - Condición: se registra una cita.
  - Comportamiento: no se pide cuenta ni inicio de sesión; el producto genera un código de reserva propio de esa cita (su uso se describe en RN-07).
  - Motivo: D5.
  - Procesos: PR-03.
- **RN-13. Código en pantalla y por mensaje.**
  - Condición: la cita quedó confirmada.
  - Comportamiento: el código se muestra en pantalla junto con los datos de la cita y también se envía por mensaje al familiar.
  - Motivo (D38, estudiante): que «Mi cita» no dependa de un solo canal.
  - Procesos: PR-03.
- **RN-14. Acompañante según la edad.**
  - Condición: el familiar indica si el paciente es menor de edad.
  - Comportamiento: si es menor, el nombre y apellido del acompañante son obligatorios; si es mayor, agregar acompañante es opcional, pero si se agrega, su nombre y apellido son obligatorios. El producto no puede comprobar la edad: se basa en lo que indica el familiar.
  - Motivo: D10, D15 y D44.
  - Procesos: PR-03.
- **RN-15. Datos obligatorios y formato.**
  - Condición: el familiar confirma la reserva.
  - Comportamiento: se comprueba que estén el nombre y apellido del paciente, si es menor de edad, el nombre y apellido del familiar, su teléfono y el canal, y el correo si el canal es correo. Solo se comprueba el formato: el teléfono tiene exactamente 10 dígitos, solo dígitos, y empieza con 09 (celular de Ecuador); el correo tiene la forma usuario@dominio. Si falta un dato o su formato no es válido, el producto indica qué dato corregir y no registra la cita (A3). Si el canal es WhatsApp, los mensajes van a ese mismo teléfono y no se pide correo.
  - Motivo: D43 a D46 (estudiante: solo se piden los datos que usa alguna regla o persona del consultorio; el formato cubre los errores más comunes y el código en pantalla cubre el resto).
  - Límites: 0991234567 es válido; 099123456 (9 dígitos), 09912345678 (11 dígitos), 0891234567 (empieza con 08) y 09912a4567 (con una letra) no son válidos. rosa@correo.com es válido; rosa.correo.com no lo es.
  - Procesos: PR-03.
- **RN-16. Reservas independientes.**
  - Condición: se reserva una cita para un paciente que ya tiene otra.
  - Comportamiento: se registra igual; el producto no limita cuántas citas tiene un paciente ni las compara entre sí, porque solo lo conoce por su nombre. Cada cita tiene su propio código. Un mismo turno sigue admitiendo una sola cita (RN-01).
  - Motivo (D48, estudiante): con solo nombre y apellido el producto no puede reconocer de verdad al mismo paciente; una regla así fallaría en los dos sentidos.
  - Procesos: PR-03.
- **RN-17. Identificación en recepción (compartida).**
  - Condición: el paciente llega al consultorio.
  - Comportamiento: se identifica diciendo su nombre en recepción; no necesita presentar el código. La secretaria lo busca en su lista.
  - Motivo: D14.
  - Procesos: PR-02, PR-03.

## Datos necesarios

| Dato | Lo aporta | Significado y valores permitidos | Obligatorio | Quién lo ve o lo modifica |
|---|---|---|---|---|
| Especialidad | El familiar la elige | Una de las especialidades cargadas que tenga turnos que se puedan reservar | Sí | La ven el familiar (con el código) y la secretaria. No se modifica. |
| Día, horario y médico | El familiar elige un turno libre | Turno publicado por la secretaria, libre y cuya hora de inicio no llegó | Sí | Los ven el familiar y la secretaria. Cambian solo con PR-06. |
| Nombre y apellido del paciente | El familiar lo ingresa | Nombre del paciente; la secretaria lo usa para encontrar la cita (D14) | Sí | Lo ven el familiar (con el código) y la secretaria. No se modifica. |
| Paciente menor de edad | El familiar lo indica | Sí o no (menor de edad: menos de 18 años). El producto no lo comprueba | Sí | Lo ve la secretaria. No se modifica. |
| Nombre y apellido del acompañante | El familiar lo ingresa | Nombre de quien irá con el paciente | Si el paciente es menor, o si se agrega acompañante | Lo ven el familiar (con el código) y la secretaria. No se modifica. |
| Nombre y apellido del familiar | El familiar lo ingresa | Para que la secretaria sepa por quién preguntar cuando llama | Sí (D50) | Lo ve la secretaria en su lista (D51). |
| Teléfono del familiar | El familiar lo ingresa | 10 dígitos, empieza con 09. Si el canal es WhatsApp, es también el número de WhatsApp | Sí | Lo ve la secretaria en su lista, para llamar si un médico falta (D21, D51); el producto lo usa para los mensajes por WhatsApp. |
| Canal de mensajes | El familiar lo elige | Correo electrónico o WhatsApp | Sí | Lo usa el producto para enviar los mensajes (RN-08); no aparece en la lista de la secretaria (D51). |
| Correo del familiar | El familiar lo ingresa | Forma usuario@dominio | Solo si el canal es correo | Solo lo usa el producto para los mensajes por correo; no aparece en la lista de la secretaria (D51). |
| Código de reserva | Lo genera el producto | Uno por cita (RN-12) | — | Lo ve el familiar en pantalla y en el mensaje; no aparece en la lista de la secretaria. |
| Estado de la cita | Lo conoce el producto | Queda «confirmada» al terminar la reserva | — | Ver `gestion-cita-codigo`. |
| Hora actual | La conoce el producto | Para aplicar RN-10 | — | — |

## Estados y cambios permitidos

La reserva crea la cita directamente en estado **confirmada** (RN-11). No hay un estado intermedio «pendiente» y el turno no queda apartado mientras el familiar llena los datos; por eso existe A2. Los cambios posteriores (cambio de día y hora, cancelada, pasada) están en `gestion-cita-codigo`.

**Turno:** libre → ocupado al confirmar la reserva.

Mensajes como «comprobando disponibilidad» o «falta el teléfono» son respuestas temporales, no estados.

## Cálculos

No aplica: la reserva no calcula importes, cantidades ni fechas. Solo compara la hora actual con la hora de inicio del turno (RN-10) y revisa el formato de los datos (RN-15); son comprobaciones, no cálculos. La división de un rango en turnos se trata en «Agenda del consultorio».

## Exclusiones y límites de esta versión

- Cuenta o inicio de sesión del familiar. (D5)
- Verificar el contacto con un código antes de reservar; solo se revisa el formato. (D46)
- Teléfonos fijos o de otros países: solo se aceptan celulares de Ecuador (10 dígitos, empiezan con 09). (D46)
- Limitar cuántas citas tiene un paciente o detectar dos citas a la misma hora para el mismo paciente. (D48)
- Recuperar o reenviar un código perdido. (D40)

## Criterios de aceptación

- **CA-03.1** (RN-04, RN-08, RN-10, RN-11, RN-12, RN-13). Condición: el martes a las 10:00 el Médico 1 de Medicina general tiene un turno libre; son las 8:00 de ese martes. Acción: Marcos elige Medicina general, el martes y las 10:00 con el Médico 1; ingresa a su papá (mayor de edad, sin acompañante), su propio nombre y apellido, el teléfono 0991234567 y elige WhatsApp; confirma. Resultado: sin crear cuenta, la cita queda confirmada sin intervención de la secretaria; la pantalla muestra especialidad, médico, día, hora, paciente y el código; llega un WhatsApp al 0991234567 con el código y los datos de la cita, incluido el médico; el turno deja de aparecer como libre; la cita aparece en la lista de la secretaria del martes.
- **CA-03.2** (RN-04). Condición: el miércoles no hay horarios libres en Medicina general. Acción: el familiar elige Medicina general. Resultado: el miércoles aparece completo y no se puede elegir; al elegir otro día solo se ven horarios libres, cada uno con su médico.
- **CA-03.3** (RN-04). Condición: el jueves a las 10:00 están libres el Médico 1 y el Médico 2, ambos de Medicina general. Acción: el familiar elige el jueves. Resultado: aparecen dos opciones de las 10:00, una con cada médico, y el familiar elige una.
- **CA-03.4** (RN-01; A2). Condición: mientras el familiar llenaba los datos, otra persona reservó el mismo turno. Acción: confirma. Resultado: el producto informa que el horario ya fue reservado, no registra la cita y muestra los horarios libres restantes.
- **CA-03.5** (RN-14; A4). Condición: el turno de Pediatría del jueves a las 16:00 está libre; Pedro marca que su hijo Mateo, de 9 años, es menor de edad, llena los datos de Mateo y los suyos, pero no agrega acompañante. Acción: confirma. Resultado: el producto indica que faltan los datos del acompañante, obligatorios porque Mateo es menor, y no registra la cita; el turno sigue libre, no se genera código, no se envía ningún mensaje y la cita no aparece en la lista de la secretaria. Al agregar el nombre y apellido del acompañante y confirmar de nuevo, la cita se registra; si el turno se ocupó mientras tanto, aplica A2.
- **CA-03.6** (RN-14). Condición: el paciente es mayor de edad y no se agrega acompañante. Acción: el familiar confirma. Resultado: la cita se registra sin acompañante.
- **CA-03.7** (RN-15; A3, límites del teléfono). Condición: el resto de los datos es válido. Acción: el familiar confirma con el teléfono 099123456, luego 09912345678, luego 0891234567 y luego 09912a4567. Resultado: en cada caso el producto indica que el teléfono no es válido y no registra la cita; con 0991234567 la cita se registra.
- **CA-03.8** (RN-15; A3, correo). Condición: el familiar eligió recibir los mensajes por correo. Acción: confirma con «rosa.correo.com» y luego sin correo. Resultado: en ambos casos el producto indica que debe corregir el correo y no registra la cita; con «rosa@correo.com» la cita se registra. Si elige WhatsApp, no se le pide correo.
- **CA-03.9** (RN-15; A3). Condición: falta el nombre y apellido del paciente o el del familiar. Acción: el familiar confirma. Resultado: el producto indica qué dato falta y no registra la cita.
- **CA-03.10** (RN-10; A6, límite de tiempo). Condición: el turno de las 10:00 está libre. Resultado esperado: a las 9:55 el turno aparece y se puede reservar; a las 10:00 ya no aparece; si el familiar lo eligió a las 9:58 y confirma a las 10:01, el producto informa que ese horario ya no se puede reservar y no registra la cita.
- **CA-03.11** (RN-09, RN-13; A5). Condición: el mensaje de confirmación no se puede enviar. Acción: el familiar confirma. Resultado: la cita queda confirmada, el código se muestra en pantalla y el producto avisa que no pudo enviar el mensaje y que anote el código.
- **CA-03.12** (RN-16). Condición: el papá de Marcos ya tiene una cita el martes a las 10:00 en Medicina general. Acción: Marcos le reserva Cardiología el martes a las 10:00. Resultado: la segunda cita también se registra, con su propio código.
- **CA-03.13** (A1). Condición: ninguna especialidad tiene turnos que se puedan reservar. Acción: el familiar entra a «Reservar cita». Resultado: el producto informa que por ahora no hay horarios libres.
- **CA-03.14** (A7). Condición: el familiar eligió un turno y llenó parte de los datos. Acción: sale sin confirmar. Resultado: no se registra ninguna cita y el turno sigue libre.
- **CA-03.15** (RN-04, RN-08, RN-13, RN-15; D51). Condición: es lunes a las 19:00; el martes de Cardiología está completo y el miércoles a las 11:30 el Dr. Andrade tiene un turno libre. Acción: Lucía reserva para su abuela María (82 años, mayor de edad, sin acompañante) el miércoles a las 11:30 con el Dr. Andrade; deja su nombre y apellido, el teléfono 0991234567, elige correo y escribe su correo; confirma. Resultado: el martes aparece completo y no se puede elegir; la cita queda confirmada sin intervención de nadie; la pantalla muestra el código; a Lucía le llega un correo con la confirmación y el código; en la lista de la secretaria la cita aparece el miércoles a las 11:30 con el Dr. Andrade, con el nombre de la abuela y el nombre y teléfono de Lucía, sin su correo.

## Decisiones y preguntas abiertas

**Decisiones que aplican:** de la fase 1, D1, D3, D5, D6, D7, D8, D9, D10, D11, D13, D14, D15, D16 y D17; de la fase 2, D36, D38, D39, D40, D42, D43 a D51 y D60 (corrección de redacción, sin cambios de reglas). El detalle está en `docs/proceso.md`.

**Preguntas abiertas**

Ninguna. El nombre y apellido del familiar es obligatorio (D50) y la secretaria ve solo el nombre y el teléfono del familiar (D51).

**Puntos redactados por el agente para revisar:** A1 (concilia el paso 2 del caso fuente, que solo muestra especialidades con horarios, con su alternativa A1), A6, A7 y el significado de «menor de edad» (menos de 18 años).

**Preguntas abiertas del caso fuente y dónde se resuelven (D42)**

| Pregunta abierta en `reservar-cita` | Se resuelve en |
|---|---|
| ¿Qué datos exactos del paciente, del acompañante y del familiar se piden? | RN-14, RN-15 y «Datos necesarios» (D43 a D46) |
| ¿El familiar ve el nombre del médico al elegir el horario, o solo la especialidad? | RN-04 (D36) |
| ¿El código de reserva también se muestra en pantalla al confirmar? | RN-13 (D38) |
| ¿Qué ocurre si el mensaje no llega o si el familiar pierde el código? (A5) | A5 y RN-09 (D39); exclusión (D40) |

**Supuestos por validar**

- Solo quien reservó conoce el código (RN-07).
- El familiar indica correctamente si el paciente es menor de edad; el producto no lo comprueba (RN-14).

**Relación con otras especificaciones:** usa RN-01, RN-02, RN-04, RN-07, RN-08 y RN-09 de `gestion-cita-codigo` (aprobada); `agenda-consultorio` (aprobada) usa RN-10 y RN-17 y muestra en la lista de la secretaria el nombre del paciente, si es menor de edad, el acompañante (si lo hay) y el nombre y el teléfono del familiar, sin su correo ni el código (D23, D51; RN-26).
