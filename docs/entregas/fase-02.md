# Consultorio Médico Privado — Procesos y reglas del negocio

## 1. Identificación del proyecto

| Campo | Dato |
|---|---|
| Producto | Consultorio Médico Privado |
| Autor | Wilson Ortiz (trabajo individual) |
| Cohorte | CB PFSD4 · VI Cohorte Frontend React |
| Entrega | **Fase 2 · Procesos y reglas del negocio** |
| Fecha | 10 de noviembre de 2026 |
| Versión del documento | 2.0 — preparada con IA a partir de las fuentes aprobadas y revisada por el autor («Esta perfecto», 10 de noviembre de 2026) |
| Retroalimentación docente de la fase 1 | no recibida al 9 de noviembre de 2026 |

Este documento es acumulativo: retoma la definición funcional de la fase 1 (versión 1.0, que se conserva sin cambios como versión histórica) y la actualiza con los procesos, las reglas del negocio y los criterios de aceptación aprobados en la fase 2. Cuando la fase 2 precisó algo de la fase 1, aquí figura la versión actual y el cambio se explica en la sección 20.

## 2. Problema y contexto

**Situación que se busca mejorar (idea del autor).** Pedir una cita en un consultorio médico privado debería ser sencillo, «para que no tengan muchas complicaciones». Según el autor, quienes más lo necesitan son niños y adultos mayores, a quienes les cuesta guiarse en una página web; por eso suele ser un familiar quien gestiona sus citas. El autor quiere que sacar una cita sea sencillo y que la confirmación llegue en el momento, por correo o al celular.

**Cómo se resuelve hoy y qué dificultad persiste (supuestos sin validar).** Estos supuestos fueron propuestos con ayuda de la IA y aceptados por el autor; no se apoyan en entrevistas, estadísticas ni estudios:

- **S1.** Hoy las citas se piden sobre todo por teléfono o yendo en persona a recepción.
- **S2.** Así, el familiar no ve qué horarios hay libres: tiene que preguntar y depende de que la secretaria pueda atender en ese momento.
- **S3.** La cita suele quedar acordada de palabra o anotada en un papel, sin un mensaje para revisarla después; para cancelar o cambiar hay que volver a llamar.

**Dificultad que persiste (derivada de los supuestos):** pedir, cancelar o cambiar una cita depende de comunicarse con el consultorio en su horario, y el familiar no tiene un registro propio de la cita.

**Observaciones y supuestos.** La situación, el público y el resultado deseado provienen de la idea del autor. La forma actual de pedir citas y sus dificultades son supuestos que no se validaron con un consultorio ni con usuarios (ver sección 8).

**Cambios en esta fase.** Ninguno: el autor decidió mantener todo lo aprobado en la fase 1 (D32).

## 3. Usuarios y objetivos

| Actor | Tipo | Resultado que busca | Qué aporta o cómo entra (precisado en la fase 2) | Casos de uso |
|---|---|---|---|---|
| Familiar responsable (por ejemplo, padre, madre o hijo adulto) | Persona; usa la página sin cuenta | Reservar la cita de un paciente en la especialidad, día y horario que elija; después consultarla, cancelarla o cambiarla con su código | Su nombre y apellido (obligatorio, D50), un teléfono celular (siempre obligatorio, D45), el canal de mensajes (correo electrónico o WhatsApp) y su correo solo si elige correo (D45, D49). Si elige WhatsApp, los mensajes llegan a ese mismo celular. | `reservar-cita`, `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` |
| Secretaria del consultorio | Persona; usa la página con usuario y contraseña | Publicar los turnos de los médicos y consultar las citas reservadas para atender en recepción o avisar a los familiares | Entra con su usuario y contraseña, que ya existen (D18). Si se equivoca, el producto no dice cuál de los dos datos falla; después de 5 intentos fallidos seguidos debe esperar 15 minutos para volver a intentar (D56, D57). | `publicar-horarios`, `consultar-citas` |
| Servicio de mensajes | Sistema externo | Entregar al familiar, por correo electrónico o WhatsApp, la confirmación con el código y los avisos de cancelación o cambio | Envía solo al familiar, por el canal que eligió al reservar; el aviso de cambio incluye el nuevo día, hora y médico (D37). Si un mensaje no se puede enviar, la operación se mantiene y el producto lo avisa en pantalla (D39). | `reservar-cita`, `cancelar-cita`, `cambiar-cita` |

**Personas que aparecen en los datos pero no usan la página (no son actores):**

- **Paciente:** recibe la atención médica; no usa la página ni recibe mensajes. Se registran su nombre y apellido y si es menor de edad (sí o no; menor de edad significa menos de 18 años), ambos obligatorios (D43). El producto no comprueba la edad: se basa en lo que indica el familiar. Al llegar, se identifica diciendo su nombre en recepción (D14).
- **Acompañante:** persona que irá con el paciente; solo se registra su nombre y apellido (D44). Es obligatorio si el paciente es menor de edad y opcional si es mayor; si se agrega, su nombre y apellido son obligatorios. No recibe mensajes.
- **Médicos:** cada uno con su especialidad; ya vienen cargados en el producto y no usan la página. El familiar ve el nombre del médico junto a cada horario libre (D36).

En esta fase no se agregó ni se quitó ningún actor; solo se precisaron los datos que aporta cada persona y cómo entra la secretaria.

## 4. Descripción general de la solución

Consultorio Médico Privado es una página para pedir citas médicas sin llamar ni ir en persona. La secretaria publica, un día por vez, los turnos libres de cada médico. Un familiar elige la especialidad, un día con cupo y un horario libre —cada horario muestra el médico que atiende—, y la cita queda confirmada en el momento, sin que nadie tenga que aprobarla. Al confirmar, el familiar ve en pantalla un código de reserva y también lo recibe por correo electrónico o WhatsApp. Con ese código puede consultar la cita y, hasta su hora de inicio, cancelarla o cambiarla. No hace falta crear una cuenta. La secretaria ve las citas del día con el nombre y el teléfono del familiar, para atender en recepción o llamar si un médico falta.

**Recorrido de principio a fin (ejemplo):**

1. La secretaria entra con su usuario y contraseña y publica los turnos del Médico 1, de Medicina general, para el martes, de 8:00 a 12:00, de 30 minutos cada uno. El producto le muestra los turnos publicados y un resumen: 8 turnos publicados y 0 minutos sobrantes.
2. Marcos, hijo adulto, entra a «Reservar cita» sin crear cuenta. Elige Medicina general y el martes; ve solo los horarios libres, cada uno con su médico, y elige las 10:00 con el Médico 1. Ingresa el nombre y apellido de su papá de 70 años e indica que no es menor de edad (no agrega acompañante, porque es opcional). Deja su propio nombre y apellido, su teléfono celular y elige recibir los mensajes por WhatsApp.
3. Al confirmar, el producto comprueba los datos, que el turno siga libre y que su hora de inicio no haya llegado. La cita queda confirmada al instante y la pantalla muestra la especialidad, el médico, el día, la hora, el paciente y el código de reserva. A Marcos le llega por WhatsApp la confirmación con el código y los datos de la cita, incluido el médico. Si el mensaje no se pudiera enviar, la cita seguiría confirmada y el producto le avisaría que anote el código que ve en pantalla.
4. Más tarde, Marcos ingresa el código en «Mi cita» y ve la especialidad, el médico, el día, la hora y el paciente. Si surge un percance, puede cancelarla o cambiarla a otro día, hora y médico de Medicina general, siempre que confirme antes de la hora de inicio de la cita. En ambos casos recibe un aviso por WhatsApp; al cambiar, conserva el mismo código.
5. El día de la cita, el papá llega al consultorio y dice su nombre en recepción. La secretaria busca su cita en la lista del día escribiendo parte del nombre, sin importar mayúsculas ni tildes, y ve la hora, el médico, el paciente y el nombre y teléfono de Marcos. La lista no muestra el código.

## 5. Alcance inicial y exclusiones

**Capacidades comprometidas para la primera versión** (todas con caso de uso aprobado; son las mismas de la fase 1, y entre paréntesis se indican las precisiones de la fase 2):

| Capacidad | Actor | Caso de uso |
|---|---|---|
| Reservar una cita por especialidad, día y horario, con confirmación inmediata y código (el horario muestra su médico; el código se ve en pantalla y llega por mensaje) | Familiar | `reservar-cita` |
| Publicar por bloques los turnos de un médico y quitar turnos libres (un día por vez, con duraciones de una lista fija) | Secretaria | `publicar-horarios` |
| Consultar las citas reservadas por día, médico o nombre del paciente (búsqueda por parte del nombre) | Secretaria | `consultar-citas` |
| Consultar una cita con su código | Familiar | `consultar-cita-codigo` |
| Cancelar una cita (hasta la hora de inicio) | Familiar | `cancelar-cita` |
| Cambiar el día y la hora de una cita (dentro de la misma especialidad, con cualquiera de sus médicos, hasta la hora de inicio) | Familiar | `cambiar-cita` |

**Exclusiones de esta versión:**

| Queda fuera | Justificación | Decisión | Fase |
|---|---|---|---|
| Crear o administrar cuentas del personal, lo que incluye desbloquear, recuperar o cambiar la contraseña | Se supone que la cuenta de la secretaria ya existe; así se protege la agenda sin sumar un caso de administración de usuarios. Por eso, ante intentos fallidos hay una espera de 15 minutos y no un bloqueo permanente, que no tendría salida (D56). | D18 | 1 (precisada en la 2) |
| Agregar, editar o quitar médicos y especialidades | En un consultorio privado los médicos cambian poco; administrarlos sería otro caso completo que no aporta al objetivo central. | D20 | 1 |
| Cancelación de citas por parte del consultorio (por ejemplo, si un médico falta) | La secretaria llama al familiar por fuera de la página con el nombre y el teléfono que ve en su lista; se evita un recorrido nuevo de cancelación y aviso automático. | D21 | 1 |
| Cambiar de especialidad al cambiar una cita | Implica otro médico y otra agenda; se resuelve cancelando y reservando de nuevo (justificación del autor en la fase 1). | D28 | 1 |
| Modificar los datos del paciente o del acompañante después de reservar | Mantiene el cambio de cita limitado al turno: día, hora y, desde la fase 2, médico de la misma especialidad (D37). | D28 | 1 |
| Recuperar o reenviar un código de reserva perdido | El código se muestra en pantalla y se envía por mensaje; perderlo exigiría perder las dos cosas a la vez. El autor prefirió no ampliar el alcance con un caso de uso nuevo. | D40 | 2 |
| Verificar el contacto con un código antes de reservar (solo se revisa el formato) | Ampliaba el alcance y chocaba con la regla de mensajes no enviados (D39); el formato cubre los errores más comunes y el código en pantalla cubre el resto. | D46 | 2 |
| Teléfonos fijos o de otros países (solo celulares de Ecuador: 10 dígitos que empiezan con 09) | Consecuencia de la regla de formato elegida por el autor; un número bien escrito pero equivocado no se detecta. | D46 | 2 |
| Limitar cuántas citas tiene un paciente (o detectar dos citas a la misma hora para el mismo paciente) | Del paciente solo se pide nombre y apellido; con eso el producto no puede reconocer de verdad al mismo paciente y una regla así fallaría en los dos sentidos. | D48 | 2 |
| Publicar varios días de una vez | Cada publicación es simple y su resultado se entiende fácil; repetir la publicación para varios días es un costo que el autor acepta. | D54 | 2 |
| Duraciones fuera de la lista (15, 20, 30, 45 y 60 minutos) y turnos de distinta duración en un mismo bloque | Todos los turnos duran lo mismo; elegir de una lista es rápido, sin errores de tipeo y con pocos casos límite. | D52, D53 | 2 |

Las especificaciones recuerdan además dos límites que ya venían de la fase 1 como reglas: el familiar no tiene cuenta ni inicio de sesión, y no existe una lista de «todas mis citas» (D5, D25).

**Mejoras futuras.** En esta fase no se definieron mejoras futuras concretas. Las exclusiones anteriores podrían evaluarse en versiones posteriores, sin compromiso.

## 6. Secciones o pantallas previstas

No se incluyen maquetas, estilos ni direcciones definitivas. Se mantienen las seis secciones de la fase 1 (D31); ninguna se agregó ni se quitó.

| Sección | Propósito | Quién la usa | Qué muestra | Qué permite | Casos de uso |
|---|---|---|---|---|---|
| Inicio | Punto de entrada del familiar | Familiar | Las dos opciones principales | Ir a reservar o a consultar una cita con su código | `reservar-cita`, `consultar-cita-codigo` |
| Reservar cita | Hacer una reserva completa | Familiar | Especialidades con turnos que se pueden reservar; días (los completos no se pueden elegir); horarios libres, cada uno con su médico; datos exactos que se piden: nombre y apellido del paciente y si es menor de edad, nombre y apellido del acompañante, nombre y apellido del familiar, su teléfono celular, el canal y su correo si elige correo | Completar la reserva y ver la confirmación con especialidad, médico, día, hora, paciente y código de reserva; ver qué dato corregir, si el horario se ocupó o si el mensaje no se pudo enviar | `reservar-cita` |
| Mi cita | Gestionar una cita existente | Familiar | Campo del código y datos de la cita: especialidad, médico, día, hora, paciente y acompañante (si lo hay); indica si la cita está pasada o cancelada | Consultar; cancelar o cambiar hasta la hora de inicio. Para cambiar reutiliza la vista de días y horarios con su médico, y puede elegir otro médico de la misma especialidad | `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` |
| Ingreso del personal | Proteger las secciones de la secretaria | Secretaria | Usuario y contraseña; el mensaje «usuario o contraseña incorrectos», sin decir cuál falla; el aviso de espera de 15 minutos después de 5 intentos fallidos seguidos | Entrar a Horarios y Citas | `publicar-horarios`, `consultar-citas` |
| Horarios | Ofrecer turnos para reservar | Secretaria | Médicos con su especialidad y turnos publicados; para publicar: un día, hora de inicio, hora de fin y duración elegida de la lista (15, 20, 30, 45 o 60 minutos); resumen de cada publicación (turnos publicados, minutos sobrantes y turnos no publicados por haber empezado o por superponerse) | Publicar un bloque de un día y quitar turnos libres | `publicar-horarios` |
| Citas | Atender en recepción y avisar a familiares | Secretaria | Citas confirmadas del día (hoy por defecto), ordenadas por hora: hora, médico y especialidad, nombre y apellido del paciente, si es menor de edad, acompañante (si lo hay) y nombre y teléfono del familiar; no muestra el código, el correo ni el canal | Cambiar de día, filtrar por médico y buscar por parte del nombre del paciente, sin importar mayúsculas ni tildes; es solo de consulta | `consultar-citas` |

## 7. Casos de uso de la versión inicial

| Identificador AHK | Nombre | Actor principal | Objetivo | Archivo fuente | Estado | Aprobación |
|---|---|---|---|---|---|---|
| `reservar-cita` | Reservar una cita médica por especialidad | Familiar responsable | Reservar la cita del paciente en la especialidad, el día y el horario elegidos, y recibir un código | `docs/use-cases/reservar-cita.md` | aprobado | Aprobado en la fase 1; revisado y aprobado de nuevo en la fase 2 (D49) |
| `publicar-horarios` | Publicar horarios disponibles de un médico | Secretaria del consultorio | Publicar los turnos de un médico para que los familiares puedan reservarlos | `docs/use-cases/publicar-horarios.md` | aprobado | Aprobado en la fase 1; sin cambios (D32, D42) |
| `consultar-citas` | Consultar citas reservadas | Secretaria del consultorio | Ver las citas reservadas, encontrar la de un paciente en recepción y tener el contacto del familiar | `docs/use-cases/consultar-citas.md` | aprobado | Aprobado en la fase 1; sin cambios (D32, D42) |
| `consultar-cita-codigo` | Consultar una cita con su código | Familiar responsable que reservó la cita | Revisar los datos de una cita y poder cancelarla o cambiarla | `docs/use-cases/consultar-cita-codigo.md` | aprobado | Aprobado en la fase 1; sin cambios (D32, D42) |
| `cancelar-cita` | Cancelar una cita | Familiar responsable que reservó la cita | Cancelar una cita a la que el paciente no podrá ir, para que el turno quede libre | `docs/use-cases/cancelar-cita.md` | aprobado | Aprobado en la fase 1; sin cambios (D32, D42) |
| `cambiar-cita` | Cambiar una cita | Familiar responsable que reservó la cita | Pasar la cita a otro día u hora sin perderla | `docs/use-cases/cambiar-cita.md` | aprobado | Aprobado en la fase 1; sin cambios (D32, D42) |

Las fichas siguientes condensan el contenido actual de los casos en AHK sin omitir pasos, alternativas, reglas ni criterios de aceptación. Las referencias entre paréntesis (D1, D2…) remiten a las decisiones de la sección 8. La marca «→ RN-xx» indica la regla consolidada de la sección 12 que hoy precisa esa regla del caso. Según D42, los casos no se modificaron (salvo la condición previa de `reservar-cita`, D49); por eso conservan sus preguntas abiertas, que aquí se marcan como «resuelta en Dxx / RN-xx».

### 7.1 Reservar una cita médica por especialidad

**Identificador y nombre:** `reservar-cita` — Reservar una cita médica por especialidad (archivo `docs/use-cases/reservar-cita.md`, aprobado; revisado y aprobado de nuevo en la fase 2, D49).

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
  - El familiar dispone de un teléfono celular y, si elige recibir los mensajes por correo electrónico, también de un correo. Si elige WhatsApp, los mensajes llegan a ese mismo celular. (D6, D16, D45, D49) — *condición revisada en la fase 2.*

**Pasos del recorrido principal:**

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

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- A1. Sin horarios en la especialidad: el producto informa que no hay horarios libres y permite elegir otra especialidad. (D17)
- A2. Horario tomado mientras se reservaba: al confirmar, el sistema detecta que el horario ya fue reservado por otra persona, lo informa, no registra la cita y muestra los horarios libres restantes. (D8, D17)
- A3. Datos incompletos o contacto inválido: el producto indica qué dato corregir y no registra la cita. (D17)
- A4. Paciente menor de edad sin acompañante: el producto indica que faltan los datos del acompañante y no registra la cita. (D15)
- A5. El mensaje no se puede entregar: comportamiento pendiente de decisión — **resuelta en D39 / RN-09** (la cita queda confirmada y el producto avisa en pantalla; ver A5 de PR-03).

_Reglas_

- R1. La cita queda confirmada al terminar la reserva; la secretaria no la aprueba ni la asigna. (D3, D8) → RN-11
- R2. No se requiere cuenta; cada cita tiene su propio código de reserva. (D5) → RN-12
- R3. El código se envía solo al familiar que reserva, por correo electrónico o por WhatsApp, según su elección. (D6, D13, D16) → RN-08, RN-13
- R4. El familiar elige primero la especialidad, después el día y por último el horario. (D7, D9) → RN-04
- R5. Un horario solo puede tener una cita. (D17) → RN-01
- R6. Los datos del acompañante son opcionales si el paciente es mayor de edad y obligatorios si es menor. (D10, D15) → RN-14
- R7. Al llegar al consultorio, el paciente se identifica diciendo su nombre en recepción; no necesita presentar el código. (D14) → RN-17

**Resultado observable:** la cita queda confirmada, el horario deja de estar disponible para otras reservas y el familiar recibe, por correo electrónico o por WhatsApp, un mensaje con el código de reserva.

**Criterios de aceptación del caso:**

- CA1. Al confirmar, el producto muestra que la cita quedó confirmada sin que intervenga la secretaria.
- CA2. En el momento de confirmar, se envía al familiar, por el canal que eligió, un mensaje que contiene el código de reserva.
- CA3. La reserva se completa sin crear una cuenta ni iniciar sesión.
- CA4. Solo se pueden elegir días con horarios libres y, dentro de un día, solo se muestran los horarios libres de la especialidad seleccionada.
- CA5. Un horario reservado deja de aparecer como disponible para otra reserva.
- CA6. Si el paciente es menor de edad y faltan los datos del acompañante, la cita no se registra y se indica qué falta.
- CA7. Si faltan datos obligatorios o el contacto no es válido, la cita no se registra y se indica qué corregir.
- CA8. La cita reservada aparece en la lista de citas de la secretaria y se puede encontrar por el nombre del paciente (caso `consultar-citas`).

**Revisión de la fase 2 (D49):** se corrigió solo la condición previa de contacto para que coincida con D45 (teléfono celular siempre obligatorio; correo solo si se elige ese canal). El resto del caso no cambió.

**Preguntas abiertas del caso:**

- ¿Qué datos exactos del paciente, del acompañante y del familiar se piden? — **resuelta en D43–D46 (y D50) / RN-14, RN-15**.
- ¿El familiar ve el nombre del médico al elegir el horario, o solo la especialidad? — **resuelta en D36 / RN-04**.
- ¿El código de reserva también se muestra en pantalla al confirmar? — **resuelta en D38 / RN-13**.
- ¿Qué ocurre si el mensaje no llega o si el familiar pierde el código? (A5) — **resuelta en D39 / RN-09** (mensaje no enviado) y **en D40** (código perdido: exclusión).

**Supuesto por validar:** solo quien reservó conoce el código (RN-07).

**Correspondencia con la fase 2:** proceso PR-03 de la especificación `reserva-cita`, que agrega las alternativas A6 (la hora de inicio llega antes de confirmar) y A7 (el familiar sale antes de confirmar) y los criterios CA-03.1 a CA-03.15.

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

- R1. Solo la secretaria, con su usuario y contraseña, puede publicar o quitar turnos. (D18) → RN-18, RN-19
- R2. Los turnos se publican por bloques: médico, día, rango de horas y duración de cada cita. (D19) → RN-20, RN-21, RN-22
- R3. Cada turno admite una sola cita (regla R5 de `reservar-cita`). (D17) → RN-01
- R4. Solo se pueden quitar turnos libres; los turnos con cita no se pueden quitar en esta versión. (D21) → RN-25

_Exclusiones de esta versión_

- Crear o administrar cuentas del personal; se supone que la cuenta de la secretaria ya existe. (D18)
- Agregar, editar o quitar médicos y especialidades; la lista ya viene cargada. (D20)
- Cancelar citas por parte del consultorio, por ejemplo si un médico falta; la secretaria avisa al familiar por fuera del producto. (D21)

**Resultado observable:** los turnos del médico quedan publicados y los familiares los ven como libres al reservar en esa especialidad.

**Criterios de aceptación del caso:**

- CA1. Al publicar, el rango se divide en turnos de la duración indicada (por ejemplo, de 8:00 a 12:00 con turnos de 30 minutos se obtienen ocho turnos).
- CA2. Los turnos publicados aparecen como libres para los familiares en la especialidad del médico.
- CA3. Sin haber entrado con usuario y contraseña no se pueden publicar ni quitar turnos.
- CA4. Un turno libre que la secretaria quita deja de aparecer para los familiares.
- CA5. Un turno que ya tiene cita no se puede quitar.
- CA6. No se publican turnos superpuestos para un mismo médico. (D22)

**Preguntas abiertas del caso:**

- ¿Se pueden publicar varios días de una vez (por ejemplo, todos los martes de un mes)? — **resuelta en D54 / RN-20** (un día por vez; publicar varios días queda excluido).
- ¿Qué pasa si el rango de horas no se divide exacto por la duración de la cita? — **resuelta en D52, D53 / RN-21, RN-22** (solo turnos completos; se informan los minutos sobrantes).

**Correspondencia con la fase 2:** proceso PR-01 de la especificación `agenda-consultorio`, con la condición previa común «Ingreso de la secretaria». La especificación precisa B1 (publicación parcial, D59) y B2, y agrega B5 a B8 y los criterios CA-01.1 a CA-01.16.

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
4. El producto muestra las citas que coinciden. De cada una muestra: hora, médico y especialidad, nombre del paciente, si es menor de edad, acompañante (si lo hay) y contacto del familiar. (D23)
5. La secretaria identifica la cita que buscaba.

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- C1. Día sin citas: el producto indica que no hay citas para ese día. (D24)
- C2. Búsqueda sin resultados: la búsqueda se hace sobre el día que se está viendo; si no hay coincidencias, el producto lo indica. (D24)
- C3. Nombres repetidos: si hay más de un paciente con ese nombre, el producto muestra todas las coincidencias con hora y médico para que la secretaria identifique la correcta. (D24)
- C4. Un médico no podrá atender: la secretaria filtra por ese médico y usa el contacto de cada familiar para avisarle por fuera del producto; en esta versión la cita no se cancela desde el producto. (D21)

_Reglas_

- R1. Solo la secretaria, con su usuario y contraseña, puede ver la lista de citas. (D18) → RN-18, RN-19
- R2. La lista no muestra el código de reserva. (D23) → RN-26
- R3. La lista es de consulta: la secretaria no crea, asigna ni cancela citas desde aquí. (D3, D21) → RN-28
- R4. Las citas canceladas por el familiar no aparecen en la lista. (D26) → RN-26

_Exclusiones de esta versión_

- Cancelar citas por parte del consultorio. (D21)

**Resultado observable:** la secretaria ve las citas del día elegido con los datos necesarios para atender al paciente en recepción o avisar al familiar.

**Criterios de aceptación del caso:**

- CA1. Al entrar, se muestran las citas de hoy ordenadas por hora.
- CA2. Al cambiar de día o filtrar por médico, solo se muestran las citas que coinciden.
- CA3. Al buscar un nombre, se muestran las citas de ese día cuyo paciente coincide; si hay varias, se muestran todas con hora y médico.
- CA4. Cada cita muestra hora, médico y especialidad, paciente, si es menor de edad, acompañante (si lo hay) y contacto del familiar.
- CA5. El código de reserva no aparece en la lista.
- CA6. Sin haber entrado con usuario y contraseña no se puede ver la lista.
- CA7. Una cita reservada por un familiar aparece en la lista del día correspondiente.
- CA8. Una cita cancelada por el familiar deja de aparecer en la lista. (D26)

**Preguntas abiertas del caso:** el caso no tiene preguntas abiertas. La fase 2 precisó qué significa «contacto del familiar» (nombre y teléfono, D51, RN-26) y cómo coincide la búsqueda por nombre (parte del nombre, sin importar mayúsculas ni tildes, D58, RN-27).

**Correspondencia con la fase 2:** proceso PR-02 de la especificación `agenda-consultorio`, con la condición previa común «Ingreso de la secretaria», y criterios CA-02.1 a CA-02.9.

### 7.4 Consultar una cita con su código

**Identificador y nombre:** `consultar-cita-codigo` — Consultar una cita con su código (archivo `docs/use-cases/consultar-cita-codigo.md`, aprobado).

**Actor principal y objetivo:**

- Actor principal: familiar responsable que reservó la cita. (D1, D11)
- Objetivo: revisar los datos de una cita reservada para no olvidarla ni perderla, y poder cancelarla o cambiarla.

**Situación que lo inicia y condiciones previas:**

- Disparador: el familiar quiere recordar o revisar una cita que reservó.
- Condiciones previas:
  - El familiar tiene el código de reserva que recibió por correo electrónico o WhatsApp al reservar. (D5, D13, D16) — desde la fase 2, el código también se muestra en pantalla al reservar (D38, RN-13).
  - No necesita cuenta ni inicio de sesión. (D5)

**Pasos del recorrido principal:**

1. El familiar entra a la sección para consultar una cita.
2. El producto le pide el código de reserva.
3. El familiar ingresa el código.
4. El producto muestra los datos de esa cita: especialidad, día, hora, nombre del paciente y acompañante (si lo hay). (D25) — PR-04 agrega el médico (D36).
5. Si la hora de la cita todavía no pasó, el producto ofrece cancelarla o cambiarla (casos `cancelar-cita` y `cambiar-cita`). (D25) — «todavía no pasó» se precisa como «su hora de inicio todavía no llegó» (RN-02).

**Alternativas, errores y restricciones relevantes:**

_Alternativas y errores_

- E1. Código incorrecto o inexistente: el producto indica que no encuentra una cita con ese código y permite intentarlo de nuevo. (D27)
- E2. Cita ya pasada: el producto la muestra como pasada y no ofrece cancelarla ni cambiarla. (D27)
- E3. Cita cancelada: si el código corresponde a una cita cancelada, el producto indica que esa cita fue cancelada. (D26)

_Reglas_

- R1. Cada código da acceso a una sola cita; no existe una lista de «todas mis citas». (D5, D25) → RN-07
- R2. No se requiere cuenta ni inicio de sesión. (D5) → RN-07, RN-12
- R3. Solo se ofrece cancelar o cambiar antes de la hora de la cita. (D26, D27) → RN-02

**Resultado observable:** el familiar ve los datos de su cita y, si todavía no pasó, puede elegir cancelarla o cambiarla.

**Criterios de aceptación del caso:**

- CA1. Con un código válido se muestran la especialidad, el día, la hora, el paciente y el acompañante (si lo hay) de esa cita.
- CA2. Con un código incorrecto se indica que no se encontró la cita y se puede reintentar.
- CA3. Una cita cuya hora ya pasó se muestra como pasada y sin opciones de cancelar o cambiar.
- CA4. El código de una cita cancelada indica que fue cancelada.
- CA5. No se pide cuenta ni inicio de sesión.

**Preguntas abiertas del caso:**

- ¿Se muestra el nombre del médico o solo la especialidad? — **resuelta en D36 / RN-04** (y paso 4 de PR-04).
- ¿Qué ocurre si el familiar pierde el código? — **resuelta en D40** (exclusión: no hay recuperación ni reenvío en esta versión).

**Supuesto por validar:** solo quien reservó conoce el código (RN-07).

**Correspondencia con la fase 2:** proceso PR-04 de la especificación `gestion-cita-codigo` y criterios CA-04.1 a CA-04.4.

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
  - La hora de la cita todavía no pasó. (D26) — precisado como «su hora de inicio todavía no llegó» (RN-02).

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

- R1. Solo se puede cancelar antes de la hora de la cita; un posible límite de anticipación se definirá en la fase 2. (D26) — **resuelta en D34, D41 / RN-02** (sin anticipación mínima; cuenta la hora en que el familiar confirma).
- R2. Al cancelar, el turno vuelve a quedar libre. (D26) → RN-01
- R3. El código de una cita cancelada deja de servir para cancelar o cambiar; al ingresarlo, se informa que la cita fue cancelada. (D26) → resultado de PR-05 y E3 de PR-04
- R4. La cita cancelada desaparece de la lista de la secretaria. (D26) → RN-26
- R5. El aviso de cancelación llega solo al familiar, por el canal que eligió al reservar. (D13, D16, D26) → RN-08

**Resultado observable:** la cita queda cancelada, el turno vuelve a estar disponible y el familiar recibe un aviso de cancelación.

**Criterios de aceptación del caso:**

- CA1. Antes de cancelar, el producto pide confirmación.
- CA2. Tras confirmar, el turno vuelve a aparecer como libre para otras reservas.
- CA3. El familiar recibe un aviso de cancelación por el canal que eligió al reservar.
- CA4. Al volver a ingresar el código, el producto indica que la cita fue cancelada.
- CA5. La cita cancelada ya no aparece en la lista de la secretaria.
- CA6. Si el familiar no confirma, la cita sigue sin cambios.

**Preguntas abiertas del caso:**

- ¿Cuánta anticipación mínima se exige para cancelar? (fase 2) — **resuelta en D34, D41 / RN-02**.
- ¿Qué ocurre si el aviso de cancelación no se puede entregar? — **resuelta en D39 / RN-09** (CN3 de PR-05).

**Correspondencia con la fase 2:** proceso PR-05 de la especificación `gestion-cita-codigo`, que agrega CN3 (aviso no enviado) y CN4 (la hora de inicio llega antes de confirmar), y criterios CA-05.1 a CA-05.4.

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
  - La hora de la cita todavía no pasó. (D28) — precisado como «su hora de inicio todavía no llegó» (RN-02).

**Pasos del recorrido principal:**

1. Desde la cita consultada, el familiar elige cambiarla.
2. El producto muestra los días de la misma especialidad. Los días sin horarios libres aparecen como completos y no se pueden elegir. (D9, D28)
3. El familiar elige un día con horarios libres.
4. El producto muestra solo los horarios libres de ese día. (D9) — PR-06 agrega que cada horario muestra su médico y que puede ser de cualquier médico de la especialidad (D36, D37).
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

- R1. Solo se cambian el día y la hora, dentro de la misma especialidad; para cambiar de especialidad se cancela y se reserva de nuevo. (D28) → RN-05 (dentro de la misma especialidad también puede cambiar el médico, D37)
- R2. El horario anterior se libera solo cuando el nuevo queda confirmado; el familiar nunca se queda sin cita durante el cambio. (D28) → RN-06
- R3. Se mantiene el mismo código de reserva. (D28) → RN-06
- R4. Los datos del paciente y del acompañante no se modifican en esta versión. (D28) → RN-06
- R5. Solo se puede cambiar antes de la hora de la cita. (D28) → RN-02
- R6. En la lista de la secretaria, la cita aparece en su nuevo día y hora. (D28) → RN-26

_Exclusiones de esta versión_

- Cambiar de especialidad dentro de este caso. (D28)
- Modificar los datos del paciente o del acompañante. (D28)

**Resultado observable:** la cita queda en el nuevo día y hora, el horario anterior vuelve a estar libre y el familiar recibe un aviso del cambio, conservando su código.

**Criterios de aceptación del caso:**

- CA1. Solo se ofrecen días y horarios libres de la misma especialidad.
- CA2. Antes de cambiar, el producto pide confirmación.
- CA3. Tras confirmar, el nuevo horario deja de estar disponible y el anterior vuelve a aparecer como libre.
- CA4. Con el mismo código se ve la cita con su nuevo día y hora.
- CA5. El familiar recibe un aviso del cambio por el canal que eligió al reservar.
- CA6. En la lista de la secretaria, la cita aparece en su nuevo día y hora.
- CA7. Si el nuevo horario se ocupó, no hay otros horarios libres o el familiar no confirma, la cita original no cambia.

**Preguntas abiertas del caso:**

- ¿Hay un límite de cambios por cita o una anticipación mínima para cambiar? (fase 2) — **resuelta en D34, D35, D41 / RN-02, RN-03** (sin límite de cambios y sin anticipación mínima).
- ¿Qué ocurre si el aviso del cambio no se puede entregar? — **resuelta en D39 / RN-09** (F5 de PR-06).

**Correspondencia con la fase 2:** proceso PR-06 de la especificación `gestion-cita-codigo`, que agrega F5 (aviso no enviado) y F6 (la hora de inicio llega antes de confirmar), y criterios CA-06.1 a CA-06.8.

## 8. Decisiones y preguntas pendientes

Cada decisión tiene su detalle (pregunta, alternativas, elección y motivo) en el registro del proceso (sección 10). En la fase 1, «Autor» indica una elección del autor entre alternativas e «IA aceptada» una recomendación de la IA que el autor aceptó. En la fase 2, la IA presentó alternativas con sus consecuencias sin recomendar ninguna, y el autor eligió y escribió su motivo.

### 8.1 Decisiones confirmadas

**Fase 1 (D1 a D31)**

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

**Cambios de decisiones durante la fase 1:**

- El primer borrador de `reservar-cita` lo redactó la IA; el ejemplo del autor lo modificó (calendario por días, acompañante, menor de edad, WhatsApp).
- D11 se corrigió con D13: el código llega solo al familiar.
- D12 (retirar el código en el consultorio) se reemplazó por D14 (identificarse con el nombre en recepción).
- «Ver mis próximas citas» pasó a ser «Consultar una cita con su código» (D25), porque sin cuenta no se pueden agrupar las citas.

**Idea de diseño para una fase posterior (no forma parte del alcance funcional):** mostrar en rojo los días completos y en blanco los días disponibles.

**Fase 2 (D32 a D60)**

| Decisión | Qué se decidió | Documentos afectados | Origen |
|---|---|---|---|
| D32 | Se mantiene todo lo aprobado en la fase 1; los seis casos siguen aprobados sin revisión | Los seis casos de uso; secciones 2 a 7 de la fase 1 como base | Autor (respuesta abierta) |
| D33 | Tres especificaciones, por actor y momento: «Agenda del consultorio», «Reserva» y «Gestión de una cita con su código» | `agenda-consultorio`, `reserva-cita`, `gestion-cita-codigo` | Autor |
| D34 | Cancelar o cambiar hasta la hora de inicio, sin anticipación mínima | `gestion-cita-codigo` (RN-02) | Autor |
| D35 | Sin límite de cambios por cita | `gestion-cita-codigo` (RN-03) | Autor |
| D36 | El familiar ve el médico junto a cada horario libre y después en la confirmación, el mensaje y «Mi cita» | `reserva-cita` (PR-03, RN-13); `gestion-cita-codigo` (RN-04, PR-04) | Autor |
| D37 | Al cambiar, puede elegir cualquier médico de la misma especialidad; lo ve antes de confirmar y el aviso lo incluye | `gestion-cita-codigo` (RN-05, RN-08) | Autor |
| D38 | El código se muestra en pantalla al confirmar y también se envía por mensaje | `reserva-cita` (RN-13); condición previa de PR-04 | Autor |
| D39 | Si un mensaje no se puede enviar, la operación se mantiene y el producto avisa en pantalla | `reserva-cita` (A5); `gestion-cita-codigo` (RN-09, CN3, F5) | Autor |
| D40 | Sin recuperación del código perdido en esta versión (exclusión) | `gestion-cita-codigo` y `reserva-cita` (exclusiones) | Autor |
| D41 | En RN-02 cuenta la hora en que el familiar confirma | `gestion-cita-codigo` (RN-02, CN4, F6, CA-05.4, CA-06.8) | Autor (ejemplo propio, sin motivo aparte) |
| D42 | Los casos de uso no se modifican; la entrega marca sus preguntas abiertas como «resuelta en Dxx / RN-xx» | Las tres especificaciones; secciones 7 y 20 de esta entrega | Autor |
| D43 | Del paciente se piden nombre y apellido y si es menor de edad, ambos obligatorios | `reserva-cita` (RN-15, datos necesarios) | Autor (respuesta abierta) |
| D44 | Del acompañante se pide solo su nombre y apellido, obligatorio cuando hay acompañante | `reserva-cita` (RN-14, RN-15) | Autor (respuesta abierta) |
| D45 | Del familiar se piden su nombre, un teléfono siempre y el correo solo si elige correo | `reserva-cita` (RN-15, datos necesarios); originó D49 | Autor (opción B más el nombre del familiar) |
| D46 | Un contacto es inválido solo por su formato: celular de Ecuador de 10 dígitos que empieza con 09; correo usuario@dominio | `reserva-cita` (RN-15, exclusiones) | Autor |
| D47 | Se puede reservar hasta la hora de inicio; cuenta la hora en que se confirma | `reserva-cita` (RN-10) | Autor |
| D48 | Cada reserva es independiente; no se limita cuántas citas tiene un paciente | `reserva-cita` (RN-16, exclusiones) | Autor |
| D49 | Se mantiene D45 y se corrige la condición previa de contacto de `reservar-cita`, que se aprueba de nuevo | Caso `reservar-cita` | Autor; contradicción detectada por la IA |
| D50 | El nombre del familiar es obligatorio | `reserva-cita` (RN-15, datos necesarios) | Autor |
| D51 | La secretaria ve solo el nombre y el teléfono del familiar | `reserva-cita` (datos necesarios); `agenda-consultorio` (RN-26) | Autor |
| D52 | Si el rango no se divide exacto, se publican solo turnos completos y se informan turnos creados y minutos sobrantes | `agenda-consultorio` (RN-22, cálculos) | Autor |
| D53 | Duraciones de una lista fija: 15, 20, 30, 45 y 60 minutos | `agenda-consultorio` (RN-21) | Autor |
| D54 | Se publica un día por vez | `agenda-consultorio` (RN-20, exclusiones) | Autor |
| D55 | Al publicar para hoy, solo se publican los turnos que no empezaron y se informa cuántos no | `agenda-consultorio` (RN-23) | Autor; la IA corrigió su propio ejemplo |
| D56 | Después de 5 intentos fallidos seguidos, espera de 15 minutos | `agenda-consultorio` (RN-19) | Autor |
| D57 | Durante la espera no se acepta ningún intento; al terminar, o con un ingreso correcto, el conteo vuelve a cero | `agenda-consultorio` (RN-19) | Autor |
| D58 | Búsqueda por parte del nombre, sin importar mayúsculas ni tildes | `agenda-consultorio` (RN-27) | Autor |
| D59 | Un turno que empieza justo cuando termina otro no se superpone; B1 es una publicación parcial | `agenda-consultorio` (RN-24, CA-01.16) | Autor (ejemplo propio ante una pregunta de la IA) |
| D60 | Se corrigieron solo frases desactualizadas o ambiguas de las tres especificaciones aprobadas (resumen de RN-02 en `agenda-consultorio`, referencias a especificaciones «pendientes», contacto que ve la secretaria) y el autor las aprobó de nuevo; ninguna regla cambió | `gestion-cita-codigo`, `reserva-cita`, `agenda-consultorio` | Autor (elección entre dos alternativas de la IA) |

**Cambios y correcciones durante la fase 2:**

- D49 modificó un caso aprobado: la contradicción entre D45 y la condición previa de `reservar-cita` la detectó la IA al revisar `reserva-cita` (reconoció que debió señalarla al comparar las opciones de D45). El autor corrigió el caso y lo aprobó de nuevo.
- En D55, la IA corrigió su propio ejemplo: a las 10:00 el turno de las 10:00 ya empezó; se publican 3 turnos (10:30, 11:00 y 11:30) y no se publican 5.
- En D52, el ejemplo inicial de 50 minutos dejó de ser posible con D53 y se reemplazó por uno de 45 minutos.

### 8.2 Supuestos por validar

| Supuesto | Reglas o casos afectados | ¿Impide cerrar el alcance? |
|---|---|---|
| S1–S3: cómo se piden hoy las citas y sus dificultades (sección 2) | Todos, como justificación del problema | No, pero el problema no está validado con usuarios reales |
| Solo quien reservó conoce el código | RN-07; `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` | No |
| El familiar indica correctamente si el paciente es menor de edad; el producto no lo comprueba | RN-14; `reservar-cita` | No |
| La cuenta de la secretaria ya existe y solo ella conoce su contraseña | RN-18, RN-19; `publicar-horarios`, `consultar-citas` | No |
| Los médicos y especialidades cargados están al día | D20; `publicar-horarios`, `reservar-cita` | No |

### 8.3 Preguntas abiertas

**Producto: ninguna pregunta abierta.** Las tres especificaciones aprobadas declaran que no les quedan preguntas abiertas. Las preguntas que la fase 1 había dejado para esta fase quedaron resueltas así:

| Pregunta de la fase 1 | Se resolvió en |
|---|---|
| ¿Qué datos exactos del paciente, del acompañante y del familiar se piden? | D43–D46, D50, D51 / RN-14, RN-15, RN-26 |
| ¿El familiar ve el nombre del médico o solo la especialidad? | D36 / RN-04 |
| ¿El código también se muestra en pantalla al confirmar? | D38 / RN-13 |
| ¿Qué ocurre si un mensaje no llega o el familiar pierde el código? | D39 / RN-09; D40 (exclusión) |
| ¿Cuánta anticipación mínima se exige para cancelar o cambiar? ¿Hay un límite de cambios? | D34, D35, D41 / RN-02, RN-03 |
| ¿Se pueden publicar varios días de una vez? ¿Qué pasa si el rango no se divide exacto por la duración? | D54 / RN-20; D52, D53 / RN-21, RN-22 |

**Pendientes que siguen abiertos (no son del producto):**

| Pendiente | Afecta | ¿Impide cerrar la fase? |
|---|---|---|
| Entorno: `ahk health` falla en Windows al invocar el script de comprobación del build (sección 10) | Solo la comprobación del entorno; ninguna regla ni caso | No impide el cierre funcional; pendiente de consultar al docente |
| Retroalimentación docente de la fase 1: no recibida al 9 de noviembre de 2026 | Ninguna decisión tomada; no se presenta ninguna aprobación docente | No |

## 9. Decisiones propias y uso de IA

Herramienta. Usé Claude Code con AHK 3.0.0 y el MCP del proyecto. Para comprobar el entorno corrí ahk --version, ahk doctor y una llamada real al MCP (specs.list). ahk health falló porque AHK no logra ejecutar health.bat en Windows. El build sí funciona si ejecuto health.bat directamente. No lo resolví: sigue pendiente consultarlo con el docente.

Regla que precisé: búsqueda por nombre del paciente (RN-27, D58). Los nombres se escriben distinto («Jose» o «José») y en recepción hay que encontrar al paciente rápido. La búsqueda se hace sobre el día que se está viendo y coincide si el texto aparece en cualquier parte del nombre y apellido, sin importar mayúsculas ni tildes.

Alternativas que evalué (las que la IA me presentó):

A) nombre completo exacto;

B) parte del nombre, sin importar mayúsculas ni tildes;

C) parte del nombre, contando tildes.

Por qué elegí B. Recepción tiene que encontrar al paciente rápido sin saber cómo se escribió el nombre al reservar.

Ejemplo válido. Ese día hay citas de José Pérez y Josefina Ruiz. «jose perez» muestra solo a José Pérez y «jose» muestra a los dos, con hora y médico.

Ejemplo alternativo o inválido. José Pérez tiene cita el jueves y yo veo el miércoles. Busco «jose perez» y no aparece, porque la búsqueda es solo sobre el día que se ve. Estos dos ejemplos salen de la pregunta de la IA en D58 y de los criterios CA-02.4 y CA-02.5; no son inventados por mí.

Qué cambió desde la fase 1. En la fase 1, desde D13, aceptaba las recomendaciones de la IA con «sí». En esta fase la IA me presentó alternativas sin recomendar ninguna, y los motivos de D33 a D59 son míos. Hubo dos correcciones:

La contradicción entre D45 y el caso de uso reservar-cita, que la IA no señaló a tiempo. Corregí el caso y lo aprobé de nuevo (D49).

Un cálculo mal hecho de la IA en el ejemplo de las 10:00 de D55, que se corrigió.

Qué sigo sin validar. Que solo quien reservó conoce el código, que el familiar marca bien si el paciente es menor, y los supuestos S1 a S3 de la fase 1. Nada se probó con un consultorio real.

Alternativa real. La opción A (nombre completo exacto). La descarté porque «Jose» no encontraría a «José» y recepción tendría que escribir el nombre completo y con tildes.

## 10. Fuentes y comprobaciones de esta fase

### Archivos fuente

| Identificador AHK | Tipo | Archivo | Estado | Revisión aprobada |
|---|---|---|---|---|
| `reservar-cita` | Caso de uso | `docs/use-cases/reservar-cita.md` | aprobado | 2026-11-09T04:44:52.623Z — aprobada de nuevo por el autor en la fase 2 (D49); la transición de estado registró `lastUpdated` 2026-11-09T04:46:54.289Z sin cambiar el contenido |
| `publicar-horarios` | Caso de uso | `docs/use-cases/publicar-horarios.md` | aprobado | Aprobado por el autor en la fase 1 (2026-10-27, hora local); sin cambios en la fase 2 (`lastUpdated` 2026-10-28T01:44:51.322Z) |
| `consultar-citas` | Caso de uso | `docs/use-cases/consultar-citas.md` | aprobado | Aprobado en la fase 1 (2026-10-27, hora local); sin cambios (`lastUpdated` 2026-10-28T01:51:48.576Z) |
| `consultar-cita-codigo` | Caso de uso | `docs/use-cases/consultar-cita-codigo.md` | aprobado | Aprobado en la fase 1 (2026-10-27, hora local); sin cambios (`lastUpdated` 2026-10-28T01:51:49.769Z) |
| `cancelar-cita` | Caso de uso | `docs/use-cases/cancelar-cita.md` | aprobado | Aprobado en la fase 1 (2026-10-27, hora local); sin cambios (`lastUpdated` 2026-10-28T01:51:50.647Z) |
| `cambiar-cita` | Caso de uso | `docs/use-cases/cambiar-cita.md` | aprobado | Aprobado en la fase 1 (2026-10-27, hora local); sin cambios (`lastUpdated` 2026-10-28T01:53:15.692Z) |
| `gestion-cita-codigo` | Especificación funcional | `docs/specs/gestion-cita-codigo.md` | aprobada | 2026-11-09T05:51:58.351Z — aprobada de nuevo por el autor el 2026-11-09 tras corregir solo redacción (D60); antes: 2026-11-09T04:26:50.175Z |
| `reserva-cita` | Especificación funcional | `docs/specs/reserva-cita.md` | aprobada | 2026-11-09T05:58:17.596Z — aprobada de nuevo por el autor el 2026-11-09 tras corregir solo redacción (D60); antes: 2026-11-09T04:53:37.072Z |
| `agenda-consultorio` | Especificación funcional | `docs/specs/agenda-consultorio.md` | aprobada | 2026-11-09T05:59:50.082Z — aprobada de nuevo por el autor el 2026-11-09 tras corregir solo redacción (D60); antes: 2026-11-09T05:15:37.840Z |
| — | Registro del proceso | `docs/proceso.md` | — | Registro de decisiones D1–D60, comprobaciones, aprobaciones y textos del autor |
| — | Entrega anterior | `docs/entregas/fase-01.md` | Versión 1.0 | Se conserva sin cambios como versión histórica |

Las revisiones se expresan en hora UTC (sufijo «Z»), como las registra AHK; el registro del proceso anota la fecha local de cada aprobación.

### Referencias externas

| Fuente | Fecha de consulta |
|---|---|
| Consigna «Proyecto · Fase 2: procesos y reglas del negocio» (React Guide VI) | 2026-11-08 |
| Agent Harness Kit 3.0.0: skills `ahk-spec` y `ahk-use-case`, leídas localmente | 2026-11-08 |

No se usaron otras fuentes externas.

### Comprobaciones

| Comprobación | Quién la ejecutó | Resultado | Límite |
|---|---|---|---|
| `node --version` / `pnpm --version` / `ahk --version` | Agente, 2026-11-08 | v22.23.4 / 11.17.0 / 3.0.0 | Confirma versiones; no prueba el producto. |
| `ahk --version` (nueva comprobación) | Agente, 2026-11-09, antes de preparar este documento | 3.0.0 | Confirma solo la versión del CLI. |
| `ahk doctor` (CLI y MCP) | Agente, 2026-11-08 | Agentes y skills completos. Aviso: AHK 3.7.0 disponible; no se instaló porque la consigna exige 3.0.0. | Diagnóstico del entorno; no prueba las decisiones del producto. |
| Skill `ahk-spec` | Agente, 2026-11-08 | `SKILL.md`, `resources/workflow.md` y `resources/template.md` legibles | Solo confirma que la guía está disponible. |
| MCP `specs.list` (llamada real) | Agente, 2026-11-08 y 2026-11-09 | 2026-11-08: 6 casos de uso, todos `approved`, ninguna especificación, sin diagnósticos. 2026-11-09: 9 documentos, todos `approved` (6 casos y 3 especificaciones), sin diagnósticos. | Prueba la conexión y los estados; no las decisiones. |
| MCP `specs.get` | Agente, 2026-11-08 y 2026-11-09 | 2026-11-08: los seis casos se recuperaron mediante AHK. 2026-11-09: los nueve documentos se leyeron completos para preparar esta entrega. | Confirma que el contenido de esta entrega sale de lo guardado en AHK. |
| MCP `specs.validate` | Agente, después de cada escritura de la fase 2 y de nuevo el 2026-11-09 | Válido, sin errores (`valid: true`) | Valida formato y referencias según la herramienta; **no** prueba que una regla sea correcta ni conveniente. |
| Estados en AHK | Agente, con cada aprobación del autor | Cada especificación pasó de `draft` a `approved` solo después del texto de aprobación del autor; `reservar-cita` pasó de `approved` a `draft` para corregirse (D49) y volvió a `approved` tras su nueva aprobación. Ningún otro documento cambió de estado. Después, las tres especificaciones volvieron a `draft` para corregir solo redacción (D60) y el autor las aprobó de nuevo. | La transición solo cambia el estado, no el contenido. |
| `ahk health` | Agente, 2026-11-08 | **Falló**, igual que en la fase 1: `"\"%USERPROFILE%\Downloads\proyecto-bootcamp\health.bat\"" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.` Los 7 registros de health guardados desde el 2026-10-27 muestran el mismo error. | Hipótesis sin confirmar: AHK 3.0.0 escapa mal la ruta del `.bat` en Windows. No se cambió la versión ni la configuración. Pendiente de consultar al docente. |
| `.\health.bat` ejecutado directamente (diagnóstico, sin AHK) | Agente, 2026-11-08 | El build terminó bien («✓ 20 modules transformed… ✓ built in 147ms»), código de salida 0 | Demuestra que el build de la plantilla funciona; **no** reemplaza a `ahk health`, que sigue registrado como fallido. |
| Revisión propia del autor antes de cada aprobación | Autor, 2026-11-08 y 2026-11-09 | «Apruebo gestion-cita-codigo, revisión 2026-11-09T04:26:50.175Z»; «Apruebo reservar-cita, revisión 2026-11-09T04:44:52.623Z»; «Apruebo reserva-cita, revisión 2026-11-09T04:53:37.072Z»; «Apruebo agenda-consultorio, revisión 2026-11-09T05:15:37.840Z». Antes de cada aprobación, la IA le señaló los puntos que había redactado ella; el autor no pidió cambios. Tras D60: «Apruebo gestion-cita-codigo, revisión 2026-11-09T05:51:58.351Z»; «Apruebo reserva-cita, revisión 2026-11-09T05:58:17.596Z»; «Apruebo agenda-consultorio, revisión 2026-11-09T05:59:50.082Z». | Muestra que el autor aprobó una revisión concreta; no valida las reglas con un consultorio ni con usuarios. |
| Lectura final de este documento por el autor | Autor, 2026-11-10 | El autor respondió «esta bien» y «Esta perfecto» | Revisión del contenido; el PDF debe revisarse aparte (ver sección 8 de la consigna). |

**Alcance de estas comprobaciones.** Que AHK valide el formato no prueba que una regla sea correcta. Todavía no existe ninguna funcionalidad del producto que se pueda probar: los criterios de la sección 18 describen el comportamiento esperado y no se ejecutaron. Las comprobaciones de la fase 1 (27 de octubre de 2026) se conservan en su entrega y no se presentan aquí como actuales.

## 11. Procesos detallados

La numeración de los procesos es común a las tres especificaciones: PR-01 y PR-02 (con la condición previa «Ingreso de la secretaria») están en `agenda-consultorio`; PR-03 en `reserva-cita`; PR-04, PR-05 y PR-06 en `gestion-cita-codigo`. Cada caso de uso queda cubierto por un proceso.

### Condición previa común de PR-01 y PR-02 · Ingreso de la secretaria

No es un caso de uso separado (D18): es la condición previa de los dos procesos de la secretaria.

- **Especificación:** `agenda-consultorio`.
- **Casos relacionados:** `publicar-horarios`, `consultar-citas`.
- **Actor e inicio:** la secretaria quiere usar «Horarios» o «Citas».
- **Condiciones previas:** su cuenta ya existe (D18).
- **Datos de entrada:** usuario y contraseña.

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Secretaria | Ingresa su usuario y su contraseña. |
| 2 | Producto | Si son correctos y no está en una espera, la deja entrar a «Horarios» y «Citas» y el conteo de intentos vuelve a cero. (RN-18, RN-19) |
| 3 | Producto | Si no lo son, indica «usuario o contraseña incorrectos», sin decir cuál de los dos falla, y permite reintentar. Con el 5.º intento fallido seguido con ese usuario, indica que debe esperar 15 minutos. (RN-19) |

- **Decisiones del producto:** datos correctos fuera de una espera → entra; datos incorrectos → mensaje genérico y nuevo intento; 5.º intento fallido seguido → espera; durante la espera → no acepta ningún intento, ni siquiera el correcto.
- **Reglas aplicables:** RN-18, RN-19.
- **Resultado (éxito):** la secretaria queda «ingresada» y puede usar «Horarios» y «Citas».
- **Fallo:** queda «sin ingresar» (puede reintentar) o «en espera» durante 15 minutos; al terminar la espera tiene otros 5 intentos.

### PR-01 · Publicar horarios de un médico

- **Especificación:** `agenda-consultorio`.
- **Caso relacionado:** `publicar-horarios` (incluye quitar turnos libres).
- **Actor e inicio:** la secretaria conoce el día y las horas en que atenderá un médico y quiere ofrecerlos para reserva.
- **Condiciones previas:** la secretaria ingresó (RN-18); el médico y su especialidad ya están cargados (D20).
- **Datos de entrada:** médico, un día, hora de inicio, hora de fin y duración de cada turno elegida de la lista (RN-21).

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Secretaria | Entra a «Horarios». |
| 2 | Producto | Muestra la lista de médicos con su especialidad. |
| 3 | Secretaria | Elige un médico. |
| 4 | Secretaria | Indica un día, la hora de inicio y la hora de fin, y elige la duración de cada turno. (RN-20, RN-21) |
| 5 | Secretaria | Confirma la publicación. |
| 6 | Producto | Comprueba los datos (B2), divide el rango en turnos completos (RN-22), descarta los turnos que ya empezaron si el día es hoy (RN-23) y los que se superponen con turnos ya publicados de ese médico (RN-24), y publica los demás como libres. |
| 7 | Producto | Muestra los turnos publicados de ese médico y ese día, y un resumen: cuántos turnos se publicaron, cuántos minutos sobraron y cuántos no se publicaron por haber empezado o por superponerse. |
| 8 | Producto | Desde ese momento, los turnos publicados aparecen como libres para los familiares que reservan en la especialidad del médico, cada uno con el nombre del médico. (PR-03, RN-04, RN-10) |

**Quitar un turno publicado (B3, B4):** la secretaria elige un turno publicado; si está libre, el producto lo quita y deja de aparecer para los familiares; si tiene cita, no lo permite e informa que ya está reservado. (RN-25)

- **Decisiones del producto:** ¿datos válidos? (si no, B2); ¿entra al menos un turno completo? (si no, B5); si es hoy, ¿quedan turnos que no empezaron? (si no, B6); ¿algún turno se superpone? (no se publica, B1); al quitar, ¿el turno tiene cita? (B4).
- **Reglas aplicables:** RN-01, RN-02, RN-10, RN-18, RN-19, RN-20, RN-21, RN-22, RN-23, RN-24 y RN-25.
- **Resultado (éxito):** los turnos nuevos quedan publicados como libres. Los turnos que el médico ya tenía y sus citas no cambian.
- **Cancelación del proceso:** B8 — si la secretaria sale antes de confirmar, no se publica nada.
- **Fallos y alternativas:**
  - **B1. Rango superpuesto:** los turnos que se superponen no se publican; los demás sí, y el producto informa cuáles no se publicaron. Si todos se superponen, no se publica nada. (RN-24)
  - **B2. Datos inválidos:** si el día ya pasó, si la hora de fin no es posterior a la de inicio, o si falta el médico, el día, alguna de las horas o la duración, el producto indica qué corregir y no publica nada.
  - **B3. Quitar un turno libre:** el turno deja de existir y de aparecer para los familiares. (RN-25)
  - **B4. Intento de quitar un turno con cita:** no se permite; el turno y su cita siguen igual. (RN-25)
  - **B5. No entra ningún turno completo:** si la duración es mayor que el rango, el producto indica que no se puede crear ningún turno y no publica nada. (RN-22)
  - **B6. Publicación para hoy en la que todos los turnos ya empezaron:** el producto lo informa y no publica nada. (RN-23)
  - **B7. Turno quitado mientras un familiar lo reservaba:** al confirmar la reserva, el producto informa al familiar que ese horario ya no está disponible, no registra la cita y le muestra los horarios libres restantes. (RN-25)

### PR-02 · Consultar citas reservadas

- **Especificación:** `agenda-consultorio`.
- **Caso relacionado:** `consultar-citas`.
- **Actor e inicio:** la secretaria quiere revisar las citas de un día; o un paciente llega y dice su nombre en recepción (RN-17); o un médico no podrá atender y la secretaria necesita avisar a los familiares (D14, D21).
- **Condiciones previas:** la secretaria ingresó (RN-18).
- **Datos de entrada (opcionales):** otro día, un médico para filtrar o parte del nombre del paciente.

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Secretaria | Entra a «Citas». |
| 2 | Producto | Muestra las citas confirmadas de hoy, ordenadas por hora. (RN-26) |
| 3 | Secretaria | Si lo necesita, elige otro día, filtra por médico o busca por el nombre del paciente. (RN-27) |
| 4 | Producto | Muestra las citas que coinciden, con los datos de RN-26. |
| 5 | Secretaria | Identifica la cita que buscaba. |

- **Decisiones del producto:** ¿hay citas ese día? (si no, C1); ¿la búsqueda coincide con alguna cita del día visto? (si no, C2); ¿hay varias coincidencias? (C3).
- **Reglas aplicables:** RN-17, RN-18, RN-19, RN-26, RN-27 y RN-28.
- **Resultado:** la secretaria ve las citas con los datos necesarios para atender al paciente en recepción o llamar al familiar. Consultar no cambia ninguna cita ni ningún turno.
- **Alternativas:**
  - **C1. Día sin citas:** el producto indica que no hay citas para ese día.
  - **C2. Búsqueda sin resultados:** la búsqueda se hace sobre el día que se está viendo; si no hay coincidencias, el producto lo indica.
  - **C3. Varias coincidencias:** el producto muestra todas, con hora y médico, para que la secretaria identifique la correcta. (RN-27)
  - **C4. Un médico no podrá atender:** la secretaria filtra por ese médico y usa el nombre y el teléfono de cada familiar para llamarlo por fuera del producto; la cita no se cancela desde el producto. (D21)

### PR-03 · Reservar una cita

- **Especificación:** `reserva-cita`.
- **Caso relacionado:** `reservar-cita`.
- **Actor e inicio:** el paciente necesita atención en una especialidad y el familiar decide reservarle una cita.
- **Condiciones previas:** la secretaria publicó turnos libres (PR-01); el familiar tiene un celular, y un correo si quiere recibir los mensajes por correo. No necesita cuenta.
- **Datos de entrada:** especialidad, día y horario (con su médico); nombre y apellido del paciente y si es menor de edad; nombre y apellido del acompañante (si lo hay); nombre y apellido del familiar, su teléfono, el canal elegido y, si elige correo, su correo. (RN-15)

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Familiar | Entra a «Reservar cita». |
| 2 | Producto | Muestra las especialidades que tienen turnos que se pueden reservar. (RN-10) |
| 3 | Familiar | Elige una especialidad. |
| 4 | Producto | Muestra los días de esa especialidad; los días sin horarios libres aparecen como completos y no se pueden elegir. (RN-04) |
| 5 | Familiar | Elige un día con horarios libres. |
| 6 | Producto | Muestra solo los horarios libres de ese día que todavía se pueden reservar, cada uno con el médico que atiende. (RN-04, RN-10) |
| 7 | Familiar | Elige un horario. |
| 8 | Familiar | Ingresa el nombre y apellido del paciente e indica si es menor de edad. |
| 9 | Familiar | Si el paciente es menor de edad, ingresa el nombre y apellido del acompañante; si es mayor, puede agregarlo o no. (RN-14) |
| 10 | Familiar | Ingresa su nombre y apellido y su teléfono, y elige recibir los mensajes por correo electrónico o por WhatsApp; si elige correo, ingresa también su correo. (RN-15) |
| 11 | Familiar | Confirma la reserva. |
| 12 | Producto | Comprueba los datos obligatorios y su formato (RN-14, RN-15), que el turno siga libre (RN-01) y que su hora de inicio no haya llegado (RN-10). Si todo se cumple, registra la cita como confirmada, sin intervención de la secretaria. (RN-11) |
| 13 | Producto | Muestra que la reserva se completó, con la especialidad, el médico, el día, la hora, el paciente y el código de reserva. (RN-13) |
| 14 | Servicio de mensajes | Envía al familiar, por el canal elegido, la confirmación con el código y los datos de la cita, incluido el médico. (RN-08, RN-13) |

- **Decisiones del producto (paso 12):** ¿falta un dato o su formato no es válido? (A3); ¿el paciente es menor y falta el acompañante? (A4); ¿el turno ya fue reservado? (A2) o ¿fue quitado? (B7); ¿llegó la hora de inicio? (A6). Si nada de eso ocurre, la cita queda confirmada. Después, ¿se pudo enviar el mensaje? (si no, A5).
- **Reglas aplicables:** RN-01, RN-02, RN-04, RN-07, RN-08, RN-09, RN-10, RN-11, RN-12, RN-13, RN-14, RN-15 y RN-16; además RN-17 (identificación en recepción) y RN-25 (B7).
- **Resultado (éxito):** la cita queda confirmada; el turno deja de aparecer como libre; el familiar ve el código en pantalla y lo recibe por mensaje; con ese código puede consultar, cancelar o cambiar la cita (PR-04 a PR-06); la cita aparece en la lista de la secretaria del día correspondiente.
- **Cancelación del proceso:** A7 — si el familiar sale antes de confirmar, no se registra nada y el turno sigue libre.
- **Fallos y alternativas:**
  - **A1. Sin horarios libres:** si ninguna especialidad tiene turnos que se puedan reservar, el producto informa que por ahora no hay horarios libres. Si los horarios de la especialidad elegida se ocupan mientras el familiar elige, informa que no hay horarios libres en esa especialidad y permite elegir otra.
  - **A2. Horario tomado mientras se reservaba:** al confirmar, el producto informa que el horario ya fue reservado por otra persona, no registra la cita y muestra los horarios libres restantes. (RN-01)
  - **A3. Datos incompletos o con formato inválido:** el producto indica qué dato corregir y no registra la cita; el familiar puede corregirlo y volver a confirmar. (RN-15)
  - **A4. Paciente menor de edad sin acompañante:** el producto indica que faltan los datos del acompañante, obligatorios porque el paciente es menor, y no registra la cita: el turno sigue libre, no se genera código, no se envía ningún mensaje y la cita no aparece en la lista de la secretaria. El familiar puede agregar al acompañante y volver a confirmar; si mientras tanto otra persona tomó el turno, aplica A2. (RN-14)
  - **A5. El mensaje no se puede enviar:** la cita queda confirmada; el producto avisa en pantalla que no pudo enviar el mensaje y recuerda anotar el código que se muestra. (RN-09, RN-13)
  - **A6. La hora de inicio llega antes de confirmar:** el producto informa que ese horario ya no se puede reservar, no registra la cita y muestra los horarios libres restantes. (RN-10)
  - **B7. Turno quitado por la secretaria mientras se reservaba:** ver PR-01. (RN-25)

### PR-04 · Consultar una cita con su código

- **Especificación:** `gestion-cita-codigo`.
- **Caso relacionado:** `consultar-cita-codigo`.
- **Actor e inicio:** el familiar quiere revisar una cita que reservó.
- **Condiciones previas:** tiene el código de reserva, que recibió por mensaje y vio en pantalla al reservar. No necesita cuenta ni inicio de sesión.
- **Datos de entrada:** el código de reserva.

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Familiar | Entra a «Mi cita». |
| 2 | Producto | Le pide el código de reserva. |
| 3 | Familiar | Ingresa el código. |
| 4 | Producto | Muestra los datos de la cita de ese código: especialidad, médico, día, hora, nombre del paciente y acompañante (si lo hay). (D36) |
| 5 | Producto | Si la cita está confirmada y su hora de inicio todavía no llegó, ofrece cancelarla (PR-05) o cambiarla (PR-06). (RN-02) |

- **Decisiones del producto:** si el código no corresponde a ninguna cita, aplica E1; si la hora de inicio ya llegó, E2; si la cita fue cancelada, E3.
- **Reglas aplicables:** RN-02, RN-07.
- **Resultado:** el familiar ve los datos de su cita. Consultar no cambia nada: la cita y su turno siguen igual.
- **Alternativas y errores:**
  - **E1. Código incorrecto o inexistente:** el producto indica que no encuentra una cita con ese código, no muestra datos de ninguna cita y permite intentarlo de nuevo.
  - **E2. Cita pasada:** el producto la muestra como pasada y no ofrece cancelarla ni cambiarla.
  - **E3. Cita cancelada:** el producto indica que esa cita fue cancelada y no ofrece opciones.

### PR-05 · Cancelar una cita

- **Especificación:** `gestion-cita-codigo`.
- **Caso relacionado:** `cancelar-cita`.
- **Actor e inicio:** al familiar le surge un percance y el paciente no podrá ir a la cita.
- **Condiciones previas:** el familiar consultó la cita (PR-04); la cita está confirmada y su hora de inicio todavía no llegó. (RN-02)
- **Datos de entrada:** ninguno nuevo; solo la confirmación del familiar.

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Familiar | Desde la cita consultada, elige «Cancelar». |
| 2 | Producto | Pide confirmar la cancelación. |
| 3 | Familiar | Confirma. |
| 4 | Producto | Comprueba que la hora de inicio todavía no llegó, cancela la cita y deja su turno libre para otras reservas. (RN-01, RN-02) |
| 5 | Producto | Muestra que la cita fue cancelada. |
| 6 | Servicio de mensajes | Envía al familiar un aviso de cancelación por el canal que eligió al reservar. (RN-08) |

- **Decisiones del producto:** ¿el familiar confirma? (si no, CN1); al confirmar, ¿ya llegó la hora de inicio? (CN4); ¿se pudo enviar el aviso? (si no, CN3).
- **Reglas aplicables:** RN-01, RN-02, RN-07, RN-08, RN-09.
- **Resultado (éxito):** la cita queda cancelada; su turno vuelve a estar libre; el código ya no permite cancelar ni cambiar (al ingresarlo se ve E3); la cita deja de aparecer en la lista de la secretaria. Los datos del paciente y del acompañante no cambian.
- **Cancelación del proceso:** CN1 — el familiar no confirma: la cita sigue confirmada y sin cambios; el turno sigue ocupado.
- **Fallos y alternativas:**
  - **CN2. La hora de inicio ya llegó:** no se ofrece cancelar (E2).
  - **CN3. El aviso no se puede enviar:** la cita queda cancelada igual y el producto avisa en pantalla que no pudo enviar el aviso. (RN-09)
  - **CN4. La hora de inicio llega antes de que el familiar confirme:** el producto indica que la cita ya pasó y no la cancela; la cita, el turno, el código y la lista de la secretaria siguen igual y no se envía ningún aviso. (RN-02, D41)

### PR-06 · Cambiar una cita

- **Especificación:** `gestion-cita-codigo`.
- **Caso relacionado:** `cambiar-cita`.
- **Actor e inicio:** surge un percance y el paciente no puede ir el día u hora reservados, pero sí en otro momento.
- **Condiciones previas:** el familiar consultó la cita (PR-04); la cita está confirmada y su hora de inicio todavía no llegó. (RN-02)
- **Datos de entrada:** el nuevo día y el nuevo horario (con su médico), elegidos entre los libres de la misma especialidad.

| Paso | Quién | Qué ocurre |
|---|---|---|
| 1 | Familiar | Desde la cita consultada, elige «Cambiar». |
| 2 | Producto | Muestra los días de la misma especialidad; los días sin horarios libres aparecen como completos y no se pueden elegir. (RN-04) |
| 3 | Familiar | Elige un día con horarios libres. |
| 4 | Producto | Muestra solo los horarios libres de ese día, cada uno con el médico que atiende; pueden ser de cualquier médico de la especialidad. (RN-04, RN-05) |
| 5 | Familiar | Elige el nuevo horario. |
| 6 | Producto | Muestra el nuevo día, hora y médico y pide confirmar el cambio. (RN-05) |
| 7 | Familiar | Confirma. |
| 8 | Producto | Comprueba que la hora de inicio de la cita todavía no llegó y que el nuevo horario siga libre; lo ocupa con la cita y recién entonces libera el horario anterior. (RN-01, RN-02, RN-06) |
| 9 | Producto | Muestra la cita con su nuevo día, hora y médico; el código sigue siendo el mismo. (RN-06) |
| 10 | Servicio de mensajes | Envía al familiar un aviso del cambio con el nuevo día, hora y médico, por el canal que eligió al reservar. (RN-08) |

- **Decisiones del producto:** ¿hay otros horarios libres en la especialidad? (si no, F3); ¿el familiar confirma? (si no, F2); al confirmar, ¿ya llegó la hora de inicio? (F6); ¿el nuevo horario sigue libre? (si no, F1); ¿se pudo enviar el aviso? (si no, F5).
- **Reglas aplicables:** RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-07, RN-08, RN-09.
- **Resultado (éxito):** la cita sigue confirmada en su nuevo día, hora y médico; el nuevo turno deja de estar libre y el anterior vuelve a estarlo; el código es el mismo; en la lista de la secretaria la cita aparece en su nuevo día y hora con el nuevo médico. Los datos del paciente y del acompañante no cambian.
- **Cancelación del proceso:** F2 — el familiar no confirma: la cita original sigue igual.
- **Fallos y alternativas:**
  - **F1. Horario tomado mientras se cambiaba:** el producto informa que ese horario ya no está libre y la cita original sigue igual.
  - **F3. Sin otros horarios libres en la especialidad:** el producto lo informa y la cita original sigue igual.
  - **F4. La hora de inicio ya llegó:** no se ofrece cambiar (E2).
  - **F5. El aviso no se puede enviar:** el cambio se mantiene y el producto avisa en pantalla que no pudo enviar el aviso. (RN-09)
  - **F6. La hora de inicio llega antes de que el familiar confirme:** el producto indica que la cita ya pasó y no hace ningún cambio; la cita, ambos turnos, el código y la lista de la secretaria siguen igual y no se envía ningún aviso. (RN-02, D41)

## 12. Reglas del negocio

Cada regla se define una sola vez, en la especificación indicada; las marcadas como «compartida» las usan también otras especificaciones, que las citan por su identificador. `reserva-cita` usa RN-01, RN-02, RN-04, RN-07, RN-08 y RN-09; `agenda-consultorio` usa RN-01, RN-02, RN-10 y RN-17.

### 12.1 Definidas en `gestion-cita-codigo` (RN-01 a RN-09)

**RN-01. Un turno, una cita (compartida).**

- Condición: un turno ya tiene una cita confirmada.
- Comportamiento exigido: ese turno no se ofrece ni se puede ocupar con otra cita. Cuando la cita se cancela o se cambia a otro turno, el turno anterior vuelve a quedar libre.
- Motivo: cada turno es la atención de un médico a un paciente (regla propuesta por la IA y aceptada en D17).
- Procesos: PR-01, PR-03, PR-05, PR-06.

**RN-02. Plazo para cancelar o cambiar.**

- Condición: la hora de inicio de la cita todavía no llegó.
- Comportamiento exigido: se ofrece cancelar o cambiar, sin anticipación mínima. Desde la hora de inicio, la cita se muestra como pasada y no se ofrece ninguna de las dos opciones. Lo que cuenta es la hora en que el familiar **confirma**: si confirma desde la hora de inicio en adelante, el producto indica que la cita ya pasó y no hace ningún cambio; la cita, el turno, el código y la lista de la secretaria siguen igual y no se envía ningún aviso. (D41)
- Motivo (D34, autor): que la persona no se estrese y siempre tenga una salida dentro del producto.
- Ejemplos (D41, del autor): cita del jueves a las 15:30 → a las 15:30 en punto ya figura como pasada y no se ofrece cancelar ni cambiar; si el familiar empieza el cambio a las 15:28 y confirma a las 15:31, el producto le dice que la cita ya pasó y no hace ningún cambio.
- Procesos: PR-04, PR-05, PR-06. El mismo criterio de tiempo lo usan RN-10 (PR-03) y RN-23 (PR-01).

**RN-03. Sin límite de cambios.**

- Condición: la cita está dentro del plazo de RN-02.
- Comportamiento exigido: puede cambiarse las veces que el familiar necesite, aunque ya se haya cambiado antes.
- Motivo (D35, autor): que sea accesible y la persona no se estrese; no agrega reglas ni datos.
- Procesos: PR-06.

**RN-04. Elección de día y horario (compartida).**

- Condición: el familiar elige un turno para reservar o para cambiar una cita.
- Comportamiento exigido: elige primero la especialidad (al cambiar, es la de la cita), después el día y por último el horario. Los días sin horarios libres aparecen como completos y no se pueden elegir. Dentro de un día solo se muestran los horarios libres, y cada uno muestra el médico que atiende.
- Motivo: D7, D9 y D36 (autor: los turnos se publican por médico, así que el familiar sabe desde el principio con quién será y no hace falta una regla para asignar médico).
- Procesos: PR-03, PR-06.

**RN-05. Cambio de médico dentro de la especialidad.**

- Condición: el familiar cambia una cita.
- Comportamiento exigido: puede elegir un horario libre de cualquier médico de la misma especialidad; antes de confirmar se muestra con qué médico quedará la cita. No se puede cambiar de especialidad: para eso se cancela y se reserva de nuevo.
- Motivo (D37, autor): coincide con «misma especialidad» del caso aprobado y da más opciones para resolver el percance.
- Procesos: PR-06.

**RN-06. Cambio sin quedarse sin cita.**

- Condición: el familiar confirma un cambio.
- Comportamiento exigido: el horario anterior se libera solo cuando el nuevo quedó ocupado; si el nuevo no se puede ocupar, la cita original sigue igual. Se mantiene el mismo código. Los datos del paciente y del acompañante no se modifican.
- Motivo: D28 (el familiar nunca se queda sin cita durante el cambio).
- Procesos: PR-06.

**RN-07. Acceso por código.**

- Condición: alguien ingresa un código en «Mi cita».
- Comportamiento exigido: cada código da acceso a una sola cita; no hay cuenta ni lista de «todas mis citas». El producto no comprueba quién ingresa el código: conocerlo basta para consultar, cancelar o cambiar esa cita.
- Motivo: D5 y D25 (sin cuenta, con un código por cita). Depende del supuesto «solo quien reservó conoce el código».
- Procesos: PR-04, PR-05, PR-06 (y PR-03, que genera el código).

**RN-08. Mensajes solo al familiar (compartida).**

- Condición: se confirma una reserva, una cancelación o un cambio.
- Comportamiento exigido: el mensaje se envía solo al familiar que reservó, por el canal que eligió al reservar (correo electrónico o WhatsApp). El paciente y el acompañante no reciben mensajes. El aviso de cambio incluye el nuevo día, hora y médico.
- Motivo: D6, D13, D16, D26, D28 y D37.
- Procesos: PR-03, PR-05, PR-06.

**RN-09. Mensaje que no se puede enviar (compartida).**

- Condición: el producto no logra enviar el mensaje de una reserva, una cancelación o un cambio.
- Comportamiento exigido: la operación se mantiene igual y el producto avisa en pantalla que no pudo enviar el mensaje; en la reserva, además, recuerda anotar el código que se muestra en pantalla.
- Motivo (D39, autor): la cita debe quedar confirmada al instante (D3) y siempre debe haber una salida.
- Procesos: PR-03, PR-05, PR-06.

### 12.2 Definidas en `reserva-cita` (RN-10 a RN-17)

**RN-10. Turnos que se pueden reservar.**

- Condición: un turno está libre.
- Comportamiento exigido: se muestra y se puede reservar mientras su hora de inicio no haya llegado, con el mismo criterio de tiempo de RN-02 (cuenta la hora en que el familiar confirma). Desde la hora de inicio deja de mostrarse. No hay anticipación mínima. Hasta cuándo hacia adelante se puede reservar depende solo de los turnos que publica la secretaria.
- Motivo (D47, autor): una sola regla de tiempo para reservar, cancelar y cambiar; se aprovechan los turnos liberados a último momento.
- Ejemplo: turno libre de las 10:00 → a las 9:55 aparece y se puede reservar; a las 10:00 ya no aparece; si el familiar empieza a las 9:58 y confirma a las 10:01, no se registra (A6).
- Procesos: PR-03 (y PR-01, que lo usa para el día de hoy).

**RN-11. Confirmación inmediata.**

- Condición: el familiar confirma la reserva y se cumplen RN-01, RN-10, RN-14 y RN-15.
- Comportamiento exigido: la cita queda confirmada en ese momento; la secretaria no la aprueba ni la asigna.
- Motivo: D3 y D8 (el familiar elige su fecha; el producto comprueba la disponibilidad).
- Procesos: PR-03.

**RN-12. Sin cuenta, un código por cita.**

- Condición: se registra una cita.
- Comportamiento exigido: no se pide cuenta ni inicio de sesión; el producto genera un código de reserva propio de esa cita (su uso se describe en RN-07).
- Motivo: D5.
- Procesos: PR-03.

**RN-13. Código en pantalla y por mensaje.**

- Condición: la cita quedó confirmada.
- Comportamiento exigido: el código se muestra en pantalla junto con los datos de la cita y también se envía por mensaje al familiar.
- Motivo (D38, autor): que «Mi cita» no dependa de un solo canal.
- Procesos: PR-03.

**RN-14. Acompañante según la edad.**

- Condición: el familiar indica si el paciente es menor de edad.
- Comportamiento exigido: si es menor, el nombre y apellido del acompañante son obligatorios; si es mayor, agregar acompañante es opcional, pero si se agrega, su nombre y apellido son obligatorios. El producto no puede comprobar la edad: se basa en lo que indica el familiar.
- Motivo: D10, D15 y D44.
- Límite: menor de edad significa menos de 18 años.
- Procesos: PR-03.

**RN-15. Datos obligatorios y formato.**

- Condición: el familiar confirma la reserva.
- Comportamiento exigido: se comprueba que estén el nombre y apellido del paciente, si es menor de edad, el nombre y apellido del familiar, su teléfono y el canal, y el correo si el canal es correo. Solo se comprueba el formato: el teléfono tiene exactamente 10 dígitos, solo dígitos, y empieza con 09 (celular de Ecuador); el correo tiene la forma usuario@dominio. Si falta un dato o su formato no es válido, el producto indica qué dato corregir y no registra la cita (A3). Si el canal es WhatsApp, los mensajes van a ese mismo teléfono y no se pide correo.
- Motivo: D43 a D46 (autor: solo se piden los datos que usa alguna regla o persona del consultorio; el formato cubre los errores más comunes y el código en pantalla cubre el resto); el nombre del familiar es obligatorio por D50.
- Límites: 0991234567 es válido; 099123456 (9 dígitos), 09912345678 (11 dígitos), 0891234567 (empieza con 08) y 09912a4567 (con una letra) no son válidos. rosa@correo.com es válido; rosa.correo.com no lo es.
- Procesos: PR-03.

**RN-16. Reservas independientes.**

- Condición: se reserva una cita para un paciente que ya tiene otra.
- Comportamiento exigido: se registra igual; el producto no limita cuántas citas tiene un paciente ni las compara entre sí, porque solo lo conoce por su nombre. Cada cita tiene su propio código. Un mismo turno sigue admitiendo una sola cita (RN-01).
- Motivo (D48, autor): con solo nombre y apellido el producto no puede reconocer de verdad al mismo paciente; una regla así fallaría en los dos sentidos.
- Procesos: PR-03.

**RN-17. Identificación en recepción (compartida).**

- Condición: el paciente llega al consultorio.
- Comportamiento exigido: se identifica diciendo su nombre en recepción; no necesita presentar el código. La secretaria lo busca en su lista.
- Motivo: D14.
- Procesos: PR-02, PR-03.

### 12.3 Definidas en `agenda-consultorio` (RN-18 a RN-28)

**RN-18. Acceso de la secretaria.**

- Condición: alguien quiere publicar o quitar turnos, o ver la lista de citas.
- Comportamiento exigido: solo puede hacerlo la secretaria después de ingresar con su usuario y contraseña. Sin ingresar, esas acciones no se pueden usar, aunque alguien conozca la sección; no basta con ocultarlas. El familiar no tiene acceso a ellas.
- Motivo: D18 (proteger la agenda y los datos de los pacientes).
- Procesos: PR-01, PR-02.

**RN-19. Intentos de ingreso.**

- Condición: la secretaria ingresa un usuario o una contraseña incorrectos.
- Comportamiento exigido: el producto indica «usuario o contraseña incorrectos», sin decir cuál falla. Después de 5 intentos fallidos seguidos con ese usuario, debe esperar 15 minutos; durante la espera no se acepta ningún intento, ni siquiera el correcto. Al terminar la espera, el conteo vuelve a cero (otros 5 intentos). Un ingreso correcto también reinicia el conteo. La espera es por usuario.
- Motivo (D56, D57, autor): protege los datos de los pacientes sin que nadie tenga que desbloquear la cuenta; un bloqueo permanente no tendría salida porque administrar cuentas está excluido; la regla es fácil de explicar y de comprobar.
- Límites: con 4 intentos fallidos todavía puede intentar; el 5.º activa la espera; a los 14 minutos de espera, incluso la contraseña correcta se rechaza; a los 15 minutos puede volver a intentar, con el conteo en cero.
- Procesos: PR-01, PR-02.

**RN-20. Publicación por bloques de un día.**

- Condición: la secretaria publica turnos.
- Comportamiento exigido: indica un médico, un solo día, una hora de inicio, una hora de fin y la duración de cada turno. Para publicar varios días, repite la publicación una vez por día.
- Motivo: D19 y D54 (autor: cada publicación es simple y su resultado se entiende fácil; repetirla para varios días es un costo aceptado).
- Procesos: PR-01.

**RN-21. Duraciones permitidas.**

- Condición: la secretaria elige la duración de los turnos.
- Comportamiento exigido: elige una de una lista fija: 15, 20, 30, 45 o 60 minutos. No se puede indicar otra duración.
- Motivo (D53, autor): rápido de elegir, sin errores de tipeo, coherente con D19 y con pocos casos límite.
- Procesos: PR-01.

**RN-22. División del rango en turnos (cálculo).**

- Condición: la secretaria confirma una publicación con datos válidos.
- Comportamiento exigido: desde la hora de inicio, el producto arma turnos consecutivos de la duración elegida mientras el turno completo termine a la hora de fin o antes. Los minutos que sobran al final no se publican. El producto informa cuántos turnos se crearon y cuántos minutos sobraron. Si no entra ningún turno completo, no publica nada (B5).
- Motivo (D52, autor): todos los turnos duran lo mismo y la secretaria no tiene que hacer cuentas antes de publicar.
- Ejemplos: ver sección 16.
- Procesos: PR-01.

**RN-23. Publicación para el día de hoy.**

- Condición: el día de la publicación es hoy.
- Comportamiento exigido: se publican solo los turnos cuya hora de inicio todavía no llegó (mismo criterio de tiempo que RN-02 y RN-10); el producto informa cuántos no se publicaron porque ya empezaron. Si todos ya empezaron, no publica nada (B6). Un día anterior a hoy es un dato inválido (B2).
- Motivo (D55, autor): coherente con RN-10; la secretaria no tiene que corregir nada.
- Ejemplo: ver sección 16 (publicación para hoy a las 10:00).
- Procesos: PR-01.

**RN-24. Sin turnos superpuestos.**

- Condición: un turno nuevo se superpone con un turno ya publicado del mismo médico ese día (empieza antes de que el otro termine y termina después de que el otro empieza), tenga o no cita.
- Comportamiento exigido: ese turno no se publica; los turnos nuevos que no se superponen sí. El producto informa cuáles no se publicaron. Un turno que empieza exactamente cuando termina otro no se superpone con él. (D59)
- Motivo: B1 aprobada (D22): un médico no atiende dos turnos a la vez. La publicación parcial y el límite «empieza justo cuando termina el otro» los confirmó el autor con su ejemplo (D59).
- Ejemplo (D59, del autor): el Dr. Andrade ya tiene el miércoles turnos de 20 minutos de 14:00 a 17:20; se publica el mismo día de 16:00 a 18:00 con turnos de 20 minutos → 16:00, 16:20, 16:40 y 17:00 no se publican por superponerse; se publican 17:20 y 17:40; sobran 0 minutos.
- Procesos: PR-01.

**RN-25. Solo se quitan turnos libres.**

- Condición: la secretaria quiere quitar un turno publicado.
- Comportamiento exigido: si el turno está libre, se quita y deja de aparecer para los familiares; si tiene cita, no se puede quitar y el producto informa que ya está reservado. Si un familiar estaba reservando un turno que se quitó, al confirmar no se registra la cita (B7).
- Motivo: D21 (corregir errores sin sumar una cancelación por parte del consultorio).
- Procesos: PR-01, PR-03.

**RN-26. Contenido de la lista de citas.**

- Condición: la secretaria ve la lista de citas.
- Comportamiento exigido: se muestran las citas confirmadas del día elegido (hoy, por defecto), ordenadas por hora. De cada una: hora, médico y especialidad, nombre y apellido del paciente, si es menor de edad, acompañante (si lo hay) y nombre y teléfono del familiar. No se muestran el código de reserva, el correo ni el canal de mensajes. Las citas canceladas no aparecen; las citas cambiadas aparecen en su nuevo día, hora y médico.
- Motivo: D23, D26, D28 y D51 (autor: la secretaria ve lo mínimo que necesita para atender y llamar).
- Procesos: PR-02.

**RN-27. Búsqueda por nombre del paciente.**

- Condición: la secretaria escribe un texto para buscar.
- Comportamiento exigido: la búsqueda se hace sobre el día que se está viendo. Una cita coincide si el texto escrito aparece en cualquier parte del nombre y apellido del paciente, sin importar mayúsculas ni tildes. Si hay varias coincidencias, se muestran todas, con hora y médico (C3).
- Motivo (D58, autor): los nombres se escriben distinto («Jose» o «José») y en recepción hay que encontrar al paciente rápido.
- Ejemplos: ver CA-02.4 y CA-02.5 (sección 18).
- Procesos: PR-02.

**RN-28. La lista es de consulta.**

- Condición: la secretaria está en la lista de citas.
- Comportamiento exigido: no puede crear, asignar, cambiar ni cancelar citas desde ahí.
- Motivo: D3 y D21.
- Procesos: PR-02.

## 13. Datos necesarios y su significado

### 13.1 Ingreso de la secretaria y PR-01 · Publicar horarios

| Dato | Lo aporta | Significado | Obligatorio | Valores permitidos | Quién lo ve o lo modifica |
|---|---|---|---|---|---|
| Usuario y contraseña | Secretaria | Los de su cuenta, que ya existe | Sí, para ingresar | Los de su cuenta | Solo la secretaria. No se administran en el producto (D18). |
| Intentos fallidos seguidos y fin de la espera | Producto | Cuántos intentos fallidos seguidos lleva ese usuario y cuándo termina la espera | — | De 0 a 5 intentos; espera de 15 minutos | Nadie los modifica a mano. |
| Médico | Secretaria (lo elige) | Médico cuyos turnos se publican | Sí, para publicar | Uno de los médicos cargados, con su especialidad | Lo ven la secretaria y, junto a cada horario, el familiar. No se edita (D20). |
| Día | Secretaria | Día de la publicación | Sí, para publicar | Hoy o un día futuro (un solo día por publicación) | La secretaria. |
| Hora de inicio y hora de fin | Secretaria | Rango de horas en que atiende el médico ese día | Sí, para publicar | Horas del día; la de fin debe ser posterior a la de inicio | La secretaria. |
| Duración | Secretaria (la elige) | Duración de cada turno del bloque | Sí, para publicar | 15, 20, 30, 45 o 60 minutos | La secretaria. |
| Turno | Producto (lo calcula) | Médico, especialidad, día, hora de inicio y de fin | — | Libre u ocupado | Los turnos libres los ve el familiar al reservar; la secretaria ve los publicados y puede quitar los libres. |
| Resumen de la publicación | Producto (lo calcula) | Resultado de cada publicación | — | Turnos publicados, minutos sobrantes, turnos no publicados por haber empezado o por superponerse | La secretaria. |

### 13.2 PR-02 · Consultar citas reservadas

| Dato | Lo aporta | Significado | Obligatorio | Valores permitidos | Quién lo ve o lo modifica |
|---|---|---|---|---|---|
| Día de la lista | Secretaria | Día cuyas citas se ven | No (hoy por defecto) | Un día | La secretaria. |
| Filtro por médico | Secretaria | Limita la lista a un médico | No | Uno de los médicos cargados | La secretaria. |
| Texto de búsqueda | Secretaria | Parte del nombre del paciente | No | Cualquier parte del nombre y apellido; no importan mayúsculas ni tildes (RN-27) | La secretaria. |
| Datos de cada cita en la lista | Vienen de la reserva | Hora, médico y especialidad, nombre y apellido del paciente, si es menor de edad, acompañante (si lo hay) y nombre y teléfono del familiar | — | Ver RN-26; sin código, correo ni canal | Solo la secretaria; no los modifica (RN-28). |

### 13.3 PR-03 · Reservar una cita

| Dato | Lo aporta | Significado | Obligatorio | Valores permitidos | Quién lo ve o lo modifica |
|---|---|---|---|---|---|
| Especialidad | Familiar (la elige) | Especialidad en la que se atenderá el paciente | Sí | Una de las especialidades cargadas que tenga turnos que se puedan reservar | La ven el familiar (con el código) y la secretaria. No se modifica (cambiar de especialidad = cancelar y reservar). |
| Día, horario y médico | Familiar (elige un turno libre) | Turno en que se atenderá el paciente | Sí | Turno publicado por la secretaria, libre y cuya hora de inicio no llegó | Los ven el familiar y la secretaria. Cambian solo con PR-06. |
| Nombre y apellido del paciente | Familiar | Nombre con el que la secretaria encuentra la cita (D14) | Sí | Debe estar presente; no se comprueba su formato (RN-15) | Lo ven el familiar (con el código) y la secretaria. No se modifica. |
| Paciente menor de edad | Familiar (lo indica) | Define si el acompañante es obligatorio | Sí | Sí o no (menor de edad: menos de 18 años). El producto no lo comprueba | Lo ve la secretaria. No se modifica. |
| Nombre y apellido del acompañante | Familiar | Quién irá con el paciente | Si el paciente es menor, o si se agrega acompañante | Debe estar presente cuando corresponde | Lo ven el familiar (con el código) y la secretaria. No se modifica. |
| Nombre y apellido del familiar | Familiar | Para que la secretaria sepa por quién preguntar cuando llama | Sí (D50) | Debe estar presente | Lo ve la secretaria en su lista (D51). |
| Teléfono del familiar | Familiar | Para que la secretaria pueda llamar si un médico falta; si el canal es WhatsApp, es también el número de WhatsApp | Sí | Exactamente 10 dígitos, solo dígitos, empieza con 09 | Lo ve la secretaria en su lista (D21, D51); el producto lo usa para los mensajes por WhatsApp. |
| Canal de mensajes | Familiar (lo elige) | Por dónde llegan la confirmación y los avisos | Sí | Correo electrónico o WhatsApp | Lo usa el producto para enviar los mensajes (RN-08); no aparece en la lista de la secretaria (D51). |
| Correo del familiar | Familiar | Destino de los mensajes por correo | Solo si el canal es correo | Forma usuario@dominio | Solo lo usa el producto para los mensajes por correo; no aparece en la lista de la secretaria (D51). |
| Código de reserva | Producto (lo genera) | Identifica una sola cita | — | Uno por cita (RN-12) | Lo ve el familiar en pantalla y en el mensaje; no aparece en la lista de la secretaria. |
| Estado de la cita | Producto | Situación de la cita | — | Queda «confirmada» al terminar la reserva | Ver 13.4 y sección 15. |
| Hora actual | Producto | Para aplicar RN-10 | — | — | — |

### 13.4 PR-04, PR-05 y PR-06 · Gestión de una cita con su código

| Dato | Lo aporta | Significado | Obligatorio | Valores permitidos | Quién lo ve o lo modifica |
|---|---|---|---|---|---|
| Código de reserva | Lo genera el producto al reservar; el familiar lo ingresa en «Mi cita» | Identifica una sola cita | Sí, para consultar | El código de una cita | Lo conoce el familiar (pantalla y mensaje al reservar). No aparece en la lista de la secretaria (D23). Nadie lo modifica; se mantiene al cambiar. |
| Especialidad | De la reserva | Especialidad de la cita | — | Una de las especialidades cargadas | La ven el familiar (con el código) y la secretaria. No se modifica (cambiar de especialidad = cancelar y reservar). |
| Médico | Del turno elegido | Médico que atiende ese turno | — | Un médico de la especialidad de la cita | Lo ven el familiar y la secretaria. Cambia solo al cambiar la cita (RN-05). |
| Día y hora | Del turno elegido | Día y hora de inicio de la cita | — | Un turno publicado | Los ven el familiar y la secretaria. Cambian solo con PR-06. |
| Paciente y acompañante (si lo hay) | De la reserva | Datos registrados al reservar (13.3) | — | — | Los ven el familiar y la secretaria. No se modifican (RN-06). |
| Canal y contacto del familiar | De la reserva | Canal elegido al reservar y su contacto | — | Correo electrónico o WhatsApp | El producto los usa para los avisos (RN-08); la secretaria ve solo el nombre y el teléfono del familiar (RN-26). |
| Confirmación del familiar | Familiar | Acepta o no la cancelación o el cambio | Sí, para cancelar o cambiar | Sí o no | — |
| Nuevo día y horario (con su médico) | Familiar (los elige) | Turno al que pasa la cita | Sí, para cambiar | Turno libre de la misma especialidad, de cualquiera de sus médicos | Una vez confirmado, lo ven el familiar y la secretaria. |
| Estado de la cita | Producto | Situación de la cita | — | Confirmada, cancelada o pasada | Lo ve el familiar en «Mi cita». |
| Hora actual | Producto | Se compara con la hora de inicio para aplicar RN-02 | — | — | — |

## 14. Validaciones, permisos y restricciones

### 14.1 Qué puede hacer cada actor

| Actor | Puede | Condiciones | No puede |
|---|---|---|---|
| Familiar (sin cuenta) | Reservar una cita (PR-03) | Sin cuenta ni inicio de sesión (RN-12); datos obligatorios con formato válido (RN-14, RN-15); turno libre cuya hora de inicio no llegó (RN-01, RN-10) | Publicar o quitar turnos ni ver la lista de citas (RN-18) |
| Familiar (con el código) | Consultar, cancelar o cambiar esa cita (PR-04 a PR-06) | Acceso por código: cada código abre una sola cita y el producto no comprueba quién lo ingresa (RN-07). Cancelar o cambiar solo si la cita está confirmada y confirma antes de su hora de inicio (RN-02). Cambiar solo dentro de la misma especialidad, sin límite de veces (RN-03, RN-05) | Ver una lista de «todas mis citas» (RN-07); cambiar de especialidad (RN-05); modificar los datos del paciente o del acompañante (RN-06); recuperar un código perdido (exclusión D40) |
| Secretaria | Publicar turnos y quitar turnos libres (PR-01); ver y buscar en la lista de citas (PR-02) | Haber ingresado con su usuario y contraseña (RN-18), fuera de una espera (RN-19) | Crear, asignar, cambiar ni cancelar citas (RN-28); quitar un turno con cita (RN-25); ver el código, el correo o el canal del familiar (RN-26); administrar cuentas, médicos o especialidades (exclusiones D18, D20) |
| Servicio de mensajes | Enviar la confirmación y los avisos | Solo al familiar que reservó, por el canal que eligió (RN-08) | Enviar mensajes al paciente o al acompañante (RN-08) |
| Cualquier persona sin ingresar como secretaria | — | — | Usar las acciones de «Horarios» y «Citas», aunque conozca la sección (RN-18) |

**Ocultar una opción no es el permiso.** Según RN-18, las acciones de la secretaria no se pueden usar sin ingresar aunque alguien conozca la sección; no basta con ocultarlas. Lo mismo vale para las opciones de «Mi cita»: dejar de mostrar «Cancelar» o «Cambiar» en una cita pasada no alcanza; si el familiar confirma desde la hora de inicio, el producto igual rechaza la operación (RN-02, CN4, F6).

### 14.2 Respuestas ante datos faltantes o inválidos y acciones no permitidas

| Situación | Proceso y etiqueta | Qué indica el producto | ¿Se puede corregir o reintentar? |
|---|---|---|---|
| Falta un dato obligatorio de la reserva o su formato no es válido (teléfono, correo) | PR-03, A3 (RN-15) | Qué dato corregir; no registra la cita | Sí: corregir y volver a confirmar |
| Paciente menor de edad sin acompañante | PR-03, A4 (RN-14) | Que faltan los datos del acompañante, obligatorios porque el paciente es menor; no registra la cita | Sí: agregar al acompañante y volver a confirmar; si el turno se ocupó, A2 |
| El turno ya fue reservado por otra persona | PR-03, A2 (RN-01) | Que el horario ya fue reservado; muestra los horarios libres restantes | Sí: elegir otro horario |
| La hora de inicio del turno llegó antes de confirmar la reserva | PR-03, A6 (RN-10) | Que ese horario ya no se puede reservar; muestra los horarios libres restantes | Sí: elegir otro horario |
| La secretaria quitó el turno mientras el familiar reservaba | PR-01 y PR-03, B7 (RN-25) | Que ese horario ya no está disponible; muestra los horarios libres restantes | Sí: elegir otro horario |
| Código incorrecto o inexistente | PR-04, E1 (RN-07) | Que no encuentra una cita con ese código; no muestra datos de ninguna cita | Sí: intentarlo de nuevo |
| Cita pasada | PR-04, E2 (RN-02) | La cita como pasada, sin opciones | No |
| Cita cancelada | PR-04, E3 | Que esa cita fue cancelada, sin opciones | No |
| El familiar confirma la cancelación o el cambio desde la hora de inicio | PR-05, CN4; PR-06, F6 (RN-02) | Que la cita ya pasó; no hace ningún cambio ni envía avisos | No |
| El nuevo horario se ocupó mientras se cambiaba | PR-06, F1 (RN-01, RN-06) | Que ese horario ya no está libre; la cita original sigue igual | Sí, mientras no llegue la hora de inicio, porque no hay límite de cambios (RN-02, RN-03) |
| Usuario o contraseña incorrectos | Ingreso (RN-19) | «usuario o contraseña incorrectos», sin decir cuál falla | Sí, hasta el 5.º intento fallido seguido |
| 5.º intento fallido seguido o intento durante la espera | Ingreso (RN-19) | Que debe esperar 15 minutos; durante la espera rechaza incluso los datos correctos | Sí, al terminar la espera, con el conteo en cero |
| Acciones de la secretaria sin haber ingresado | Ingreso (RN-18) | Pide ingresar | Sí: ingresar primero |
| Publicación con día pasado, hora de fin no posterior a la de inicio, o sin médico, día, horas o duración | PR-01, B2 (RN-23) | Qué corregir; no publica nada | Sí: corregir y volver a confirmar |
| Duración mayor que el rango | PR-01, B5 (RN-22) | Que no se puede crear ningún turno; no publica nada | Sí: cambiar el rango o la duración |
| Publicación para hoy en la que todos los turnos ya empezaron | PR-01, B6 (RN-23) | Lo informa; no publica nada | Sí, con otro rango u otro día |
| Turnos que se superponen con turnos ya publicados | PR-01, B1 (RN-24) | Cuáles no se publicaron; publica los demás | Sí, con un rango que no se superponga |
| Duración distinta de 15, 20, 30, 45 o 60 minutos | PR-01 (RN-21) | Solo ofrece esas duraciones; no se puede indicar otra | — |
| Quitar un turno con cita | PR-01, B4 (RN-25) | Que el turno ya está reservado; el turno y su cita siguen igual | No |
| Crear, cambiar o cancelar una cita desde la lista de la secretaria | PR-02 (RN-28) | La lista no ofrece esas acciones | No |

## 15. Estados y cambios permitidos

### 15.1 Cita

| Desde | Hacia | Quién lo inicia | Condición | Efecto |
|---|---|---|---|---|
| — (reserva, PR-03) | Confirmada | Familiar | Se cumplen RN-01, RN-10, RN-14 y RN-15 (RN-11) | El turno queda ocupado. |
| Confirmada | Confirmada, en nuevo día, hora y médico | Familiar | Confirma antes de la hora de inicio; el nuevo horario sigue libre | Nuevo turno ocupado, anterior libre, mismo código, aviso de cambio. |
| Confirmada | Cancelada | Familiar | Confirma antes de la hora de inicio | Turno libre; el código muestra «cancelada»; sale de la lista de la secretaria; aviso de cancelación. |
| Confirmada | Pasada | Nadie: ocurre al llegar la hora de inicio | — | Ya no se ofrece cancelar ni cambiar. |

Un cambio no crea un estado nuevo: la cita sigue **confirmada**, con otro turno. Cancelada y pasada son estados finales: no admiten cambios. La reserva crea la cita directamente como confirmada: no hay un estado intermedio «pendiente» y el turno no queda apartado mientras el familiar llena los datos; por eso existe A2.

### 15.2 Turno

| Desde | Hacia | Quién lo inicia | Condición | Efecto |
|---|---|---|---|---|
| — | Libre | Secretaria (publicar) | RN-20 a RN-24 | Aparece para los familiares mientras su hora de inicio no llegue (RN-10). |
| Libre | Ocupado | Familiar (reservar o cambiar hacia ese turno) | RN-01, RN-10 | Deja de aparecer como libre. |
| Ocupado | Libre | Familiar (cancelar o cambiar desde ese turno) | Antes de la hora de inicio (RN-02) | Vuelve a aparecer como libre si su hora de inicio no llegó. |
| Libre | Quitado | Secretaria | El turno no tiene cita (RN-25) | Deja de existir y de aparecer para los familiares. |
| Ocupado | Quitado | — | No permitido (RN-25, B4) | — |

Un turno libre cuya hora de inicio llegó deja de ofrecerse (RN-10); no se trata como un estado aparte.

### 15.3 Ingreso de la secretaria

| Desde | Hacia | Condición | Efecto |
|---|---|---|---|
| Sin ingresar | Ingresada | Usuario y contraseña correctos, fuera de una espera | Puede usar «Horarios» y «Citas»; el conteo vuelve a cero. |
| Sin ingresar | En espera | 5.º intento fallido seguido | Durante 15 minutos no se acepta ningún intento. |
| En espera | Sin ingresar | Pasan 15 minutos | Conteo en cero; puede volver a intentar. |

### 15.4 Respuestas temporales que no son estados

Mensajes como «buscando la cita», «no encontramos una cita con ese código», «comprobando disponibilidad», «falta el teléfono», «usuario o contraseña incorrectos», «publicando» o «no hay citas para este día» son respuestas temporales: informan qué pasó en ese momento, pero no cambian el estado de ninguna cita, turno ni ingreso.

### 15.5 Operaciones sin ciclo de estados

- **PR-02 (consultar citas reservadas)** y **PR-04 (consultar una cita con su código)** son consultas: muestran información y no cambian ninguna cita ni ningún turno. Por eso no tienen una tabla de estados propia; solo leen el estado actual (por ejemplo, PR-04 muestra si la cita está pasada o cancelada).
- **Publicar** crea turnos libres y **quitar** los elimina; la publicación en sí no tiene estados: o se publican turnos o no se publica nada (B2, B5, B6, B8).

## 16. Cálculos y ejemplos

El único cálculo del producto es la **división de un rango de horas en turnos** al publicar (RN-22, con RN-23 y RN-24).

- **Entradas:** hora de inicio, hora de fin y duración (15, 20, 30, 45 o 60 minutos).
- **Unidad:** minutos.
- **Regla en palabras:** cantidad de turnos = cuántas veces entra la duración completa entre la hora de inicio y la de fin, armando turnos consecutivos desde la hora de inicio; los minutos sobrantes no se publican. **No hay redondeo:** un turno incompleto nunca se crea. Después se descartan los turnos que ya empezaron (si el día es hoy, RN-23) y los que se superponen con turnos ya publicados del mismo médico (RN-24); se publican los demás.
- **Resultado que se informa:** turnos publicados, minutos sobrantes y turnos no publicados por haber empezado o por superponerse.

| Ejemplo | Rango | Duración | Turnos completos | Minutos sobrantes | No publicados | Publicados | Fuente |
|---|---|---|---|---|---|---|---|
| Exacto | 8:00 a 12:00 (240 minutos) | 30 | 240 ÷ 30 = 8 (8:00, 8:30, …, 11:30) | 0 | — | 8 | Cálculos de `agenda-consultorio`; CA-01.5 |
| Con sobrante | 8:00 a 12:00 | 45 | 5 (8:00, 8:45, 9:30, 10:15 y 11:00, que termina a las 11:45) | 15 | — | 5 | CA-01.6 |
| Ningún turno | 8:00 a 8:30 | 45 | 0 | — | — | 0: no se publica nada (B5) | CA-01.7 |
| Publicación para hoy, a las 10:00 | 8:00 a 12:00 | 30 | 8 | 0 | 5 ya empezaron (8:00, 8:30, 9:00, 9:30 y 10:00, porque a las 10:00 su hora de inicio ya llegó) | 3 (10:30, 11:00 y 11:30) | CA-01.9; D55 |
| Superposición | 9:00 a 12:00; el médico ya tiene turnos de 30 minutos de 8:00 a 10:00 | 45 | 4 (9:00, 9:45, 10:30 y 11:15) | 0 (180 ÷ 45 = 4 exactos) | 2 por superponerse: 9:00 y 9:45 (chocan con 9:00–9:30 y 9:30–10:00) | 2 (10:30 y 11:15) | CA-01.11 |
| Ejemplo válido del autor | Miércoles, 14:00 a 17:30 (210 minutos), Dr. Andrade, confirmado el lunes a las 8:00 | 20 | 210 ÷ 20 = 10 completos (de 14:00 a 17:00; el último termina a las 17:20) | 10 | Ninguno | 10 | CA-01.15 |
| Ejemplo límite del autor | Mismo miércoles, 16:00 a 18:00 (120 minutos), Dr. Andrade, después del anterior | 20 | 6 (16:00, 16:20, 16:40, 17:00, 17:20 y 17:40) | 0 | 4 por superponerse (16:00, 16:20, 16:40 y 17:00) | 2 (17:20 y 17:40); resumen «2 turnos publicados, 0 minutos sobrantes, 4 no publicados por superponerse» | CA-01.16; D59 |

**Límite de la superposición (D59).** El turno de las 17:20 se publica porque empieza exactamente cuando termina el último turno anterior (17:00–17:20), y eso no es superposición. En cambio, el de las 17:00 nuevo coincide con el turno existente de 17:00–17:20 y no se publica.

**Corrección registrada.** En D55, el primer ejemplo de la IA para la publicación de hoy estaba mal calculado; se corrigió así: a las 10:00 el turno de las 10:00 ya empezó, por lo que se publican 3 turnos y no se publican 5.

**Lo que no es un cálculo.** Comparar la hora actual con la hora de inicio (RN-02, RN-10, RN-23) y revisar el formato del teléfono y del correo (RN-15) son comprobaciones, no cálculos: no producen cantidades ni redondeos. La reserva, la consulta, la cancelación y el cambio no calculan importes, cantidades ni fechas.

## 17. Alternativas, errores y recuperación

| Situación | Proceso y etiqueta | Qué ve el usuario | Qué cambia / qué permanece | Cómo continuar |
|---|---|---|---|---|
| Ninguna especialidad tiene turnos que se puedan reservar | PR-03, A1 | Que por ahora no hay horarios libres | No se registra nada | No hay reserva posible hasta que la secretaria publique turnos (PR-01) |
| La especialidad elegida se quedó sin horarios mientras el familiar elegía | PR-03, A1 | Que no hay horarios libres en esa especialidad | No se registra nada | Elegir otra especialidad |
| El familiar sale antes de confirmar la reserva | PR-03, A7 | — | No se registra nada; el turno sigue libre | Empezar de nuevo cuando quiera |
| Datos incompletos o con formato inválido | PR-03, A3 | Qué dato corregir | No se registra la cita; el turno sigue libre | Corregir y volver a confirmar |
| Menor de edad sin acompañante | PR-03, A4 | Que faltan los datos del acompañante, obligatorios porque el paciente es menor | El turno sigue libre; no se genera código; no se envía mensaje; la cita no aparece en la lista | Agregar al acompañante y volver a confirmar; si el turno se ocupó, A2 |
| Turno tomado por otra persona mientras se reservaba | PR-03, A2 | Que el horario ya fue reservado y los horarios libres restantes | No se registra la cita | Elegir otro horario |
| Turno quitado por la secretaria mientras se reservaba | PR-01 y PR-03, B7 | Que ese horario ya no está disponible y los horarios libres restantes | No se registra la cita | Elegir otro horario |
| La hora de inicio llega antes de confirmar la reserva | PR-03, A6 | Que ese horario ya no se puede reservar y los horarios libres restantes | No se registra la cita | Elegir otro horario |
| El mensaje de confirmación no se puede enviar | PR-03, A5 | Que no se pudo enviar el mensaje y que anote el código que ve en pantalla | La cita queda confirmada; el código sigue en pantalla | Anotar el código; usarlo en «Mi cita» |
| Operación repetida: reservar otra cita para el mismo paciente | PR-03 (RN-16) | Una nueva confirmación con otro código | Se registra una cita independiente; un turno sigue admitiendo una sola cita | Cada cita se gestiona con su propio código |
| Código incorrecto o inexistente | PR-04, E1 | Que no encuentra una cita con ese código | No se muestran datos de ninguna cita | Intentarlo de nuevo |
| Código de una cita pasada | PR-04, E2 | La cita como pasada, sin opciones | Nada cambia | — |
| Operación repetida: ingresar el código de una cita ya cancelada | PR-04, E3 | Que esa cita fue cancelada, sin opciones | Nada cambia | — |
| Código perdido | Exclusión D40 | — | La cita sigue confirmada; sin el código no se puede consultar, cancelar ni cambiar desde el producto | No hay recuperación ni reenvío en esta versión; el paciente igual puede ir a la cita y identificarse con su nombre en recepción (RN-17) |
| El familiar no confirma la cancelación | PR-05, CN1 | — | La cita sigue confirmada y el turno sigue ocupado | Puede volver a elegir «Cancelar» antes de la hora de inicio |
| El aviso de cancelación no se puede enviar | PR-05, CN3 | Que no se pudo enviar el aviso | La cita queda cancelada igual | — |
| La hora de inicio llega antes de confirmar la cancelación | PR-05, CN4 | Que la cita ya pasó | Nada cambia: cita, turno, código y lista igual; no se envía aviso | — |
| No hay otros horarios libres en la especialidad | PR-06, F3 | Que no hay otros horarios libres | La cita sigue igual | Mantener la cita o cancelarla (PR-05) |
| El nuevo horario se ocupó mientras se cambiaba | PR-06, F1 | Que ese horario ya no está libre | La cita original sigue igual | Volver a intentar el cambio con otro horario antes de la hora de inicio (RN-03) |
| El familiar no confirma el cambio | PR-06, F2 | — | La cita original sigue igual | Puede volver a elegir «Cambiar» antes de la hora de inicio |
| El aviso del cambio no se puede enviar | PR-06, F5 | Que no se pudo enviar el aviso | El cambio se mantiene | — |
| La hora de inicio llega antes de confirmar el cambio | PR-06, F6 | Que la cita ya pasó | Nada cambia: cita, ambos turnos, código y lista igual; no se envía aviso | — |
| Operación repetida: cambiar una cita ya cambiada | PR-06 (RN-03) | Las mismas opciones que la primera vez | Se aplica el cambio como cualquier otro | Sin límite, mientras no llegue la hora de inicio |
| Usuario o contraseña incorrectos | Ingreso (RN-19) | «usuario o contraseña incorrectos», sin decir cuál falla | Aumenta el conteo de intentos | Reintentar |
| 5.º intento fallido seguido | Ingreso (RN-19) | Que debe esperar 15 minutos | Durante la espera no se acepta ningún intento, ni el correcto | A los 15 minutos, con el conteo en cero |
| Datos de publicación inválidos | PR-01, B2 | Qué corregir | No se publica nada | Corregir y volver a confirmar |
| No entra ningún turno completo | PR-01, B5 | Que no se puede crear ningún turno | No se publica nada | Cambiar el rango o la duración |
| Publicación para hoy con todos los turnos ya empezados | PR-01, B6 | Lo informa | No se publica nada | Publicar otro rango u otro día |
| Operación repetida: volver a publicar un rango ya publicado (o parte de él) | PR-01, B1 | Cuáles no se publicaron por superponerse | Se publican solo los turnos que no se superponen; los existentes y sus citas no cambian | — |
| La secretaria sale antes de confirmar la publicación | PR-01, B8 | — | No se publica nada | Empezar de nuevo |
| Intento de quitar un turno con cita | PR-01, B4 | Que el turno ya está reservado | El turno y su cita siguen igual | — |
| Día sin citas | PR-02, C1 | Que no hay citas para ese día | Nada cambia | Elegir otro día |
| Búsqueda sin resultados | PR-02, C2 | Que no hay coincidencias en ese día | Nada cambia | Cambiar de día o el texto de búsqueda |
| Varias coincidencias en la búsqueda | PR-02, C3 | Todas las coincidencias, con hora y médico | Nada cambia | Identificar la correcta por hora y médico |
| Un médico no podrá atender | PR-02, C4 | Las citas de ese médico con el nombre y teléfono de cada familiar | Ninguna cita se cancela desde el producto | La secretaria llama a cada familiar por fuera del producto (exclusión D21) |

## 18. Criterios de aceptación y ejemplos comprobables

Estos criterios describen el comportamiento esperado. No se ejecutó ninguna prueba porque el producto todavía no está implementado.

Se presentan todos los criterios de las tres especificaciones aprobadas, con su identificador, su proceso y sus reglas o alternativas. La redacción está condensada sin quitar condiciones ni límites. «Médico 1» y «Médico 2» son nombres de ejemplo.

### 18.1 Ingreso de la secretaria (condición previa de PR-01 y PR-02) — `agenda-consultorio`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-01.1 | RN-18 | Nadie ingresó | Se intenta publicar o quitar turnos, o ver la lista de citas | No se puede; el producto pide ingresar |
| CA-01.2 | RN-19 | La secretaria lleva 4 intentos fallidos seguidos | Falla el 5.º | Hasta el 4.º, el producto indica «usuario o contraseña incorrectos», sin decir cuál falla, y permite reintentar; con el 5.º, indica que debe esperar 15 minutos |
| CA-01.3 | RN-19 | La secretaria está en espera desde hace 14 minutos | Ingresa usuario y contraseña correctos | No entra. A los 15 minutos, con los datos correctos, entra |
| CA-01.4 | RN-19 | La secretaria lleva 3 intentos fallidos | Ingresa bien | Entra y el conteo vuelve a cero |

### 18.2 PR-01 · Publicar horarios de un médico — `agenda-consultorio`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-01.5 | RN-20, RN-21, RN-22 | El Médico 1 de Medicina general no tiene turnos el martes | La secretaria publica el martes de 8:00 a 12:00 con turnos de 30 minutos | Se publican 8 turnos libres; el resumen indica 8 turnos y 0 minutos sobrantes; los familiares ven esos turnos en Medicina general, cada uno con el nombre del Médico 1 |
| CA-01.6 | RN-22 | Igual que CA-01.5 | Publica de 8:00 a 12:00 con turnos de 45 minutos | Se publican 5 turnos (8:00, 8:45, 9:30, 10:15 y 11:00) y el resumen indica que sobraron 15 minutos |
| CA-01.7 | RN-22; B5 | — | Publica de 8:00 a 8:30 con turnos de 45 minutos | No se publica ningún turno y el producto indica que no entra ninguno |
| CA-01.8 | RN-21 | — | La secretaria elige la duración | Solo puede elegir 15, 20, 30, 45 o 60 minutos |
| CA-01.9 | RN-23 | Hoy son las 10:00 | Publica para hoy de 8:00 a 12:00 con turnos de 30 minutos | Se publican 10:30, 11:00 y 11:30, y el producto informa que 5 turnos no se publicaron porque ya empezaron |
| CA-01.10 | RN-23; B2 | — | Intenta publicar para un día anterior a hoy, o con la hora de fin igual o anterior a la de inicio, o sin duración | El producto indica qué corregir y no publica nada |
| CA-01.11 | RN-24; B1 | El Médico 1 ya tiene turnos de 8:00 a 10:00 de 30 minutos ese día | Publica de 9:00 a 12:00 con turnos de 45 minutos | Se publican 10:30 y 11:15; el producto informa que 9:00 y 9:45 no se publicaron por superponerse; los turnos que ya existían no cambian |
| CA-01.12 | RN-25; B3 | El turno del martes a las 11:30 está libre | La secretaria lo quita | Deja de aparecer para los familiares |
| CA-01.13 | RN-25; B4 | El turno del martes a las 10:00 tiene cita | La secretaria intenta quitarlo | El producto no lo permite, informa que está reservado y la cita sigue igual |
| CA-01.14 | RN-25; B7 | Un familiar eligió el turno de las 11:30 y está llenando los datos | La secretaria quita ese turno y luego el familiar confirma | No se registra la cita; el familiar ve que ese horario ya no está disponible y los horarios libres restantes |
| CA-01.15 | RN-20, RN-21, RN-22, RN-04 | Es lunes a las 8:00 y el Dr. Andrade, de Cardiología, no tiene turnos el miércoles por la tarde | La secretaria publica el miércoles de 14:00 a 17:30 con turnos de 20 minutos | El resumen indica «10 turnos publicados, 10 minutos sobrantes», sin turnos descartados (de 14:00 a 17:00; el último termina a las 17:20); un familiar que reserva en Cardiología ve esos 10 turnos libres del miércoles con el nombre del Dr. Andrade, y la secretaria puede quitar los que sigan libres |
| CA-01.16 | RN-24; B1 (límite de superposición) | Después de CA-01.15 | La secretaria publica el mismo miércoles, con el Dr. Andrade, de 16:00 a 18:00 con turnos de 20 minutos | Se publican solo 17:20 y 17:40; el resumen indica «2 turnos publicados, 0 minutos sobrantes, 4 no publicados por superponerse» (16:00, 16:20, 16:40 y 17:00); el turno de las 17:20 se publica porque empieza justo cuando termina el anterior; los turnos que ya había no cambian |

### 18.3 PR-02 · Consultar citas reservadas — `agenda-consultorio`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-02.1 | RN-26 | — | La secretaria entra a «Citas» | Ve las citas confirmadas de hoy, ordenadas por hora |
| CA-02.2 | RN-26 | Lucía reservó para su abuela María el miércoles a las 11:30 con el Dr. Andrade, eligiendo correo | La secretaria ve el miércoles | La cita muestra 11:30, Dr. Andrade y Cardiología, María (no menor de edad), sin acompañante, y el nombre y teléfono de Lucía; no muestra el código, el correo ni el canal |
| CA-02.3 | RN-26 | — | La secretaria cambia de día o filtra por un médico | Solo se ven las citas de ese día o de ese médico |
| CA-02.4 | RN-27; C3 | Ese día hay citas de «José Pérez» y de «Josefina Ruiz» | Busca «jose perez» y luego «jose» | Con «jose perez» aparece José Pérez; con «jose» aparecen los dos, cada uno con hora y médico |
| CA-02.5 | RN-27; C2 | José Pérez tiene cita el jueves; la secretaria está viendo el miércoles | Busca «jose perez» | El producto indica que no hay coincidencias en ese día |
| CA-02.6 | C1 | El día elegido no tiene citas | — | El producto indica que no hay citas para ese día |
| CA-02.7 | RN-26 | Una cita fue cancelada y otra se cambió del jueves 15:30 con el Dr. Paredes al viernes 9:00 con la Dra. Salazar | — | La cancelada no aparece; la cambiada aparece el viernes a las 9:00 con la Dra. Salazar y ya no aparece el jueves |
| CA-02.8 | RN-28 | — | La secretaria intenta crear, cambiar o cancelar una cita desde la lista | La lista no ofrece esas acciones |
| CA-02.9 | C4 | El Médico 1 no podrá atender el martes | La secretaria ve el martes y filtra por el Médico 1 | Ve todas sus citas con el nombre y teléfono de cada familiar para llamarlos; ninguna cita se cancela desde el producto |

### 18.4 PR-03 · Reservar una cita — `reserva-cita`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-03.1 | RN-04, RN-08, RN-10, RN-11, RN-12, RN-13 | El martes a las 10:00 el Médico 1 de Medicina general tiene un turno libre; son las 8:00 de ese martes | Marcos elige Medicina general, el martes y las 10:00 con el Médico 1; ingresa a su papá (mayor de edad, sin acompañante), su propio nombre y apellido, el teléfono 0991234567 y elige WhatsApp; confirma | Sin crear cuenta, la cita queda confirmada sin intervención de la secretaria; la pantalla muestra especialidad, médico, día, hora, paciente y el código; llega un WhatsApp al 0991234567 con el código y los datos de la cita, incluido el médico; el turno deja de aparecer como libre; la cita aparece en la lista de la secretaria del martes |
| CA-03.2 | RN-04 | El miércoles no hay horarios libres en Medicina general | El familiar elige Medicina general | El miércoles aparece completo y no se puede elegir; al elegir otro día solo se ven horarios libres, cada uno con su médico |
| CA-03.3 | RN-04 | El jueves a las 10:00 están libres el Médico 1 y el Médico 2, ambos de Medicina general | El familiar elige el jueves | Aparecen dos opciones de las 10:00, una con cada médico, y el familiar elige una |
| CA-03.4 | RN-01; A2 | Mientras el familiar llenaba los datos, otra persona reservó el mismo turno | Confirma | El producto informa que el horario ya fue reservado, no registra la cita y muestra los horarios libres restantes |
| CA-03.5 | RN-14; A4 | El turno de Pediatría del jueves a las 16:00 está libre; Pedro marca que su hijo Mateo, de 9 años, es menor de edad, llena los datos de Mateo y los suyos, pero no agrega acompañante | Confirma | El producto indica que faltan los datos del acompañante, obligatorios porque Mateo es menor, y no registra la cita; el turno sigue libre, no se genera código, no se envía ningún mensaje y la cita no aparece en la lista de la secretaria. Al agregar el nombre y apellido del acompañante y confirmar de nuevo, la cita se registra; si el turno se ocupó mientras tanto, aplica A2 |
| CA-03.6 | RN-14 | El paciente es mayor de edad y no se agrega acompañante | El familiar confirma | La cita se registra sin acompañante |
| CA-03.7 | RN-15; A3 (límites del teléfono) | El resto de los datos es válido | El familiar confirma con el teléfono 099123456, luego 09912345678, luego 0891234567 y luego 09912a4567 | En cada caso el producto indica que el teléfono no es válido y no registra la cita; con 0991234567 la cita se registra |
| CA-03.8 | RN-15; A3 (correo) | El familiar eligió recibir los mensajes por correo | Confirma con «rosa.correo.com» y luego sin correo | En ambos casos el producto indica que debe corregir el correo y no registra la cita; con «rosa@correo.com» la cita se registra. Si elige WhatsApp, no se le pide correo |
| CA-03.9 | RN-15; A3 | Falta el nombre y apellido del paciente o el del familiar | El familiar confirma | El producto indica qué dato falta y no registra la cita |
| CA-03.10 | RN-10; A6 (límite de tiempo) | El turno de las 10:00 está libre | — | A las 9:55 el turno aparece y se puede reservar; a las 10:00 ya no aparece; si el familiar lo eligió a las 9:58 y confirma a las 10:01, el producto informa que ese horario ya no se puede reservar y no registra la cita |
| CA-03.11 | RN-09, RN-13; A5 | El mensaje de confirmación no se puede enviar | El familiar confirma | La cita queda confirmada, el código se muestra en pantalla y el producto avisa que no pudo enviar el mensaje y que anote el código |
| CA-03.12 | RN-16 | El papá de Marcos ya tiene una cita el martes a las 10:00 en Medicina general | Marcos le reserva Cardiología el martes a las 10:00 | La segunda cita también se registra, con su propio código |
| CA-03.13 | A1 | Ninguna especialidad tiene turnos que se puedan reservar | El familiar entra a «Reservar cita» | El producto informa que por ahora no hay horarios libres |
| CA-03.14 | A7 | El familiar eligió un turno y llenó parte de los datos | Sale sin confirmar | No se registra ninguna cita y el turno sigue libre |
| CA-03.15 | RN-04, RN-08, RN-13, RN-15; D51 | Es lunes a las 19:00; el martes de Cardiología está completo y el miércoles a las 11:30 el Dr. Andrade tiene un turno libre | Lucía reserva para su abuela María (82 años, mayor de edad, sin acompañante) el miércoles a las 11:30 con el Dr. Andrade; deja su nombre y apellido, el teléfono 0991234567, elige correo y escribe su correo; confirma | El martes aparece completo y no se puede elegir; la cita queda confirmada sin intervención de nadie; la pantalla muestra el código; a Lucía le llega un correo con la confirmación y el código; en la lista de la secretaria la cita aparece el miércoles a las 11:30 con el Dr. Andrade, con el nombre de la abuela y el nombre y teléfono de Lucía, sin su correo |

### 18.5 PR-04 · Consultar una cita con su código — `gestion-cita-codigo`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-04.1 | RN-02, RN-07 | Hay una cita confirmada el martes a las 10:00 con el Médico 1 en Medicina general y son las 8:00 de ese martes | El familiar ingresa su código en «Mi cita» | Ve especialidad, médico, día, hora, paciente y acompañante (si lo hay), y se le ofrecen «Cancelar» y «Cambiar», sin pedirle cuenta ni inicio de sesión |
| CA-04.2 | RN-07; E1 | El código no corresponde a ninguna cita | El familiar lo ingresa | El producto indica que no encuentra una cita con ese código, no muestra datos de ninguna cita y permite reintentar |
| CA-04.3 | RN-02; E2 | La cita era el martes a las 10:00 y ya son las 10:00 o más tarde | El familiar ingresa su código | La cita se muestra como pasada y no se ofrecen «Cancelar» ni «Cambiar» |
| CA-04.4 | RN-07; E3 | La cita fue cancelada | El familiar ingresa su código | El producto indica que la cita fue cancelada y no ofrece opciones |

### 18.6 PR-05 · Cancelar una cita — `gestion-cita-codigo`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-05.1 | RN-01, RN-02, RN-08 | Cita confirmada el martes a las 10:00 con el Médico 1; son las 9:59 | El familiar elige «Cancelar» y confirma | El producto muestra que la cita fue cancelada; el turno del martes a las 10:00 con el Médico 1 vuelve a estar libre para otras reservas; la cita ya no aparece en la lista de la secretaria; el familiar recibe un aviso de cancelación por el canal que eligió al reservar |
| CA-05.2 | CN1 | El producto pide confirmar la cancelación | El familiar no confirma | La cita sigue confirmada y el turno sigue ocupado |
| CA-05.3 | RN-09; CN3 | El aviso de cancelación no se puede enviar | El familiar confirma la cancelación | La cita queda cancelada igual y el producto avisa en pantalla que no pudo enviar el aviso |
| CA-05.4 | RN-02; CN4 | Cita del jueves a las 15:30; el familiar abrió «Mi cita» y eligió «Cancelar» a las 15:28 | Confirma a las 15:31 | El producto indica que la cita ya pasó y no la cancela; el turno sigue ocupado, el código sigue mostrando la cita, la lista de la secretaria no cambia y no se envía ningún aviso |

### 18.7 PR-06 · Cambiar una cita — `gestion-cita-codigo`

| Criterio | Reglas / alternativa | Condición | Acción | Resultado esperado |
|---|---|---|---|---|
| CA-06.1 | RN-04, RN-05 | La cita es de Medicina general; el miércoles no hay horarios libres de Medicina general; Cardiología sí tiene horarios libres | El familiar elige «Cambiar» | Solo ve días de Medicina general; el miércoles aparece completo y no se puede elegir; al elegir un día ve solo horarios libres, cada uno con su médico; no aparece ningún horario de Cardiología |
| CA-06.2 | RN-01, RN-05, RN-06, RN-08 | Cita el martes a las 10:00 con el Médico 1; el jueves a las 11:00 el Médico 2, de la misma especialidad, está libre; la hora de la cita no llegó | El familiar elige el jueves a las 11:00, ve que es con el Médico 2 y confirma | Con el mismo código ve la cita del jueves a las 11:00 con el Médico 2; el martes a las 10:00 con el Médico 1 vuelve a estar libre; el jueves a las 11:00 deja de estar libre; en la lista de la secretaria la cita aparece el jueves a las 11:00 con el Médico 2; el familiar recibe un aviso con el nuevo día, hora y médico; los datos del paciente y del acompañante siguen iguales |
| CA-06.3 | RN-01, RN-06; F1 | Mientras el familiar cambiaba, otra persona reservó el jueves a las 11:00 | El familiar confirma el cambio | El producto informa que ese horario ya no está libre y la cita sigue el martes a las 10:00 con el Médico 1 |
| CA-06.4 | F2 | El producto pide confirmar el cambio | El familiar no confirma | La cita sigue igual |
| CA-06.5 | F3 | No hay otros horarios libres en la especialidad de la cita | El familiar elige «Cambiar» | El producto informa que no hay otros horarios libres y la cita sigue igual |
| CA-06.6 | RN-03 | La cita ya se cambió dos veces y su hora de inicio no llegó | El familiar elige «Cambiar» otra vez | El producto lo permite igual que la primera vez |
| CA-06.7 | RN-09; F5 | El aviso del cambio no se puede enviar | El familiar confirma el cambio | El cambio se mantiene y el producto avisa en pantalla que no pudo enviar el aviso |
| CA-06.8 | RN-02; F6 | Cita de Pediatría del jueves a las 15:30; el familiar empezó el cambio a las 15:28 y eligió el viernes a las 9:00 | Confirma a las 15:31 | El producto indica que la cita ya pasó y no hace ningún cambio; la cita sigue el jueves a las 15:30, el viernes a las 9:00 sigue libre, el código y la lista de la secretaria no cambian y no se envía ningún aviso |

## 19. Relación entre casos, procesos, reglas y criterios

| Caso de uso | Proceso | Reglas | Datos o estados relevantes | Criterios de aceptación | Especificación fuente |
|---|---|---|---|---|---|
| (condición previa) Ingreso de la secretaria — de `publicar-horarios` y `consultar-citas` | Ingreso de la secretaria (común a PR-01 y PR-02) | RN-18, RN-19 | Usuario y contraseña; intentos fallidos seguidos y fin de la espera; ingreso sin ingresar / ingresada / en espera | CA-01.1 a CA-01.4 | `agenda-consultorio` (`docs/specs/agenda-consultorio.md`) |
| `publicar-horarios` | PR-01 | RN-01, RN-02, RN-10, RN-18, RN-19, RN-20, RN-21, RN-22, RN-23, RN-24, RN-25 | Médico, día, hora de inicio y de fin, duración; resumen de la publicación; turno libre / ocupado / quitado | CA-01.5 a CA-01.16 | `agenda-consultorio` (`docs/specs/agenda-consultorio.md`) |
| `consultar-citas` | PR-02 | RN-17, RN-18, RN-19, RN-26, RN-27, RN-28 | Día de la lista, filtro por médico, texto de búsqueda; datos de cada cita (RN-26); solo citas confirmadas | CA-02.1 a CA-02.9 | `agenda-consultorio` (`docs/specs/agenda-consultorio.md`) |
| `reservar-cita` | PR-03 | RN-01, RN-02, RN-04, RN-07, RN-08, RN-09, RN-10, RN-11, RN-12, RN-13, RN-14, RN-15, RN-16, RN-17, RN-25 | Especialidad; día, horario y médico; paciente y si es menor de edad; acompañante; nombre, teléfono, canal y correo del familiar; código; cita confirmada; turno libre → ocupado | CA-03.1 a CA-03.15; también CA-01.14 (B7) | `reserva-cita` (`docs/specs/reserva-cita.md`), con reglas de `gestion-cita-codigo` |
| `consultar-cita-codigo` | PR-04 | RN-02, RN-07 | Código; datos de la cita con su médico; cita confirmada / cancelada / pasada; hora actual | CA-04.1 a CA-04.4 | `gestion-cita-codigo` (`docs/specs/gestion-cita-codigo.md`) |
| `cancelar-cita` | PR-05 | RN-01, RN-02, RN-07, RN-08, RN-09; efecto en la lista: RN-26 | Confirmación del familiar; cita confirmada → cancelada; turno ocupado → libre; hora actual | CA-05.1 a CA-05.4; efecto en la lista: CA-02.7 | `gestion-cita-codigo` (`docs/specs/gestion-cita-codigo.md`) |
| `cambiar-cita` | PR-06 | RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-07, RN-08, RN-09; efecto en la lista: RN-26 | Nuevo día, horario y médico; confirmación; cita confirmada → confirmada en otro turno; turno nuevo ocupado y anterior libre; mismo código | CA-06.1 a CA-06.8; efecto en la lista: CA-02.7 | `gestion-cita-codigo` (`docs/specs/gestion-cita-codigo.md`) |

## 20. Cambios respecto de la primera entrega

La entrega de la fase 1 (versión 1.0) se conserva sin cambios como versión histórica. Esta tabla resume qué cambió desde entonces y por qué.

| Qué cambió | Cómo se describía antes (fase 1) | Decisión actual | Por qué cambió | Fuentes afectadas | Tipo |
|---|---|---|---|---|---|
| Organización de los documentos | Solo seis casos de uso, sin especificaciones | Tres especificaciones por actor y momento, con numeración común: `agenda-consultorio` (PR-01, PR-02; RN-18 a RN-28), `reserva-cita` (PR-03; RN-10 a RN-17) y `gestion-cita-codigo` (PR-04 a PR-06; RN-01 a RN-09) (D33) | Coincide con las secciones ya definidas; cada documento queda de un tamaño revisable y las reglas compartidas se escriben una vez (motivo del autor) | Las tres especificaciones; secciones 11 a 19 | Precisión de regla (organización; no cambia el alcance) |
| Plazo para cancelar o cambiar | «Solo antes de la hora de la cita; un posible límite de anticipación se definirá en la fase 2» (R1 de `cancelar-cita`) | Hasta la hora de inicio, sin anticipación mínima; cuenta la hora en que el familiar confirma (RN-02, CN4, F6) (D34, D41) | Que la persona no se estrese y siempre tenga una salida; el ejemplo del autor fijó el límite exacto | `gestion-cita-codigo`; fichas 7.4 a 7.6 | Precisión de regla |
| Límite de cambios | Pregunta abierta en `cambiar-cita` | Sin límite de cambios (RN-03) (D35) | Accesible y sin reglas ni datos nuevos (motivo del autor) | `gestion-cita-codigo` | Precisión de regla |
| Plazo para reservar | No estaba definido: solo se mostraban horarios libres | Se puede reservar hasta la hora de inicio; cuenta la hora en que se confirma (RN-10, A6) (D47) | Una sola regla de tiempo para reservar, cancelar y cambiar | `reserva-cita` | Precisión de regla |
| Médico visible | Pregunta abierta; la cita mostraba especialidad, día y hora | El médico aparece junto a cada horario libre, en la confirmación, en el mensaje y en «Mi cita» (RN-04, RN-13, PR-04) (D36) | Los turnos ya se publican por médico; no hace falta inventar una regla de asignación | `reserva-cita`, `gestion-cita-codigo`; secciones 4 y 6 | Precisión de regla |
| Cambio de médico al cambiar una cita | «Solo se cambian el día y la hora, dentro de la misma especialidad» | Puede elegir un horario de cualquier médico de la misma especialidad; lo ve antes de confirmar y el aviso lo incluye (RN-05, RN-08) (D37) | Coincide con «misma especialidad» del caso aprobado y da más opciones; no modifica el caso | `gestion-cita-codigo`; secciones 5 y 6 | Precisión de regla |
| Código en pantalla | Pregunta abierta; el código llegaba por mensaje | El código se muestra en pantalla al confirmar y también se envía por mensaje (RN-13) (D38) | Que «Mi cita» no dependa de un solo canal | `reserva-cita`; condición previa de PR-04 | Precisión de regla |
| Mensaje que no se puede enviar | A5 de `reservar-cita`: «comportamiento pendiente de decisión»; preguntas abiertas en `cancelar-cita` y `cambiar-cita` | La operación se mantiene y el producto avisa en pantalla; en la reserva recuerda anotar el código (RN-09; A5, CN3, F5) (D39) | La cita debe quedar confirmada al instante (D3) y siempre debe haber una salida | `reserva-cita`, `gestion-cita-codigo`; fichas 7.1, 7.5, 7.6 | Precisión de regla |
| Código perdido | Pregunta abierta | Sin recuperación ni reenvío en esta versión (D40) | Perderlo exige perder pantalla y mensaje a la vez; no se amplía el alcance con un caso nuevo | `gestion-cita-codigo`, `reserva-cita`; sección 5 | Modificación del alcance (nueva exclusión) |
| Datos que se piden | «Datos del paciente», «datos del acompañante» y «contacto», sin detalle; pregunta abierta | Paciente: nombre y apellido y si es menor de edad. Acompañante: nombre y apellido. Familiar: nombre y apellido (obligatorio), teléfono celular siempre, canal y correo solo si elige correo. Solo se revisa el formato (RN-14, RN-15) (D43, D44, D45, D46, D50) | Solo se piden los datos que usa alguna regla o persona del consultorio (motivo del autor) | `reserva-cita`; secciones 3, 6 y 13 | Precisión de regla |
| Lo que ve la secretaria del familiar | «Contacto del familiar» (`consultar-citas`, paso 4, C4 y CA4) | Solo el nombre y el teléfono del familiar; no ve el correo, el canal ni el código (RN-26) (D51); si un médico falta, lo llama (C4) | La secretaria ve lo mínimo que necesita para llamar | `reserva-cita`, `agenda-consultorio`; secciones 6 y 13 | Precisión de regla |
| Verificación del contacto y tipo de teléfono | No estaba definido | No se verifica el contacto con un código; no se aceptan teléfonos fijos ni de otros países (D46) | Ampliaba el alcance y chocaba con D39; el formato cubre los errores comunes | `reserva-cita`; sección 5 | Modificación del alcance (nuevas exclusiones) |
| Varias citas del mismo paciente | No estaba definido | Cada reserva es independiente; no se limita cuántas citas tiene un paciente (RN-16) (D48) | Con solo el nombre no se puede reconocer de verdad al mismo paciente | `reserva-cita`; sección 5 | Modificación del alcance (nueva exclusión) |
| Condición previa de contacto de `reservar-cita` | «El familiar dispone de un correo electrónico o de un número con WhatsApp. (D6, D16)» | «El familiar dispone de un teléfono celular y, si elige recibir los mensajes por correo electrónico, también de un correo. Si elige WhatsApp, los mensajes llegan a ese mismo celular. (D6, D16, D45, D49)». El caso pasó de aprobado a borrador, se corrigió solo esa condición y el autor lo aprobó de nuevo (revisión 2026-11-09T04:44:52.623Z) (D49) | Contradecía D45: un familiar con solo correo podía reservar según el caso y no según la especificación. El autor prefirió corregir el caso de forma explícita antes que dejar la contradicción o cambiar su decisión | Caso `reservar-cita`; fichas 7.1; sección 3 | Modificación del alcance (condición previa de un caso aprobado) |
| Rango que no se divide exacto y duraciones | Preguntas abiertas en `publicar-horarios`; «falta la duración» como único error de duración | Solo turnos completos; se informan los minutos sobrantes; duración de una lista fija de 15, 20, 30, 45 y 60 minutos (RN-21, RN-22, B5) (D52, D53) | Todos los turnos duran lo mismo y la secretaria no hace cuentas; elegir de una lista es rápido y sin errores de tipeo | `agenda-consultorio`; secciones 5, 6 y 16 | Precisión de regla y modificación del alcance (exclusión de otras duraciones) |
| Publicar varios días | Pregunta abierta | Un día por vez (RN-20) (D54) | Cada publicación es simple; repetirla es un costo aceptado | `agenda-consultorio`; sección 5 | Modificación del alcance (nueva exclusión) |
| Publicación para hoy | No estaba definido | Solo se publican los turnos que no empezaron y se informa cuántos no (RN-23, B6) (D55) | Coherente con RN-10; la secretaria no tiene que corregir nada. La IA corrigió su ejemplo de las 10:00 | `agenda-consultorio`; sección 16 | Precisión de regla |
| Superposición y datos inválidos al publicar | B1: «no publica los turnos superpuestos»; B2: día pasado, hora de fin anterior a la de inicio o falta la duración | B1 es una publicación parcial y un turno que empieza justo cuando termina otro no se superpone (RN-24) (D59). B2 también rechaza la hora de fin igual a la de inicio y la falta de médico, día u horas. Se agregan B5 a B8 y el resumen de cada publicación | El ejemplo del autor confirmó la lectura de B1 y fijó el límite; B2 y B5 a B8 los redactó la IA y el autor los aprobó sin cambios | `agenda-consultorio`; secciones 11, 16 y 17 | Precisión de regla |
| Ingreso de la secretaria | «Entra con su usuario y contraseña», sin más detalle | Mensaje «usuario o contraseña incorrectos» sin decir cuál falla; 5 intentos fallidos seguidos → espera de 15 minutos sin aceptar ningún intento; el conteo vuelve a cero al terminar la espera o con un ingreso correcto (RN-19) (D56, D57). «Administrar cuentas» incluye desbloquear, recuperar o cambiar la contraseña | Protege los datos de los pacientes sin que nadie tenga que desbloquear la cuenta | `agenda-consultorio`; secciones 3, 5, 6 y 15 | Precisión de regla |
| Búsqueda por nombre | «Busca por el nombre del paciente» sobre el día visto | Coincide si el texto aparece en cualquier parte del nombre y apellido, sin importar mayúsculas ni tildes (RN-27) (D58) | Los nombres se escriben distinto y en recepción hay que encontrar al paciente rápido | `agenda-consultorio`; secciones 6 y 9 | Precisión de regla |
| Alternativas nuevas de la reserva | A1 solo para «sin horarios en la especialidad»; no existían A6 ni A7 | A1 distingue «ninguna especialidad con turnos» de «la especialidad elegida se quedó sin horarios»; A6 (la hora llega antes de confirmar) y A7 (sale sin confirmar); «menor de edad» = menos de 18 años | Los redactó la IA para revisión; el autor los aprobó sin cambios | `reserva-cita`; secciones 11 y 17 | Precisión de regla |
| Preguntas abiertas de los casos | Los casos listaban preguntas abiertas | Los casos no se modifican (salvo D49); en la sección 7 cada pregunta se marca «resuelta en Dxx / RN-xx» (D42) | Mantener lo aprobado (D32) y no volver a aprobar varios casos | Sección 7 | Corrección de redacción (marcas en la entrega; los casos no cambian) |
| Sección 6 | Seis secciones con su contenido de la fase 1 | Las mismas seis secciones, con lo que ahora muestra y permite cada una según las especificaciones | Reflejar D36, D38, D43 a D46, D51, D53, D56 a D58 | Sección 6 | Corrección de redacción |
| Sección 9 | Texto del autor sobre la fase 1 | Texto nuevo del autor sobre la fase 2 (herramienta, regla precisada, alternativas, ejemplos, qué cambió y qué sigue sin validar) | La consigna de la fase 2 pide una explicación propia de esta fase | Sección 9 | Corrección de redacción |
| Redacción de las especificaciones | Frases desactualizadas al cerrar la fase 2 (por ejemplo, «RN-02 … cuenta la hora de inicio» en `agenda-consultorio`) | Corregidas sin cambiar reglas; las tres especificaciones aprobadas de nuevo (D60) | Evitar dos textos para la misma regla (motivo del autor) | `gestion-cita-codigo`, `reserva-cita`, `agenda-consultorio`; sección 10 | Corrección de redacción |

**Se mantuvo sin cambios:**

- Todo lo aprobado en la fase 1 que no figura en la tabla anterior (D32): actores, objetivo central, seis casos de uso y seis secciones.
- La sección 2 (problema, contexto y supuestos S1–S3).
- Los casos `publicar-horarios`, `consultar-citas`, `consultar-cita-codigo`, `cancelar-cita` y `cambiar-cita`, que siguen aprobados con su contenido de la fase 1; las precisiones están en las especificaciones.
- La entrega de la fase 1 (versión 1.0), que se conserva sin cambios como versión histórica.
