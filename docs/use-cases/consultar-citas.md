---
slug: "consultar-citas"
title: "Consultar citas reservadas"
description: "La secretaria ve las citas reservadas por día, filtra por médico y busca por nombre del paciente para atenderlo en recepción o avisar al familiar."
spec_kind: use-case
status: approved
created_at: "2026-10-28T01:46:18.205Z"
last_updated: "2026-10-28T01:51:48.576Z"
related_specs:
  - slug: reservar-cita
    relationship: depends-on
---
## Actor, objetivo y disparador

- **Actor principal:** secretaria del consultorio. (D2)
- **Objetivo:** saber qué citas hay reservadas, encontrar la cita de un paciente cuando llega a recepción y tener el contacto del familiar si hace falta avisarle.
- **Disparadores:**
  - La secretaria quiere revisar las citas de un día.
  - Un paciente llega al consultorio y dice su nombre en recepción. (D14)
  - Un médico no podrá atender y la secretaria necesita avisar a los familiares. (D21)

## Condiciones previas y recorrido principal

**Condiciones previas**

- La secretaria entró con su propio usuario y contraseña. (D18)

**Recorrido principal**

1. La secretaria entra a la sección de citas.
2. El producto muestra las citas reservadas de hoy, ordenadas por hora. (D23)
3. Si lo necesita, la secretaria elige otro día, filtra por médico o busca por el nombre del paciente. (D14, D23)
4. El producto muestra las citas que coinciden. De cada una muestra: hora, médico y especialidad, nombre del paciente, si es menor de edad, acompañante (si lo hay) y contacto del familiar. (D23)
5. La secretaria identifica la cita que buscaba.

## Alternativas, errores y reglas

**Alternativas y errores**

- **C1. Día sin citas:** el producto indica que no hay citas para ese día. (D24)
- **C2. Búsqueda sin resultados:** la búsqueda se hace sobre el día que se está viendo; si no hay coincidencias, el producto lo indica. (D24)
- **C3. Nombres repetidos:** si hay más de un paciente con ese nombre, el producto muestra todas las coincidencias con hora y médico para que la secretaria identifique la correcta. (D24)
- **C4. Un médico no podrá atender:** la secretaria filtra por ese médico y usa el contacto de cada familiar para avisarle por fuera del producto; en esta versión la cita no se cancela desde el producto. (D21)

**Reglas**

- **R1.** Solo la secretaria, con su usuario y contraseña, puede ver la lista de citas. (D18)
- **R2.** La lista no muestra el código de reserva. (D23)
- **R3.** La lista es de consulta: la secretaria no crea, asigna ni cancela citas desde aquí. (D3, D21)
- **R4.** Las citas canceladas por el familiar no aparecen en la lista. (D26)

**Exclusiones de esta versión**

- Cancelar citas por parte del consultorio. (D21)

## Resultado observable y criterios de aceptación

**Resultado observable:** la secretaria ve las citas del día elegido con los datos necesarios para atender al paciente en recepción o avisar al familiar.

**Criterios de aceptación**

- **CA1.** Al entrar, se muestran las citas de hoy ordenadas por hora.
- **CA2.** Al cambiar de día o filtrar por médico, solo se muestran las citas que coinciden.
- **CA3.** Al buscar un nombre, se muestran las citas de ese día cuyo paciente coincide; si hay varias, se muestran todas con hora y médico.
- **CA4.** Cada cita muestra hora, médico y especialidad, paciente, si es menor de edad, acompañante (si lo hay) y contacto del familiar.
- **CA5.** El código de reserva no aparece en la lista.
- **CA6.** Sin haber entrado con usuario y contraseña no se puede ver la lista.
- **CA7.** Una cita reservada por un familiar aparece en la lista del día correspondiente.
- **CA8.** Una cita cancelada por el familiar deja de aparecer en la lista. (D26)

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplican a este caso:** D2, D3, D14, D18, D21, D23, D24 y D26. D13 a D26 son recomendaciones del agente aceptadas por el estudiante. El detalle está en `docs/proceso.md`.

**Casos relacionados:** muestra el resultado de «Reservar una cita médica por especialidad» y usa los turnos de «Publicar horarios disponibles de un médico».