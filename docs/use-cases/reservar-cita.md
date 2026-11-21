---
slug: "reservar-cita"
title: "Reservar una cita médica por especialidad"
description: "El familiar responsable elige especialidad, día y horario libre para el paciente, y recibe la confirmación con un código de reserva por correo electrónico o WhatsApp."
spec_kind: use-case
status: approved
created_at: "2026-10-28T00:58:42.900Z"
last_updated: "2026-11-09T04:46:54.289Z"
related_specs:
  - slug: publicar-horarios
    relationship: depends-on
  - slug: consultar-citas
    relationship: required-by
  - slug: consultar-cita-codigo
    relationship: required-by
---
## Actor, objetivo y disparador

- **Actor principal:** familiar responsable (por ejemplo, padre, madre o hijo adulto). Siempre es un familiar quien reserva, en nombre del paciente. (D1, D11)
- **Actor secundario:** servicio de mensajes (sistema externo) que entrega el código al familiar por correo electrónico o por WhatsApp. (D6, D16)
- **Personas registradas que no usan la aplicación:**
  - **Paciente:** recibe la atención médica; no usa la aplicación ni recibe mensajes. (D1, D13)
  - **Acompañante:** persona que irá con el paciente a la cita; solo se registran sus datos y no recibe mensajes. Opcional si el paciente es mayor de edad; obligatorio si es menor. (D10, D13, D15)
- **Objetivo:** dejar reservada una cita en la especialidad que necesita el paciente, en un día y horario elegidos por el familiar, y recibir un código para consultarla, cancelarla o cambiarla después.
- **Disparador:** el paciente necesita atención en una especialidad y el familiar decide reservarle una cita.

## Condiciones previas y recorrido principal

**Condiciones previas**

- La secretaria publicó horarios disponibles para al menos una especialidad (caso «Publicar horarios disponibles»).
- El familiar no necesita cuenta ni inicio de sesión. (D5)
- El familiar dispone de un teléfono celular y, si elige recibir los mensajes por correo electrónico, también de un correo. Si elige WhatsApp, los mensajes llegan a ese mismo celular. (D6, D16, D45, D49)

**Recorrido principal**

1. El familiar entra a la sección de reserva.
2. El producto muestra las especialidades que tienen horarios disponibles.
3. El familiar elige una especialidad. (D7)
4. El producto muestra los días de esa especialidad. Los días sin ningún horario libre aparecen como completos y no se pueden elegir. (D9)
5. El familiar elige un día con horarios libres.
6. El producto muestra solo los horarios libres de ese día. (D9)
7. El familiar elige un horario. (D3)
8. El familiar ingresa los datos del paciente e indica si es menor de edad. (D15)
9. Si el paciente irá acompañado, el familiar agrega los datos del acompañante; si el paciente es menor de edad, este paso es obligatorio. (D10, D15)
10. El familiar ingresa su contacto y elige recibir el código por correo electrónico o por WhatsApp. (D6, D13, D16)
11. El familiar confirma la reserva.
12. El sistema comprueba que el horario siga libre, registra la cita como confirmada sin intervención de la secretaria y muestra que la reserva se completó. (D3, D8)
13. El servicio de mensajes envía al familiar, por el canal elegido, la confirmación de la cita con su código de reserva. (D5, D13)

## Alternativas, errores y reglas

**Alternativas y errores**

- **A1. Sin horarios en la especialidad:** el producto informa que no hay horarios libres y permite elegir otra especialidad. (D17)
- **A2. Horario tomado mientras se reservaba:** al confirmar, el sistema detecta que el horario ya fue reservado por otra persona, lo informa, no registra la cita y muestra los horarios libres restantes. (D8, D17)
- **A3. Datos incompletos o contacto inválido:** el producto indica qué dato corregir y no registra la cita. (D17)
- **A4. Paciente menor de edad sin acompañante:** el producto indica que faltan los datos del acompañante y no registra la cita. (D15)
- **A5. El mensaje no se puede entregar:** comportamiento pendiente de decisión.

**Reglas**

- **R1.** La cita queda confirmada al terminar la reserva; la secretaria no la aprueba ni la asigna. (D3, D8)
- **R2.** No se requiere cuenta; cada cita tiene su propio código de reserva. (D5)
- **R3.** El código se envía solo al familiar que reserva, por correo electrónico o por WhatsApp, según su elección. (D6, D13, D16)
- **R4.** El familiar elige primero la especialidad, después el día y por último el horario. (D7, D9)
- **R5.** Un horario solo puede tener una cita. (D17)
- **R6.** Los datos del acompañante son opcionales si el paciente es mayor de edad y obligatorios si es menor. (D10, D15)
- **R7.** Al llegar al consultorio, el paciente se identifica diciendo su nombre en recepción; no necesita presentar el código. (D14)

## Resultado observable y criterios de aceptación

**Resultado observable:** la cita queda confirmada, el horario deja de estar disponible para otras reservas y el familiar recibe, por correo electrónico o por WhatsApp, un mensaje con el código de reserva.

**Criterios de aceptación**

- **CA1.** Al confirmar, el producto muestra que la cita quedó confirmada sin que intervenga la secretaria.
- **CA2.** En el momento de confirmar, se envía al familiar, por el canal que eligió, un mensaje que contiene el código de reserva.
- **CA3.** La reserva se completa sin crear una cuenta ni iniciar sesión.
- **CA4.** Solo se pueden elegir días con horarios libres y, dentro de un día, solo se muestran los horarios libres de la especialidad seleccionada.
- **CA5.** Un horario reservado deja de aparecer como disponible para otra reserva.
- **CA6.** Si el paciente es menor de edad y faltan los datos del acompañante, la cita no se registra y se indica qué falta.
- **CA7.** Si faltan datos obligatorios o el contacto no es válido, la cita no se registra y se indica qué corregir.
- **CA8.** La cita reservada aparece en la lista de citas de la secretaria y se puede encontrar por el nombre del paciente (caso «Consultar citas reservadas»).

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplican a este caso:** D1, D3, D5, D6, D7, D8, D9, D10, D11, D13, D14, D15, D16 y D17. D13 a D17 son recomendaciones del agente aceptadas por el estudiante. D12 fue reemplazada por D14. El detalle está en `docs/proceso.md`.

**Revisión de la fase 2 (D49):** se corrigió solo la condición previa de contacto para que coincida con D45 (teléfono celular siempre obligatorio; correo solo si se elige ese canal). El resto del caso no cambió.

**Preguntas abiertas (secundarias)**

- ¿Qué datos exactos del paciente, del acompañante y del familiar se piden?
- ¿El familiar ve el nombre del médico al elegir el horario, o solo la especialidad?
- ¿El código de reserva también se muestra en pantalla al confirmar?
- ¿Qué ocurre si el mensaje no llega o si el familiar pierde el código? (A5)

**Supuestos por validar**

- Solo quien reservó conoce el código.

**Casos relacionados (aún no redactados):** depende de «Publicar horarios disponibles»; su resultado lo usan «Consultar citas reservadas», «Cancelar una cita», «Consultar una cita con su código» y «Cambiar una cita».