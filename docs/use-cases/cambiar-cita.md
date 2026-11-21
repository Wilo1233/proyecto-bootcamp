---
slug: "cambiar-cita"
title: "Cambiar una cita"
description: "Desde la cita consultada con su código, el familiar cambia el día y la hora dentro de la misma especialidad, conserva el mismo código y recibe un aviso del cambio."
spec_kind: use-case
status: approved
created_at: "2026-10-28T01:50:57.292Z"
last_updated: "2026-10-28T01:53:15.692Z"
related_specs:
  - slug: consultar-cita-codigo
    relationship: extends
---
## Actor, objetivo y disparador

- **Actor principal:** familiar responsable que reservó la cita. (D1, D11)
- **Actor secundario:** servicio de mensajes, que entrega el aviso del cambio por correo electrónico o WhatsApp. (D6, D16)
- **Objetivo:** pasar la cita a otro día u hora por algún percance, sin perderla. (D4)
- **Disparador:** surge un percance y el paciente no puede ir el día u hora reservados, pero sí en otro momento.

## Condiciones previas y recorrido principal

**Condiciones previas**

- El familiar consultó la cita con su código (caso «Consultar una cita con su código»). (D25)
- La hora de la cita todavía no pasó. (D28)

**Recorrido principal**

1. Desde la cita consultada, el familiar elige cambiarla.
2. El producto muestra los días de la misma especialidad. Los días sin horarios libres aparecen como completos y no se pueden elegir. (D9, D28)
3. El familiar elige un día con horarios libres.
4. El producto muestra solo los horarios libres de ese día. (D9)
5. El familiar elige el nuevo horario.
6. El producto pide confirmar el cambio. (D28)
7. El familiar confirma.
8. El sistema comprueba que el nuevo horario siga libre, lo ocupa con la cita y recién entonces libera el horario anterior. (D8, D28)
9. El producto muestra la cita con su nuevo día y hora; el código sigue siendo el mismo. (D28)
10. El servicio de mensajes envía al familiar un aviso del cambio con el nuevo día y hora, por el canal que eligió al reservar. (D13, D16, D28)

## Alternativas, errores y reglas

**Alternativas y errores**

- **F1. Horario tomado mientras se cambiaba:** el producto lo informa y la cita original sigue igual. (D29)
- **F2. El familiar no confirma:** la cita sigue igual. (D29)
- **F3. Sin otros horarios libres en la especialidad:** el producto lo informa y la cita original sigue igual. (D29)
- **F4. La hora de la cita ya pasó:** no se ofrece cambiar (ver E2 de «Consultar una cita con su código»). (D27, D28)

**Reglas**

- **R1.** Solo se cambian el día y la hora, dentro de la misma especialidad; para cambiar de especialidad se cancela y se reserva de nuevo. (D28)
- **R2.** El horario anterior se libera solo cuando el nuevo queda confirmado; el familiar nunca se queda sin cita durante el cambio. (D28)
- **R3.** Se mantiene el mismo código de reserva. (D28)
- **R4.** Los datos del paciente y del acompañante no se modifican en esta versión. (D28)
- **R5.** Solo se puede cambiar antes de la hora de la cita. (D28)
- **R6.** En la lista de la secretaria, la cita aparece en su nuevo día y hora. (D28)

**Exclusiones de esta versión**

- Cambiar de especialidad dentro de este caso. (D28)
- Modificar los datos del paciente o del acompañante. (D28)

## Resultado observable y criterios de aceptación

**Resultado observable:** la cita queda en el nuevo día y hora, el horario anterior vuelve a estar libre y el familiar recibe un aviso del cambio, conservando su código.

**Criterios de aceptación**

- **CA1.** Solo se ofrecen días y horarios libres de la misma especialidad.
- **CA2.** Antes de cambiar, el producto pide confirmación.
- **CA3.** Tras confirmar, el nuevo horario deja de estar disponible y el anterior vuelve a aparecer como libre.
- **CA4.** Con el mismo código se ve la cita con su nuevo día y hora.
- **CA5.** El familiar recibe un aviso del cambio por el canal que eligió al reservar.
- **CA6.** En la lista de la secretaria, la cita aparece en su nuevo día y hora.
- **CA7.** Si el nuevo horario se ocupó, no hay otros horarios libres o el familiar no confirma, la cita original no cambia.

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplican a este caso:** D1, D4, D6, D8, D9, D11, D13, D16, D25, D27, D28 y D29. D13 a D29 son recomendaciones del agente aceptadas por el estudiante. El detalle está en `docs/proceso.md`.

**Preguntas abiertas (secundarias)**

- ¿Hay un límite de cambios por cita o una anticipación mínima para cambiar? (fase 2)
- ¿Qué ocurre si el aviso del cambio no se puede entregar?

**Casos relacionados:** parte de «Consultar una cita con su código»; usa los turnos de «Publicar horarios disponibles de un médico»; el resultado se ve en «Consultar citas reservadas».