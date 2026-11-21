---
slug: "cancelar-cita"
title: "Cancelar una cita"
description: "Desde la cita consultada con su código, el familiar la cancela, el turno vuelve a quedar libre y recibe un aviso de cancelación."
spec_kind: use-case
status: approved
created_at: "2026-10-28T01:49:01.268Z"
last_updated: "2026-10-28T01:51:50.647Z"
related_specs:
  - slug: consultar-cita-codigo
    relationship: extends
---
## Actor, objetivo y disparador

- **Actor principal:** familiar responsable que reservó la cita. (D1, D11)
- **Actor secundario:** servicio de mensajes, que entrega el aviso de cancelación por correo electrónico o WhatsApp. (D6, D16)
- **Objetivo:** cancelar una cita a la que el paciente ya no podrá ir, para que el turno quede libre. (D4)
- **Disparador:** surge un percance y el paciente no podrá asistir a la cita.

## Condiciones previas y recorrido principal

**Condiciones previas**

- El familiar consultó la cita con su código (caso «Consultar una cita con su código»). (D25)
- La hora de la cita todavía no pasó. (D26)

**Recorrido principal**

1. Desde la cita consultada, el familiar elige cancelarla.
2. El producto pide confirmar la cancelación. (D26)
3. El familiar confirma.
4. El sistema cancela la cita y el turno vuelve a quedar libre para otras reservas. (D26)
5. El producto muestra que la cita fue cancelada.
6. El servicio de mensajes envía al familiar un aviso de cancelación por el mismo canal que eligió al reservar. (D26)

## Alternativas, errores y reglas

**Alternativas y errores**

- **CN1. El familiar no confirma:** la cita sigue igual. (D27)
- **CN2. La hora de la cita ya pasó:** no se ofrece cancelar (ver E2 de «Consultar una cita con su código»). (D26, D27)

**Reglas**

- **R1.** Solo se puede cancelar antes de la hora de la cita; un posible límite de anticipación se definirá en la fase 2. (D26)
- **R2.** Al cancelar, el turno vuelve a quedar libre. (D26)
- **R3.** El código de una cita cancelada deja de servir para cancelar o cambiar; al ingresarlo, se informa que la cita fue cancelada. (D26)
- **R4.** La cita cancelada desaparece de la lista de la secretaria. (D26)
- **R5.** El aviso de cancelación llega solo al familiar, por el canal que eligió al reservar. (D13, D16, D26)

## Resultado observable y criterios de aceptación

**Resultado observable:** la cita queda cancelada, el turno vuelve a estar disponible y el familiar recibe un aviso de cancelación.

**Criterios de aceptación**

- **CA1.** Antes de cancelar, el producto pide confirmación.
- **CA2.** Tras confirmar, el turno vuelve a aparecer como libre para otras reservas.
- **CA3.** El familiar recibe un aviso de cancelación por el canal que eligió al reservar.
- **CA4.** Al volver a ingresar el código, el producto indica que la cita fue cancelada.
- **CA5.** La cita cancelada ya no aparece en la lista de la secretaria.
- **CA6.** Si el familiar no confirma, la cita sigue sin cambios.

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplican a este caso:** D1, D4, D6, D11, D13, D16, D25, D26 y D27. D13 a D27 son recomendaciones del agente aceptadas por el estudiante. El detalle está en `docs/proceso.md`.

**Preguntas abiertas (secundarias)**

- ¿Cuánta anticipación mínima se exige para cancelar? (fase 2)
- ¿Qué ocurre si el aviso de cancelación no se puede entregar?

**Casos relacionados:** parte de «Consultar una cita con su código»; libera turnos publicados en «Publicar horarios disponibles de un médico»; quita la cita de «Consultar citas reservadas».