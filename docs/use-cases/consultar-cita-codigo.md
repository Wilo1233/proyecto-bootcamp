---
slug: "consultar-cita-codigo"
title: "Consultar una cita con su código"
description: "El familiar ingresa el código de reserva y ve los datos de esa cita; si todavía no pasó, desde ahí puede cancelarla o cambiarla."
spec_kind: use-case
status: approved
created_at: "2026-10-28T01:48:46.833Z"
last_updated: "2026-10-28T01:51:49.769Z"
related_specs:
  - slug: reservar-cita
    relationship: depends-on
  - slug: cancelar-cita
    relationship: extended-by
  - slug: cambiar-cita
    relationship: extended-by
---
## Actor, objetivo y disparador

- **Actor principal:** familiar responsable que reservó la cita. (D1, D11)
- **Objetivo:** revisar los datos de una cita reservada para no olvidarla ni perderla, y poder cancelarla o cambiarla.
- **Disparador:** el familiar quiere recordar o revisar una cita que reservó.

## Condiciones previas y recorrido principal

**Condiciones previas**

- El familiar tiene el código de reserva que recibió por correo electrónico o WhatsApp al reservar. (D5, D13, D16)
- No necesita cuenta ni inicio de sesión. (D5)

**Recorrido principal**

1. El familiar entra a la sección para consultar una cita.
2. El producto le pide el código de reserva.
3. El familiar ingresa el código.
4. El producto muestra los datos de esa cita: especialidad, día, hora, nombre del paciente y acompañante (si lo hay). (D25)
5. Si la hora de la cita todavía no pasó, el producto ofrece cancelarla o cambiarla (casos «Cancelar una cita» y «Cambiar una cita»). (D25)

## Alternativas, errores y reglas

**Alternativas y errores**

- **E1. Código incorrecto o inexistente:** el producto indica que no encuentra una cita con ese código y permite intentarlo de nuevo. (D27)
- **E2. Cita ya pasada:** el producto la muestra como pasada y no ofrece cancelarla ni cambiarla. (D27)
- **E3. Cita cancelada:** si el código corresponde a una cita cancelada, el producto indica que esa cita fue cancelada. (D26)

**Reglas**

- **R1.** Cada código da acceso a una sola cita; no existe una lista de «todas mis citas». (D5, D25)
- **R2.** No se requiere cuenta ni inicio de sesión. (D5)
- **R3.** Solo se ofrece cancelar o cambiar antes de la hora de la cita. (D26, D27)

## Resultado observable y criterios de aceptación

**Resultado observable:** el familiar ve los datos de su cita y, si todavía no pasó, puede elegir cancelarla o cambiarla.

**Criterios de aceptación**

- **CA1.** Con un código válido se muestran la especialidad, el día, la hora, el paciente y el acompañante (si lo hay) de esa cita.
- **CA2.** Con un código incorrecto se indica que no se encontró la cita y se puede reintentar.
- **CA3.** Una cita cuya hora ya pasó se muestra como pasada y sin opciones de cancelar o cambiar.
- **CA4.** El código de una cita cancelada indica que fue cancelada.
- **CA5.** No se pide cuenta ni inicio de sesión.

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplican a este caso:** D1, D5, D11, D13, D16, D25, D26 y D27. D13 a D27 son recomendaciones del agente aceptadas por el estudiante. El detalle está en `docs/proceso.md`.

**Preguntas abiertas (secundarias)**

- ¿Se muestra el nombre del médico o solo la especialidad? (también abierta en «Reservar una cita médica por especialidad»)
- ¿Qué ocurre si el familiar pierde el código? (también abierta en «Reservar una cita médica por especialidad»)

**Supuestos por validar**

- Solo quien reservó conoce el código.

**Casos relacionados:** usa el código que entrega «Reservar una cita médica por especialidad»; es el punto de partida de «Cancelar una cita» y «Cambiar una cita».