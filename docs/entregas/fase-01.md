# Consultorio Médico Privado — Definición funcional

## 1. Identificación del proyecto

| Campo | Dato |
|---|---|
| Producto | Consultorio Médico Privado |
| Autor | Wilson Ortiz (trabajo individual) |
| Cohorte | CB PFSD4 · VI Cohorte Frontend React |
| Entrega | **Fase 1 · Definición funcional** |
| Fecha | 27 de octubre de 2026 |
| Versión del documento | 1.0 — revisada por el autor |

## 2. Problema y contexto

**Situación que se busca mejorar (idea del autor).** Pedir una cita en un consultorio médico privado debería ser sencillo, «para que no tengan muchas complicaciones». Según el autor, quienes más lo necesitan son niños y adultos mayores, a quienes les cuesta guiarse en una página web; por eso suele ser un familiar quien gestiona sus citas. El autor quiere que sacar una cita sea sencillo y que la confirmación llegue en el momento, por correo o al celular.

**Cómo se resuelve hoy y qué dificultad persiste (supuestos sin validar).** Estos supuestos fueron propuestos con ayuda de la IA y aceptados por el autor; no se apoyan en entrevistas, estadísticas ni estudios:

- **S1.** Hoy las citas se piden sobre todo por teléfono o yendo en persona a recepción.
- **S2.** Así, el familiar no ve qué horarios hay libres: tiene que preguntar y depende de que la secretaria pueda atender en ese momento.
- **S3.** La cita suele quedar acordada de palabra o anotada en un papel, sin un mensaje para revisarla después; para cancelar o cambiar hay que volver a llamar.

**Dificultad que persiste (derivada de los supuestos):** pedir, cancelar o cambiar una cita depende de comunicarse con el consultorio en su horario, y el familiar no tiene un registro propio de la cita.

**Observaciones y supuestos.** La situación, el público y el resultado deseado provienen de la idea del autor. La forma actual de pedir citas y sus dificultades son supuestos que no se validaron con un consultorio ni con usuarios (ver sección 8).

## 3. Usuarios y objetivos

| Actor | Tipo | Resultado que busca | Casos de uso |
|---|---|---|---|
| Familiar responsable (por ejemplo, padre, madre o hijo adulto) | Persona; usa la página sin cuenta | Reservar la cita de un paciente en la especialidad, día y horario que elija; después consultarla, cancelarla o cambiarla con su código | `reservar-cita`, `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` |
| Secretaria del consultorio | Persona; usa la página con usuario y contraseña | Publicar los turnos de los médicos y consultar las citas reservadas para atender en recepción o avisar a los familiares | `publicar-horarios`, `consultar-citas` |
| Servicio de mensajes | Sistema externo | Entregar al familiar, por correo electrónico o WhatsApp, la confirmación con el código y los avisos de cancelación o cambio | `reservar-cita`, `cancelar-cita`, `cambiar-cita` |

**Personas que aparecen en los datos pero no usan la página (no son actores):**

- **Paciente:** recibe la atención médica; no usa la página ni recibe mensajes. Al llegar, se identifica diciendo su nombre en recepción.
- **Acompañante:** persona que irá con el paciente; solo se registran sus datos. Es opcional si el paciente es mayor de edad y obligatorio si es menor. No recibe mensajes.
- **Médicos:** cada uno con su especialidad; ya vienen cargados en el producto y no usan la página.

## 4. Descripción general de la solución

Consultorio Médico Privado es una página para pedir citas médicas sin llamar ni ir en persona. La secretaria publica los turnos libres de cada médico. Un familiar elige la especialidad, un día con cupo y un horario libre para el paciente, y la cita queda confirmada en el momento, sin que nadie tenga que aprobarla. El familiar recibe por correo electrónico o WhatsApp un código con el que después puede consultar, cancelar o cambiar la cita. No hace falta crear una cuenta.

**Recorrido de principio a fin (ejemplo):**

1. La secretaria entra con su usuario y contraseña y publica los turnos de un médico de Medicina general para el martes, de 8:00 a 12:00, de 30 minutos cada uno.
2. Marcos, hijo adulto, entra sin crear cuenta, elige Medicina general, un día con cupo y las 10:00, llena los datos de su papá de 70 años y elige recibir el mensaje por WhatsApp.
3. La cita queda confirmada al instante y a Marcos le llega por WhatsApp la confirmación con el código de reserva.
4. Días después, Marcos ingresa el código para revisar la cita; si surge un percance, puede cancelarla o pasarla a otro día y hora.
5. El día de la cita, el papá llega al consultorio, dice su nombre en recepción y la secretaria encuentra su cita en la lista del día.

## 5. Alcance inicial y exclusiones

**Capacidades comprometidas para la primera versión** (todas con caso de uso aprobado):

| Capacidad | Actor | Caso de uso |
|---|---|---|
| Reservar una cita por especialidad, día y horario, con confirmación inmediata y código | Familiar | `reservar-cita` |
| Publicar por bloques los turnos de un médico y quitar turnos libres | Secretaria | `publicar-horarios` |
| Consultar las citas reservadas por día, médico o nombre del paciente | Secretaria | `consultar-citas` |
| Consultar una cita con su código | Familiar | `consultar-cita-codigo` |
| Cancelar una cita | Familiar | `cancelar-cita` |
| Cambiar el día y la hora de una cita | Familiar | `cambiar-cita` |

**Exclusiones de esta versión:**

| Queda fuera | Justificación | Decisión |
|---|---|---|
| Crear o administrar cuentas del personal | Se supone que la cuenta de la secretaria ya existe; así se protege la agenda sin sumar un caso de administración de usuarios. | D18 |
| Agregar, editar o quitar médicos y especialidades | En un consultorio privado los médicos cambian poco; administrarlos sería otro caso completo que no aporta al objetivo central. | D20 |
| Cancelación de citas por parte del consultorio (por ejemplo, si un médico falta) | La secretaria avisa al familiar por fuera de la página con el contacto de la lista; se evita un recorrido nuevo de cancelación y aviso automático. | D21 |
| Cambiar de especialidad al cambiar una cita | Implica otro médico y otra agenda; se resuelve cancelando y reservando de nuevo (justificación del autor en la sección 9). | D28 |
| Modificar los datos del paciente o del acompañante después de reservar | Mantiene el cambio de cita limitado a día y hora. | D28 |

**Mejoras futuras.** En esta fase no se definieron mejoras futuras concretas. Las exclusiones anteriores podrían evaluarse en versiones posteriores, sin compromiso.

## 6. Secciones o pantallas previstas

No se incluyen maquetas, estilos ni direcciones definitivas.

| Sección | Propósito | Quién la usa | Qué muestra | Qué permite | Casos de uso |
|---|---|---|---|---|---|
| Inicio | Punto de entrada del familiar | Familiar | Las dos opciones principales | Ir a reservar o a consultar una cita con su código | `reservar-cita`, `consultar-cita-codigo` |
| Reservar cita | Hacer una reserva completa | Familiar | Especialidades, días (los completos no se pueden elegir), horarios libres, datos del paciente y del acompañante, contacto y canal | Completar la reserva y ver la confirmación | `reservar-cita` |
| Mi cita | Gestionar una cita existente | Familiar | Campo del código y datos de la cita | Consultar, cancelar o cambiar (para cambiar reutiliza la vista de días y horarios) | `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` |
| Ingreso del personal | Proteger las secciones de la secretaria | Secretaria | Usuario y contraseña | Entrar a Horarios y Citas | `publicar-horarios`, `consultar-citas` |
| Horarios | Ofrecer turnos para reservar | Secretaria | Médicos con su especialidad y turnos publicados | Publicar un bloque y quitar turnos libres | `publicar-horarios` |
| Citas | Atender en recepción y avisar a familiares | Secretaria | Citas del día con sus datos | Cambiar de día, filtrar por médico y buscar por nombre | `consultar-citas` |

## 7. Casos de uso de la versión inicial

| Identificador AHK | Nombre | Actor principal | Objetivo | Archivo fuente | Estado |
|---|---|---|---|---|---|
| `reservar-cita` | Reservar una cita médica por especialidad | Familiar responsable | Reservar la cita del paciente en la especialidad, el día y el horario elegidos, y recibir un código | `docs/use-cases/reservar-cita.md` | aprobado |
| `publicar-horarios` | Publicar horarios disponibles de un médico | Secretaria del consultorio | Publicar los turnos de un médico para que los familiares puedan reservarlos | `docs/use-cases/publicar-horarios.md` | aprobado |
| `consultar-citas` | Consultar citas reservadas | Secretaria del consultorio | Ver las citas reservadas, encontrar la de un paciente en recepción y tener el contacto del familiar | `docs/use-cases/consultar-citas.md` | aprobado |
| `consultar-cita-codigo` | Consultar una cita con su código | Familiar responsable que reservó la cita | Revisar los datos de una cita y poder cancelarla o cambiarla | `docs/use-cases/consultar-cita-codigo.md` | aprobado |
| `cancelar-cita` | Cancelar una cita | Familiar responsable que reservó la cita | Cancelar una cita a la que el paciente no podrá ir, para que el turno quede libre | `docs/use-cases/cancelar-cita.md` | aprobado |
| `cambiar-cita` | Cambiar una cita | Familiar responsable que reservó la cita | Pasar la cita a otro día u hora sin perderla | `docs/use-cases/cambiar-cita.md` | aprobado |

Las fichas siguientes condensan los archivos fuente sin omitir pasos, alternativas, reglas ni criterios de aceptación. Las referencias entre paréntesis (D1, D2…) remiten a las decisiones de la sección 8.

### 7.1 Reservar una cita médica por especialidad

**Identificador y nombre:** `reservar-cita` — Reservar una cita médica por especialidad (archivo `docs/use-cases/reservar-cita.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: familiar responsable (por ejemplo, padre, madre o hijo adulto). Siempre es un familiar quien reserva, en nombre del paciente. (D1, D11)
- Actor secundario: servicio de mensajes (sistema externo), que entrega el código al familiar por correo electrónico o por WhatsApp. (D6, D16)
- Objetivo: dejar reservada una cita en la especialidad que necesita el paciente, en un día y horario elegidos por el familiar, y recibir un código para consultarla, cancelarla o cambiarla después.
- Personas registradas que no usan la aplicación: el paciente, que recibe la atención médica y no usa la aplicación ni recibe mensajes (D1, D13); y el acompañante, que irá con el paciente a la cita, del que solo se registran sus datos y que no recibe mensajes; es opcional si el paciente es mayor de edad y obligatorio si es menor (D10, D13, D15).

**Situación que lo inicia y condiciones previas:**

- Disparador: el paciente necesita atención en una especialidad y el familiar decide reservarle una cita.
- Condiciones previas:
  - La secretaria publicó horarios disponibles para al menos una especialidad (caso `publicar-horarios`).
  - El familiar no necesita cuenta ni inicio de sesión. (D5)
  - El familiar dispone de un correo electrónico o de un número con WhatsApp. (D6, D16)

**Pasos del recorrido principal:**

1. El familiar entra a la sección de reserva.
2. El producto muestra las especialidades que tienen horarios disponibles.
3. El familiar elige una especialidad. (D7)
4. El producto muestra los días de esa especialidad; los días sin ningún horario libre aparecen como completos y no se pueden elegir. (D9)
5. El familiar elige un día con horarios libres.
6. El producto muestra solo los horarios libres de ese día. (D9)
7. El familiar elige un horario. (D3)
8. El familiar ingresa los datos del paciente e indica si es menor de edad. (D15)
9. Si el paciente irá acompañado, el familiar agrega los datos del acompañante; si el paciente es menor de edad, este paso es obligatorio. (D10, D15)
10. El familiar ingresa su contacto y elige recibir el código por correo electrónico o por WhatsApp. (D6, D13, D16)
11. El familiar confirma la reserva.
12. El sistema comprueba que el horario siga libre, registra la cita como confirmada sin intervención de la secretaria y muestra que la reserva se completó. (D3, D8)
13. El servicio de mensajes envía al familiar, por el canal elegido, la confirmación de la cita con su código de reserva. (D5, D13)

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- A1. Sin horarios en la especialidad: el producto informa que no hay horarios libres y permite elegir otra especialidad. (D17)
- A2. Horario tomado mientras se reservaba: al confirmar, el sistema detecta que el horario ya fue reservado por otra persona, lo informa, no registra la cita y muestra los horarios libres restantes. (D8, D17)
- A3. Datos incompletos o contacto inválido: el producto indica qué dato corregir y no registra la cita. (D17)
- A4. Paciente menor de edad sin acompañante: el producto indica que faltan los datos del acompañante y no registra la cita. (D15)
- A5. El mensaje no se puede entregar: comportamiento pendiente de decisión.

_Reglas_

- R1. La cita queda confirmada al terminar la reserva; la secretaria no la aprueba ni la asigna. (D3, D8)
- R2. No se requiere cuenta; cada cita tiene su propio código de reserva. (D5)
- R3. El código se envía solo al familiar que reserva, por correo electrónico o por WhatsApp, según su elección. (D6, D13, D16)
- R4. El familiar elige primero la especialidad, después el día y por último el horario. (D7, D9)
- R5. Un horario solo puede tener una cita. (D17)
- R6. Los datos del acompañante son opcionales si el paciente es mayor de edad y obligatorios si es menor. (D10, D15)
- R7. Al llegar al consultorio, el paciente se identifica diciendo su nombre en recepción; no necesita presentar el código. (D14)

**Resultado observable:** la cita queda confirmada, el horario deja de estar disponible para otras reservas y el familiar recibe, por correo electrónico o por WhatsApp, un mensaje con el código de reserva.

**Criterios de aceptación:**

- CA1. Al confirmar, el producto muestra que la cita quedó confirmada sin que intervenga la secretaria.
- CA2. En el momento de confirmar, se envía al familiar, por el canal que eligió, un mensaje que contiene el código de reserva.
- CA3. La reserva se completa sin crear una cuenta ni iniciar sesión.
- CA4. Solo se pueden elegir días con horarios libres y, dentro de un día, solo se muestran los horarios libres de la especialidad seleccionada.
- CA5. Un horario reservado deja de aparecer como disponible para otra reserva.
- CA6. Si el paciente es menor de edad y faltan los datos del acompañante, la cita no se registra y se indica qué falta.
- CA7. Si faltan datos obligatorios o el contacto no es válido, la cita no se registra y se indica qué corregir.
- CA8. La cita reservada aparece en la lista de citas de la secretaria y se puede encontrar por el nombre del paciente (caso `consultar-citas`).

### 7.2 Publicar horarios disponibles de un médico

**Identificador y nombre:** `publicar-horarios` — Publicar horarios disponibles de un médico (archivo `docs/use-cases/publicar-horarios.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: secretaria del consultorio. (D2)
- Objetivo: dejar publicados los turnos de un médico para que los familiares puedan reservarlos.
- Datos que usa (no son actores): los médicos y sus especialidades, que ya vienen cargados en el producto. Los médicos no usan la aplicación. (D2, D20)

**Situación que lo inicia y condiciones previas:**

- Disparador: la secretaria conoce los días y las horas en que atenderá un médico y quiere ofrecerlos para reserva.
- Condiciones previas:
  - La secretaria entró con su propio usuario y contraseña. (D18)
  - El médico y su especialidad ya están cargados en el producto. (D20)

**Pasos del recorrido principal:**

1. La secretaria entra a la sección de horarios.
2. El producto muestra la lista de médicos con su especialidad. (D20)
3. La secretaria elige un médico.
4. La secretaria indica el día, el rango de horas y la duración de cada cita. (D19)
5. La secretaria confirma la publicación.
6. El sistema divide el rango en turnos de la duración indicada y los publica como libres. (D19)
7. El producto muestra los turnos publicados para ese médico y ese día.
8. Desde ese momento, los turnos aparecen como libres para los familiares que reservan en la especialidad del médico (caso `reservar-cita`). (D3, D9)

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- B1. Rango superpuesto: si el rango se superpone con turnos ya publicados del mismo médico, el producto lo informa y no publica los turnos superpuestos. (D22)
- B2. Datos inválidos: si el día ya pasó, la hora de fin es anterior a la de inicio o falta la duración, el producto indica qué corregir y no publica nada. (D22)
- B3. Quitar un turno libre: la secretaria elige un turno publicado que no tiene cita y lo quita; deja de aparecer para los familiares. (D21)
- B4. Intento de quitar un turno con cita: el producto no lo permite e informa que el turno ya está reservado. (D21)

_Reglas_

- R1. Solo la secretaria, con su usuario y contraseña, puede publicar o quitar turnos. (D18)
- R2. Los turnos se publican por bloques: médico, día, rango de horas y duración de cada cita. (D19)
- R3. Cada turno admite una sola cita (regla R5 de `reservar-cita`). (D17)
- R4. Solo se pueden quitar turnos libres; los turnos con cita no se pueden quitar en esta versión. (D21)

_Exclusiones de esta versión_

- Crear o administrar cuentas del personal; se supone que la cuenta de la secretaria ya existe. (D18)
- Agregar, editar o quitar médicos y especialidades; la lista ya viene cargada. (D20)
- Cancelar citas por parte del consultorio, por ejemplo si un médico falta; la secretaria avisa al familiar por fuera del producto. (D21)

**Resultado observable:** los turnos del médico quedan publicados y los familiares los ven como libres al reservar en esa especialidad.

**Criterios de aceptación:**

- CA1. Al publicar, el rango se divide en turnos de la duración indicada (por ejemplo, de 8:00 a 12:00 con turnos de 30 minutos se obtienen ocho turnos).
- CA2. Los turnos publicados aparecen como libres para los familiares en la especialidad del médico.
- CA3. Sin haber entrado con usuario y contraseña no se pueden publicar ni quitar turnos.
- CA4. Un turno libre que la secretaria quita deja de aparecer para los familiares.
- CA5. Un turno que ya tiene cita no se puede quitar.
- CA6. No se publican turnos superpuestos para un mismo médico. (D22)

### 7.3 Consultar citas reservadas

**Identificador y nombre:** `consultar-citas` — Consultar citas reservadas (archivo `docs/use-cases/consultar-citas.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: secretaria del consultorio. (D2)
- Objetivo: saber qué citas hay reservadas, encontrar la cita de un paciente cuando llega a recepción y tener el contacto del familiar si hace falta avisarle.

**Situación que lo inicia y condiciones previas:**

- Disparadores:
  - La secretaria quiere revisar las citas de un día.
  - Un paciente llega al consultorio y dice su nombre en recepción. (D14)
  - Un médico no podrá atender y la secretaria necesita avisar a los familiares. (D21)
- Condiciones previas:
  - La secretaria entró con su propio usuario y contraseña. (D18)

**Pasos del recorrido principal:**

1. La secretaria entra a la sección de citas.
2. El producto muestra las citas reservadas de hoy, ordenadas por hora. (D23)
3. Si lo necesita, la secretaria elige otro día, filtra por médico o busca por el nombre del paciente. (D14, D23)
4. El producto muestra las citas que coinciden; de cada una muestra hora, médico y especialidad, nombre del paciente, si es menor de edad, acompañante (si lo hay) y contacto del familiar. (D23)
5. La secretaria identifica la cita que buscaba.

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- C1. Día sin citas: el producto indica que no hay citas para ese día. (D24)
- C2. Búsqueda sin resultados: la búsqueda se hace sobre el día que se está viendo; si no hay coincidencias, el producto lo indica. (D24)
- C3. Nombres repetidos: si hay más de un paciente con ese nombre, el producto muestra todas las coincidencias con hora y médico para que la secretaria identifique la correcta. (D24)
- C4. Un médico no podrá atender: la secretaria filtra por ese médico y usa el contacto de cada familiar para avisarle por fuera del producto; en esta versión la cita no se cancela desde el producto. (D21)

_Reglas_

- R1. Solo la secretaria, con su usuario y contraseña, puede ver la lista de citas. (D18)
- R2. La lista no muestra el código de reserva. (D23)
- R3. La lista es de consulta: la secretaria no crea, asigna ni cancela citas desde aquí. (D3, D21)
- R4. Las citas canceladas por el familiar no aparecen en la lista. (D26)

_Exclusiones de esta versión_

- Cancelar citas por parte del consultorio. (D21)

**Resultado observable:** la secretaria ve las citas del día elegido con los datos necesarios para atender al paciente en recepción o avisar al familiar.

**Criterios de aceptación:**

- CA1. Al entrar, se muestran las citas de hoy ordenadas por hora.
- CA2. Al cambiar de día o filtrar por médico, solo se muestran las citas que coinciden.
- CA3. Al buscar un nombre, se muestran las citas de ese día cuyo paciente coincide; si hay varias, se muestran todas con hora y médico.
- CA4. Cada cita muestra hora, médico y especialidad, paciente, si es menor de edad, acompañante (si lo hay) y contacto del familiar.
- CA5. El código de reserva no aparece en la lista.
- CA6. Sin haber entrado con usuario y contraseña no se puede ver la lista.
- CA7. Una cita reservada por un familiar aparece en la lista del día correspondiente.
- CA8. Una cita cancelada por el familiar deja de aparecer en la lista. (D26)

### 7.4 Consultar una cita con su código

**Identificador y nombre:** `consultar-cita-codigo` — Consultar una cita con su código (archivo `docs/use-cases/consultar-cita-codigo.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: familiar responsable que reservó la cita. (D1, D11)
- Objetivo: revisar los datos de una cita reservada para no olvidarla ni perderla, y poder cancelarla o cambiarla.

**Situación que lo inicia y condiciones previas:**

- Disparador: el familiar quiere recordar o revisar una cita que reservó.
- Condiciones previas:
  - El familiar tiene el código de reserva que recibió por correo electrónico o WhatsApp al reservar. (D5, D13, D16)
  - No necesita cuenta ni inicio de sesión. (D5)

**Pasos del recorrido principal:**

1. El familiar entra a la sección para consultar una cita.
2. El producto le pide el código de reserva.
3. El familiar ingresa el código.
4. El producto muestra los datos de esa cita: especialidad, día, hora, nombre del paciente y acompañante (si lo hay). (D25)
5. Si la hora de la cita todavía no pasó, el producto ofrece cancelarla o cambiarla (casos `cancelar-cita` y `cambiar-cita`). (D25)

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- E1. Código incorrecto o inexistente: el producto indica que no encuentra una cita con ese código y permite intentarlo de nuevo. (D27)
- E2. Cita ya pasada: el producto la muestra como pasada y no ofrece cancelarla ni cambiarla. (D27)
- E3. Cita cancelada: si el código corresponde a una cita cancelada, el producto indica que esa cita fue cancelada. (D26)

_Reglas_

- R1. Cada código da acceso a una sola cita; no existe una lista de «todas mis citas». (D5, D25)
- R2. No se requiere cuenta ni inicio de sesión. (D5)
- R3. Solo se ofrece cancelar o cambiar antes de la hora de la cita. (D26, D27)

**Resultado observable:** el familiar ve los datos de su cita y, si todavía no pasó, puede elegir cancelarla o cambiarla.

**Criterios de aceptación:**

- CA1. Con un código válido se muestran la especialidad, el día, la hora, el paciente y el acompañante (si lo hay) de esa cita.
- CA2. Con un código incorrecto se indica que no se encontró la cita y se puede reintentar.
- CA3. Una cita cuya hora ya pasó se muestra como pasada y sin opciones de cancelar o cambiar.
- CA4. El código de una cita cancelada indica que fue cancelada.
- CA5. No se pide cuenta ni inicio de sesión.

### 7.5 Cancelar una cita

**Identificador y nombre:** `cancelar-cita` — Cancelar una cita (archivo `docs/use-cases/cancelar-cita.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: familiar responsable que reservó la cita. (D1, D11)
- Actor secundario: servicio de mensajes, que entrega el aviso de cancelación por correo electrónico o WhatsApp. (D6, D16)
- Objetivo: cancelar una cita a la que el paciente ya no podrá ir, para que el turno quede libre. (D4)

**Situación que lo inicia y condiciones previas:**

- Disparador: surge un percance y el paciente no podrá asistir a la cita.
- Condiciones previas:
  - El familiar consultó la cita con su código (caso `consultar-cita-codigo`). (D25)
  - La hora de la cita todavía no pasó. (D26)

**Pasos del recorrido principal:**

1. Desde la cita consultada, el familiar elige cancelarla.
2. El producto pide confirmar la cancelación. (D26)
3. El familiar confirma.
4. El sistema cancela la cita y el turno vuelve a quedar libre para otras reservas. (D26)
5. El producto muestra que la cita fue cancelada.
6. El servicio de mensajes envía al familiar un aviso de cancelación por el mismo canal que eligió al reservar. (D26)

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- CN1. El familiar no confirma: la cita sigue igual. (D27)
- CN2. La hora de la cita ya pasó: no se ofrece cancelar (ver E2 de `consultar-cita-codigo`). (D26, D27)

_Reglas_

- R1. Solo se puede cancelar antes de la hora de la cita; un posible límite de anticipación se definirá en la fase 2. (D26)
- R2. Al cancelar, el turno vuelve a quedar libre. (D26)
- R3. El código de una cita cancelada deja de servir para cancelar o cambiar; al ingresarlo, se informa que la cita fue cancelada. (D26)
- R4. La cita cancelada desaparece de la lista de la secretaria. (D26)
- R5. El aviso de cancelación llega solo al familiar, por el canal que eligió al reservar. (D13, D16, D26)

**Resultado observable:** la cita queda cancelada, el turno vuelve a estar disponible y el familiar recibe un aviso de cancelación.

**Criterios de aceptación:**

- CA1. Antes de cancelar, el producto pide confirmación.
- CA2. Tras confirmar, el turno vuelve a aparecer como libre para otras reservas.
- CA3. El familiar recibe un aviso de cancelación por el canal que eligió al reservar.
- CA4. Al volver a ingresar el código, el producto indica que la cita fue cancelada.
- CA5. La cita cancelada ya no aparece en la lista de la secretaria.
- CA6. Si el familiar no confirma, la cita sigue sin cambios.

### 7.6 Cambiar una cita

**Identificador y nombre:** `cambiar-cita` — Cambiar una cita (archivo `docs/use-cases/cambiar-cita.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: familiar responsable que reservó la cita. (D1, D11)
- Actor secundario: servicio de mensajes, que entrega el aviso del cambio por correo electrónico o WhatsApp. (D6, D16)
- Objetivo: pasar la cita a otro día u hora por algún percance, sin perderla. (D4)

**Situación que lo inicia y condiciones previas:**

- Disparador: surge un percance y el paciente no puede ir el día u hora reservados, pero sí en otro momento.
- Condiciones previas:
  - El familiar consultó la cita con su código (caso `consultar-cita-codigo`). (D25)
  - La hora de la cita todavía no pasó. (D28)

**Pasos del recorrido principal:**

1. Desde la cita consultada, el familiar elige cambiarla.
2. El producto muestra los días de la misma especialidad; los días sin horarios libres aparecen como completos y no se pueden elegir. (D9, D28)
3. El familiar elige un día con horarios libres.
4. El producto muestra solo los horarios libres de ese día. (D9)
5. El familiar elige el nuevo horario.
6. El producto pide confirmar el cambio. (D28)
7. El familiar confirma.
8. El sistema comprueba que el nuevo horario siga libre, lo ocupa con la cita y recién entonces libera el horario anterior. (D8, D28)
9. El producto muestra la cita con su nuevo día y hora; el código sigue siendo el mismo. (D28)
10. El servicio de mensajes envía al familiar un aviso del cambio con el nuevo día y hora, por el canal que eligió al reservar. (D13, D16, D28)

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- F1. Horario tomado mientras se cambiaba: el producto lo informa y la cita original sigue igual. (D29)
- F2. El familiar no confirma: la cita sigue igual. (D29)
- F3. Sin otros horarios libres en la especialidad: el producto lo informa y la cita original sigue igual. (D29)
- F4. La hora de la cita ya pasó: no se ofrece cambiar (ver E2 de `consultar-cita-codigo`). (D27, D28)

_Reglas_

- R1. Solo se cambian el día y la hora, dentro de la misma especialidad; para cambiar de especialidad se cancela y se reserva de nuevo. (D28)
- R2. El horario anterior se libera solo cuando el nuevo queda confirmado; el familiar nunca se queda sin cita durante el cambio. (D28)
- R3. Se mantiene el mismo código de reserva. (D28)
- R4. Los datos del paciente y del acompañante no se modifican en esta versión. (D28)
- R5. Solo se puede cambiar antes de la hora de la cita. (D28)
- R6. En la lista de la secretaria, la cita aparece en su nuevo día y hora. (D28)

_Exclusiones de esta versión_

- Cambiar de especialidad dentro de este caso. (D28)
- Modificar los datos del paciente o del acompañante. (D28)

**Resultado observable:** la cita queda en el nuevo día y hora, el horario anterior vuelve a estar libre y el familiar recibe un aviso del cambio, conservando su código.

**Criterios de aceptación:**

- CA1. Solo se ofrecen días y horarios libres de la misma especialidad.
- CA2. Antes de cambiar, el producto pide confirmación.
- CA3. Tras confirmar, el nuevo horario deja de estar disponible y el anterior vuelve a aparecer como libre.
- CA4. Con el mismo código se ve la cita con su nuevo día y hora.
- CA5. El familiar recibe un aviso del cambio por el canal que eligió al reservar.
- CA6. En la lista de la secretaria, la cita aparece en su nuevo día y hora.
- CA7. Si el nuevo horario se ocupó, no hay otros horarios libres o el familiar no confirma, la cita original no cambia.

## 8. Decisiones y preguntas pendientes

El detalle de cada decisión (pregunta, alternativas, elección y motivo) está en `docs/proceso.md`. «Autor» indica una elección del autor entre alternativas; «IA aceptada» indica una recomendación de la IA que el autor aceptó.

### 8.1 Decisiones confirmadas

| Decisión | Qué se decidió | Origen |
|---|---|---|
| D1 | Siempre reserva un familiar responsable, en nombre del paciente | Autor |
| D2 | La agenda la maneja la secretaria; los médicos no usan la página | Autor |
| D3 | Reserva directa: la cita se confirma al instante, sin aprobación | Autor |
| D4 | La primera versión incluye seis casos de uso | Autor, sobre una propuesta de separación de la IA |
| D5 | Sin cuenta: cada cita tiene su propio código de reserva | Autor |
| D6 | El familiar elige el canal del mensaje | Autor |
| D7 | Se elige primero la especialidad y después el horario | Autor |
| D8 | Al confirmar, el sistema comprueba que el horario siga libre (no una persona) | Autor |
| D9 | Los días completos no se pueden elegir; dentro de un día solo se ven horas libres | Autor, con redacción propuesta por la IA |
| D10 | Los datos del acompañante son opcionales | Autor |
| D11 | Se confirma que siempre reserva un familiar | Autor |
| D12 | Retirar el código en el consultorio | Autor; reemplazada por D14 |
| D13 | El código llega solo al familiar que reserva | IA aceptada |
| D14 | El paciente se identifica con su nombre en recepción; no hay tercer canal | IA aceptada |
| D15 | Si el paciente es menor de edad, el acompañante es obligatorio | IA aceptada |
| D16 | El canal de celular es WhatsApp | IA aceptada |
| D17 | Alternativas A1–A3 y regla R5 de `reservar-cita` | IA aceptada |
| D18 | La secretaria entra con usuario y contraseña | IA aceptada |
| D19 | Los turnos se publican por bloques | IA aceptada |
| D20 | Los médicos y especialidades ya vienen cargados | IA aceptada |
| D21 | Solo se pueden quitar turnos libres | IA aceptada |
| D22 | Alternativas B1–B2 de `publicar-horarios` | IA aceptada |
| D23 | Qué ve la secretaria en la lista de citas (sin el código) | IA aceptada |
| D24 | Alternativas C1–C3 de `consultar-citas` | IA aceptada |
| D25 | «Ver mis próximas citas» pasa a «Consultar una cita con su código»; cancelar y cambiar parten de ahí | IA aceptada |
| D26 | Cómo funciona cancelar | IA aceptada |
| D27 | Alternativas E1, E2 y CN1 | IA aceptada |
| D28 | Cómo funciona cambiar una cita | IA aceptada |
| D29 | Alternativas F1–F3 de `cambiar-cita` | IA aceptada |
| D30 | Supuestos S1–S3 de la sección 2 | IA aceptada |
| D31 | Seis secciones o pantallas | IA aceptada |

**Cambios de decisiones durante la fase:**

- El primer borrador de `reservar-cita` lo redactó la IA; el ejemplo del autor lo modificó (calendario por días, acompañante, menor de edad, WhatsApp).
- D11 se corrigió con D13: el código llega solo al familiar.
- D12 (retirar el código en el consultorio) se reemplazó por D14 (identificarse con el nombre en recepción).
- «Ver mis próximas citas» pasó a ser «Consultar una cita con su código» (D25), porque sin cuenta no se pueden agrupar las citas.

**Idea de diseño para una fase posterior (no forma parte del alcance funcional):** mostrar en rojo los días completos y en blanco los días disponibles.

### 8.2 Supuestos por validar

| Supuesto | Casos afectados | ¿Impide cerrar el alcance? |
|---|---|---|
| Solo quien reservó conoce el código | `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` | No |
| S1–S3: cómo se piden hoy las citas y sus dificultades (sección 2) | Todos, como justificación del problema | No, pero el problema no está validado con usuarios reales |

### 8.3 Preguntas abiertas

Quién usa el producto, cuál es su objetivo central y qué resultado produce están resueltos. Las preguntas que siguen son secundarias.

| Pregunta | Casos afectados | ¿Impide cerrar el alcance? |
|---|---|---|
| ¿Qué datos exactos del paciente, del acompañante y del familiar se piden? | `reservar-cita` | No; se precisará en la fase 2 |
| ¿El familiar ve el nombre del médico o solo la especialidad? | `reservar-cita`, `consultar-cita-codigo` | No |
| ¿El código también se muestra en pantalla al confirmar? | `reservar-cita` | No |
| ¿Qué ocurre si un mensaje no llega o el familiar pierde el código? | `reservar-cita`, `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` | No, pero es la duda más relevante para la fase 2 |
| ¿Cuánta anticipación mínima se exige para cancelar o cambiar? ¿Hay un límite de cambios? | `cancelar-cita`, `cambiar-cita` | No; reglas de la fase 2 |
| ¿Se pueden publicar varios días de una vez? ¿Qué pasa si el rango no se divide exacto por la duración? | `publicar-horarios` | No |
| Entorno: `ahk health` falla en Windows al invocar `health.bat` | Ninguno (afecta solo la comprobación de la sección 10) | No; pendiente de consultar al docente |

## 9. Decisiones propias y uso de IA

### Agente utilizado y comprobación de AHK 3.0.0

Usé Cursor junto con Claude Code y comprobé que AHK era la 3.0.0 con ahk --version. Cuando ejecuté ahk health me salía error, al preguntar a la IA y que lo revisara y concluyó que el AHK llama al script y no al proyecto, así que me dijo que usara .\health.bat para ejecutar directamente y funcionó, cuando ejecuté ahk doctor todo salió bien y sin errores.

### Decisiones tomadas y una exclusión

Lo elegí para que sea accesible para cualquiera que lo use, pero mayormente para niños y adultos mayores.

Elegí la de cambiar de especialidad al cambiar una cita y la dejé fuera porque cambiar de especialidad implica cambiar de médico y horario, y eso ya se resuelve cancelando la cita y reservando de nuevo. Así evito más pantallas y reglas sin perder nada importante.

### Una propuesta del agente que modifiqué

Le cambié la forma que estaba estructurada, tenía demasiadas incoherencias haciendo que se complique el contexto que quiero dar a conocer.

Agregué las casillas rojas porque es una manera sencilla y rápida de guiar a la persona a horarios factibles y hacer entender que las que están marcadas en rojo ya están ocupadas.

Las que me hacía contradicciones, no pensé en las consecuencias de mis decisiones haciendo que la definición tenga muchos errores.

### Un recorrido principal y una situación alternativa

1. Entra un familiar responsable, por ejemplo Marcos, un hijo adulto, sin crear cuenta ni iniciar sesión. Reserva para su papá, que tiene 70 años, así que es mayor de edad. El papá no usa la página ni recibe mensajes.

2. Elige la especialidad entre las que tienen horarios disponibles, por ejemplo Medicina general.

3. Ve los días de esa especialidad. Los días sin ningún horario libre aparecen como completos y no se pueden elegir. Al elegir un día con cupo, ve solo los horarios libres, no los ocupados. Luego elige uno, por ejemplo las 10:00.

4. Llena los datos de su papá como paciente e indica que es mayor de edad. Como es mayor de edad, agregar acompañante es opcional. Si decide agregarlo, por ejemplo a su hermana, que irá con el papá, solo registra sus datos, y ella no recibe mensajes. Si el paciente fuera menor de edad, el acompañante sería obligatorio.

5. Deja su propio contacto, el de Marcos por ejemplo, y elige recibir el mensaje por correo electrónico o por WhatsApp. Por ejemplo, elige WhatsApp.

6. Nadie revisa la cita: queda confirmada sola, sin que intervenga la secretaria. Antes de registrarla, el sistema comprueba que el horario siga libre. Si otra persona lo tomó mientras tanto, lo avisa y muestra los horarios que quedan. El mensaje llega en el momento de confirmar, solo a Marcos y por el canal que eligió. Trae la confirmación de la cita y su código de reserva.

7. Llega al consultorio y dice su nombre en recepción. No necesita presentar el código, porque el código le sirve a Marcos solo para consultar, cancelar o cambiar la cita después.

### Qué sigue sin validar y qué ayuda recibí de la IA

Nada de esto lo he validado con un consultorio real ni con usuarios; todo parte de supuestos míos y de las decisiones que fui tomando.

Claude fue quien me ayudó en el proceso, me armó tablas de opciones para decidir qué casos entraban y cuáles quedaban fuera, y yo elegía entre ellas.

Los supuestos sobre cómo se piden las citas hoy (S1 a S3) los propuso la IA y yo los acepté (D30); no los validé con nadie, así que siguen siendo supuestos.

Desde D13 hasta D31 la IA me hizo recomendaciones y yo las acepté con “sí”, y los casos de uso los redactó la IA a partir de mis decisiones; lo mío fueron las decisiones de D1 a D12 y la elección final de qué dejar fuera.

## 10. Fuentes y comprobaciones de esta fase

### Archivos fuente

| Archivo | Identificador AHK | Estado |
|---|---|---|
| `docs/use-cases/reservar-cita.md` | `reservar-cita` | aprobado |
| `docs/use-cases/publicar-horarios.md` | `publicar-horarios` | aprobado |
| `docs/use-cases/consultar-citas.md` | `consultar-citas` | aprobado |
| `docs/use-cases/consultar-cita-codigo.md` | `consultar-cita-codigo` | aprobado |
| `docs/use-cases/cancelar-cita.md` | `cancelar-cita` | aprobado |
| `docs/use-cases/cambiar-cita.md` | `cambiar-cita` | aprobado |
| `docs/proceso.md` | — | registro de decisiones y comprobaciones |

### Referencias externas

- Consigna «Proyecto · Fase 1: definición funcional y casos de uso» (React Guide VI).
- Agent Harness Kit 3.0.0 (`@cardor/agent-harness-kit`) y su skill `ahk-use-case`.

### Comprobaciones

| Comprobación | Quién la ejecutó | Resultado | Límite |
|---|---|---|---|
| `ahk --version` | Agente (al inicio) y autor | `3.0.0` | Confirma la versión del CLI. |
| Plantilla abierta en el navegador (`pnpm dev`) | Autor | Se mostró la plantilla de Vite + React («Get started», «Count is 0») | Confirma el arranque inicial de React; no prueba funcionalidades. |
| `ahk doctor` | Agente (vía MCP, al inicio) y autor (terminal) | Agentes y skills completos; aviso de versión 3.3.0 disponible, que no se instaló porque la consigna exige 3.0.0 | Diagnóstico del entorno; no prueba las decisiones del producto. |
| Acceso real a `specs.*` | Agente | `specs.list` respondió: lista vacía al inicio; al cierre, seis casos aprobados y sin diagnósticos | Prueba la conexión con el flujo documental, no las decisiones. |
| Validación de los casos con AHK (`specs.validate`) | Agente, después de cada escritura | `{"valid":true,"errors":[]}` | Comprueba formato y relaciones según la herramienta, no la conveniencia de las decisiones. |
| `ahk health` (configurado con `pnpm build` en `health.bat`) | Autor | **Falló.** Validó agentes, base de datos y `.mcp.json`, pero al invocar el script mostró: `"\"C:\Users\wiloo\Downloads\proyecto-bootcamp\health.bat\"" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.` | A través de AHK no se ejecutó el build. Hipótesis sin confirmar: AHK 3.0.0 escapa mal la ruta del `.bat` en Windows. Pendiente de consultar al docente; no se cambió la versión ni la configuración. |
| `.\health.bat` ejecutado directamente (diagnóstico) | Autor | El build terminó bien («✓ built in 133ms») | Demuestra que el build de la plantilla funciona; **no** reemplaza a `ahk health`, que sigue registrado como fallido. |
| Lectura final del documento | Autor | Realizada: el autor confirmó «sí, lo leí completo» (27 de octubre de 2026) | Comprueba títulos, referencias y coherencia respecto de las decisiones; no valida el producto con usuarios. |
