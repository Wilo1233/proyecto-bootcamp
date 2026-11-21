---
slug: "publicar-horarios"
title: "Publicar horarios disponibles de un médico"
description: "La secretaria publica por bloques los turnos de un médico (día, rango de horas y duración) para que los familiares puedan reservarlos, y puede quitar turnos que sigan libres."
spec_kind: use-case
status: approved
created_at: "2026-10-28T01:39:50.257Z"
last_updated: "2026-10-28T01:44:51.322Z"
related_specs:
  - slug: reservar-cita
    relationship: required-by
---
## Actor, objetivo y disparador

- **Actor principal:** secretaria del consultorio. (D2)
- **Datos que usa (no son actores):** los médicos y sus especialidades, que ya vienen cargados en el producto. Los médicos no usan la aplicación. (D2, D20)
- **Objetivo:** dejar publicados los turnos de un médico para que los familiares puedan reservarlos.
- **Disparador:** la secretaria conoce los días y las horas en que atenderá un médico y quiere ofrecerlos para reserva.

## Condiciones previas y recorrido principal

**Condiciones previas**

- La secretaria entró con su propio usuario y contraseña. (D18)
- El médico y su especialidad ya están cargados en el producto. (D20)

**Recorrido principal**

1. La secretaria entra a la sección de horarios.
2. El producto muestra la lista de médicos con su especialidad. (D20)
3. La secretaria elige un médico.
4. La secretaria indica el día, el rango de horas y la duración de cada cita. (D19)
5. La secretaria confirma la publicación.
6. El sistema divide el rango en turnos de la duración indicada y los publica como libres. (D19)
7. El producto muestra los turnos publicados para ese médico y ese día.
8. Desde ese momento, los turnos aparecen como libres para los familiares que reservan en la especialidad del médico (caso «Reservar una cita médica por especialidad»). (D3, D9)

## Alternativas, errores y reglas

**Alternativas y errores**

- **B1. Rango superpuesto:** si el rango se superpone con turnos ya publicados del mismo médico, el producto lo informa y no publica los turnos superpuestos. (D22)
- **B2. Datos inválidos:** si el día ya pasó, la hora de fin es anterior a la de inicio o falta la duración, el producto indica qué corregir y no publica nada. (D22)
- **B3. Quitar un turno libre:** la secretaria elige un turno publicado que no tiene cita y lo quita; deja de aparecer para los familiares. (D21)
- **B4. Intento de quitar un turno con cita:** el producto no lo permite e informa que el turno ya está reservado. (D21)

**Reglas**

- **R1.** Solo la secretaria, con su usuario y contraseña, puede publicar o quitar turnos. (D18)
- **R2.** Los turnos se publican por bloques: médico, día, rango de horas y duración de cada cita. (D19)
- **R3.** Cada turno admite una sola cita (regla R5 de «Reservar una cita médica por especialidad»). (D17)
- **R4.** Solo se pueden quitar turnos libres; los turnos con cita no se pueden quitar en esta versión. (D21)

**Exclusiones de esta versión**

- Crear o administrar cuentas del personal; se supone que la cuenta de la secretaria ya existe. (D18)
- Agregar, editar o quitar médicos y especialidades; la lista ya viene cargada. (D20)
- Cancelar citas por parte del consultorio, por ejemplo si un médico falta; la secretaria avisa al familiar por fuera del producto. (D21)

## Resultado observable y criterios de aceptación

**Resultado observable:** los turnos del médico quedan publicados y los familiares los ven como libres al reservar en esa especialidad.

**Criterios de aceptación**

- **CA1.** Al publicar, el rango se divide en turnos de la duración indicada (por ejemplo, de 8:00 a 12:00 con turnos de 30 minutos se obtienen ocho turnos).
- **CA2.** Los turnos publicados aparecen como libres para los familiares en la especialidad del médico.
- **CA3.** Sin haber entrado con usuario y contraseña no se pueden publicar ni quitar turnos.
- **CA4.** Un turno libre que la secretaria quita deja de aparecer para los familiares.
- **CA5.** Un turno que ya tiene cita no se puede quitar.
- **CA6.** No se publican turnos superpuestos para un mismo médico. (D22)

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplican a este caso:** D2, D3, D7, D9, D17, D18, D19, D20, D21 y D22. D18 a D22 son recomendaciones del agente aceptadas por el estudiante. El detalle está en `docs/proceso.md`.

**Preguntas abiertas (secundarias)**

- ¿Se pueden publicar varios días de una vez (por ejemplo, todos los martes de un mes)?
- ¿Qué pasa si el rango de horas no se divide exacto por la duración de la cita?

**Casos relacionados:** «Reservar una cita médica por especialidad» depende de este caso; los turnos publicados también se reflejan en «Consultar citas reservadas» (aún no redactado).
