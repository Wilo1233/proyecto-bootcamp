# Registro del proceso — Fase 1

Registro de decisiones y comprobaciones reales. Cada decisión distingue lo que **propuso el agente (IA)** de lo que **eligió y justificó el estudiante**. Las preguntas y propuestas pendientes se listan aparte y no son decisiones.

## Identificación (datos aportados por el estudiante)

- **Producto:** Consultorio Médico Privado (texto del estudiante: «Consultorio Medico Privado»).
- **Autor:** Wilson Ortiz (trabajo individual).
- **Cohorte:** «corte CB PFSD4 VI Cohorte Frontend React».
- **Entrega:** Fase 1 · Definición funcional.

## Herramientas

- Agente: Claude Code, usado dentro del editor Cursor (dato aportado por el estudiante), con el harness de AHK de este proyecto.

## Comprobaciones del entorno

### Ejecutadas por el agente el 2026-10-27, antes de iniciar el diseño

| Comprobación | Resultado | Límite |
|---|---|---|
| `ahk --version` | 3.0.0 | Confirma solo la versión del CLI. |
| `node --version` / `pnpm --version` | v22.23.4 / 11.17.0 | Confirma las herramientas de la cohorte. |
| Configuración local | `agent-harness-kit.config.json` en la raíz; proveedor `claude-code`; `docsPath: ./docs`; almacenamiento `local`; health → `./health.bat` | No prueba la conexión MCP. |
| `health.bat` | Su contenido coincide con la sección 4.4 de la consigna. | El agente no lo ejecutó. |
| Skill `ahk-use-case` | `SKILL.md`, `resources/workflow.md` y `resources/template.md` legibles. | — |
| MCP `specs.list` | Llamada real: lista vacía, sin diagnósticos. | Prueba la conexión, no las decisiones del producto. |
| `ahk doctor` (vía MCP) | Agentes y skills completos. Aviso: existe AHK 3.3.0; no se actualiza porque la consigna exige 3.0.0. | Diagnóstico del entorno. |

### Ejecutadas por el estudiante el 2026-10-27 (terminal de VS Code, PowerShell)

El estudiante compartió capturas de la terminal y del navegador; aquí se transcriben los resultados.

| Comprobación | Resultado | Límite |
|---|---|---|
| `ahk --version` | `3.0.0` | Confirma la versión del CLI. |
| `ahk doctor` | lib version: aviso «3.0.0 → 3.3.0 available»; agent files: «all present»; harness skills: «all present and up to date». No se actualizó, porque la consigna exige 3.0.0. | Diagnóstico del entorno; no prueba las decisiones del producto. |
| `ahk health` | **Falló.** Validó `.claude\agents\*.md`, `.harness\harness.db` y `.mcp.json`, pero al invocar el script mostró: `"\"%USERPROFILE%\Downloads\proyecto-bootcamp\health.bat\"" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.` A través de AHK no se llegó a ejecutar `pnpm build`. | Hipótesis sin confirmar: AHK 3.0.0 escapa mal la ruta del `.bat` al llamar a cmd en Windows. Pendiente de consultar al docente. No se cambió la versión ni la configuración del harness. |
| `.\health.bat` (diagnóstico, ejecutado directamente, sin AHK) | `tsc -b && vite build` terminó bien: «vite v8.2.2 building client environment for production… ✓ 20 modules transformed… ✓ built in 133ms». | Demuestra que el build de la plantilla funciona. **No** reemplaza a `ahk health`, que sigue registrado como fallido. |
| `pnpm dev` y navegador | Se mostró la plantilla de Vite + React («Get started», botón «Count is 0»). | Confirma el arranque inicial de React; no prueba funcionalidades del producto. |
| Lectura final de `docs/entregas/fase-01.md` | El estudiante confirmó: «sí, lo leí completo». | Comprueba títulos, referencias y coherencia; no valida el producto con usuarios. |

## Idea inicial (texto del estudiante, sin editar)

> Quiero hacer un consultorio medico privado sencillo para que no tengan muchas complicaciones.
> La viven los chicos y adultos mayores, para que sea facil guiarse.
> Para poder sacar citas medicas de una manera sencilla y que les llegue el mensaje en ese instante o mediante correo o celular.
> La velocidad que viajan los datos para poder realizar sin problemas citas medicas

Observaciones del agente sobre la idea: no indica cómo se resuelve hoy la situación (pendiente para la sección 2). «La velocidad de los datos» es un aspecto técnico de la fase 3; en esta fase se expresa como resultado observable («el mensaje se envía en el momento de confirmar»).

## Decisiones confirmadas

### D1 — ¿Quién saca la cita en la aplicación?

- **Alternativas propuestas por el agente:** A) el propio paciente; B) un familiar responsable; C) ambos; D) la recepcionista del consultorio.
- **Elección del estudiante:** B — un familiar responsable reserva por el paciente.
- **Motivo (palabras del estudiante):** «porque los chicos o adultos mayores no conocen bien el uso de la pagina, mientras que un padre de familia la sabra manejar con mejor precision.»
- **Consecuencia señalada por el agente:** quien usa la página es el familiar; el paciente solo recibe la atención. La sencillez se mantiene, pero aplicada al familiar.
- **Casos afectados:** Reservar, Cancelar, Consultar con código, Cambiar.

### D2 — ¿Quién maneja la agenda del consultorio?

- **Alternativas propuestas por el agente:** A) secretaria o recepcionista; B) el propio médico; C) nadie en esta versión (horarios ya cargados).
- **Elección del estudiante:** A — la secretaria.
- **Motivo (palabras del estudiante):** «La secretaria se encargara de asignar las citas ya que los medicos siempre estan ocupados con demas pacientes»
- **Consecuencia:** el médico no usa la aplicación; aparece como dato, no como actor.
- **Contradicción detectada por el agente:** «asignar las citas» chocaba con D1 (reserva el familiar). Se resolvió en D3.
- **Casos afectados:** Publicar horarios, Consultar citas reservadas.

### D3 — ¿Cómo queda confirmada una cita?

- **Alternativas propuestas por el agente:** A) reserva directa con confirmación inmediata; B) solicitud que la secretaria confirma o rechaza; C) la secretaria asigna fecha y hora.
- **Elección del estudiante:** A — reserva directa.
- **Motivo (palabras del estudiante):** «Porque es importante que el familiar eliga para que tengan tiempo y planear bien las fechas»
- **Consecuencia:** la secretaria publica horarios y ve las citas; no asigna ni aprueba.
- **Casos afectados:** Reservar, Publicar horarios, Consultar citas reservadas.

### D4 — Alcance de la versión inicial

- **Propuesta del agente:** tres casos derivados de D1–D3 (Reservar, Publicar horarios, Consultar citas reservadas) y tres opcionales (Cancelar, Ver próximas citas, Cambiar una cita).
- **Elección del estudiante:** incluir los seis.
- **Motivo (palabras del estudiante):** «ya que siempre es importante la decision del cliente el cancelar las citas o ver las proximas para que no pierdan su cita o cambiar las fechas por algun percance que les haya sucedido.»
- **Observación del agente:** con esta decisión no quedaba ninguna exclusión; la sección 9 exige justificar al menos una. Se resolvió después con D18, D20 y D21 (ver «Exclusiones de la versión inicial»).

### D5 — ¿Cómo se identifica el familiar?

- **Alternativas propuestas por el agente:** A) cuenta propia con contraseña; B) sin cuenta, con un código de reserva por cita; C) sin cuenta, con un código de acceso enviado en el momento.
- **Elección del estudiante:** B — sin cuenta, con código de reserva.
- **Motivo (palabras del estudiante):** «Porque es una manera rapida y segura, y tener un codigo de respaldo es mejor que estar complicandose creando una sesion»
- **Consecuencia señalada por el agente:** el caso «Ver mis próximas citas» pasaría a ser «Consultar una cita con su código» (propuesta pendiente de revisión). El mensaje se vuelve clave porque contiene el código.
- **Casos afectados:** Reservar, Cancelar, Consultar con código, Cambiar.

### D6 — ¿Por dónde llega el mensaje de confirmación?

- **Alternativas propuestas por el agente:** A) solo correo; B) solo celular (SMS o WhatsApp); C) el familiar elige.
- **Elección del estudiante:** C — el familiar elige correo o celular.
- **Motivo (palabras del estudiante):** «La C. es la mejor forma para que el Familiar tenga el control de los datos»
- **Consecuencia:** aparece un actor externo, el servicio de mensajes. Cuál servicio usar se decide en la fase 3.
- **Casos afectados:** Reservar (y posiblemente Cancelar y Cambiar, pendiente).

### D7 — ¿Qué elige el familiar antes del horario?

- **Alternativas propuestas por el agente:** A) un solo médico, solo día y hora; B) elige el médico; C) elige la especialidad.
- **Elección del estudiante:** C — la especialidad.
- **Motivo (palabras del estudiante):** «Ya que es necesario saber en que especialidad se va a realizar la cita»
- **Contradicción detectada por el agente:** la opción A chocaba con «los médicos» (plural) de D2.
- **Casos afectados:** Reservar, Publicar horarios.

## Revisión del caso «Reservar una cita» — ejemplo del estudiante (texto sin editar)

> Pongamos un caso, un padre de familia pide cita medica hacia su padre mayor de edad, busca la especialidad que necesita, una consulta general por ejemplo y ahi aparecen los horarios en tiempo real, si el dia esta ocupado se marca con una casilla roja y las disponibles estan en blancas, pero solo cuando los horarios del dia esten completos, cuando registra la cita llena los datos del paciente y marcar si es mayor de edad o no y poner los datos del familiar si viene acompañado para poder avisarle al responsable, una vez que eliga donde reciba el mensaje ya sea via correo electronico o mensaje de whatsapp, apenas mande la cita, el equipo revisa si esta disponible y mandan el mensaje con el codigo respectivo

Diferencias detectadas por el agente al comparar el ejemplo con el borrador `reservar-cita`:

1. «el equipo revisa» frente a la confirmación inmediata (D3) → resuelta en D8.
2. Calendario por días → resuelta en D9.
3. Marca «mayor de edad» → pendiente.
4. Datos del familiar «si viene acompañado» → resuelta en D10; originó D11 y una contradicción pendiente sobre quién recibe el código.
5. «Celular» como WhatsApp → pendiente.

### D8 — Aclaración: ¿quién revisa la disponibilidad al enviar la cita?

- **Alternativas propuestas por el agente:** A) el sistema lo comprueba automáticamente; B) una persona (la secretaria) revisa cada cita.
- **Elección del estudiante:** A — el sistema.
- **Motivo (palabras del estudiante):** «Porque el sistema como esta constantemente actualizando los horarios disponibles asi que no hay necesidad de que una secretaria lo revise»
- **Consecuencia:** D3 se mantiene. Si el horario se ocupó mientras tanto, aplica la alternativa A2 del caso Reservar.
- **Casos afectados:** Reservar.

### D9 — ¿Cómo se muestran los días y horarios?

- **Redacción propuesta por el agente (el estudiante no la corrigió):** el producto muestra los días de la especialidad; los días sin ningún horario libre se marcan como completos y no se pueden elegir; al elegir un día con horarios libres, se muestran sus horarios.
- **Alternativas para las horas ocupadas de un día:** A) solo se muestran las horas libres; B) se muestran todas, con las ocupadas marcadas.
- **Elección del estudiante:** A — solo las horas libres.
- **Motivo (palabras del estudiante):** «Para no sobrecargar informacion para el paciente»
- **Observación del agente:** quien ve la pantalla es el familiar (D1), no el paciente.
- **Idea de diseño para la fase 3 (no forma parte del caso de uso):** días completos en rojo y días disponibles en blanco.
- **Casos afectados:** Reservar (y posiblemente Cambiar).

### D10 — ¿Los datos del familiar o acompañante son obligatorios?

- **Alternativas propuestas por el agente:** A) el contacto del familiar siempre es obligatorio; B) obligatorio, más un acompañante opcional; C) opcionales: el paciente adulto puede ir solo.
- **Elección del estudiante:** C.
- **Motivo (palabras del estudiante):** «porque si desea ir solo se debe llenar solo el paciente, y si va acompañado que exista un boton que cuando se de click abre otra hoja de datos para que rellene el que va a acompañarlo»
- **Comportamiento para el caso de uso:** se pueden agregar, de forma opcional, los datos de un acompañante. El botón y la «otra hoja» son detalles de pantalla.
- **Consecuencia:** reabrió D1 (ver D11).

### D11 — ¿Quién puede reservar después de D10?

- **Alternativas propuestas por el agente:** A) se mantiene D1: siempre reserva un familiar (el texto de la opción decía que el código llega al paciente o al acompañante, según quién vaya); B) puede reservar el paciente adulto o un familiar.
- **Elección del estudiante:** A — siempre reserva un familiar.
- **Motivo (palabras del estudiante):** «Porque facilita al familiar»
- **Problema reconocido por el agente:** la opción A mezclaba dos decisiones (quién reserva y quién recibe el código). La parte «quién recibe el código» quedó en contradicción con D12 y está pendiente.
- **Estado:** la parte sobre quién recibe el código fue corregida por D13.
- **Casos afectados:** Reservar, Cancelar, Consultar con código, Cambiar.

### D12 — ¿«Retirar el código en el consultorio» entra en la versión inicial?

- **Idea original del estudiante:** «recoger el codigo dentro del hospital», diciendo su nombre en caja.
- **Alternativas propuestas por el agente:** A) entra como tercer canal; B) queda como mejora futura; C) se descarta.
- **Elección del estudiante:** A — entra en la versión inicial.
- **Motivo (palabras del estudiante):** «ya que es una opcion viable, pero tambien que se envie al correo y el familiar responsable pueda verlo, como los adultos mayores no saben pero los familiares si, pueden revisar ellos y si quieren cancelar lo pueden hacer»
- **Observaciones del agente:** el producto es un consultorio, no un hospital; no se definió quién entrega el código («caja»); sin el código no se puede cancelar, consultar ni cambiar la cita antes de ir.
- **Estado:** reemplazada por D14.
- **Casos afectados:** Reservar, Consultar citas reservadas, Cancelar, Consultar con código, Cambiar.

### Modo de trabajo desde D13

A pedido del estudiante de agilizar, desde D13 el agente presentó una recomendación por punto, con su motivo, y el estudiante la aceptó o la rechazó. En estas decisiones el motivo registrado es del agente, basado en decisiones previas del estudiante.

### D13 — ¿Quién recibe el código por mensaje?

- **Recomendación del agente:** solo el familiar que reserva, por el canal que elija (correo o WhatsApp).
- **Alternativa considerada:** que también lo reciban el paciente o el acompañante.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente, basado en D1, D11 y la respuesta a D12):** los familiares son quienes revisan y cancelan las citas.
- **Consecuencias:** corrige la parte de D11 sobre el destinatario del código; el contacto del familiar es obligatorio; el acompañante no recibe mensajes.
- **Casos afectados:** Reservar, Cancelar, Consultar con código, Cambiar.

### D14 — Reformulación de D12: identificación al llegar al consultorio

- **Recomendación del agente:** no hay tercer canal. Al llegar, el paciente dice su nombre en recepción y la secretaria busca su cita en la lista de citas reservadas.
- **Alternativa considerada:** mantener D12 como tercer canal («retirar el código en el consultorio»).
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** con D13 el familiar ya tiene el código. La reformulación conserva la idea del estudiante (el adulto mayor no necesita el código al llegar) sin ampliar el alcance.
- **Consecuencias:** D12 queda reemplazada; «caja» pasa a ser la recepción atendida por la secretaria; en «Consultar citas reservadas» la secretaria debe poder buscar por nombre del paciente.
- **Casos afectados:** Reservar, Consultar citas reservadas.

### D15 — ¿Para qué sirve la marca «mayor de edad»?

- **Recomendación del agente:** si el paciente es menor de edad, los datos del acompañante son obligatorios; si es mayor, son opcionales (D10).
- **Alternativa considerada:** no darle a la marca ningún efecto en el recorrido.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** un niño no debería ir solo a la consulta; así la marca tiene un efecto concreto.
- **Casos afectados:** Reservar (nueva alternativa A4) y posiblemente Cambiar.

### D16 — ¿«Celular» significa WhatsApp, SMS o ambos?

- **Recomendación del agente:** solo WhatsApp.
- **Alternativas consideradas:** SMS; ambos.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** coincide con el ejemplo del estudiante; un solo medio por canal reduce lo que hay que describir y construir.
- **Consecuencia:** el familiar elige entre correo electrónico o WhatsApp.
- **Casos afectados:** Reservar, Cancelar, Cambiar.

### D17 — Alternativas y regla propuestas por el agente para el caso Reservar

- **Propuestas:** A1 (sin horarios en la especialidad), A2 (horario tomado mientras se reservaba), A3 (datos incompletos o contacto inválido) y R5 (un horario solo puede tener una cita).
- **Respuesta del estudiante:** «si» (las cuatro aceptadas).
- **Casos afectados:** Reservar.

## Decisiones del caso «Publicar horarios disponibles»

Se mantiene el modo de trabajo desde D13: recomendación del agente y respuesta del estudiante.

### D18 — ¿Cómo entra la secretaria?

- **Recomendación del agente:** con su propio usuario y contraseña, como condición previa de los casos «Publicar horarios disponibles» y «Consultar citas reservadas» (no como caso separado).
- **Alternativa considerada:** sin protección (cualquiera podría publicar horarios o ver datos de pacientes).
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** proteger la agenda y los datos de los pacientes; el familiar sigue sin cuenta (D5).
- **Exclusión que acompaña la decisión:** crear o administrar cuentas del personal; se supone que la cuenta de la secretaria ya existe.
- **Casos afectados:** Publicar horarios, Consultar citas reservadas.

### D19 — ¿Cómo publica la secretaria los horarios?

- **Recomendación del agente:** por bloques. Elige médico, día, rango de horas y duración de cada cita; el sistema divide el rango en turnos.
- **Alternativa considerada:** publicar cada turno por separado.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** la tarea de la secretaria debe ser rápida, coherente con D2 (los médicos no tienen tiempo y la agenda la maneja ella).
- **Casos afectados:** Publicar horarios, Reservar.

### D20 — ¿De dónde salen los médicos y las especialidades?

- **Recomendación del agente:** la lista ya viene cargada en el producto.
- **Alternativa considerada:** que la secretaria pueda dar de alta, editar o quitar médicos y especialidades.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** en un consultorio privado los médicos cambian poco; administrarlos sería otro caso completo que no aporta al objetivo central.
- **Exclusión:** agregar, editar o quitar médicos y especialidades.
- **Casos afectados:** Publicar horarios, Reservar.

### D21 — ¿Se pueden quitar horarios ya publicados?

- **Recomendación del agente:** solo los turnos libres; los turnos con cita no se pueden quitar en esta versión. Si un médico falta, la secretaria avisa al familiar por fuera del producto usando los datos de la lista de citas.
- **Alternativa considerada:** quitar también turnos con cita, cancelando la cita y avisando automáticamente al familiar.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** permite corregir errores sin sumar un recorrido nuevo de cancelación por parte del consultorio.
- **Exclusión:** cancelación de citas por parte del consultorio.
- **Casos afectados:** Publicar horarios, Consultar citas reservadas.

### D22 — Alternativas propuestas por el agente para el caso Publicar horarios

- **Propuestas:** B1 (rango superpuesto) y B2 (datos inválidos).
- **Respuesta del estudiante:** «si» (las dos aceptadas).
- **Casos afectados:** Publicar horarios.

## Decisiones del caso «Consultar citas reservadas»

### D23 — ¿Qué ve la secretaria en la lista de citas?

- **Recomendación del agente:** lista por día (hoy por defecto, ordenada por hora), con cambio de día, filtro por médico y búsqueda por nombre del paciente. Cada cita muestra hora, médico y especialidad, paciente, si es menor de edad, acompañante y contacto del familiar. No muestra el código de reserva.
- **Alternativa considerada:** que el estudiante cambiara cualquier parte del paquete.
- **Respuesta del estudiante:** «si» (en el mensaje «Apruebo publicar-horarios, si»).
- **Motivo (del agente):** cubre lo ya decidido (D14: atender en recepción; D21: avisar si un médico falta) sin sumar tareas nuevas. No mostrar el código respeta el supuesto de que solo quien reservó lo conoce.
- **Casos afectados:** Consultar citas reservadas.

### D24 — Alternativas propuestas por el agente para el caso Consultar citas

- **Propuestas:** C1 (día sin citas), C2 (búsqueda sobre el día visto y sin resultados) y C3 (nombres repetidos).
- **Respuesta del estudiante:** «si» (las tres aceptadas).
- **Casos afectados:** Consultar citas reservadas.

## Decisiones de los casos del código («Consultar una cita con su código», «Cancelar una cita» y «Cambiar una cita»)

### D25 — ¿Cómo se organizan los casos que usan el código?

- **Recomendación del agente:** renombrar «Ver mis próximas citas» como «Consultar una cita con su código» (el familiar ingresa el código y ve esa cita). «Cancelar una cita» y «Cambiar una cita» empiezan desde ahí.
- **Alternativa considerada:** mantener «Ver mis próximas citas», que con D5 (sin cuenta) no es posible.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** el ingreso del código se describe una sola vez; cancelar y cambiar siguen siendo casos separados porque cada uno tiene su propio resultado.
- **Casos afectados:** Consultar con código, Cancelar, Cambiar.

### D26 — ¿Cómo funciona cancelar?

- **Recomendación del agente:** desde la cita consultada, el familiar elige cancelar y confirma; el turno vuelve a quedar libre; el familiar recibe un aviso de cancelación por el canal que eligió al reservar; el código deja de servir; la cita desaparece de la lista de la secretaria; se puede cancelar en cualquier momento antes de la hora de la cita (un límite de anticipación queda para la fase 2).
- **Alternativa considerada:** que el estudiante cambiara cualquier punto del paquete.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** respeta el motivo del estudiante en D4 (no perder la cita), D13 y D16 (mensajes al familiar por su canal) y la regla de un turno por cita.
- **Casos afectados:** Cancelar, Consultar con código, Consultar citas reservadas.

### D27 — Alternativas propuestas por el agente para consultar con código y cancelar

- **Propuestas:** E1 (código incorrecto), E2 (cita ya pasada) y la alternativa «el familiar no confirma la cancelación». En la conversación esta última se llamó «D1»; en el documento se registra como **CN1** para no confundirla con la decisión D1.
- **Respuesta del estudiante:** «si» (las tres aceptadas).
- **Casos afectados:** Consultar con código, Cancelar.

### D28 — ¿Cómo funciona cambiar una cita?

- **Recomendación del agente:** desde la cita consultada y antes de su hora, el familiar cambia solo el día y la hora dentro de la misma especialidad (cambiar de especialidad = cancelar y reservar de nuevo); se muestran días y horarios libres igual que al reservar; el familiar confirma; el sistema comprueba que el nuevo horario siga libre y recién entonces libera el anterior; se mantiene el mismo código; el familiar recibe un aviso del cambio por su canal; la cita aparece en su nuevo día y hora en la lista de la secretaria; los datos del paciente y del acompañante no se modifican.
- **Alternativa considerada:** que el estudiante cambiara cualquier punto del paquete.
- **Respuesta del estudiante:** «si» (aceptada).
- **Motivo (del agente):** responde al motivo del estudiante en D4 («cambiar las fechas por algun percance»); el familiar nunca se queda sin cita durante el cambio.
- **Exclusiones:** cambiar de especialidad dentro de este caso; modificar los datos del paciente o del acompañante.
- **Casos afectados:** Cambiar, Consultar con código, Consultar citas reservadas.

### D29 — Alternativas propuestas por el agente para cambiar una cita

- **Propuestas:** F1 (horario tomado mientras se cambiaba), F2 (el familiar no confirma) y F3 (sin otros horarios libres); en todas, la cita original sigue igual.
- **Respuesta del estudiante:** «si» (las tres aceptadas, en el mismo mensaje que D28).
- **Casos afectados:** Cambiar.

## Decisiones para las secciones 2 y 6 del documento

### D30 — Sección 2: ¿cómo se resuelve hoy y qué dificultad persiste?

- **Pregunta del agente:** cómo se pide hoy una cita, qué problema tiene esa forma y si es una observación propia o un supuesto.
- **Respuesta inicial del estudiante:** pidió al agente que propusiera la respuesta.
- **Propuesta del agente (supuestos sin verificar; no hay entrevistas, datos ni estudios):**
  - **S1.** Hoy las citas se piden sobre todo por teléfono o yendo en persona a recepción.
  - **S2.** Así, el familiar no ve qué horarios hay libres: tiene que preguntar y depende de que la secretaria pueda atender en ese momento.
  - **S3.** La cita suele quedar acordada de palabra o anotada en un papel, sin un mensaje para revisarla después; para cancelar o cambiar hay que volver a llamar.
- **Respuesta del estudiante:** «Si» (aceptados como supuestos; el estudiante no señaló ninguno como observación propia).
- **Dificultad que persiste (derivada de los supuestos):** pedir, cancelar o cambiar una cita depende de comunicarse con el consultorio en su horario, y el familiar no tiene un registro propio de la cita.
- **Lo que sí proviene del estudiante (idea inicial):** la situación a mejorar (un consultorio sencillo, sin complicaciones), quién la vive (niños y adultos mayores, a quienes les cuesta guiarse) y el resultado deseado (sacar citas de forma sencilla y recibir el mensaje al instante).

### D31 — Sección 6: ¿qué secciones o pantallas tendrá el producto?

- **Propuesta del agente:** seis secciones.
  1. **Inicio** (familiar): las dos opciones principales; lleva a reservar o a consultar una cita con su código. Casos: reservar-cita, consultar-cita-codigo.
  2. **Reservar cita** (familiar): especialidades, días (los completos no se pueden elegir), horarios libres, datos del paciente y del acompañante, contacto y canal; permite completar la reserva y ver la confirmación. Caso: reservar-cita.
  3. **Mi cita** (familiar): campo del código y datos de la cita; permite consultar, cancelar o cambiar (para cambiar reutiliza la vista de días y horarios). Casos: consultar-cita-codigo, cancelar-cita, cambiar-cita.
  4. **Ingreso del personal** (secretaria): usuario y contraseña; da acceso a Horarios y Citas. Casos: publicar-horarios, consultar-citas.
  5. **Horarios** (secretaria): médicos con su especialidad y turnos publicados; permite publicar un bloque y quitar turnos libres. Caso: publicar-horarios.
  6. **Citas** (secretaria): citas del día con sus datos; permite cambiar de día, filtrar por médico y buscar por nombre. Caso: consultar-citas.
- **Respuesta del estudiante:** «Si» (aceptada).
- **Motivo (del agente):** cada sección agrupa los pasos de un mismo objetivo; se evita una pantalla por cada paso, como pide la consigna.

## Exclusiones de la versión inicial

| Exclusión | Decisión | Casos relacionados |
|---|---|---|
| Crear o administrar cuentas del personal (se supone que la cuenta de la secretaria ya existe) | D18 | Publicar horarios, Consultar citas reservadas |
| Agregar, editar o quitar médicos y especialidades (la lista ya viene cargada) | D20 | Publicar horarios, Reservar |
| Cancelación de citas por parte del consultorio (por ejemplo, si un médico falta) | D21 | Publicar horarios, Consultar citas reservadas |
| Cambiar de especialidad al cambiar una cita (se cancela y se reserva de nuevo) | D28 | Cambiar |
| Modificar los datos del paciente o del acompañante después de reservar | D28 | Cambiar |

## Propuestas del agente pendientes de revisión

- Ninguna por ahora (la propuesta de renombrar «Ver mis próximas citas» se resolvió en D25).

## Supuestos por validar

- Solo quien reservó conoce el código (el estudiante calificó la opción como «segura»).
- **S1.** Hoy las citas se piden sobre todo por teléfono o yendo en persona a recepción. (propuesto por la IA, sin verificar; D30)
- **S2.** El familiar no ve qué horarios hay libres y depende de que la secretaria pueda atender. (propuesto por la IA, sin verificar; D30)
- **S3.** La cita queda de palabra o en papel; para cancelar o cambiar hay que volver a llamar. (propuesto por la IA, sin verificar; D30)

## Preguntas abiertas

- **Entorno:** `ahk health` falla en Windows al invocar `health.bat` (ver «Comprobaciones del entorno»). Pendiente de consultar al docente.
- Pendiente del estudiante: justificar con sus propias palabras al menos una exclusión (sección 9).
- ¿Qué ocurre si se pierde el código o el mensaje no llega?
- ¿Qué datos exactos del paciente, del acompañante y del familiar se piden?
- ¿El familiar ve el nombre del médico, o solo la especialidad?
- ¿El código también se muestra en pantalla al confirmar?
- ¿Se pueden publicar varios días de una vez?
- ¿Qué pasa si el rango de horas no se divide exacto por la duración de la cita?
- ¿Cuánta anticipación mínima se exige para cancelar? (fase 2)
- ¿Hay un límite de cambios por cita o una anticipación mínima para cambiar? (fase 2)

## Casos de uso

| Caso | Identificador AHK | Archivo | Estado |
|---|---|---|---|
| Reservar una cita médica por especialidad | reservar-cita | `docs/use-cases/reservar-cita.md` | aprobado por el estudiante el 2026-10-27 («Apruebo reservar-cita») |
| Publicar horarios disponibles de un médico | publicar-horarios | `docs/use-cases/publicar-horarios.md` | aprobado por el estudiante el 2026-10-27 («Apruebo publicar-horarios») |
| Consultar citas reservadas | consultar-citas | `docs/use-cases/consultar-citas.md` | aprobado por el estudiante el 2026-10-27 («Apruebo consultar-citas») |
| Cancelar una cita | cancelar-cita | `docs/use-cases/cancelar-cita.md` | aprobado por el estudiante el 2026-10-27 («Apruebo cancelar-cita») |
| Consultar una cita con su código | consultar-cita-codigo | `docs/use-cases/consultar-cita-codigo.md` | aprobado por el estudiante el 2026-10-27 («Apruebo consultar-cita-codigo») |
| Cambiar una cita | cambiar-cita | `docs/use-cases/cambiar-cita.md` | aprobado por el estudiante el 2026-10-27 («Apruebo cambiar-cita») |

## Explicación propia del estudiante — sección 9 (borrador, texto sin editar)

Respuestas escritas por el estudiante en la conversación, a partir de preguntas guía del agente. Se copian sin corregir; la corrección ortográfica queda pendiente de que el estudiante la pida. Entre corchetes se indican correcciones de palabras que el propio estudiante confirmó.

**Corrección posterior:** a pedido del estudiante («si, me gustaria que arregles esas faltas ortograficas»), en `docs/entregas/fase-01.md` se corrigieron solo la ortografía, la puntuación final y los espacios de la numeración. Aquí se conserva el texto original.

### 9.1 Agente utilizado y comprobación de AHK 3.0.0

> Use Cursor junto con claude code y comprobe que AHK era la 3.0.0 con ahk --version. Cuando ejecute ahk health me salia error, al preguntar a la IA y que lo revisara y concluyo que el AHK llama al script y no al proyecto, asi que me dijo que usara .\health.bat para ejecutar directamente y funciono, cuando ejecute ahk doctor todo salio bien y sin errores

Nota del agente: el estudiante completó una frase guía con tres espacios. Imprecisiones señaladas al estudiante, sin corregir: `ahk doctor` mostró un aviso de versión 3.3.0 disponible; la conclusión fue que el problema está en cómo AHK invoca el script (hipótesis); lo que funcionó fue el build ejecutado directamente, y `ahk health` sigue registrado como fallido.

### 9.2 Decisiones propias y una exclusión

**¿Por qué reserva un familiar y no el paciente? (D1)**

> Lo elegi para que sea accsesible para cualquiera que lo use pero mayormente para niños y adultos mayores

[El estudiante confirmó cambiar «mayores de edad» por «adultos mayores».]

**Exclusión elegida**

> Elegi la de cambiar de especialidad al cambiar una cita y la deje fuera porque cambiar de especialidad implica cambiar de medico y horario, y eso ya se resuelve cancelando la cita y reservando de nuevim Asi evito mas pantallas y reglas sin perder nada importante

Nota del agente: es la tercera versión. Las dos anteriores justificaban la exclusión con una «carga de documentos» que no existe en el producto; el agente lo señaló y el estudiante reescribió el motivo.

### 9.3 Una propuesta del agente que el estudiante modificó

> Le cambie la forma que estaba estructurada, tenia demasiadas incoherencias haciendo que se complique el contexto que quiero dar a conocer

> Agregue las casillas rojas porque es una manera sencilla y rapida de guair a la persona a horarios factibles y hacer entender que las que estan marcadas en rojo ya estan ocupadas

**Reflexión sobre las contradicciones**

> Las que me hacia contradicciones, no pense en las consecuencias de mis decisiones haciendo que la definición tenga muchos errores

[El estudiante confirmó cambiar «pagina» por «definición».]

### 9.4 Recorrido principal y situación alternativa

> 1.Entra un familiar responsable, por ejemplo Marcos, un hijo adulto, sin crear cuenta ni iniciar sesión. Reserva para su papá, que tiene 70 años, así que es mayor de edad. El papá no usa la página ni recibe mensajes.
> 2.Elige la especialidad entre las que tienen horarios disponibles, por ejemplo Medicina general.
> 3. Ve los días de esa especialidad. Los días sin ningún horario libre aparecen como completos y no se pueden elegir. Al elegir un día con cupo, ve solo los horarios libres, no los ocupados. Luego elige uno, por ejemplo las 10:00.
> 4. Llena los datos de su papá como paciente e indica que es mayor de edad. Como es mayor de edad, agregar acompañante es opcional. Si decide agregarlo, por ejemplo a su hermana, que irá con el papá, solo registra sus datos, y ella no recibe mensajes. Si el paciente fuera menor de edad, el acompañante sería obligatorio.
> 5. Deja su propio contacto, el de Marcos por ejemplo, y elige recibir el mensaje por correo electrónico o por WhatsApp. Por ejemplo, elige WhatsApp.
> 6. Nadie revisa la cita: queda confirmada sola, sin que intervenga la secretaria. Antes de registrarla, el sistema comprueba que el horario siga libre. Si otra persona lo tomó mientras tanto, lo avisa y muestra los horarios que quedan. El mensaje llega en el momento de confirmar, solo a Marcos y por el canal que eligió. Trae la confirmación de la cita y su código de reserva.
> 7. Llega al consultorio y dice su nombre en recepción. No necesita presentar el código, porque el código le sirve a Marcos solo para consultar, cancelar o cambiar la cita después.

Nota del agente: varias frases coinciden casi literalmente con el caso `reservar-cita`; el ejemplo concreto (Marcos, su papá de 70 años, la hermana, las 10:00, WhatsApp) es del estudiante. La situación alternativa está en el punto 6.

### 9.5 Qué sigue sin validar y qué ayuda se recibió de la IA

> Nada de esto lo he validado con un consultorio real ni con usuarios; todo parte de supuestos míos y de las decisiones que fui tomando.

> Claude fue quien me ayudo en el proceso, ,me armó tablas de opciones para decidir qué casos entraban y cuáles quedaban fuera, y yo elegía entre ellas.

> Los supuestos sobre cómo se piden las citas hoy (S1 a S3) los propuso la IA y yo los acepté (D30); no los validé con nadie, así que siguen siendo supuestos

> Desde D13 hasta D31 la IA me hizo recomendaciones y yo las acepté con “sí”, y los casos de uso los redactó la IA a partir de mis decisiones; lo mío fueron las decisiones de D1 a D12 y la elección final de qué dejar fuera

---

# Registro del proceso — Fase 2 · Procesos y reglas del negocio

## Comprobaciones del entorno (ejecutadas por el agente el 2026-11-08, antes del trabajo asistido)

| Comprobación | Resultado | Límite |
|---|---|---|
| `node --version` / `pnpm --version` / `ahk --version` | v22.23.4 / 11.17.0 / 3.0.0 | Confirma versiones; no prueba el producto. |
| `ahk doctor` (CLI y MCP) | Agentes y skills completos. Aviso: AHK 3.7.0 disponible; no se actualiza porque la consigna exige 3.0.0. | Diagnóstico del entorno. |
| Skill `ahk-spec` | `SKILL.md`, `resources/workflow.md` y `resources/template.md` legibles. | — |
| MCP `specs.list` (llamada real) | 6 casos de uso, todos `approved`; ninguna especificación; sin diagnósticos. | Prueba la conexión y los estados; no las decisiones. |
| MCP `specs.get` | Los seis casos se recuperaron mediante AHK. | — |
| MCP `specs.validate` | `valid: true`, sin errores. | Valida formato y referencias, no que las reglas sean correctas. |
| `ahk health` | **Falló**, igual que en la fase 1: `"\"%USERPROFILE%\Downloads\proyecto-bootcamp\health.bat\"" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.` Los 7 logs de `.harness/health-logs/` (desde el 2026-10-27) muestran el mismo error. | Hipótesis sin confirmar: AHK 3.0.0 escapa mal la ruta del `.bat` en Windows. No se cambió la versión ni la configuración. Pendiente de consultar al docente. |
| `.\health.bat` (diagnóstico directo, sin AHK) | `tsc -b && vite build` terminó bien («✓ 20 modules transformed… ✓ built in 147ms»), código de salida 0. | Demuestra que el build funciona; **no** reemplaza a `ahk health`, que sigue registrado como fallido. |

## Retroalimentación docente de la fase 1

- No recibida al 2026-11-08 (respuesta del estudiante: «aun no»). No se presenta ninguna aprobación docente.

## Modo de trabajo en la fase 2

Una decisión por turno. El agente presenta alternativas con sus consecuencias, sin recomendar ninguna; el estudiante elige y escribe su motivo. A diferencia de D13–D31, los motivos de D33–D40 son del estudiante.

## Decisiones confirmadas (fase 2)

### D32 — ¿Qué se mantiene y qué se corrige de la fase 1?

- **Respuesta del estudiante (texto sin editar):** «Todo, en la fase 1 arregle muchas cosas y estoy contento por ello, no me queda ninguna duda pendiente»
- **Consecuencia:** los seis casos de uso se mantienen aprobados, sin revisión con `ahk-use-case`.
- **Observación del agente:** las preguntas que la fase 1 dejó para esta fase (anticipación para cancelar, mensaje que no llega, médico visible, código perdido, etc.) se resuelven en las especificaciones (D34–D40 y siguientes).

### Explicación del estudiante de una operación: Cancelar (texto sin editar)

> Cancelar, una manera muy bien aplicada para que no se estrece la persona y accesible

> Marcos entra a “Mi cita” y pone el código de reserva que le llegó por WhatsApp. Ahí ve la especialidad, el día, la hora (10:00), el nombre de su papá y el acompañante, si lo hay. Elige “Cancelar” y el producto le pide confirmar. Cuando lo hace, la cita queda cancelada, el horario de las 10:00 vuelve a quedar libre y a Marcos le llega un aviso de cancelación por WhatsApp.

Nota del agente: el estudiante completó una frase guía con espacios en blanco propuesta por el agente. Comparación con lo aprobado: coincide con `consultar-cita-codigo` y `cancelar-cita`, sin contradicciones. No mencionó (sin contradecir): el código deja de servir, la cita desaparece de la lista de la secretaria y solo se puede cancelar antes de la hora.

### D33 — ¿Cómo se agrupan las especificaciones funcionales?

- **Alternativas presentadas por el agente:** A) por actor y momento (3 especificaciones); B) por actor (2); C) una por caso de uso (6); D) una sola.
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque coincide con las secciones que ya definí (Horarios y Citas, Reservar, Mi cita). Cada documento queda de un tamaño que se puede revisar, y las reglas que se repiten, como “un turno admite una sola cita” o “solo antes de la hora”, se escriben una vez y las demás especificaciones las referencian.»
- **Especificaciones:** «Agenda del consultorio» (publicar-horarios, consultar-citas); «Reserva» (reservar-cita); «Gestión de una cita con su código» (consultar-cita-codigo, cancelar-cita, cambiar-cita).

### D34 — ¿Hasta cuándo se puede cancelar o cambiar una cita?

- **Alternativas presentadas por el agente:** A) sin anticipación, hasta la hora de inicio; B) la misma anticipación mínima para ambas; C) anticipaciones distintas.
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque quiero que sea accesible y que la persona no se estrese: si surge un percance, Marcos siempre puede cancelar o cambiar dentro del producto, hasta la hora de la cita. No agrega reglas nuevas.»
- **Pendiente de confirmar con ejemplos:** con una cita de las 10:00, a las 9:59 se puede y a las 10:00 ya figura como pasada (lectura literal de «antes de la hora»).
- **Documentos afectados:** especificación `gestion-cita-codigo` (RN-02).

### D35 — ¿Hay un límite de cambios por cita?

- **Alternativas presentadas por el agente:** A) sin límite; B) un límite de N cambios.
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque quiero que sea accesible y que la persona no se estrese: Marcos puede cambiar la cita las veces que haga falta, siempre antes de la hora. No agrego reglas ni datos nuevos.»
- **Documentos afectados:** especificación `gestion-cita-codigo` (RN-03).

### D36 — ¿El familiar ve el nombre del médico?

- **Alternativas presentadas por el agente:** A) nunca, solo la especialidad (exigía una regla de asignación de médico); B) solo después de reservar (también exigía esa regla); C) junto a cada horario libre y después en la confirmación, el mensaje y «Mi cita».
- **Elección del estudiante:** C.
- **Motivo (palabras del estudiante):** «Elijo la C porque los turnos ya se publican por médico y la secretaria ya ve el médico de cada cita, así que el familiar también debe saber desde el principio con quién será. Así no hace falta inventar una regla para asignar médico, y la persona no se lleva sorpresas.»
- **Documentos afectados:** especificaciones «Reserva» (pendiente) y `gestion-cita-codigo` (RN-04).

### D37 — Al cambiar una cita, ¿puede cambiar también el médico?

- **Alternativas presentadas por el agente:** A) cualquier médico de la misma especialidad; B) solo el mismo médico (exigía revisar `cambiar-cita`).
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque coincide con lo que ya aprobé en cambiar-cita (“misma especialidad”) y le da a Marcos más opciones para resolver su percance. Como ahora el horario muestra el médico, puede ver con quién queda antes de confirmar.»
- **Consecuencia:** antes de confirmar se ve el nuevo médico; el aviso del cambio lo incluye. No modifica el caso aprobado.
- **Documentos afectados:** especificación `gestion-cita-codigo` (RN-05, RN-08).

### D38 — ¿El código se muestra en pantalla al confirmar la reserva?

- **Alternativas presentadas por el agente:** A) en pantalla y también por mensaje; B) solo por mensaje.
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque quiero que siempre haya una salida dentro del producto: si el mensaje no le llega a Marcos, igual vio el código al confirmar y pudo anotarlo. Todo “Mi cita” depende del código, y no quiero que dependa de un solo canal.»
- **Documentos afectados:** especificación «Reserva» (pendiente) y condición previa de `gestion-cita-codigo`.

### D39 — Si un mensaje no se puede enviar, ¿qué pasa con la operación?

- **Alcance:** regla compartida para reservar, cancelar y cambiar.
- **Alternativas presentadas por el agente:** A) la operación se mantiene y el producto avisa en pantalla; B) se mantiene sin avisar; C) la operación se deshace.
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque la cita debe quedar confirmada al instante (D3) y porque quiero que siempre haya una salida: si el mensaje no se pudo enviar, Marcos lo sabe en pantalla y anota su código.»
- **Resuelve:** la alternativa A5 de `reservar-cita` y las preguntas abiertas de `cancelar-cita` y `cambiar-cita` sobre avisos no entregados.
- **Documentos afectados:** especificaciones «Reserva» (pendiente) y `gestion-cita-codigo` (RN-09).

### D40 — ¿Qué pasa si el familiar pierde el código?

- **Alternativas presentadas por el agente:** A) sin recuperación en esta versión (exclusión); B) reenvío del código al mismo contacto (exigía un caso de uso nuevo); C) la secretaria se lo da (contradecía `consultar-citas`).
- **Elección del estudiante:** A.
- **Motivo (palabras del estudiante):** «Elijo la A porque con el código en pantalla y por mensaje, perderlo ya es poco probable: Marcos tendría que perder las dos cosas a la vez. Prefiero no ampliar el alcance de esta versión con un caso de uso nuevo, y dejarlo como exclusión justificada.»
- **Documentos afectados:** especificación `gestion-cita-codigo` (exclusiones).

### Revisión de `gestion-cita-codigo` (paso 4)

**Observaciones del agente al releer el borrador:** «todavía no pasó» en `consultar-cita-codigo` era ambiguo (inicio o fin de la cita); el borrador usa «hora de inicio». RN-07 («el producto no comprueba quién ingresa el código») y el motivo de RN-01 los redactó el agente y quedan para revisión del estudiante. No se encontraron contradicciones con los casos fuente.

**Ejemplo válido del estudiante (texto sin editar):**

> Quién y qué cita tiene: Rosa reservó para su hija Camila, de 8 años, una cita de Pediatría el jueves a las 15:30 con el Dr. Paredes. Como Camila es menor, Rosa registró a su hermana como acompañante. Rosa eligió recibir los mensajes por correo electrónico.
>
> Qué hace: el mismo jueves a las 14:00, antes de la hora de la cita, a Rosa le surge un percance. Entra a “Mi cita”, ingresa su código y ve la especialidad, el día, la hora, el médico, la paciente y la acompañante. Elige “Cambiar”, ve los días de Pediatría con horarios libres y escoge el viernes a las 9:00 con la Dra. Salazar. El producto le pide confirmar y Rosa confirma.
>
> Qué espera ver al final: la cita con su nuevo día, hora y médico, con el mismo código. El horario del jueves a las 15:30 queda libre. Le llega un aviso del cambio por correo, con el nombre de la Dra. Salazar. En la lista de la secretaria, la cita aparece el viernes a las 9:00.

Comparación del agente: coincide con PR-04, PR-06, RN-01, RN-02, RN-04, RN-05, RN-06 y RN-08. Matices señalados, sin contradicción: los días sin horarios libres también aparecen, marcados como completos y sin poder elegirse (RN-04, D9); si la acompañante no puede ir el nuevo día, no se puede cambiar al cambiar la cita (RN-06, exclusión de D28). El estudiante no pidió revisar esa exclusión; se mantiene.

### D41 — Límite exacto de RN-02 (ejemplo inválido del estudiante)

- **Alternativas presentadas por el agente:** A) cuenta la hora en que el familiar confirma; B) cuenta la hora en que empezó la operación.
- **Elección del estudiante:** A.
- **Ejemplo del estudiante (texto sin editar):**

> Yo elegiría la A
>
> Rosa entra a “Mi cita” a las 15:30 en punto: la cita ya figura como pasada y no se le ofrece cancelar ni cambiar. Si empieza el cambio a las 15:28 pero confirma a las 15:31, el producto le dice que la cita ya pasó y no hace ningún cambio. La cita, el horario, el código y la lista de la secretaria quedan igual, y no se envía ningún aviso.

- **Motivo:** el estudiante no escribió un motivo aparte de su ejemplo.
- **Documentos afectados:** `gestion-cita-codigo` (RN-02, CN4 de PR-05, F6 de PR-06, CA-05.4 y CA-06.8).

### D42 — ¿Se actualizan los casos de uso que siguen listando preguntas ya resueltas?

- **Alcance:** las tres especificaciones.
- **Alternativas presentadas por el agente:** A) actualizar los casos con `ahk-use-case` y volver a aprobarlos antes de aprobar cualquier especificación; B) no tocar los casos y marcar en la entrega cada pregunta como resuelta.
- **Elección del estudiante:** B.
- **Motivo (palabras del estudiante):** «Elijo la B porque ya decidí mantener lo aprobado en la fase 1 (D32). Prefiero no volver a aprobar varios casos ni arriesgar que AHK pase una especificación a needs-decision. Las preguntas resueltas las marco en la entrega como “resuelta en Dxx / RN-xx” y explico el cambio en la sección 20.»
- **Consecuencia:** los casos fuente no se modifican; cada especificación incluye una correspondencia entre las preguntas abiertas de sus casos y la regla o decisión que las resuelve.
- **Documentos afectados:** `gestion-cita-codigo`, «Reserva» y «Agenda del consultorio»; secciones 7 y 20 de la entrega.

### Aprobación de `gestion-cita-codigo`

- **Texto del estudiante:** «Apruebo gestion-cita-codigo, revisión 2026-11-09T04:26:50.175Z»
- **Fecha:** 2026-11-08 (hora local).
- **Antes de aprobar**, el agente le pidió revisar en especial dos frases que había redactado el agente: RN-07 («el producto no comprueba quién ingresa el código») y el motivo de RN-01. El estudiante no pidió cambios.
- **Transición en AHK:** `draft` → `approved` mediante `specs.transition`; la revisión aprobada es la de `lastUpdated` 2026-11-09T04:26:50.175Z (la transición solo cambia el estado; nuevo `lastUpdated`: 2026-11-09T04:29:49.375Z). `specs.validate`: sin errores.

## Decisiones de la especificación «Reserva» (`reserva-cita`)

### D43 — ¿Qué datos del paciente se piden?

- **Pregunta abierta del agente** (sin alternativas cerradas): qué datos, cuáles obligatorios y para qué sirve cada uno.
- **Respuesta del estudiante (texto sin editar):** «Del paciente pido su nombre y apellido (obligatorio), que sirve para que la secretaria encuentre la cita cuando llega a recepción y dice su nombre (D14). Pido también si es menor de edad (obligatorio), que sirve para decidir si los datos del acompañante son opcionales u obligatorios (D15). No pido nada más porque el resto no lo usa ninguna regla.»
- **Consecuencia señalada por el agente:** como no se pide la edad ni la fecha de nacimiento, el producto no puede comprobar si el paciente es menor; se basa en lo que indica el familiar.

### D44 — ¿Qué datos del acompañante se piden?

- **Respuesta del estudiante (texto sin editar):** «Del acompañante pido solo su nombre y apellido, obligatorio cuando hay acompañante, que sirve para que la secretaria sepa quién viene con el paciente, sobre todo si es menor (D10, D15). No pido más porque el acompañante no recibe mensajes (D13) y ninguna regla usa su contacto: si hay que avisar algo, la secretaria llama al familiar, cuyo contacto sí aparece en su lista (D23).»
- **Observación del agente:** «la secretaria llama al familiar» no se cumplía si el familiar elegía correo (solo había correo); se resolvió en D45.

### D45 — ¿Qué datos del familiar se piden?

- **Alternativas presentadas por el agente (contacto):** A) solo el contacto del canal elegido; B) siempre un teléfono, más el correo si elige ese canal; C) siempre correo y teléfono.
- **Elección del estudiante:** B, más el nombre del familiar.
- **Respuesta del estudiante (texto sin editar):** «Yo elegiría la B: siempre un teléfono, más el correo si el familiar elige ese canal, y además pediría el nombre del familiar.

Del familiar pido su nombre y apellido, para que la secretaria sepa por quién preguntar cuando llama, y un teléfono, obligatorio siempre, para que pueda llamar si un médico falta (D21). Si el familiar elige recibir los mensajes por correo, pido también su correo; si elige WhatsApp, el número de WhatsApp es su teléfono y no pido nada más. Los mensajes del producto siguen yendo solo por el canal elegido (RN-08).»
- **Pendientes que el estudiante resolverá al final:** (1) si el nombre del familiar es obligatorio (escrito como obligatorio por interpretación del agente); (2) qué ve la secretaria como contacto del familiar en su lista (propuesta del agente: nombre, teléfono y correo si lo hay).

### D46 — ¿Cuándo un dato de contacto es inválido?

- **Alternativas presentadas por el agente:** A) solo el formato; B) formato y escribirlo dos veces; C) formato y código de verificación previo (ampliaba el alcance y chocaba con D39).
- **Elección del estudiante:** A.
- **Respuesta del estudiante (texto sin editar):** «Yo elegiría la A (solo el formato). Los dos puntos que el tutor te pide confirmar los resuelvo al final.

Elijo la A: el producto comprueba solo el formato. El correo debe tener la forma usuario@dominio, y el teléfono debe tener solo dígitos y los 10 de un celular de Ecuador (empieza con 09). Es simple para el familiar y cubre los errores más comunes. Un número bien escrito pero equivocado no se detecta, pero Marcos igual tiene su código en pantalla (D38).»
- **Consecuencias señaladas por el agente (sin objeción del estudiante):** no se aceptan teléfonos fijos ni números de otros países; límites: 9 u 11 dígitos, o 10 que empiezan con 08, son inválidos.

### D47 — ¿Hasta cuándo se puede reservar un turno?

- **Alternativas presentadas por el agente:** A) hasta la hora de inicio, contando la hora en que se confirma (igual que D41); B) con anticipación mínima.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Yo elegiría la A (hasta la hora de inicio, cuenta la hora en que confirma).

Elijo la A porque quiero una sola regla de tiempo para reservar, cancelar y cambiar: lo que cuenta es la hora en que se confirma. Así los turnos que se liberan a último momento todavía se pueden aprovechar, y no agrego un número nuevo que explicar.»
- **Consecuencia:** RN-10 de `reserva-cita` referencia el criterio de RN-02 sin modificar `gestion-cita-codigo` (ya aprobada).

### D48 — ¿Un mismo paciente puede tener varias citas?

- **Alternativas presentadas por el agente:** A) sin restricción; B) no permitir dos citas del mismo paciente a la misma hora; C) una sola cita vigente por paciente y especialidad (B y C dependían de reconocer al paciente solo por el nombre).
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A porque del paciente solo pido nombre y apellido (D43), y con eso el producto no puede saber de verdad si es el mismo paciente: los nombres se repiten y se escriben distinto (“Jose” o “José”). Una regla que dependa de reconocerlo fallaría en los dos sentidos. Cada reserva es independiente y un turno sigue admitiendo una sola cita (RN-01).»

### Borrador de `reserva-cita`

- Guardado mediante `specs.create` como `draft`, vinculado con `reservar-cita`. Usa RN-01, RN-02, RN-04, RN-07, RN-08 y RN-09 de `gestion-cita-codigo` y define RN-10 a RN-17.
- Puntos redactados por el agente para revisión del estudiante: A1 (conciliación con el paso 2 del caso fuente), A6, A7 y «menor de edad» = menos de 18 años.

### D49 — Contradicción entre D45 y la condición previa de `reservar-cita`

- **Detectada por el agente** al revisar `reserva-cita`. El agente reconoció que debió señalarla al comparar las opciones de D45.
- **Contradicción:** el caso aprobado decía «El familiar dispone de un correo electrónico o de un número con WhatsApp»; D45 exige un celular siempre. Un familiar con solo correo podía reservar según el caso y no según la especificación.
- **Alternativas presentadas por el agente:** A) mantener D45 y revisar el caso con `ahk-use-case`; B) mantener el caso y cambiar D45 (teléfono obligatorio solo si el canal es WhatsApp).
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A porque quiero mantener lo que decidí en D45: que la secretaria siempre pueda llamar al familiar si un médico falta (D21). Como eso contradice la condición previa del caso aprobado, prefiero corregir ese caso de forma explícita y volver a aprobarlo, en lugar de dejar una contradicción o cambiar mi decisión.»
- **Relación con D42:** excepción justificada; D42 trataba preguntas abiertas de los casos, y aquí había una contradicción con una condición aprobada.

### Revisión y nueva aprobación de `reservar-cita` (`ahk-use-case`)

- `approved` → `draft` mediante `specs.transition` antes de cambiar el contenido.
- **Cambio (solo la condición previa de contacto):** antes «El familiar dispone de un correo electrónico o de un número con WhatsApp. (D6, D16)»; ahora «El familiar dispone de un teléfono celular y, si elige recibir los mensajes por correo electrónico, también de un correo. Si elige WhatsApp, los mensajes llegan a ese mismo celular. (D6, D16, D45, D49)». Se agregó una nota de revisión (D49). El resto del caso no cambió (comparación línea por línea).
- `specs.validate`: sin errores. Ningún otro documento cambió de estado.
- **Aprobación del estudiante (texto):** «Apruebo reservar-cita, revisión 2026-11-09T04:44:52.623Z»
- `draft` → `approved` mediante `specs.transition` (nuevo `lastUpdated`: 2026-11-09T04:46:54.289Z; la transición solo cambia el estado).

### Revisión de `reserva-cita` (paso 4)

**Ejemplo válido del estudiante (texto sin editar):**

> Quién reserva y para quién: Lucía reserva para su abuela María, de 82 años, que es mayor de edad. Decide no registrar acompañante, porque es opcional.
>
> Qué elige y cuándo: el lunes a las 19:00 entra a la sección de reserva, elige Cardiología y ve los días de esa especialidad. El martes aparece como completo y no puede elegirlo. Elige el miércoles, ve solo los horarios libres, cada uno con su médico, y escoge las 11:30 con el Dr. Andrade.
>
> Qué datos deja: del paciente, el nombre y apellido de su abuela, y marca que no es menor de edad. Como familiar, deja su nombre y apellido, su teléfono (0991234567: 10 dígitos y empieza con 09) y elige recibir los mensajes por correo, así que también escribe su correo.
>
> Qué espera ver y recibir: al confirmar, el producto comprueba que el horario siga libre, registra la cita como confirmada sin que intervenga nadie y muestra en pantalla su código de reserva. Le llega un correo con la confirmación y el código. En la lista de la secretaria, la cita aparece el miércoles a las 11:30 con el Dr. Andrade, con el nombre de la abuela y el contacto de Lucía.

Comparación del agente: coincide con RN-04, RN-08, RN-10, RN-11, RN-13, RN-14 y RN-15. Matiz: la pantalla muestra además especialidad, médico, día, hora y paciente (paso 13). Se incorporó como CA-03.15.

**Ejemplo inválido del estudiante (texto sin editar):**

> Qué pasó: Pedro reserva para su hijo Mateo, de 9 años, una cita de Pediatría el jueves a las 16:00. Marca que el paciente es menor de edad, llena los datos de Mateo y los suyos, pero se olvida de agregar al acompañante. Confirma la reserva.
>
> Qué ve el familiar: el producto le indica que faltan los datos del acompañante, que son obligatorios porque Mateo es menor, y no registra la cita.
>
> Qué queda igual: el turno del jueves a las 16:00 sigue libre, no se genera ningún código de reserva, no se envía ningún mensaje y la cita no aparece en la lista de la secretaria.
>
> Cómo puede continuar: Pedro agrega el nombre y apellido del acompañante y vuelve a confirmar. Si mientras tanto otra persona tomó ese turno, aplica la alternativa de horario ocupado: el producto se lo informa y le muestra los horarios libres que quedan.

Comparación del agente: coincide con A4 y RN-14, y precisa qué queda igual y cómo continuar. El agente anunció que incorporaría esa precisión a A4 y CA-03.5 con las palabras del estudiante; el estudiante no objetó.

### D50 — ¿El nombre del familiar es obligatorio?

- **Alternativas presentadas por el agente:** A) obligatorio; B) opcional.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A: el nombre del familiar es obligatorio. Lo pido para que la secretaria sepa por quién preguntar cuando llama, y si falta, la cita no se registra y el producto indica qué corregir (A3). Es un dato más, pero sin él la secretaria no sabría con quién habla.»
- **Documentos afectados:** `reserva-cita` (RN-15, «Datos necesarios»).

### D51 — ¿Qué ve la secretaria como contacto del familiar?

- **Alternativas presentadas por el agente:** A) nombre, teléfono y correo (si lo hay); B) solo nombre y teléfono; C) nombre, teléfono, canal y correo.
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «Elijo la B: la secretaria ve el nombre y el teléfono del familiar, porque el motivo de pedir el contacto es poder llamar si un médico falta (D21, D45). El correo solo lo usa el producto para mandar los mensajes, y a la secretaria no le sirve para ninguna de sus tareas. Muestro lo mínimo que necesita y nada más.»
- **Documentos afectados:** `reserva-cita` («Datos necesarios») y «Agenda del consultorio» (contenido de la lista de la secretaria).

### Aprobación de `reserva-cita`

- **Texto del estudiante:** «Apruebo reserva-cita, revisión 2026-11-09T04:53:37.072Z»
- **Fecha:** 2026-11-08 (hora local).
- **Antes de aprobar**, el agente le pidió revisar en especial los puntos redactados por el agente: A1, A6, A7 y «menor de edad» = menos de 18 años. El estudiante no pidió cambios.
- **Transición en AHK:** `draft` → `approved` mediante `specs.transition`; la revisión aprobada es la de `lastUpdated` 2026-11-09T04:53:37.072Z (la transición solo cambia el estado; nuevo `lastUpdated`: 2026-11-09T04:56:49.790Z). Su caso fuente `reservar-cita` estaba aprobado. `specs.validate`: sin errores.

## Decisiones de la especificación «Agenda del consultorio» (`agenda-consultorio`)

### D52 — ¿Qué pasa si el rango no se divide exacto por la duración?

- **Alternativas presentadas por el agente:** A) solo turnos completos, informando turnos creados y minutos sobrantes; B) no publicar nada; C) último turno más corto.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A: se publican solo los turnos completos y el producto le muestra a la secretaria cuántos turnos se crearon y cuántos minutos sobraron. Así todos los turnos duran lo mismo, el familiar sabe cuánto tiempo tiene su cita y la secretaria no tiene que hacer cuentas antes de publicar (D19).»
- **Observaciones del agente:** en `reserva-cita` el familiar ve la hora de inicio, no la duración; el motivo se registra como «todos los turnos duran lo mismo» (el estudiante no pidió mostrar la duración). El ejemplo inicial de 50 minutos dejó de ser posible con D53 y se reemplazó por 45 minutos (5 turnos, sobran 15).

### D53 — ¿Qué duraciones de turno se permiten?

- **Alternativas presentadas por el agente:** A) cualquier cantidad de minutos; B) lista fija; C) mínimo, máximo y paso.
- **Elección del estudiante:** B (15, 20, 30, 45 y 60 minutos).
- **Motivo (texto sin editar):** «Elijo la B: la secretaria elige la duración de una lista fija de 15, 20, 30, 45 y 60 minutos. Es rápido de elegir, no tiene errores de tipeo y es coherente con D19, que buscaba que su tarea fuera rápida. Además deja pocos casos límite que comprobar.»

### D54 — ¿Se pueden publicar varios días de una vez?

- **Alternativas presentadas por el agente:** A) un día por vez, como dice el caso aprobado; B) varios días a la vez (exigía revisar `publicar-horarios`).
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A: se publica un día por vez, como dice el caso aprobado. No cambia ningún caso, cada publicación es simple y su resultado (turnos creados, minutos sobrantes y superposiciones) se entiende fácil. Si un médico atiende todos los martes, la secretaria repite la publicación, y es un costo que acepto.»

### D55 — ¿Qué pasa si se publica hoy un rango que ya empezó?

- **Alternativas presentadas por el agente:** A) publicar solo los turnos que no empezaron e informar cuántos no; B) no publicar nada; C) publicar todos.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A: se publican solo los turnos que todavía no empezaron, y el producto informa cuántos no se publicaron porque ya empezaron, igual que informa los minutos sobrantes (D52). Es coherente con la regla de que solo se puede reservar antes de la hora de inicio (RN-10), y la secretaria no tiene que corregir nada.»
- **Corrección del agente a su propio ejemplo:** a las 10:00 el turno de las 10:00 ya empezó (criterio de D41 y D47): se publican 3 turnos (10:30, 11:00 y 11:30) y no se publican 5.

### D56 — ¿Qué pasa si la secretaria ingresa mal su usuario o contraseña?

- **Alternativas presentadas por el agente:** A) reintentar sin límite; B) bloqueo después de N intentos (sin forma de desbloquear dentro del producto); C) espera después de N intentos. En todas, el mensaje no dice cuál de los dos datos falla.
- **Elección del estudiante:** C (5 intentos, 15 minutos).
- **Motivo (texto sin editar):** «Elijo la C: después de 5 intentos fallidos seguidos, la secretaria tiene que esperar 15 minutos para volver a intentar. Protege los datos de los pacientes, que es el motivo de D18, sin que nadie tenga que desbloquear la cuenta. Como administrar cuentas está fuera de esta versión, un bloqueo permanente no tendría salida.»

### D57 — ¿Qué pasa durante la espera y después de ella?

- **Alternativas presentadas por el agente:** A) durante la espera no se acepta ningún intento y al terminar el conteo vuelve a cero; B) el conteo sigue hasta un ingreso correcto.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «Elijo la A: durante los 15 minutos no se acepta ningún intento, ni siquiera el correcto, y al terminar la espera la secretaria tiene otros 5 intentos. Un ingreso correcto también reinicia el conteo. Es una regla fácil de explicar y de comprobar, y no castiga a la secretaria si olvidó su contraseña.»

### D58 — ¿Cómo encuentra la secretaria a un paciente por su nombre?

- **Alternativas presentadas por el agente:** A) nombre completo exacto; B) parte del nombre, sin importar mayúsculas ni tildes; C) parte del nombre, contando tildes.
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «Elijo la B: la secretaria busca por parte del nombre, sin importar mayúsculas ni tildes. Los nombres se escriben distinto (“Jose” o “José”), y la secretaria está en recepción con el paciente delante, así que necesita encontrarlo rápido aunque escriba rápido. Si aparecen más coincidencias de las necesarias, ya las resuelve C3, que muestra todas con hora y médico.»

### Borrador de `agenda-consultorio`

- Guardado mediante `specs.create` como `draft`, vinculado con `publicar-horarios` y `consultar-citas`. Usa RN-01, RN-02, RN-10 y RN-17 y define RN-18 a RN-28.
- Puntos redactados por el agente para revisión del estudiante: mensaje de ingreso sin decir cuál dato falla (RN-19), lectura de B1 como publicación parcial y definición de superposición (RN-24), B7, B8, y que «administrar cuentas» incluye desbloquear, recuperar o cambiar la contraseña.

### Revisión de `agenda-consultorio` (paso 4)

**Ejemplo válido del estudiante (texto sin editar):**

> Entro como secretaria, abro «Horarios» y elijo al Dr. Andrade de Cardiología. Pongo el miércoles 11 de noviembre, de 14:00 a 17:30, con turnos de 20 minutos, y confirmo hoy lunes a las 8:00. Espero ver «10 turnos publicados, 10 minutos sobrantes», sin turnos descartados. Después, un familiar que reserva en Cardiología ve esos 10 turnos libres del miércoles con el nombre del Dr. Andrade, y la secretaria puede quitar los que sigan libres.

Comparación del agente: coincide con RN-04, RN-20, RN-21, RN-22, RN-24 y RN-25; el cálculo es correcto (210 minutos ÷ 20 = 10 turnos completos, sobran 10 minutos). Se incorporó como CA-01.15.

### D59 — Límite de superposición (ejemplo inválido del estudiante)

- **Pregunta del agente:** publicar el mismo miércoles, con el Dr. Andrade, de 16:00 a 18:00 con turnos de 20 minutos: qué se publica y si el turno de las 17:20, que empieza justo cuando termina el último anterior, se superpone.
- **Ejemplo del estudiante (texto sin editar):**

> Vuelvo a «Horarios», elijo al Dr. Andrade y pongo el mismo miércoles 11, de 16:00 a 18:00, con turnos de 20 minutos. Espero que publique solo los de 17:20 y 17:40, porque los de 16:00, 16:20, 16:40 y 17:00 chocan con turnos que ya existen. El resumen debe decir «2 turnos publicados, 0 minutos sobrantes, 4 no publicados por superponerse». El turno de las 17:20 sí se publica, porque empieza justo cuando termina el último anterior y eso no es superposición. Los turnos que ya había no cambian.

- **Resultado:** confirma la lectura del agente de B1 como publicación parcial y fija el límite: un turno que empieza exactamente cuando termina otro no se superpone. Se agregó a RN-24 y como CA-01.16.

### Aprobación de `agenda-consultorio`

- **Texto del estudiante:** «Apruebo agenda-consultorio, revisión 2026-11-09T05:15:37.840Z»
- **Fecha:** 2026-11-09 (hora local).
- **Antes de aprobar**, el agente le pidió revisar en especial los puntos redactados por el agente: RN-19 (mensaje sin decir cuál dato falla), B7, B8 y que «administrar cuentas» incluye desbloquear, recuperar o cambiar la contraseña. El estudiante no pidió cambios.
- **Transición en AHK:** `draft` → `approved` mediante `specs.transition`; la revisión aprobada es la de `lastUpdated` 2026-11-09T05:15:37.840Z (la transición solo cambia el estado; nuevo `lastUpdated`: 2026-11-09T05:17:45.847Z). Sus casos fuente estaban aprobados. `specs.validate`: sin errores.

### Explicación propia del estudiante — sección 9 (versión final, texto sin editar)

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

Nota del agente: el estudiante escribió el texto en tres versiones. En las dos primeras, el agente señaló espacios sin completar, un pedido dirigido al agente, el nombre del caso (`reservar-cita`, no `reserva-cita`), que `ahk health` no se resolvió y que los ejemplos de José Pérez provenían de la IA; no reescribió el texto. El estudiante corrigió y declaró el origen de los ejemplos.

### D60 — Frases desactualizadas en las especificaciones aprobadas

- **Detectadas al preparar `fase-02.md`:** en `agenda-consultorio`, «RN-02 (criterio de tiempo: cuenta la hora de inicio)» resumía mal RN-02, que dice «cuenta la hora en que el familiar confirma»; en `gestion-cita-codigo` y `reserva-cita`, otras especificaciones figuraban como «pendiente(s)» cuando ya estaban aprobadas; en `gestion-cita-codigo`, «la secretaria ve el contacto (D23)» era anterior a D51. Eran errores de redacción del agente, no cambios de reglas.
- **Alternativas presentadas por el agente:** A) dejarlas y declarar en la entrega cuál es el texto vigente; B) corregir solo esas frases y volver a aprobar las tres especificaciones.
- **Elección del estudiante:** B.
- **Motivo (texto del estudiante):** «Elegí corregir solo esas frases y volver a aprobar, porque la consigna pide que no haya versiones contradictorias del mismo requisito y una nota aclaratoria deja dos textos para la misma regla. Los cambios son de una o dos líneas y no modifican ninguna regla.»
- **Nota del agente:** el mensaje del estudiante incluía además una frase dirigida a él («La decisión y el motivo tienen que ser tuyos…»), que no se registra como motivo; el agente le pidió confirmar que el motivo es propio.
- **Revisión:** las tres especificaciones pasaron de `approved` a `draft` mediante `specs.transition`; se corrigieron solo esas frases (más la referencia a D60 en sus decisiones); `specs.validate` sin errores. Revisiones para aprobar: `gestion-cita-codigo` 2026-11-09T05:51:58.351Z; `reserva-cita` 2026-11-09T05:58:17.596Z; `agenda-consultorio` 2026-11-09T05:59:50.082Z.

### Nueva aprobación tras D60

- **Textos del estudiante:** «Apruebo gestion-cita-codigo, revisión 2026-11-09T05:51:58.351Z», «Apruebo reserva-cita, revisión 2026-11-09T05:58:17.596Z», «Apruebo agenda-consultorio, revisión 2026-11-09T05:59:50.082Z».
- **Fecha:** 2026-11-09 (hora local).
- **Transiciones en AHK:** `draft` → `approved` mediante `specs.transition` (nuevos `lastUpdated`: `gestion-cita-codigo` 2026-11-09T06:02:20.351Z; `reserva-cita` 2026-11-09T06:02:20.903Z; `agenda-consultorio` 2026-11-09T06:02:21.247Z; la transición solo cambia el estado).
- **Motivo de D60:** el agente pidió al estudiante confirmar que el motivo es propio; el estudiante no respondió de forma explícita a esa pregunta.

### Revisión de `fase-02.md` por el estudiante

- **Respuestas del estudiante (texto sin editar):** «esta bien. dame el pdf» y «Esta perfecto, termina lo que te falta» (2026-11-10).
- El PDF se generó a pedido del estudiante (ver «Comprobaciones»); el estudiante debe abrirlo y revisarlo completo antes de entregarlo.

## Exclusiones nuevas (fase 2)

| Exclusión | Decisión | Documentos relacionados |
|---|---|---|
| Recuperar o reenviar un código de reserva perdido | D40 | `gestion-cita-codigo`, «Reserva» |
| Verificar el contacto con un código antes de reservar (solo se revisa el formato) | D46 | `reserva-cita` |
| Teléfonos fijos o de otros países (solo celulares de Ecuador) | D46 | `reserva-cita` |
| Limitar cuántas citas tiene un paciente | D48 | `reserva-cita` |
| Publicar varios días de una vez | D54 | `agenda-consultorio` |
| Duraciones fuera de la lista (15, 20, 30, 45, 60) y turnos de distinta duración en un mismo bloque | D52, D53 | `agenda-consultorio` |

## Especificaciones funcionales

| Especificación | Identificador AHK | Casos fuente | Estado |
|---|---|---|---|
| Gestión de una cita con su código | gestion-cita-codigo | consultar-cita-codigo, cancelar-cita, cambiar-cita | aprobada por el estudiante; revisión vigente aprobada el 2026-11-09: 2026-11-09T05:51:58.351Z |
| Reserva de una cita médica | reserva-cita | reservar-cita | aprobada por el estudiante; revisión vigente aprobada el 2026-11-09: 2026-11-09T05:58:17.596Z |
| Agenda del consultorio | agenda-consultorio | publicar-horarios, consultar-citas | aprobada por el estudiante; revisión vigente aprobada el 2026-11-09: 2026-11-09T05:59:50.082Z |

## Pendientes de la fase 2

- `gestion-cita-codigo`: aprobada (ver «Aprobación de `gestion-cita-codigo`»).
- Casos fuente: no se modifican (D42), salvo la condición previa de `reservar-cita`, revisada y aprobada de nuevo (D49); la entrega marca sus preguntas abiertas como resueltas (secciones 7 y 20).
- `reserva-cita`: aprobada (ver «Aprobación de `reserva-cita`»).
- Puntos de D45 resueltos: el nombre del familiar es obligatorio (D50); la secretaria ve solo su nombre y teléfono (D51).
- `agenda-consultorio`: aprobada (ver «Aprobación de `agenda-consultorio`»).
- Sección 9: escrita por el estudiante (ver «Explicación propia del estudiante — sección 9»).
- Documento acumulativo `docs/entregas/fase-02.md`: revisado por el estudiante («Esta perfecto»); PDF generado a su pedido; falta que el estudiante abra el PDF, lo revise completo y lo entregue.
- `ahk health` sigue fallando en Windows (pendiente de consultar al docente).
- Nueva aprobación tras D60: hecha.

---

# Registro del proceso — Fase 3 · Diseño técnico

## Comprobaciones del entorno (2026-11-10, antes del trabajo asistido)

| Comprobación | Quién | Resultado | Límite |
|---|---|---|---|
| `node --version` / `pnpm --version` / `ahk --version` | Agente | v22.23.4 / 11.17.0 / 3.0.0 | Confirma versiones; no prueba el producto. |
| `ahk doctor` (MCP) | Agente | Agentes (lead, explorer, consultant, builder, reviewer) y skills completos. Aviso: AHK 3.7.0 disponible; no se actualiza porque la consigna exige 3.0.0. | Diagnóstico del entorno. |
| Skill `ahk-spec-tech` | Agente | `SKILL.md`, `resources/workflow.md` y `resources/template.md` legibles. | — |
| MCP `specs.list` (llamada real) | Agente | 6 casos de uso y 3 especificaciones funcionales (`agenda-consultorio`, `reserva-cita`, `gestion-cita-codigo`), todos `approved`; ningún `spec-tech`; sin diagnósticos. | Prueba la conexión y los estados; no las decisiones. |
| MCP `specs.get` de `agenda-consultorio` | Agente | Recuperada mediante AHK (`lastUpdated` 2026-11-09T06:02:21.247Z). | — |
| Aplicación base (`package.json`) | Agente | Instalados: `react` y `react-dom` 19.2.8, TypeScript 6.0.3, Vite 8.2.2, oxlint. No instalados: `react-router`, `@tanstack/react-query`, `zustand`, `zod`, `@mantine/core`, `@mantine/form`. | Lo no instalado es diseño propuesto; esta fase no instala dependencias. |
| Context7 | Agente | No disponible: no está en `.mcp.json` ni aparece en la sesión. | Bloquea las decisiones que dependen de documentación de librerías (BQ-02). |
| Health automático de AHK (`tasks.claim` de la tarea 1) | Agente | **Falló**: `"\"%USERPROFILE%\Downloads\proyecto-bootcamp\health.bat\"" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.` La tarea quedó en modo `blocked` y AHK no permitió escribir este registro; el estudiante lo pegó manualmente. | Mismo fallo de las fases 1 y 2. Hipótesis sin confirmar: AHK 3.0.0 escapa mal la ruta del `.bat` en Windows. No se cambió la versión ni la configuración. Pendiente de consultar al docente. |
| PDF de la fase 1 | Agente (builder), a pedido del estudiante | Copiado de `Avance_1.pdf` a `docs/entregas/consultorio-medico-privado-fase-01.pdf`; tamaño (1.867.623 bytes) y SHA256 iguales al original. | Conserva la entrega; no revisa su contenido. |

## Retroalimentación docente de las fases 1 y 2

- No recibida al 2026-11-10. Respuesta del estudiante (texto sin editar): «No por ahora no me ha dado una nota, el profesor aun no me da indicaciones». No se presenta ninguna aprobación docente.

## Modo de trabajo en la fase 3

Una decisión por turno. El agente presenta alternativas con sus consecuencias, sin elegir; el estudiante elige y escribe su motivo.

## Explicación del estudiante de una operación: publicar los turnos de un médico (texto sin editar)

> **Qué pasa, en orden**
>
> La secretaria ingresa con su usuario y contraseña. Sin eso no puede usar «Horarios» ni «Citas».
> Entra a «Horarios» y elige un médico de la lista, que muestra su especialidad.
> Indica un solo día, la hora de inicio, la hora de fin y la duración de cada turno. La duración se elige de una lista fija: 15, 20, 30, 45 o 60 minutos. Si quiere publicar varios días, repite el proceso una vez por día.
> Confirma. El producto arma turnos seguidos de esa duración desde la hora de inicio y solo crea los que terminan a la hora de fin o antes. Los minutos que sobran no se publican.
> Si el día es hoy, no publica los turnos que ya empezaron. Si el médico ya tenía turnos que se cruzan con los nuevos, tampoco publica esos.
> Muestra los turnos publicados de ese médico y ese día, y un resumen: cuántos turnos se publicaron, cuántos minutos sobraron y cuántos no se publicaron por haber empezado o por superponerse.
> Desde ese momento, los familiares ven esos turnos libres al reservar en la especialidad del médico, con su nombre.
>
> Ejemplo. El miércoles, de 14:00 a 17:30, turnos de 20 minutos con el Dr. Andrade: se publican 10 turnos (el último a las 17:00, que termina a las 17:20) y sobran 10 minutos.
>
> **Reglas que se aplican**
>
> Solo la secretaria publica o quita turnos, y solo después de ingresar. Con 5 intentos fallidos seguidos de ingreso, debe esperar 15 minutos (RN-18, RN-19).
> Un solo día por publicación y duraciones de la lista fija (RN-20, RN-21).
> No se crean turnos incompletos (RN-22).
> Hoy solo se publican turnos que todavía no empezaron (RN-23).
> Un médico no puede tener dos turnos a la vez. Si el inicio de uno coincide con el fin de otro, no se superponen (RN-24).
> Solo se quitan turnos libres, nunca uno que ya tiene cita (RN-25).
>
> **Qué puede salir mal**
>
> Datos inválidos: falta algún dato, el día ya pasó o la hora de fin no es posterior a la de inicio. El producto dice qué corregir y no publica nada.
> No entra ningún turno completo: por ejemplo, de 8:00 a 8:30 con turnos de 45 minutos. No se publica nada.
> Todos los turnos de hoy ya empezaron: no se publica nada.
> Superposición: se publican los turnos que no chocan y se informa cuáles no. Si todos chocan, no se publica nada.
> Quitar un turno con cita: el producto no lo permite y la cita sigue igual.
> Quitar un turno mientras un familiar lo está reservando: al confirmar, el familiar ve que ese horario ya no está disponible y se le muestran los libres restantes. No se registra la cita.
> La secretaria sale antes de confirmar: no se publica nada.

- **Autoría (declarada por el estudiante el 2026-11-10):** lo escribió con ayuda de una IA (Claude), a partir de la especificación `agenda-consultorio`. Respuesta del estudiante sobre sus cambios (texto sin editar): «La mayoria de cosas las deje tal cual, ya que me dio una buena opcion».
- **Comparación del agente con `agenda-consultorio` (PR-01):** coincide con RN-18 a RN-25, B1, B2, B4 a B8 y CA-01.15; sin contradicciones. Matices señalados, sin contradicción: en RN-23 cuenta la hora en que la secretaria confirma (criterio de RN-02); RN-24 se aplica aunque el turno existente no tenga cita; el recorrido no describe quitar un turno libre (B3).

## Bloqueos de la fase 3

### BQ-01 — No existe un servicio remoto

- **Respuesta del estudiante (2026-11-10):** «No existe por ahora».
- **Impacto:** TanStack Query exige al menos una consulta remota real del producto (sección 5 de la consigna). Sin un servicio viable no se da por resuelto su uso (sección 25): no se inventan endpoints ni se envuelve una lista local en una consulta.
- **Dependencias que necesitan servidor en cualquier caso:** validar el usuario y la contraseña de la secretaria (RN-18, RN-19) y enviar correos o mensajes de WhatsApp (las claves privadas no pueden exponerse en el navegador).
- **Acción:** el estudiante consulta al docente si habrá un backend docente y con qué endpoints; si no, qué se acepta como consulta remota real; y cómo tratar el ingreso de la secretaria y el envío de mensajes.
- **Estado al 2026-11-10:** sin indicaciones del docente. Respuesta del estudiante (texto sin editar): «el profesor aun no me da indicaciones». En su sección 9, el estudiante aclaró que todavía no consultó al docente por BQ-01 ni por `ahk health`. Sigue pendiente.

### BQ-02 — Context7 no disponible

- **Impacto:** se detienen las decisiones sobre React Router, Zustand, Zod con Mantine Form y Mantine Modal hasta recuperar el acceso; no se diseña con APIs recordadas.
- **Acción:** instalar Context7 (`claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp`), reiniciar el agente y repetir las comprobaciones al retomar.
- **Estado: resuelto el 2026-11-10.** El estudiante instaló Context7 con `cmd /c "claude mcp add --scope user context7 -- cmd /c npx -y @upstash/context7-mcp"`. El primer intento, escrito directamente en PowerShell, falló con `error: unknown option '-y'` porque PowerShell consumió el `--`. Después de reiniciar, una llamada real a Context7 respondió (ver «Comprobaciones al retomar»).

## Decisiones confirmadas (fase 3)

### D61 — ¿Cómo se agrupan las especificaciones técnicas?

- **Restricción comprobada en AHK:** cada `spec-tech` tiene un solo `sourceSpec`.
- **Alternativas presentadas por el agente:** A) un `spec-tech` por especificación funcional (3); B) tres más un documento transversal de arquitectura; C) un único `spec-tech`.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí un spec-tech por cada especificación funcional. Cada documento técnico apunta a un solo origen, como exige AHK, y es lo bastante corto para revisarlo y aprobarlo. Con un transversal el origen no queda claro, y con un único documento dos especificaciones quedarían sin vínculo y sería muy largo de revisar. Lo común lo defino en un solo documento y los otros lo referencian.»
- **Consecuencia:** se prevén tres `spec-tech`, con `sourceSpec` `agenda-consultorio`, `reserva-cita` y `gestion-cita-codigo`.

### D62 — ¿Qué `spec-tech` contiene lo común?

- **Qué es lo común:** la tabla completa de rutas, el layout general, los proveedores de la aplicación (Mantine y el cliente de TanStack Query) y las convenciones de carpetas.
- **Alternativas presentadas por el agente:** A) `agenda-consultorio`; B) `reserva-cita`; C) `gestion-cita-codigo`.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí `agenda-consultorio` como documento base porque es lo primero que se construye: sin turnos publicados no hay nada que reservar ni que cambiar. Además contiene el acceso de la secretaria, la pieza de rutas más estructural, junto con su regla. Las otras dos especificaciones dependen de esta, así que lo común nace en el origen de esa cadena y ellas lo referencian.»
- **Consecuencia señalada por el agente:** la tabla de rutas del `spec-tech` de `agenda-consultorio` incluirá también las pantallas del familiar, cada una con su caso de origen (`reservar-cita`, `consultar-cita-codigo`); los otros dos documentos la referencian.

### D63 — ¿Cómo se organizan las rutas?

- **Fuente consultada:** React Router, modo declarativo (rutas de layout, `index`, `:param` y `*`).
- **Alternativas presentadas por el agente:** A) rutas planas, en las que cada pantalla del personal comprueba el ingreso; B) dos grupos con layout (público y del personal), con la protección escrita una sola vez para Horarios y Citas y una ruta `*`; C) un solo layout para todo.
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «La B. Elegí dos grupos con layout: uno público para el familiar y uno del personal para la secretaria. Así la comprobación de ingreso se escribe una sola vez y cubre Horarios y Citas, y el familiar no ve el menú del personal. Acepto tener dos layouts más a cambio de no repetir la protección en cada pantalla. Sé que redirigir en el navegador es solo una guardia visual y que la protección real depende del servidor.»
- **Límite señalado por el agente:** la protección real de RN-18 depende del servidor (BQ-01).

### D64 — ¿El código va en la URL de «Mi cita»?

- **Alternativas presentadas por el agente:** A) en la ruta (`/mi-cita/:codigo`); B) solo en el formulario (`/mi-cita`); C) como parámetro de búsqueda (`?codigo=`).
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «La B. Elegí que el código solo viva en el formulario. Como conocer el código basta para cancelar la cita (RN-07), no quiero que quede en el historial ni en la barra de direcciones, donde cualquiera podría verlo o copiarlo. Acepto que, si Marcos recarga la página, tenga que escribirlo otra vez. C la descarté porque expone igual que A.»
- **Consecuencias señaladas por el agente:** «Cambiar» se muestra dentro de `/mi-cita`, sin ruta propia. El mensaje sigue llevando el código y no un enlace; cambiar eso sería un cambio funcional.

### D65 — ¿Cómo se navega dentro de «Reservar cita»?

- **Alternativas presentadas por el agente:** A) una sola ruta; B) la especialidad y el día en la URL (`?especialidad=…&dia=…`); C) una ruta por paso.
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «La B. Elegí poner la especialidad y el día en la URL. Así, si el familiar recarga o vuelve atrás, no pierde lo que ya eligió, y no expongo nada sensible porque una especialidad y una fecha no son una llave. Los datos personales y el código siguen fuera de la URL, como en la decisión anterior. Acepto tener que validar esos parámetros. Descarté C porque pide estado compartido entre pantallas y más rutas para algo que B resuelve con menos.»
- **Fuente:** `useSearchParams` de React Router. Los valores se leen al dibujar, sin copiarlos con `useEffect`.

### D66 — ¿Dónde viven los filtros de «Citas»?

- **Alternativas presentadas por el agente:** A) el día, el médico y la búsqueda en la URL; B) el día y el médico en la URL y la búsqueda en la pantalla; C) todo en la pantalla.
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «La B. Elegí poner el día y el médico en la URL y dejar la búsqueda solo en la pantalla. El nombre de un paciente es un dato personal y en recepción el equipo puede ser compartido, así que no quiero que quede en el historial ni en la barra de direcciones. El día y el médico no son sensibles, y con ellos en la URL recargar o volver atrás no hace perder la vista. Acepto que al recargar se borre el texto de búsqueda y tener que validar los parámetros, como en D65.»
- **Consecuencia:** la lista filtrada se calcula al dibujar (estado derivado), sin guardar una copia ni usar `useEffect`.

### D67 — ¿A dónde va la secretaria después de ingresar?

- **Alternativas presentadas por el agente:** A) siempre a Citas; B) siempre a Horarios; C) vuelve a la página que intentó abrir (destino guardado en `state`), con un destino por defecto.
- **Elección del estudiante:** C, con Citas como destino por defecto.
- **Motivo (texto sin editar):** «La C. Elegí que, después de ingresar, la secretaria vuelva a la página que intentó abrir, con el día y el médico que tenía. Así, si su sesión vence mientras mira las citas, no pierde lo que buscaba. Acepto una pieza más y validar que el destino guardado sea una dirección del grupo del personal. Si entra directo al ingreso, va a Citas, porque supongo que es lo que más usa en recepción, aunque no tengo datos de uso para comprobarlo.»
- **Fuente:** `useNavigate` de React Router (`replace` y `state`).

### D68 — ¿Qué pasa si un parámetro de la URL no es válido?

- **Alternativas presentadas por el agente:** A) se ignora en silencio; B) se usa el valor por defecto y se muestra un aviso; C) se muestra la página «no encontrada».
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «La B. Elegí volver al valor por defecto y mostrar un aviso. Un parámetro inválido suele ser un error pequeño, y no quiero sacar al usuario de la pantalla por eso. Prefiero explicarle qué pasó, por ejemplo «la fecha del enlace no es válida; se muestra hoy», y dejarlo seguir. Descarté A porque el usuario podría no entender por qué se borró lo que tenía, y C porque castiga un error pequeño con una página «no encontrada». Acepto tener que redactar y probar el mensaje.»
- **Nota del agente:** la validación tiene dos niveles: la forma, que se comprueba en el navegador, y la existencia, que se comprueba con datos del servidor (BQ-01).

### D69 — ¿Quién administra la sesión de la secretaria en el cliente?

- **Inventario del agente:** la sesión de la secretaria es el único candidato real a estado del cliente compartido entre pantallas. La especialidad y el día ya están en la URL; el código y los avisos son locales; turnos, citas y médicos son datos remotos.
- **Alternativas presentadas por el agente:** A) un store de Zustand con «ingresó» y el nombre, con las acciones entrar y salir, sin contraseña ni token y sin persistencia; B) una consulta de TanStack Query; C) un contexto de React.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí un store de Zustand para la sesión de la secretaria, porque es el único dato del cliente que varias pantallas necesitan a la vez (la guardia, el layout y el ingreso) y que no es un dato remoto, un formulario ni algo que ya esté en la URL. Guarda solo si ingresó y su nombre, nunca la contraseña ni un token, y no persiste; la sesión real la maneja el servidor. Acepto que al recargar tenga que volver a ingresar. Descarté B porque deja a Zustand sin uso y habría que acordar el ajuste con el docente, y C porque no cumple el requisito.»

### D70 — ¿Qué formulario se documenta en detalle con Zod y Mantine Form?

- **Alternativas presentadas por el agente:** A) los datos de la reserva; B) la publicación de un bloque de turnos; C) el ingreso de la secretaria.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí el formulario de datos de la reserva porque es el que más reglas condicionales tiene: el acompañante depende de la edad del paciente y el correo depende del canal, y eso muestra bien qué aporta Zod. Ya hay ejemplos aprobados, uno válido y otro inválido, y lo usa el familiar, que es el actor principal. Que el turno siga libre no lo valida el formulario sino el servidor, y eso también lo explico. Descarté B porque lo más interesante de ese caso depende del servidor, y C porque es muy pobre.»

### D71 — ¿Para qué se usa el Modal obligatorio?

- **Alternativas presentadas por el agente:** A) confirmar la cancelación (PR-05, CN1); B) confirmar el cambio (PR-06, F2); C) confirmar que se quita un turno. C no está aprobada: sería un cambio funcional.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí el Modal de confirmación de la cancelación porque es la acción irreversible del familiar y ahí es donde más aporta. El contenido es corto (resumen de la cita y dos botones) y su comportamiento es claro: no se cierra mientras se cancela, muestra el error dentro del Modal si falla y deja la cita igual. Que la cancelación quede confirmada depende del servidor. Descarté C porque agregaría una confirmación que las especificaciones no piden, y B porque tiene más casos de error y quiero documentar uno en profundidad; el cambio puede usar el mismo patrón.»

### D72 — ¿Qué consulta remota se documenta en profundidad?

- **Alternativas presentadas por el agente:** A) los turnos libres de una especialidad y un día; B) las citas de un día; C) una cita por su código.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí la consulta de turnos libres porque es la que más se conecta con lo que ya decidí: su clave sale de la URL (D65), solo se pide si los parámetros son válidos (D68) y se reutiliza al cambiar una cita. También tiene la sincronización más clara con las mutaciones: al reservar se invalidan los turnos de esa especialidad, y si el turno ya fue tomado, el error vuelve a pedirlos y se muestran los que quedan. Todo esto es hipótesis hasta resolver BQ-01. Descarté B porque es solo de consulta y no muestra esa sincronización.»
- **Estado:** hipótesis hasta resolver BQ-01.

### D73 — ¿Cómo se expresan en Zod las reglas condicionales del formulario de reserva?

- **Alternativas presentadas por el agente:** A) un objeto con todos los campos y reglas cruzadas en `.refine()`; B) variantes separadas por canal (unión discriminada); C) las reglas condicionales fuera de Zod, en una validación propia de Mantine Form.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí un solo objeto con todos los campos y las reglas cruzadas en un .refine(). Así cada regla del schema se lee casi igual que RN-14 y RN-15, y la cadena regla → schema es fácil de explicar. Las dos condiciones, la edad y el canal, quedan juntas en vez de repartirse entre variantes. Acepto que falta confirmar cómo mostrar el error junto al campo correcto. Descarté B porque habría que combinar variantes para las dos condiciones, y C porque saca las reglas más importantes del schema.»
- **Pendiente resuelto después:** la documentación oficial (zod.dev) confirma que `.refine(..., { error, path: ["campo"] })` asigna el error al campo indicado. Riesgo anotado: un `refine` de objeto no se ejecuta si antes hubo errores que no permiten continuar (por ejemplo, de tipo); se mitiga con valores iniciales del tipo correcto o con la opción `when`.

### D74 — ¿Cuándo ve el familiar los errores del formulario?

- **Fuente:** Mantine Form 9 (`form.onSubmit`, `validateInputOnBlur`, `validateInputOnChange`, `clearInputErrorOnChange`).
- **Alternativas presentadas por el agente:** A) solo al confirmar; B) al salir de cada campo y además al confirmar; C) mientras se escribe.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí mostrar los errores solo al confirmar. Así el familiar escribe sin interrupciones, que es lo que busco desde D34 y D35, y al pulsar «Confirmar» ve todos los errores juntos, cada uno junto a su campo. También es coherente con las reglas cruzadas, que se evalúan sobre el objeto completo. Acepto que los errores lleguen todos al final. Descarté C porque marca error en cada tecla, y B porque obligaba a limitar la validación al salir y mantener una regla más.»

### D75 — ¿Dónde vive el código después de confirmar la reserva?

- **Alternativas presentadas por el agente:** A) solo en la respuesta de la mutación, en la memoria de la pantalla; B) copiado a `sessionStorage`; C) A más un aviso al intentar salir si el mensaje falló (un comportamiento que las especificaciones no piden).
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí que el código viva solo en la respuesta de la mutación, en la memoria de la pantalla. El código es la llave de la cita (RN-07), por eso no lo copio a ningún otro lado ni lo persisto, igual que en D64 y D69. Si el mensaje llegó, el familiar tiene el código en su correo o WhatsApp. Acepto que, si el mensaje falló y recarga sin haberlo anotado, lo pierda; la pantalla lo muestra destacado y avisa del fallo para que lo anote. Descarté B porque guarda la llave en el navegador, y C porque agrega un comportamiento que las especificaciones no piden.»

### Borrador de `reserva-cita-tech`

- Creado mediante `specs.create` como `draft`, con `sourceSpec` `reserva-cita`; `lastUpdated` 2026-11-11T01:47:01.091Z; `specs.validate`: {"valid":true,"errors":[]}. Lo escribió el builder a pedido del estudiante, fuera del flujo de tareas (bloqueado por `ahk health`).
- Aplica D64, D65, D68, D70, D72, D73, D74 y D75. Las propuestas del agente pendientes de revisión están listadas al final del documento.

### Revisión de `reserva-cita-tech` (paso 3)

- **Lectura del borrador (revisión 2026-11-11T01:47:01.091Z):** el estudiante respondió «Esta perfecto». Las propuestas del agente quedan aceptadas sin cambios, salvo la que pasó a D76.

**Recorrido explicado por el estudiante: Pedro, un menor sin acompañante y luego un turno tomado (texto sin editar)**

> Pedro pulsa «Confirmar». Mantine Form ejecuta la validación con el schema de Zod (vía schemaResolver).
> El teléfono 0991234567 es válido: tiene 10 dígitos y empieza con 09 (D46). El correo no se exige porque el canal es WhatsApp (RN-15).
> Falla la regla cruzada de RN-14: el paciente es menor, así que el acompañante es obligatorio. Es la regla que vive en el .refine() sobre el objeto completo.
> El mensaje aparece en el formulario, junto al campo del acompañante (esto quedó «por confirmar» en la decisión de Zod).
> Lo que no ocurre: no se llama a la mutación, no se envía nada al servidor, no se reserva el turno, no se genera código y no se manda ningún mensaje. La URL no cambia y lo que Pedro escribió sigue en el formulario.
>
> Zod ahora pasa todas las reglas y Mantine Form llama a la mutación de reservar (useMutation de TanStack Query).
> Quien lo detecta es el servidor, no el cliente. La validación del cliente no reserva el turno; el servidor comprueba que siga libre (RN-01, A2) y rechaza la reserva.
> Pedro ve que ese horario ya no está disponible y no se registra ninguna cita ni se genera código.
> Los turnos libres de pediatría ese día se vuelven a pedir (D72): se invalidan y Query los trae de nuevo, así que el de las 16:00 ya no aparece y se muestran los que quedan.
> La URL sigue igual (especialidad y dia).
> Los datos que ya había escrito: mientras Pedro sigue en la pantalla, viven en el estado de Mantine Form. Comprueba en A2 de reserva-cita y en tus decisiones si se conservan al elegir otro horario o si la pantalla lo trata distinto. No lo afirmes sin comprobarlo.

- **Comparación del agente:** coincide con D46, RN-14, RN-15, D72, D73 y A2/A4. Precisiones:
  - el error junto al acompañante ya estaba confirmado por la documentación (`.refine` con `path`);
  - el documento también quita la selección del turno (estado local) e invalida `['dias', especialidad]`.
- **Comprobación pedida por el estudiante:** A2 y A4 de `reserva-cita` no dicen nada sobre los datos del formulario, y ninguna decisión lo trataba. En el borrador figuraba como propuesta del agente, aceptada en bloque con «Esta perfecto». El agente pidió una confirmación explícita, que dio lugar a D76.

### D76 — ¿Se conservan los datos del formulario si el turno fue tomado o ya empezó?

- **Origen:** propuesta del agente en el borrador (paso 11). El estudiante pidió comprobarla y la confirmó de forma explícita.
- **Elección del estudiante:** se conservan los datos y solo se quita el turno elegido (A2 y A6).
- **Motivo (texto sin editar):** «Confirmo que, si el turno fue tomado (A2) o ya empezó (A6), se conservan los datos que Pedro escribió y solo se quita el turno elegido. No quiero que el familiar pierda lo que ya llenó por algo que no es su culpa, y eso es coherente con mi motivo de no estresar al usuario (D34, D35). Técnicamente no cuesta nada, porque los valores siguen en Mantine Form, y los datos del paciente y del familiar no dependen del turno. La pantalla avisa que el horario ya no está disponible y muestra los libres restantes.»

**Decisión explicada por el estudiante: qué regla valida Zod (texto sin editar)**

> 1. De qué regla sale y cómo se escribe. Sale de D46: el celular del familiar es de Ecuador, de 10 dígitos y empieza con 09. En el schema de Zod es un campo de texto con una expresión regular, algo como z.string().regex(/^09\d{8}$/, "mensaje de error"). El mensaje le dice al familiar qué formato se espera.
>
> 2. En qué momento se ejecuta. Al pulsar «Confirmar» (D74): Mantine Form le pasa los valores al schema mediante schemaResolver y ahí Zod comprueba la regla. Tener el tipo inferido con z.infer no es validar: z.infer solo le da a TypeScript el tipo de los datos mientras escribo el código, y no ejecuta ninguna comprobación en tiempo de ejecución. Quien valida es el schema cuando se ejecuta sobre los valores reales.
>
> 3. Qué ve el familiar si falla. Si pone, por ejemplo, un teléfono de 9 dígitos, al confirmar ve el mensaje de error junto al campo del teléfono y no se envía nada. Cuando corrige el campo, su error desaparece (D74).
>
> 4. Qué no puede garantizar Zod en el navegador. Que el número exista, que sea realmente del familiar o que el mensaje llegue por WhatsApp: Zod solo comprueba la forma. Tampoco garantiza que el turno siga libre, y eso lo decide el servidor. Además, el servidor debe volver a validar el formato, porque las comprobaciones del navegador se pueden saltar.

- **Comparación del agente:** coincide con D46, D73, D74 y con «Lo que el formulario no garantiza». Matiz: el error desaparece cuando el valor cambia (`clearInputErrorOnChange`), no cuando queda correcto; se vuelve a evaluar al confirmar.
- **Corrección del documento:** el estudiante señaló que el servidor debe volver a validar el formato, algo que el borrador no decía. Respuesta del estudiante (texto sin editar): «Sí, agrégalo. El servidor debe volver a validar RN-14 y RN-15, porque la validación del navegador se puede saltar: solo existe el formulario del navegador, pero cualquiera podría enviar datos sin pasar por él. Es lo mismo que acepté en D63 con la guardia visual, y queda como dependencia de BQ-01.»

**Alternativa explicada por el estudiante: D74 (texto sin editar)**

> Decisión: los errores del formulario se muestran solo al confirmar (D74).
>
> 1. Qué problema resolvía mi opción. Quería que el familiar llene el formulario sin interrupciones, sin que le aparezcan errores mientras escribe. Eso es coherente con mi motivo de no estresar al usuario (D34, D35).
>
> 2. Qué ofrecía la alternativa que descarté. Validar al salir de cada campo (y además al confirmar) tenía una ventaja real: el familiar corrige cada error en el momento, por ejemplo un teléfono de 9 dígitos, y no tiene que revisar varios errores juntos al final, sobre todo en un formulario largo.
>
> 3. Qué costo acepté. Los errores llegan todos juntos al pulsar «Confirmar», así que puede tener que corregir varios a la vez. Aun así, cada error aparece junto a su campo y desaparece apenas lo corrige.
>
> 4. Por qué aun así encaja mejor. Las reglas cruzadas (acompañante según la edad, correo según el canal) viven en un .refine() sobre el objeto completo (D73) y se evalúan al confirmar de todos modos. Con la validación por campo, el aviso del acompañante podría aparecer antes de que llegue a ese campo, y habría que limitar la validación a los campos de formato, que es otra regla más. Mostrar todo al confirmar mantiene un solo comportamiento y respeta D34 y D35.

- **Comparación del agente:** coincide con D73 y D74. El mismo matiz que antes: el error desaparece cuando el valor cambia, no cuando queda correcto.

**Actualización del borrador:**
- Cambios aplicados mediante `specs.update_content`:
  - el paso 11 pasa de «Propuesta» a D76;
  - se agrega la revalidación de RN-14 y RN-15 en el servidor;
  - D76 se agrega a la lista de decisiones;
  - se agrega una fila de verificación de la revalidación en el servidor (bloqueada por BQ-01).
- Nueva revisión: 2026-11-11T02:01:05.648Z. `specs.validate`: sin errores.
- Lo escribió el builder a pedido del estudiante, fuera del flujo de tareas, que sigue bloqueado por `ahk health`.

### Aprobación de `reserva-cita-tech`

- **Texto del estudiante:** «Apruebo reserva-cita-tech, revisión 2026-11-11T02:01:05.648Z»
- **Fecha:** 2026-11-10 (hora local).
- **Antes de aprobar:** el agente indicó que seguían abiertas BQ-01 (contrato del servicio y cómo evitar duplicados al reintentar) y la pregunta de cuándo quitar de la URL un parámetro inválido. También recordó que aprobar el diseño no autoriza implementarlo.
- **Transición en AHK:** `draft` → `approved` mediante `specs.transition`. La revisión aprobada es la de `lastUpdated` 2026-11-11T02:01:05.648Z; la transición solo cambia el estado (nuevo `lastUpdated`: 2026-11-11T02:04:37.057Z). Su fuente `reserva-cita` estaba aprobada. `specs.validate`: {"valid":true,"errors":[]}.
- **Escritura:** el builder la hizo a pedido del estudiante, fuera del flujo de tareas, que sigue bloqueado por `ahk health`.

### D77 — ¿Quién decide si una cita «ya pasó»?

- **Alternativas presentadas por el agente:** A) solo el servidor, que devuelve el estado de la cita; B) solo el navegador, que compara la hora de inicio con el reloj del equipo; C) el servidor manda y el navegador vuelve a pedir la cita en momentos clave.
- **Elección del estudiante:** A.
- **Motivo (texto sin editar):** «La A. Elegí que solo el servidor decida si una cita ya pasó. Lo que cuenta es la hora en que el familiar confirma (RN-02, D41), y eso lo decide el servidor, así que quiero una sola fuente de verdad y no depender del reloj del equipo. Acepto que, si la pantalla queda abierta y llega la hora, los botones sigan visibles; si intenta cancelar, el servidor responde «ya pasó» y la regla se cumple igual. Descarté B porque un reloj mal puesto mostraría un estado equivocado y la regla quedaría en dos lugares, y C porque agrega reglas de cuándo volver a pedir que no son necesarias para cumplir la regla.»

### D78 — ¿Cuánto tiempo queda en memoria la cita consultada?

- **Fuente:** TanStack Query (`gcTime`, por defecto 5 minutos, y `removeQueries`).
- **Alternativas presentadas por el agente:** A) el valor por defecto (5 minutos); B) borrarla apenas deje de usarse (`gcTime: 0` en esa consulta); C) borrarla al pulsar «Consultar otro código».
- **Elección del estudiante:** B.
- **Motivo (texto sin editar):** «La B. Elegí que la cita se borre de la memoria apenas deje de usarse, con gcTime: 0 en esa consulta. Con el código como única llave de la cita (RN-07), no quiero que ni la cita ni el código queden en memoria más de lo necesario, igual que en D64, D69 y D75. Es una sola opción en la definición de la consulta. Acepto que, si Marcos vuelve a escribir el código, la cita se vuelva a pedir al servidor y haya una breve carga. Descarté A porque deja los datos 5 minutos sin necesidad, y C porque, si sale navegando sin pulsar el botón, quedan igual y agrega una regla más.»

### Borrador de `gestion-cita-codigo-tech`

- Creado mediante `specs.create` como `draft`, con `sourceSpec` `gestion-cita-codigo`. `lastUpdated`: 2026-11-11T02:10:41.080Z. `specs.validate`: {"valid":true,"errors":[]}.
- Lo escribió el builder a pedido del estudiante, fuera del flujo de tareas, que sigue bloqueado por `ahk health`.
- Aplica D64, D71, D72, D77 y D78. Las propuestas del agente pendientes de revisión están listadas al final del documento.

### Revisión de `gestion-cita-codigo-tech` (paso 3)

- **Lectura del borrador (revisión 2026-11-11T02:10:41.080Z):** el estudiante respondió «Esta bien». Las propuestas del agente quedan aceptadas sin cambios, salvo la que pasó a D79.

**Recorrido explicado por el estudiante: cancelar con el Modal y error «ya pasó» (texto sin editar)**

> 1. Pulsa «Cancelar»
>
> Se abre el Modal con el resumen de la cita (especialidad, médico, día, hora y paciente) y dos botones: «Sí, cancelar» y «Volver».
> Quien guarda que esté abierto es useDisclosure, el estado local de la pantalla. No lo guarda ni Query ni el servidor. La cita sigue viniendo de TanStack Query.
>
> 2. Duda y pulsa «Volver»
>
> Se cierra el Modal sin cambios (CN1): no se llama a ninguna mutación y la cita sigue confirmada. Escape y la X hacen lo mismo.
> Solo cambia el estado de useDisclosure, que pasa a cerrado.
>
> 3. Vuelve a pulsar «Cancelar» y luego «Sí, cancelar», pero ya son las 10:01
>
> Mientras espera: useMutation queda en estado pendiente y el Modal no se puede cerrar hasta que responda.
> Quién decide que ya pasó: el servidor. Lo que cuenta es la hora en que el familiar confirma (RN-02, D41): confirma a las 10:01 y la cita era a las 10:00, así que responde «ya pasó» (CN4, F6).
> Dónde ve el mensaje: dentro del Modal, no fuera.
> Cómo queda la cita: igual, sin cambios. No se registra ninguna cancelación.
>
> 4. Cierra el Modal y mira «Mi cita»
>
> Al terminar la mutación, el Modal vuelve a poder cerrarse y useDisclosure pasa a cerrado.
> Qué ve en «Mi cita»: aquí no te doy una afirmación segura. Si el estado de la cita se vuelve a pedir tras el error (Query), la cita aparecería como pasada y sin «Cancelar» ni «Cambiar» (E2). Si no se vuelve a pedir, aún se vería confirmada hasta que se refresque. En tu decisión de «quién decide que ya pasó» aceptaste el costo de que la pantalla pueda quedar desactualizada hasta que se pida de nuevo. Comprueba en tu documento qué invalida el error de «ya pasó» antes de afirmarlo en la defensa.

- **Comparación del agente:** los pasos 1 a 3 coinciden con D71, D77, RN-02, D41 y CN1. Precisiones: el clic fuera del Modal también lo cierra; en la cancelación la alternativa es CN4, y F6 es la equivalente del cambio.
- **Comprobación pedida por el estudiante (paso 4):** el borrador (PR-05) invalidaba `['cita', codigo]` al cerrar el Modal después de «ya pasó». Era una propuesta del agente, aceptada en bloque con «Esta bien», y el agente pidió confirmarla de forma explícita, lo que dio lugar a D79.

### D79 — ¿Se vuelve a pedir la cita después de un error «ya pasó»?

- **Origen:** propuesta del agente en el borrador. El estudiante pidió comprobarla y la confirmó de forma explícita.
- **Elección del estudiante:** sí; al cerrar el Modal se vuelve a pedir la cita para mostrarla como pasada (CN4 y F6).
- **Motivo (texto sin editar):** «Confirmo que, después de un error «ya pasó» (CN4 al cancelar o F6 al cambiar), al cerrar el Modal se vuelve a pedir la cita para mostrarla como pasada. El servidor acaba de avisar que el estado cambió, y no quiero que Marcos siga viendo botones que ya no sirven. Es coherente con D77, porque ahí acepté que la pantalla se quede desactualizada solo mientras nadie vuelva a pedir la cita, y aquí hay una señal clara para hacerlo. Acepto una petición más al servidor.»

**Síntesis del estudiante: qué resuelve cada herramienta obligatoria (texto sin editar)**

> React Router. Organiza las seis pantallas en un grupo público (el familiar) y un grupo del personal protegido por una guardia, y guarda en la URL lo que no es sensible: especialidad y día en Reservar, día y médico en Citas. Se relaciona con D63, D65, D66 y D67.
>
> TanStack Query. Trae y mantiene sincronizados los datos remotos: los turnos libres al reservar, las citas de la secretaria y la cita que Marcos consulta por su código. También invalida esos datos después de reservar, cancelar o cambiar. Se relaciona con D72 y con la decisión de cuánto tiempo queda en memoria la cita consultada.
>
> Zustand. Guarda la sesión de la secretaria en el cliente (si ingresó y su nombre), para que la guardia, el layout del personal y la consulta de citas la lean. Nunca guarda la contraseña ni un token, y no persiste. Se relaciona con D69.
>
> Zod con Mantine Form. Valida el formulario de la reserva antes de enviarlo: el teléfono de 10 dígitos que empieza con 09, el acompañante si el paciente es menor y el correo si el canal es correo. Los errores se muestran junto al campo al pulsar «Confirmar». Se relaciona con D73, D74 y D76.
>
> Mantine Modal. Pide confirmación antes de cancelar la cita de Marcos, que es la acción irreversible. Muestra el resumen, no se cierra mientras se cancela y muestra el error dentro del Modal si algo falla. Se relaciona con D71.
>
> Lo que todavía no existe: TanStack Query depende de algo que hoy no existe, que es el servidor y sus endpoints (BQ-01). Las consultas y mutaciones que describí son hipótesis hasta que exista.

- **Comparación del agente:** coincide con los tres `spec-tech`. Precisiones:
  - en navegación también cuentan D64 (el código no va en la URL) y D68;
  - D70 es la decisión sobre qué formulario se valida; D76 es de Mantine Form, pero no de validación;
  - el Modal también confirma el cambio, con el mismo patrón;
  - además de Query, dependen en parte de BQ-01:
    - Zustand: `entrar` solo se llama cuando el servidor acepta el ingreso;
    - el resultado de las operaciones del Modal;
    - la protección real de la guardia del router.

    Zod funciona completo en el navegador, aunque el servidor debe volver a validar RN-14 y RN-15.
- No se modificó ningún documento.

**Alternativa explicada por el estudiante: D77 (texto sin editar)**

> Decisión: solo el servidor decide si una cita ya pasó (D77).
>
> 1. Qué problema resolvía mi opción. Quería una sola fuente de verdad para una regla que importa: lo que cuenta es la hora en que el familiar confirma (RN-02, D41). Eso lo decide el servidor, y no quería que la regla quedara repartida entre el servidor y el navegador, ni que dependiera del reloj del equipo del familiar.
>
> 2. Qué ofrecía la alternativa que descarté. Que el navegador compare la hora de inicio con el reloj del equipo tenía una ventaja real: los botones «Cancelar» y «Cambiar» se ocultarían solos al llegar la hora, sin esperar a que se vuelva a pedir la cita.
>
> 3. Qué costo acepté. Si Marcos deja la pantalla abierta y llega la hora, los botones siguen visibles hasta que se vuelva a pedir la cita. Si intenta cancelar, el servidor responde «ya pasó» (CN4), así que la regla se cumple igual y el costo es de apariencia, no de integridad.
>
> 4. Por qué aun así encaja mejor. Con RN-02 y D41 la hora que cuenta es la de la confirmación, y solo el servidor la conoce de forma fiable. Un reloj adelantado 10 minutos mostraría «pasada» cuando no lo está, o al revés, y el servidor igual tendría que decidir al confirmar, así que la regla quedaría escrita en dos lugares. Además, cuando el servidor responde «ya pasó», al cerrar el Modal se vuelve a pedir la cita para mostrarla como pasada, lo que reduce el costo.

- **Comparación del agente:** coincide con D77 y D79. Sin correcciones.

**Actualización del borrador:**
- D79 se aplicó mediante `specs.update_content` en PR-05, PR-06 (paso 8) y la lista de decisiones, y la propuesta correspondiente se quitó de la lista de propuestas.
- Nueva revisión: 2026-11-11T02:16:33.017Z. `specs.validate`: sin errores.
- La escribió el builder a pedido del estudiante, fuera del flujo de tareas, que sigue bloqueado por `ahk health`.

### Aprobación de `gestion-cita-codigo-tech`

- **Texto del estudiante:** «Apruebo gestion-cita-codigo-tech, revisión 2026-11-11T02:16:33.017Z»
- **Fecha:** 2026-11-10 (hora local).
- **Antes de aprobar:** el agente indicó que seguía abierta BQ-01 (contrato del servicio, formato del código y atomicidad del cambio) y recordó que aprobar el diseño no autoriza implementarlo.
- **Transición en AHK:** `draft` → `approved` mediante `specs.transition`. La revisión aprobada es la de `lastUpdated` 2026-11-11T02:16:33.017Z; la transición solo cambia el estado (nuevo `lastUpdated`: 2026-11-11T02:21:27.752Z). Su fuente `gestion-cita-codigo` estaba aprobada. `specs.validate`: {"valid":true,"errors":[]}.
- **Escritura:** la hizo el builder a pedido del estudiante, fuera del flujo de tareas, que sigue bloqueado por `ahk health`.
- **Estado de los `spec-tech`:** los tres están aprobados (`agenda-consultorio-tech`, `reserva-cita-tech` y `gestion-cita-codigo-tech`).

## Uso de IA declarado por el estudiante (fase 3)

- **Declaración (texto sin editar):** «Sobre mi uso de IA en esta fase. Quiero que conste que, además del recorrido de publicar turnos, usé ayuda de Claude en otro chat para ordenar borradores de motivos de varias decisiones técnicas (D63 a D79) y para practicar respuestas de la defensa. Lo declaro en mi sección 9 y la reescribo con lo que entendí y decidí yo.»
- **Alcance en las revisiones:** el agente preguntó si las explicaciones dadas en las revisiones de los tres `spec-tech` (recorridos, decisiones, alternativas y síntesis de herramientas) también salieron de esa práctica con otra IA. Respuesta del estudiante: «Parcialmente».
- **Nota del agente:** los motivos de D63 a D79 y las explicaciones de las revisiones que figuran en este registro como «texto sin editar» son los textos que el estudiante entregó en esta conversación. Según su declaración, los preparó total o parcialmente con ayuda de Claude en otro chat. Las elecciones entre alternativas y las aprobaciones de cada documento las dio el estudiante en esta conversación. El agente de esta conversación no redactó esos textos.

### Explicación propia del estudiante — sección 9 (fase 3, versión final, texto sin editar)

Qué decidí. Decidí que la sesión de la secretaria viva en un store de Zustand (D69), porque es el único dato del cliente que varias pantallas necesitan a la vez (la guardia del grupo protegido, el layout del personal y la consulta de citas) y que no es un dato remoto ni un valor de formulario. Guarda solo si ingresó y su nombre; nunca la contraseña ni un token, y no persiste. La sesión real la maneja el servidor.

Qué fue mío y qué no. En esta fase yo elegí entre las alternativas (D61 a D79) y aprobé los tres documentos. Los motivos de varias decisiones los usé casi sin cambios a partir de los borradores que me dio otra IA, y en la defensa tendré que poder explicarlos sin ayuda.

Una alternativa real que descarté y sus consecuencias (D77). Para decidir si una cita «ya pasó», descarté que el navegador lo calcule con el reloj del equipo, que ocultaría los botones solo al llegar la hora. Elegí que decida solo el servidor, porque lo que cuenta es la hora en que el familiar confirma (RN-02, D41) y así la regla tiene una sola fuente de verdad. La consecuencia: si Marcos deja la pantalla abierta y llega la hora, los botones siguen visibles hasta que se vuelva a pedir la cita; si intenta cancelar, el servidor responde «ya pasó» (CN4) y la regla se cumple igual.

Qué recomendación necesité entender antes de confirmarla. Hubo dos.

D76: que, si el turno elegido fue tomado o ya empezó, se conserven los datos que el familiar escribió y solo se quite el turno. Era una propuesta del agente que yo había aceptado en bloque y me pidió confirmarla aparte. Entendí que conservar los datos no cuesta nada técnicamente, porque siguen en Mantine Form mientras no salga de la pantalla, y que era un comportamiento que el familiar va a ver, así que tenía que decidirlo yo.
Citas frente a Reservar: en una explicación que me dieron como guía mezclé las dos pantallas y dije que la consulta de citas dependía de la sesión y de que los parámetros fueran válidos. Entendí que esa condición es de Reservar (D72), y que en Citas la consulta depende solo de la sesión y un parámetro inválido se reemplaza por el valor por defecto (D68).

Un recorrido técnico. Si la secretaria recarga la lista de citas del jueves 12 de noviembre del Dr. Andrade, la URL conserva el día y el médico (D66), pero el store de Zustand queda vacío porque no persiste. La guardia ve que no hay sesión y la manda a /personal/ingreso, guardando la dirección que pidió en el state de la redirección (D67), no en la URL. Ella ingresa, el servidor valida y el store guarda que ingresó. Después vuelve a Citas, que lee el día y el médico de la URL y los valida (D68), y TanStack Query trae las citas. La búsqueda por nombre es estado local y empieza vacía.

Qué evidencia falta. No hay backend (BQ-01), así que las consultas y mutaciones que describí son hipótesis hasta que exista. Nada está implementado ni probado, ni con un consultorio real. ahk health falla en Windows; la causa que figura en el registro, que no está confirmada, es que AHK no logra ejecutar health.bat, y el build sí funciona si lo ejecuto directamente. Todavía no consulté al docente por BQ-01 ni por ahk health; el profesor aún no me da indicaciones.

Cómo usé la IA. Usé Claude Code con AHK 3.0.0 y el MCP del proyecto para el trabajo en el registro y los documentos. En otro chat con Claude me ayudó a armar el borrador del recorrido de publicar turnos, los motivos de las decisiones D63 a D79 y la práctica para la defensa.

- **Comparación del agente:**
  - coincide con D63, D66 a D69, D72, D76, D77, RN-02, D41 y CN4, y con la declaración de uso de IA;
  - en versiones anteriores, el agente señaló los corchetes sin completar, que la causa de `ahk health` era una hipótesis y la frase poco clara sobre qué decidió el estudiante. No reescribió el texto: el estudiante lo corrigió.

### Revisión de `fase-03.md` por el estudiante

- **Respuesta del estudiante (texto sin editar):** «Esta excelente» (2026-11-10).
- **Ajuste posterior:** las menciones «pendiente de la revisión completa del autor» de `fase-03.md` pasaron a «revisada por el autor («Esta excelente», 10 de noviembre de 2026)».
- **PDF:** generado por el builder a pedido del estudiante («Ayudame exportando el pdf»): `docs/entregas/consultorio-medico-privado-fase-03.pdf`. El estudiante debe abrirlo y revisarlo completo antes de entregarlo (sección 8 de la consigna).

## Supuestos de la fase 3

- Citas es la pantalla que más usa la secretaria en recepción (D67). No hay datos de uso que lo confirmen.

## Fuentes documentales consultadas (fase 3)

| Librería | Versión de la cohorte | Fuente | Concepto consultado | Enlace | Fecha |
|---|---|---|---|---|---|
| React Router | 8.3.1 | Context7 `/websites/reactrouter` (documentación vigente; enlaza la API v8). Context7 no ofrece una versión fijada 8.x: la más alta listada es la 7.13.0 | Modo declarativo: `BrowserRouter`, `Routes`/`Route`, rutas de layout, `index`, `:param` y `*` | https://reactrouter.com/start/declarative/routing | 2026-11-10 |
| React Router | 8.3.1 | Context7 `/websites/reactrouter` | `useSearchParams` | https://reactrouter.com/api/hooks/useSearchParams | 2026-11-10 |
| React Router | 8.3.1 | Context7 `/websites/reactrouter` | `useNavigate` (`replace` y `state`) y `useLocation` | https://reactrouter.com/api/hooks/useNavigate | 2026-11-10 |
| Zustand | 5.0.15 | Context7 `/pmndrs/zustand` v5.0.14 | `create<T>()()`, selectores y `persist` opcional | https://github.com/pmndrs/zustand/blob/v5.0.14/docs/learn/guides/beginner-typescript.md | 2026-11-10 |
| Mantine Form | 9.4.1 | Context7 `/mantinedev/mantine` 9.0.0 | `schemaResolver` con `zod/v4`, `{ sync: true }` y la eliminación de `zodResolver` | https://github.com/mantinedev/mantine/blob/9.0.0/apps/mantine.dev/src/pages/form/schema-validation.mdx | 2026-11-10 |
| Mantine Core (Modal) | 9.4.1 | Context7 `/mantinedev/mantine` 9.0.0 | `opened`, `onClose`, `title`, `useDisclosure` y cómo impedir el cierre durante una operación | https://github.com/mantinedev/mantine/blob/9.0.0/apps/mantine.dev/src/pages/core/modal.mdx | 2026-11-10 |
| TanStack Query | 5.102.8 | Context7 `/websites/tanstack_query_framework_react` (latest) | `useQuery` (`queryKey`, `enabled`, `isPending`/`isError`), `useMutation` e `invalidateQueries` | https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations | 2026-11-10 |
| Zod | 4.4.3 | Context7 `/colinhacks/zod` v4.3.6 (la más cercana por debajo de la 4.4.3) | `safeParse` (resultado sin excepción), el parámetro `error` de Zod 4 y que `.superRefine()` está obsoleto en favor de `.check()` | https://github.com/colinhacks/zod/blob/v4.3.6/packages/docs/content/basics.mdx | 2026-11-10 |
| Zod | 4.4.3 | Context7 `/llmstxt/zod_dev_llms-full_txt` (documentación oficial vigente) | `.refine(..., { error, path })` para asignar el error a un campo y la opción `when` | https://zod.dev/llms-full.txt | 2026-11-10 |
| Mantine Form | 9.4.1 | Context7 `/mantinedev/mantine` 9.0.0 | `validateInputOnBlur`, `validateInputOnChange` y `clearInputErrorOnChange` | https://github.com/mantinedev/mantine/blob/9.0.0/apps/mantine.dev/src/pages/form/validation.mdx | 2026-11-10 |
| TanStack Query | 5.102.8 | Context7 `/websites/tanstack_query_framework_react` (latest) | `gcTime` (por defecto, 5 minutos) y `queryClient.removeQueries` | https://tanstack.com/query/latest/docs/framework/react/reference/classes/QueryClient.md | 2026-11-10 |

**Registro npm (`npm view`, 2026-11-10; compatibilidad declarada, no instalación):**

- `react-router@8.3.1`: peer `react`/`react-dom` >= 19.2.7; `node` >= 22.22.0.
- `@tanstack/react-query@5.102.8`: peer `react` ^18 || ^19.
- `zustand@5.0.15`: todas sus dependencias pares son opcionales.
- `@mantine/core@9.4.1`: peer `react`/`react-dom` ^19.2.0 y `@mantine/hooks` 9.4.1.
- `@mantine/form@9.4.1`: peer `react` ^19.2.0.
- `zod@4.4.3`: publica la entrada `./v4`.

## Comprobaciones al retomar (2026-11-10, después de instalar Context7)

| Comprobación | Quién | Resultado | Límite |
|---|---|---|---|
| `ahk --version` | Agente | 3.0.0 | Confirma la versión. |
| Skill `ahk-spec-tech` | Agente | `SKILL.md`, `workflow.md` y `template.md` legibles. | — |
| MCP `specs.list` (llamada real) | Agente | 3 especificaciones `approved`; ningún `spec-tech` en ese momento. | Prueba la conexión. |
| Context7 (`resolve-library-id` y `query-docs`, llamadas reales) | Agente | Respondió para React Router, Zustand, Mantine y TanStack Query. | La documentación no demuestra que la integración esté implementada. |
| Borrador `agenda-consultorio-tech` | Agente (builder), a pedido del estudiante («Sip») | Creado con `specs.create` como `draft`, con `sourceSpec` `agenda-consultorio`, y validado con `specs.validate`. | Es un borrador: no está aprobado. Se escribió fuera del flujo de tareas, que sigue bloqueado por `ahk health`. |

### Revisión de `agenda-consultorio-tech` (paso 3)

- **Lectura del borrador (revisión 2026-11-11T01:08:18.698Z):** el estudiante respondió «No hay nada que corregir, esta perfecto». Las propuestas del agente que lista el documento quedan aceptadas sin cambios. La pregunta abierta sobre cuándo quitar de la URL un parámetro inválido sigue abierta.

**Recorrido explicado por el estudiante: recarga en Citas (texto sin editar)**

> Recarga. El navegador carga la app desde cero. La URL conserva dia=2026-11-12&medico=andrade (D66). El store de Zustand queda vacío porque no persiste, así que «ingresó» vale no. La caché de Query y la búsqueda escrita también se pierden.
> La guardia. El grupo protegido (D63) lee el store, ve que no hay sesión y redirige a /personal/ingreso reemplazando el historial. En el state de esa redirección guarda la dirección que pidió, con el día y el médico (D67). No la pone en la URL.
> Ingreso. La secretaria escribe su usuario y contraseña. El servidor decide si son correctos (BQ-01). La sesión real la maneja el servidor, por ejemplo con una cookie. Si acepta, el ingreso llama a entrar(nombre) y el store guarda «ingresó» y el nombre. La contraseña no se guarda en ningún lado del cliente.
> Después de ingresar. Se lee el destino guardado en el state, se comprueba que sea una dirección del grupo del personal y se navega ahí. Si hubiera entrado directo al ingreso, iría a Citas por defecto.
> De vuelta en Citas. La pantalla lee el día y el médico de la URL y los valida (D68). Si no son válidos, usa el valor por defecto con un aviso. El texto de búsqueda es estado local y empieza vacío.
> Quién trae las citas. TanStack Query, con la clave ['citas', dia, medico]. Solo se ejecuta si hay sesión en el store y los parámetros son válidos (D69). Si el servidor responde «sesión vencida», se llama a salir() y vuelve al ingreso.
> La lista que se ve. Es estado derivado: se calcula al dibujar, a partir de las citas que trajo Query y del texto de búsqueda. No se guarda una copia filtrada ni se usa useEffect.

- **Comparación del agente:** coincide con D63, D66, D67, D68 y D69. Omitió que la navegación después de ingresar también usa `replace`. **Diferencia:** afirmó que la consulta de citas solo se ejecuta si los parámetros son válidos. El documento la condiciona solo a la sesión (`enabled: isSignedIn`) y, por D68, usa los valores por defecto. Esa condición corresponde a la consulta de turnos libres de Reservar (D72).
- **Corrección elegida por el estudiante (texto sin editar):** «Elijo A. Me equivoqué al explicarlo: mezclé Citas con Reservar. En Citas, la consulta depende solo de la sesión. Si un parámetro de la URL es inválido, aplico D68: se usa el valor por defecto (hoy, todos los médicos), se muestra el aviso y la consulta se ejecuta con ese valor, así que nunca queda esperando. La condición «solo si los parámetros son válidos» es de Reservar (D72), porque ahí, sin una especialidad válida, no hay nada que pedir. El documento queda igual.»

**Decisión explicada por el estudiante: qué guarda Zustand (texto sin editar)**

> Zustand guarda solo si la secretaria ingresó y su nombre para mostrar. No guarda la contraseña ni ningún token, y no persiste: la sesión real la maneja el servidor.
>
> Lo escribe el ingreso: cuando el servidor acepta usuario y contraseña, llama a entrar(nombre). Y se borra con salir(), cuando la secretaria sale o el servidor responde «sesión vencida». Lo leen varias partes a la vez: la guardia del grupo protegido, el layout del personal (que muestra el nombre y «Salir») y la consulta de citas, que solo se ejecuta si hay sesión.
>
> No le pertenece a TanStack Query porque Query administra datos remotos que se piden al servidor y se mantienen sincronizados. Este dato es lo que el cliente recuerda de su propia sesión, no una copia de algo que el servidor devuelve. Si lo administrara Query, la sesión dejaría de ser estado del cliente y Zustand se quedaría sin ningún uso real.
>
> Tampoco le pertenece a Mantine Form porque el formulario de ingreso solo existe en esa pantalla. Cuando la secretaria entra a Citas o a Horarios, el formulario ya no está, y la guardia y el layout necesitarían leer el dato desde otro sitio. Además, lo que vive en el formulario incluye la contraseña, que no debe guardarse.

- **Comparación del agente:** coincide con D69. El estudiante detectó que el documento omitía `CitasPage` entre los consumidores del store; fue un error de redacción del agente.
- **Observación del agente para la defensa:** «Zustand se quedaría sin uso» es un motivo de la consigna. El argumento técnico es que el store recuerda que el ingreso salió bien, para decidir la navegación; no es un recurso remoto que haya que volver a pedir ni sincronizar.
- **Corrección del documento:** el estudiante respondió «Si» a agregar `CitasPage`. El cambio se aplicó mediante `specs.update_content` (una sola línea) y generó la revisión 2026-11-11T01:29:58.067Z. `specs.validate`: sin errores.

**Alternativa explicada por el estudiante: D64 (texto sin editar)**

> Decisión: el código de la cita va solo en el formulario, no en la URL (D64).
>
> 1. Qué problema resolvía mi opción. El código es la única llave de la cita: según RN-07, quien lo conoce puede cancelarla. Si va en la dirección, queda en el historial del navegador y en la barra de direcciones, y se comparte si alguien copia el enlace. En un equipo compartido, cualquiera que viera el historial podría cancelar la cita.
>
> 2. Qué ofrecía la alternativa que descarté. Poner el código en la ruta (/mi-cita/AB12CD) tenía ventajas reales: si Marcos recarga la página sigue viendo su cita, puede guardarla en favoritos, y el botón «atrás» vuelve al campo del código.
>
> 3. Qué costo acepté. Si Marcos recarga, el campo vuelve a quedar vacío y tiene que escribir el código otra vez, y «atrás» lo saca de Mi cita. Es una molestia, pero el código lo tiene a mano porque lo recibió en su mensaje.
>
> 4. Por qué aun así encaja mejor. Porque RN-07 hace del código la única protección de la cita, y dejarlo en la URL debilita justo ese supuesto. Además, las especificaciones aprobadas dicen que el mensaje lleva el código, no un enlace, así que Marcos no depende de un enlace con el código para volver. Por eso preferí una molestia menor a una exposición del código.

- **Comparación del agente:** coincide con D64 y RN-07. Matiz: el código también se muestra en pantalla al confirmar la reserva (D38), lo que refuerza el punto 3.

### Aprobación de `agenda-consultorio-tech`

- **Texto del estudiante:** «Apruebo agenda-consultorio-tech, revisión 2026-11-11T01:29:58.067Z»
- **Fecha:** 2026-11-10 (hora local).
- **Antes de aprobar:** el agente indicó que la pregunta abierta sobre cuándo quitar de la URL un parámetro inválido seguía sin resolver; el estudiante aprobó con esa pregunta declarada como pendiente. El agente recordó que aprobar el diseño no autoriza implementarlo.
- **Transición en AHK:** `draft` → `approved` mediante `specs.transition`. La revisión aprobada es la de `lastUpdated` 2026-11-11T01:29:58.067Z; la transición solo cambia el estado (nuevo `lastUpdated`: 2026-11-11T01:34:07.254Z). Su fuente `agenda-consultorio` estaba aprobada. `specs.validate`: {"valid":true,"errors":[]}.
- **Escritura:** el builder la hizo a pedido del estudiante, fuera del flujo de tareas, que sigue bloqueado por `ahk health`.

## Pendientes de la fase 3

- BQ-01: no consultado al docente al 2026-11-10 (bloquea TanStack Query, la autorización real y los mensajes).
- `ahk health` fallaba en Windows por un error de AHK 3.0.0 (ver «Diagnóstico de `ahk health` en Windows (tarea 2)»); el 2026-11-12 el estudiante decidió aplicar un parche local de una línea (ver «Parche local de AHK 3.0.0 para `health` en Windows (tarea 2, 2026-11-12)»). Antes de reconectar el MCP, `health.run` seguía fallando (corrida `ec01e8e5-60d9-4a16-93b4-110a5daa9e7c`). Después del parche y de la reconexión del MCP, el health de AHK pasa: `health.run` dio «passed», estado 0, en dos corridas (`ec4e0569-5a8d-472a-b4d5-490f80f38a62` y `f4e81666-9f11-4f1a-b814-08413e839313`), con el `tsc -b && vite build` real en el log. El comando manual `ahk health` de la CLI, que usa el `cli.js` parcheado, no se ejecutó. El docente todavía no ha sido consultado. La demo de reserva pedida por el docente es un trabajo aparte y no se verificó aquí.
- Los tres `spec-tech` están aprobados: `agenda-consultorio-tech`, `reserva-cita-tech` y `gestion-cita-codigo-tech`.
- Pregunta abierta de `agenda-consultorio-tech`: ¿cuándo se quita de la URL un parámetro inválido?
- Sección 9: escrita por el estudiante (ver «Explicación propia del estudiante — sección 9 (fase 3)»).
- Documento acumulativo `docs/entregas/fase-03.md`: revisado por el estudiante («Esta excelente»); PDF generado a su pedido; falta que el estudiante abra el PDF, lo revise completo y lo entregue.

## Diagnóstico de `ahk health` en Windows (tarea 2, 2026-11-12)

- **Origen:** el docente pidió una demo de reserva (una pantalla con turnos, formulario y modal de revisión; Medicina General, un médico ficticio, 2026-11-15, turnos de 09:00, 09:20 y 09:40). Construirla bajo AHK requiere un `health` que pase. El estudiante eligió una reparación auditada (tarea 2, modo reparación, alcance: solo la configuración del health y el script en la raíz).
- **Causa:** AHK 3.0.0 (instalación global `@cardor/agent-harness-kit`) arranca `cmd.exe` directamente en `dist/chunk-RXYGE27F.js:88-92` (`executeHealthCheck`, que usan `tasks.claim`, `health.run` y `tasks.update`) y en `dist/cli.js:4408` (`ahk health`), con los argumentos `/d /v:off /s /c call "<ruta>"` (en `cli.js` sin `/v:off`) y sin `windowsVerbatimArguments`. Node escapa las comillas internas como `\"`, `cmd.exe` no las entiende y busca un comando que se llama literalmente `"\"c:\...\health.bat\""`. Error textual: `"\"%USERPROFILE%\Downloads\proyecto-bootcamp\health.bat\"" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.`
- **Evidencia:** una prueba de solo lectura, fuera del proyecto, con `where.exe` da estado 1 y el mismo mensaje sin la opción, y estado 0 con `windowsVerbatimArguments: true`. Ejecutar `.\health.bat` directamente funciona (corre `pnpm build`). Esto confirma la hipótesis registrada en `fase-01.md`, `fase-02.md` y `fase-03.md`.
- **Formas de `scriptPath`:** AHK solo lee `health.scriptPath`; cualquier archivo (`.bat`, `.cmd`, `.mjs`, `.ps1`) se lanza de la misma manera, así que cambiar la configuración o el script no lo arregla. `health.required` no lo lee ninguna compuerta.
- **Opciones identificadas, ninguna aplicada:** (1) actualizar AHK: existe la 3.7.0, no se verificó que lo arregle y el curso exige la 3.0.0; (2) un parche local de una línea en la instalación global: es reversible, pero modifica la herramienta exigida; (3) correr AHK bajo WSL: es pesado.
- **Decisión del estudiante (2026-11-12):** «Consultar al docente primero». No se modifica nada de AHK, la tarea 2 se cierra como bloqueada y la demo espera la respuesta del docente. Luego cambió su decisión: ver «Parche local de AHK 3.0.0 para `health` en Windows (tarea 2, 2026-11-12)».

## Parche local de AHK 3.0.0 para `health` en Windows (tarea 2, 2026-11-12)

- **Decisión del estudiante (2026-11-12):** «Que aplique un parche local de una linea». Reemplaza su decisión anterior, «Consultar al docente primero» (que sigue registrada arriba, en el diagnóstico). Es la opción (2) de las identificadas allí.
- **Qué es:** un cambio local de una línea en dos archivos de la instalación global de AHK 3.0.0, hecho por el builder en la tarea 2 (modo reparación, id 2). No se reinstaló ni se actualizó AHK. No se tocó `src/`, `package.json`, `health.bat` ni `agent-harness-kit.config.json`. No se detuvo ni se reinició el proceso `ahk serve`.
- **Carpeta:** `%USERPROFILE%\AppData\Roaming\npm\node_modules\@cardor\agent-harness-kit\dist`.
- **Cambio 1, `chunk-RXYGE27F.js`, línea 92** (`executeHealthCheck`, la usan `tasks.claim`, `health.run` y `tasks.update`):
  - Antes: `result = spawnSync(command, args, { cwd, stdio: ["ignore", fd, fd] });`
  - Después: `result = spawnSync(command, args, { cwd, stdio: ["ignore", fd, fd], windowsVerbatimArguments: true });`
- **Cambio 2, `cli.js`, línea 4408** (`ahk health`, en el `spawn2` de `MaintenanceService`): solo cambian las opciones de `spawn2`.
  - Antes: `{ cwd: this.cwd, stdio: ["ignore", "pipe", "pipe"] }`
  - Después: `{ cwd: this.cwd, stdio: ["ignore", "pipe", "pipe"], windowsVerbatimArguments: true }`
- **Respaldos** (copias exactas hechas antes de editar, junto a los originales, en la misma carpeta):

  | Archivo | SHA256 del original (= respaldo `.ahk300-orig`) | SHA256 del archivo parcheado |
  |---|---|---|
  | `chunk-RXYGE27F.js` | `B46FD5726673E76F3220411D13875C9A71CE5D0B8A821040826884BF20B4FD30` | `E5DA10609D65270F6A652C8D605C0F09B32B1685023E5D2F74C0E0A0EDADFC59` |
  | `cli.js` | `163BE59C8AE187D297E3B15DDC21E39F0B690BB2BD23A3957FF40CB3B8CEDB34` | `329A1B8341FCE1BB2C29B09F648616D2972043D410AFE17D073E9CD97F2E153D` |

  Respaldos: `chunk-RXYGE27F.js.ahk300-orig` y `cli.js.ahk300-orig`. Se comprobó que cada respaldo tiene el mismo SHA256 que su original antes de editar.
- **Verificación hecha:**
  - `node --check` sobre los dos archivos parcheados: sin errores (código de salida 0).
  - Diferencia contra el respaldo (`git diff --no-index --numstat`): 1 línea añadida y 1 eliminada en cada archivo, o sea exactamente una línea cambiada por archivo. Cada archivo creció 32 bytes (`, windowsVerbatimArguments: true`); los finales de línea (LF) no cambiaron.
  - `ahk --version`: `3.0.0`.
  - `.\health.bat` ejecutado directamente desde la raíz del proyecto: corre `pnpm build` (`tsc -b && vite build`), compila y sale con código 0. Esto confirma que el script sigue funcionando; no prueba nada sobre AHK, porque no lo llama AHK.
- **Verificación después de la reconexión del MCP (2026-11-12):** el proceso `ahk serve` en marcha había cargado el código anterior y no se tocó; el estudiante reconectó el MCP («listo») y se repitió `health.run` en la tarea 2:
  - Antes de reconectar: **falló**, corrida `ec01e8e5-60d9-4a16-93b4-110a5daa9e7c`, con el mismo error de antes.
  - Después de reconectar: **pasó**, estado 0, en dos corridas: `ec4e0569-5a8d-472a-b4d5-490f80f38a62` (lead) y `f4e81666-9f11-4f1a-b814-08413e839313` (reviewer). El log de las corridas muestra el `tsc -b && vite build` real.
  - Esto verifica el Cambio 1 (`chunk-RXYGE27F.js`, `executeHealthCheck`), que según el diagnóstico es la función que usa `health.run`.
- **Lo que NO está verificado:** el comando manual `ahk health` de la CLI, que usa el `cli.js` parcheado (Cambio 2, línea 4408), **no se ejecutó**; por esa vía el parche sigue sin probarse. Tampoco hay en este registro una corrida aparte de `tasks.claim` ni de `tasks.update` después de la reconexión: comparten `executeHealthCheck` con `health.run` (según el diagnóstico), pero solo `health.run` se corrió. Antes de la reconexión, nada de esto estaba verificado; ahora lo está únicamente lo indicado en el punto anterior.
- **Alcance:** es un cambio local en la instalación global, no forma parte del proyecto ni de lo que se entrega. Se pierde si se reinstala o actualiza AHK (los respaldos están dentro de la misma carpeta y se pierden igual). Modifica una herramienta que el curso exige en la versión 3.0.0, aunque `ahk --version` sigue informando 3.0.0.
- **Cómo revertirlo:** copiar cada respaldo sobre su original (con AHK detenido o reconectando el MCP después):
  - `Copy-Item "$d\chunk-RXYGE27F.js.ahk300-orig" "$d\chunk-RXYGE27F.js" -Force`
  - `Copy-Item "$d\cli.js.ahk300-orig" "$d\cli.js" -Force`
  - donde `$d` es la carpeta indicada arriba. Después, comprobar que los SHA256 vuelven a coincidir con los de la columna «original».
- **Docente:** todavía no ha sido consultado. Queda pendiente informarle del parche y preguntarle si lo acepta.

## Demo de reserva pedida por el docente (tarea 3, 2026-11-12)

> La tarea 4 cambió esta demo; lo que sigue describe la versión de la tarea 3. Ver «Mejoras de la demo (tarea 4, 2026-11-14)» al final de este archivo.

- **Origen:** el docente pidió una demo separada del producto aprobado. Pedido textual, tal como está en la descripción de la tarea 3: «Puedes usar una pantalla con los turnos y el formulario, más un cuadro para revisar la reserva. Prepara Medicina General, un médico ficticio y el 15 de noviembre de 2026, con tres turnos: 09:00, 09:20 y 09:40. Usa nombres y teléfonos de prueba. 1. El familiar elige un turno y completa el nombre del paciente, su propio nombre y un celular de diez dígitos que empiece por 09. 2. Exige ambos nombres con al menos dos caracteres y un turno disponible. Si hay errores, conserva los datos y muestra qué debe corregir. 3. Revisar reserva abre un resumen con médico, fecha, hora y nombres. Cancelar vuelve al formulario sin ocupar el turno. 4. Confirmar marca el turno como ocupado y muestra el resumen con un código de demostración, como DEMO-001. Mantén el código visible y evita duplicar la reserva por repetir el clic. Para demostrarlo: reserva las 09:00 y muestra que ese turno queda deshabilitado, mientras siguen disponibles los otros dos. Prueba teléfono vacío y cancela otra confirmación: ninguna de esas acciones debe ocupar otro turno.»
- **Autorización del estudiante (2026-11-12):** «sip». Motivo que dio: «Lo pidió el docente». (Citas tal como las registraron la tarea 3 y el handoff del lead.)
- **Decisiones del estudiante (tarea 3):**
  - Usar Mantine 9.4.1 (`@mantine/core`, `@mantine/hooks`, `@mantine/form`) y zod 4.4.3, las versiones de la cohorte, en versiones exactas. El spec técnico `reserva-cita-tech.md:75` ya importa `zod/v4` y `:149` ya dice que la cohorte usa 4.4.3.
  - Importar desde `zod/v4` y usar `schemaResolver` de `@mantine/form`, sin `mantine-form-zod-resolver`.
  - Sin librería de toasts.
  - Marcar la pantalla claramente como DEMO.
  - No modificar los casos de uso ni las especificaciones funcionales o técnicas aprobadas, y registrar aquí las divergencias.
  - Fuera de alcance: reservas para menores, mensajes, pantallas de secretaria, React Router, TanStack Query y Zustand.
- **Dependencias instaladas** (`pnpm add -E @mantine/core@9.4.1 @mantine/hooks@9.4.1 @mantine/form@9.4.1 zod@4.4.3`, sin `^` ni `~` en `package.json`):

  | Paquete | Versión |
  |---|---|
  | `@mantine/core` | 9.4.1 |
  | `@mantine/hooks` | 9.4.1 |
  | `@mantine/form` | 9.4.1 |
  | `zod` | 4.4.3 |

  - pnpm informó `Packages: +25`: los 4 directos y sus dependencias transitivas (entre ellas `@floating-ui/react`, `react-number-format`, `react-remove-scroll`, `clsx`, `type-fest`, `klona`, `fast-deep-equal` y `@standard-schema/spec`; el detalle está en `pnpm-lock.yaml`).
  - No se instalaron `postcss`, `postcss-preset-mantine`, `@mantine/notifications`, `mantine-form-zod-resolver`, React Router, TanStack Query ni Zustand. React (19.2.8) no cambió.
  - Hay versiones más nuevas (según el aviso de pnpm: Mantine 9.7.1 en `core` y `hooks`, 9.8.0 en `form`; zod 4.6.7). No se actualizó, porque el estudiante fijó las versiones exactas.
  - `tsconfig.app.json` no declara `strict`, pero TypeScript 6.0.3 lo trae activado por defecto (`node_modules/typescript/lib/_tsc.js:18281`: `compilerOptions.strict !== false`). No se modificó ningún `tsconfig`.
- **Qué se construyó** (todo dentro de `src/`, más `index.html` y `README.md`):
  - `src/demo/datos.ts`: datos fijos (Medicina General, «Dr. Martín Prueba (ficticio)», fecha como texto fijo «15 de noviembre de 2026», turnos 09:00, 09:20 y 09:40).
  - `src/demo/esquema.ts`: esquema zod (`zod/v4`). Los nombres usan `.trim().min(2)`; el celular, `/^09\d{8}$/`; «turno disponible» es un `refine` del propio campo `turno`, que lee los turnos ocupados desde una `useRef`.
  - `src/demo/ReservaDemo.tsx`: pantalla única, con `useForm` (`mode: 'controlled'`, sin validación al escribir ni al salir del campo) y `schemaResolver(esquema, { sync: true })`.
  - `src/main.tsx` (`MantineProvider` y `@mantine/core/styles.css`), `src/App.tsx` (solo la demo) y `src/index.css` (solo `body { margin: 0 }`). Se borraron `src/App.css` y `src/assets/*` (imágenes de la plantilla de Vite). `public/icons.svg` quedó sin usar y no se tocó.
  - `index.html`: `lang="es"` y título «Consultorio Médico Privado — Demo de reserva».
  - Sin duplicar la reserva: una `useRef` booleana síncrona protege «Confirmar reserva»; al confirmar, el botón desaparece porque el cuadro pasa a la vista «Reserva confirmada». El código (`DEMO-001`, `DEMO-002`, …) se calcula dentro del manejador del clic, con un contador en otra `useRef` y fuera de cualquier `setState(prev => …)`, para que `StrictMode` no lo duplique ni salte números.
  - El código sigue visible tras cerrar el cuadro: la página lista «Reservas confirmadas en esta demo» con código, hora y paciente.
  - Una sola línea de `oxlint-disable-next-line react/refs`, con su motivo en el comentario: `crearEsquema` solo guarda la función que lee la ref, y esa función se ejecuta al validar, no al renderizar.
- **Divergencias con lo aprobado** (con archivo:línea de lo aprobado; solo se registran, no se corrigen):
  1. **Nombres con mínimo de 2 caracteres.** `docs/specs/reserva-cita.md:93-98` (RN-15) pide «nombre y apellido» obligatorios y no fija mínimo; `reserva-cita-tech.md:81` y `:85` usan `.trim().min(1)`. La demo pide «nombre» (como el docente) y exige al menos 2 caracteres, sin contar espacios al inicio y al final.
  2. **Sin «menor de edad» ni acompañante.** `reserva-cita.md:36` y `:88-92` (RN-14), A4, y los campos de `reserva-cita-tech.md:61-70`. La demo no los tiene (fuera de alcance).
  3. **Sin canal ni correo.** `reserva-cita.md:47` (paso 10) y `:93-98` (RN-15), y RN-08. El celular conserva el formato de RN-15 (`:97`, `reserva-cita-tech.md:86`): 10 dígitos que empiezan por 09.
  4. **Sin mensaje; código solo en pantalla.** RN-13 (`reserva-cita.md:83-87`) y D38 (`docs/proceso.md:521-526`) piden el código en pantalla y también por mensaje; la demo no envía mensajes. Además, el código `DEMO-001`, `DEMO-002`, … se genera en el cliente y no es el código de RN-12 (`reserva-cita.md:123`, «Uno por cita (RN-12)»). Vive en el estado local de la pantalla: no hay mutación, así que D75 (`docs/proceso.md:1040-1044`; `reserva-cita-tech.md:54`, «solo en la respuesta de la mutación») no aplica literalmente.
  5. **Modal «Revisar reserva» con «Cancelar» antes de confirmar.** El flujo aprobado confirma directamente: `reserva-cita.md:47-51` (pasos 10 a 14). Lo más cercano es A7 (`reserva-cita.md:61`, el familiar sale antes de confirmar y el turno sigue libre).
  6. **Datos fijos en memoria, sin servidor ni TanStack Query.** No hay elección de especialidad ni de día, ni A1, A2 (`reserva-cita.md:56`) ni A6 (`reserva-cita.md:60`): hay un solo usuario y nada que otro pueda tomar o que venza (BQ-01: no existe servicio remoto).
  7. **Doble clic evitado en el cliente con una `useRef`.** El spec técnico (`reserva-cita-tech.md:36-37`) lo propone con `isPending` de la mutación, que aquí no existe.
- **Cómo demostrarla, paso a paso:**
  1. En la raíz del proyecto: `pnpm install`, luego `pnpm dev`, y abrir en el navegador la dirección que muestra la terminal (normalmente `http://localhost:5173/`).
  2. Se ve el aviso amarillo «DEMO — datos ficticios en memoria; se pierden al recargar la página…», Medicina General, el médico ficticio, el 15 de noviembre de 2026 y los tres turnos disponibles.
  3. Teléfono vacío: elegir 09:00, escribir «Ana Pérez» como paciente y «Luis Pérez» como familiar, dejar el celular vacío y pulsar «Revisar reserva». El cuadro no se abre, aparece el mensaje bajo el celular y los datos escritos se conservan. Ningún turno queda ocupado.
  4. Cancelar: escribir el celular `0991234567`, pulsar «Revisar reserva» y, en el cuadro, «Cancelar». El cuadro se cierra, el formulario sigue igual y los tres turnos siguen disponibles.
  5. Confirmar: pulsar de nuevo «Revisar reserva» y luego «Confirmar reserva» (se puede hacer doble clic). El cuadro pasa a «Reserva confirmada» con el código `DEMO-001`. Pulsar «Cerrar».
  6. El código sigue visible en «Reservas confirmadas en esta demo» (`DEMO-001 · 09:00 · Ana Pérez`); 09:00 aparece como «09:00 — Ocupado» y deshabilitado, mientras 09:20 y 09:40 siguen disponibles, y el formulario queda vacío.
  7. Una segunda reserva (por ejemplo, 09:20) recibe `DEMO-002`. Recargar la página borra todo.
- **Verificación hecha:** `pnpm build` (`tsc -b && vite build`) pasa y `pnpm lint` (`oxlint`) no reporta nada. Además se recorrieron estos pasos en un Chrome sin interfaz contra `pnpm dev` (con `StrictMode`): 40 comprobaciones, todas correctas, sin errores ni avisos en la consola (nombres de un carácter, celulares de 9 y 11 dígitos, con 08 y con una letra, doble y triple clic, y dos reservas seguidas). Esa prueba usó `puppeteer-core` instalado en una carpeta temporal fuera del proyecto; no es una dependencia del proyecto.
- **Alcance:** no se modificaron `docs/specs/*`, los casos de uso ni `fase-01.md`, `fase-02.md` y `fase-03.md`.

## Mejoras de la demo (tarea 4, 2026-11-14)

- **Origen:** tarea 4 (`demo-reserva-mejoras`), pedida para mejorar la demo de la tarea 3: diseño más profesional, selección encadenada especialidad → médico → fecha → turno, acompañante opcional con la casilla «El paciente va solo», y turno ocupado por médico + fecha + hora. Esta sección no reemplaza la de la tarea 3: aquella queda como registro de lo que se hizo ese día.
- **Dependencias:** ninguna nueva ni cambiada. `package.json` y `pnpm-lock.yaml` no se tocaron (Mantine 9.4.1, React 19.2.8, zod 4.4.3).
- **Qué cambió, por archivo:**
  - `src/demo/datos.ts`: ahora hay 3 especialidades (Medicina General con 2 médicos, Pediatría con 1, Cardiología con 1), cada médico con 2 fechas y 3 turnos por fecha. Todo es ficticio (los nombres dicen «ficticio/ficticia»). Tres funciones (`medicosDe`, `fechasDe`, `turnosDe`) devuelven la lista de cada paso según lo ya elegido, y `claveTurno(medicoId, fechaId, hora)` arma la clave de un turno ocupado. El `id` de cada médico es único en todo el archivo porque la clave no incluye la especialidad.
  - `src/demo/esquema.ts`: el esquema valida especialidad, médico, fecha y turno (obligatorios) y conserva las reglas de nombres y celular. Dos `.refine` del objeto completo (no de un campo) comprueban «turno libre» (con médico + fecha + hora) y «acompañante obligatorio salvo que vaya solo»; se usan porque necesitan mirar varios campos a la vez. No se usó `superRefine`, que Zod 4 marca como obsoleto. Se reescribió el comentario que decía que un refine de objeto se omite cuando otro campo falla: con campos que solo son texto o booleano, Zod sí los ejecuta, y así todos los errores salen juntos.
  - `src/demo/ReservaDemo.tsx`: tres tarjetas (1 Cita, 2 Paciente y acompañante, 3 Tus datos), encabezado, aviso DEMO y reservas confirmadas como tarjetas. Un manejador por Select (`elegirEspecialidad`, `elegirMedico`, `elegirFecha`) guarda lo elegido y vacía los pasos siguientes con `form.setFieldValue`. A los Select se les pasa `value={campo || null}` porque con `''` mostrarían todavía el texto anterior. Casilla «El paciente va solo»: al marcarla se vacía y deshabilita el nombre del acompañante (y se borra su error). El nombre del familiar sigue siempre obligatorio. Los nombres se recortan a mano al abrir la revisión, porque `form.onSubmit` entrega lo escrito, sin el `trim` de Zod. Se conservan: `ocupadosRef` + estado `ocupados`, protección contra doble clic, contador del código `DEMO-00N`, «Cancelar» que conserva el formulario, aviso DEMO y `form.reset()` al confirmar.
  - `src/main.tsx`: `createTheme` con color principal, esquinas redondeadas y la letra del sistema (sin fuentes externas).
- **Clave de turno ocupado:** `médico|fecha|hora` (por ejemplo `gral-martin|2026-11-16|09:00`). Reservar las 09:00 con un médico no bloquea las 09:00 de otro médico ni de otra fecha.
- **Divergencias con lo aprobado (actualización de la lista de la tarea 3):**
  - **(2) Ahora hay acompañante, pero ligado a «El paciente va solo», no a la edad.** Lo aprobado lo condiciona a «menor de edad»: RN-14 (`docs/specs/reserva-cita.md:88-92`), paso 9 (`:46`), A4 (`:58`) y `reserva-cita-tech.md:66`. La demo no pregunta la edad: si el paciente no va solo, exige el acompañante (en lo aprobado es opcional para mayores). Sigue sin existir la marca «menor de edad».
  - **(6) Ahora sí hay elección de especialidad, médico y fecha**, pero con datos fijos en memoria. Siguen sin existir A1, A2 (`reserva-cita.md:56`) ni A6 (`reserva-cita.md:60`).
  - Las divergencias 1, 3, 4, 5 y 7 de la tarea 3 siguen igual.
- **Cómo demostrarla, paso a paso:**
  1. `pnpm dev` y abrir `http://localhost:5173/`. Se ven el aviso DEMO y las tres tarjetas; Médico y Fecha están deshabilitados hasta elegir el paso anterior.
  2. Pulsar «Revisar reserva» sin escribir nada: aparecen a la vez los errores de especialidad, médico, fecha, turno, paciente, acompañante, familiar y celular.
  3. Elegir Medicina General, el Dr. Martín Prueba y el lunes 16: aparecen los turnos 09:00, 09:20 y 09:40. Cambiar la especialidad a Pediatría: médico, fecha y turno quedan vacíos y solo se listan los médicos de Pediatría.
  4. Volver a Medicina General, Dr. Martín Prueba, lunes 16, turno 09:00. Escribir paciente «Ana Pérez», familiar «Luis Pérez» y celular `0991234567`. Marcar «El paciente va solo»: el acompañante se vacía y se deshabilita. Pulsar «Revisar reserva»: el cuadro muestra especialidad, médico, fecha, hora, paciente, acompañante («Va solo») y familiar.
  5. «Cancelar» cierra el cuadro, conserva el formulario y no ocupa el turno. Pulsar de nuevo «Revisar reserva» y «Confirmar reserva» (se puede hacer doble clic): sale un solo `DEMO-001`. «Cerrar»: la reserva aparece como tarjeta y el formulario queda vacío.
  6. Elegir otra vez Medicina General, Dr. Martín Prueba y lunes 16: 09:00 aparece como «09:00 — Ocupado». Con el martes 17, o con la Dra. Sofía Ejemplo el lunes 16, 09:00 sigue libre.
  7. Con una reserva sin marcar «El paciente va solo» y el acompañante vacío (o de un solo carácter), aparece el error del acompañante junto a los demás.
- **Verificación hecha:** `pnpm build` (`tsc -b && vite build`) pasa y `pnpm lint` (`oxlint`) no reporta nada. Además se recorrieron estos pasos en un Chrome sin interfaz contra `pnpm dev` (con `StrictMode`), con ancho de 375 px y luego de 1280 px: 40 comprobaciones, todas correctas, sin errores ni avisos en la consola y sin scroll horizontal (errores a la vez al enviar vacío, cascada que vacía los Select, solo los médicos de la especialidad elegida, acompañante de un carácter, casilla «va solo», nombres recortados en el cuadro, «Cancelar» sin ocupar, doble clic con un solo `DEMO-001`, 09:00 ocupado solo para ese médico y fecha, y segunda reserva con acompañante `DEMO-002`). La prueba usó `puppeteer-core` instalado en una carpeta temporal fuera del proyecto; no es una dependencia del proyecto.
- **Alcance:** no se modificaron `docs/specs/*`, los casos de uso ni `fase-01.md`, `fase-02.md` y `fase-03.md`.

## Rediseño visual de la demo (tarea 5, 2026-11-14)

- **Origen:** tarea 5 (`rediseno-demo-consultorio-profesional`): que la demo se vea como el sitio web de un consultorio profesional, sin cambiar lo que hace. Es un cambio solo visual y de uso: la lógica de reserva no se tocó. Esta sección no reemplaza las de las tareas 3 y 4: ellas describen la versión anterior (título «Consultorio Médico Privado», aviso amarillo, turnos como botones de radio) y quedan como registro de lo que se hizo esos días.
- **Dependencias:** ninguna nueva ni cambiada. `package.json` y `pnpm-lock.yaml` no se tocaron (Mantine 9.4.1, React 19.2.8, zod 4.4.3). Los iconos son SVG escritos en el código; no se descargan fuentes y no se añadió ninguna librería de animación ni de iconos.
- **Qué cambió, por archivo:**
  - `src/theme.ts` (nuevo): el tema de Mantine, antes dentro de `main.tsx`. Tres paletas propias de diez tonos: `clinica` (verde azulado clínico, color principal), `exito` (verde) y `aviso` (ámbar, para DEMO), con `primaryShade: 7`. Un `cssVariablesResolver` oscurece tres colores de texto que en Mantine 9 no llegan a AA: el texto secundario («dimmed», gris 6 → gris 7), el error (rojo 6 → rojo 9) y el marcador de posición (gris 5 → gris 6). Valores por defecto de componentes: tarjetas con esquinas de 16 px y borde; campos de texto y `Select` de tamaño `md` (letra de 16 px, para que iOS no amplíe la pantalla al enfocar); el grupo de turnos y la casilla también `md`; y el cuadro de diálogo con fondo más tenue, desenfoque leve y una entrada de escala 0,96 → 1 con opacidad. `respectReducedMotion: true`. Se mantuvo la letra del sistema (sin fuentes externas); los títulos tienen tamaños propios (`h1` fluido con `clamp`).
  - `src/main.tsx`: usa `tema` y `variablesCss` de `theme.ts`. Siguen `StrictMode` y el orden de los estilos (`@mantine/core/styles.css` y luego `index.css`).
  - `src/index.css`: clases con prefijo `demo-`: la lista de datos (`demo-datos`), los turnos (`demo-turno`: seleccionado con borde + anillo + fondo, ocupado con fondo gris y borde discontinuo, pulsación con escala 0,97), el icono de éxito (`demo-exito-icono`), la tarjeta de reserva (`demo-reserva`) y `demo-campo-ancho`. Define `--demo-ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
  - `src/demo/Iconos.tsx`, `Marco.tsx`, `Paso.tsx`, `ListaDatos.tsx`, `ResumenCita.tsx`, `TarjetaReserva.tsx` (nuevos): componentes solo de presentación. Reciben valores sencillos; nunca el formulario, las `ref` ni los setters. `Marco.tsx` tiene la cabecera (`Encabezado`), la franja de presentación con el aviso DEMO (`Presentacion`) y el pie (`PiePagina`). Cada `.tsx` exporta solo componentes, por la regla `react/only-export-components`; por eso el tema vive en un `.ts`.
  - `src/demo/ReservaDemo.tsx`: **la lógica no cambió.** Del archivo original, las líneas 90–223 (de `export function ReservaDemo()` hasta `const turnos = turnosDe(...)`: las `ref`, el estado, `estaOcupado`, la línea `oxlint-disable-next-line react/refs` con `useState(() => crearEsquema(...))`, el `useForm`, `elegirEspecialidad`, `elegirMedico`, `elegirFecha`, `marcarVaSolo`, `abrirRevision`, `confirmar` y las listas derivadas) están ahora en las líneas 55–188 y son idénticas byte a byte (se comprobó con `diff`; solo cambió el número de línea porque `Datos` y `Paso` salieron del archivo). También quedaron idénticos el tipo `Revision` y `filasDeReserva` (líneas 38–40 y 42–53). Lo que sí cambió: los imports; `Datos` pasó a `ListaDatos.tsx` y `Paso` a `Paso.tsx`; se añadieron, después de las listas derivadas, el resumen «Tu cita» y las tres marcas de «paso completo» (líneas 190–207, calculadas solo con `form.values`); y se reescribió el JSX del `return` (desde la línea 209): la maquetación, los turnos como `Radio.Card` y el cuadro de diálogo con `ListaDatos`. Dentro de ese JSX se conservaron el `<form onSubmit … noValidate>`, los tres `Select` (`value={x || null}`, `allowDeselect={false}`, deshabilitados hasta el paso anterior, `error={form.errors.X}`), el `Radio.Group` con `{...form.getInputProps('turno')}`, `disabled={ocupado}` en cada turno, la casilla «El paciente va solo» con `marcarVaSolo`, `role="status"` en las reservas confirmadas, los títulos del cuadro y «Cerrar» a la izquierda. El único añadido a un `Select` es `className="demo-campo-ancho"` en Fecha (solo estilo).
  - `index.html`: título «Consultorio Ejemplo (ficticio) — Demo de reserva» y una `meta description` que dice que es una demo ficticia.
- **Contraste** (medido en el navegador con los colores calculados; AA pide 4,5:1 para texto normal):

  | Elemento | Antes | Ahora |
  |---|---|---|
  | Botón «Revisar reserva» (blanco sobre el color principal) | unos 2,6:1 (teal 6) | 5,47:1 |
  | Insignia DEMO (blanco sobre `aviso.8`) | unos 1,9:1 (amarillo) | 5,84:1 |
  | Texto secundario («dimmed») y descripciones de campo | unos 3,3:1 | de 7,3:1 a 8,2:1 |
  | Mensajes de error | unos 3,3:1 | 5,46:1 |

  Los valores «antes» son estimaciones calculadas con la paleta que traía Mantine en la versión anterior (no se midieron en el navegador); los de «ahora» sí se midieron. El botón, la insignia, el texto secundario y los errores de antes no cumplían AA; eso se corrigió aquí. El texto del aviso DEMO es negro sobre ámbar claro (18,4:1, medido).
- **Decisiones:**
  - **Marca ficticia:** «Consultorio Ejemplo» (como en `datos.ts`: Prueba, Ejemplo, Muestra, Simulado), con un logo propio (cuadrado verde azulado con un corazón). A propósito no hay cruz roja (es un emblema protegido) ni se imita a ninguna clínica o persona real, ni hay teléfonos reales. La insignia DEMO y el aviso de datos ficticios siguen visibles arriba y en el pie. El nombre del producto aprobado, «Consultorio Médico Privado», no se cambió en los documentos aprobados; solo la demo usa el nombre ficticio.
  - **Turnos como `Radio.Card`** (botones con `role="radio"` dentro del `Radio.Group`): el estado y los errores siguen saliendo de `getInputProps('turno')`, y cada tarjeta se deshabilita con `disabled={ocupado}` y dice «HH:MM — Ocupado». El seleccionado se distingue por borde, anillo y fondo (no solo por color) y por el punto del indicador.
  - **«Tu cita» fijo (sticky) desde 992 px (`md`)**, a la derecha del formulario, y oculto por debajo de ese ancho: en el móvil el cuadro «Revisar reserva» ya muestra el resumen completo. Se logra con `position: sticky`, sin `align` en la rejilla ni `overflow` en los contenedores (con cualquiera de los dos el sticky no tendría recorrido). Los valores pendientes dicen «Pendiente». No es una región en vivo (cambia con cada letra y saturaría a un lector de pantalla). Por eso, en pantallas anchas hay una cuarta tarjeta además de las tres de los pasos.
  - **Marca de «paso completo»** (número → verificación): se calcula solo con `form.values` (turno elegido; paciente y acompañante, o «va solo»; nombre y celular escritos). Quiere decir «relleno», no «válido». No se llama a `form.isValid()` ni al esquema durante el render, porque la regla «turno libre» lee la `ref` de turnos ocupados.
  - **Sin `Stepper` ni `AppShell`:** un `Stepper` convertiría la página en varias pantallas y rompería que todos los errores salgan a la vez al enviar; `AppShell` exige una cabecera fija con márgenes que chocarían con el sticky y se vería como una aplicación, no como un sitio.
  - **API de Mantine 9:** la rejilla `Grid` usa `gap` (en versiones anteriores era `gutter`). El consejo previo decía `gutter` y el tipado de la versión instalada lo rechazó; se usó `gap`.
  - **Selects:** Especialidad y Médico en una fila y Fecha a todo el ancho de la tarjeta, porque con tres en fila el nombre del médico («… (ficticio)») se cortaba en 1280 px.
  - **Movimiento:** solo `transform` y `opacity`, con salida rápida (`ease-out`) y entre 120 y 250 ms: (1) entrada y salida del cuadro de diálogo (escala 0,96 → 1 con opacidad, 200/150 ms); (2) pulsación del turno (escala 0,97, 120 ms); (3) icono de éxito del cuadro «Reserva confirmada», una sola vez (220 ms); (4) la tarjeta de una reserva nueva aparece con opacidad y 6 px de desplazamiento (220 ms, con `@starting-style`: sin JavaScript; un navegador que no lo entienda la muestra sin animación). No hay animación al cargar la página, ni en el resumen «Tu cita», ni en la marca de paso, ni al seleccionar un turno (con las flechas se cambia muy seguido), ni elevación al pasar el ratón. Con `prefers-reduced-motion: reduce`: el cuadro no se anima (`respectReducedMotion`), la pulsación del turno no escala, y el icono y la tarjeta solo usan opacidad.
- **Accesibilidad:** la página tiene `header`, `main`, `aside` (con `aria-labelledby`) y `footer`; los iconos son decorativos (`aria-hidden`); un paso completo añade «(completo)» solo para lectores de pantalla; las reservas confirmadas siguen en `role="status"`. **Limitación de teclado de `Radio.Card` (es de Mantine y no se evitó):** cada turno es una parada de `Tab` (no hay un solo foco para todo el grupo, como en un radio nativo); Espacio o Intro lo selecciona; las flechas mueven el foco al turno anterior o siguiente y lo seleccionan, pero una flecha hacia un turno ocupado no hace nada, porque un botón deshabilitado no recibe foco (con `Tab` sí se llega a todos los turnos libres). No se cambió `disabled` por `aria-disabled` para evitarlo: dejaría elegir turnos ocupados, que sería un cambio de lógica.
- **Cómo demostrarla, paso a paso** (reemplaza a los pasos 1, 3 y 6 de la tarea 4 y añade los pasos 7 a 9; los demás siguen igual):
  1. `pnpm dev` y abrir `http://localhost:5173/`. Se ven: la cabecera con «Consultorio Ejemplo» y la insignia DEMO, la franja de presentación con el aviso DEMO, las tres tarjetas numeradas (Cita, Paciente y acompañante, Tus datos) y, en pantallas de 992 px o más, el resumen «Tu cita» fijo a la derecha. Médico y Fecha están deshabilitados hasta elegir el paso anterior.
  2. Pulsar «Revisar reserva» sin escribir nada: aparecen a la vez los errores de especialidad, médico, fecha, turno, paciente, acompañante, familiar y celular.
  3. Elegir Medicina General, el Dr. Martín Prueba y el lunes 16: los turnos aparecen como tarjetas (09:00, 09:20 y 09:40) y «Tu cita» se va rellenando. Cambiar la especialidad a Pediatría: médico, fecha y turno quedan vacíos.
  4. Volver a Medicina General, Dr. Martín Prueba, lunes 16, turno 09:00: la tarjeta queda marcada y el número de la tarjeta Cita pasa a una verificación. Escribir paciente «Ana Pérez», familiar «Luis Pérez» y celular `0991234567`, y marcar «El paciente va solo». Pulsar «Revisar reserva»: el cuadro muestra especialidad, médico, fecha, hora, paciente, acompañante («Va solo») y familiar.
  5. «Cancelar» cierra el cuadro y no ocupa el turno. Pulsar de nuevo «Revisar reserva» y «Confirmar reserva» (se puede hacer doble clic): sale un solo `DEMO-001`. «Cerrar»: la reserva aparece como tarjeta y el formulario queda vacío.
  6. Elegir otra vez Medicina General, Dr. Martín Prueba y lunes 16: la tarjeta 09:00 aparece deshabilitada, con borde discontinuo, como «09:00 — Ocupado». Con el martes 17, o con la Dra. Sofía Ejemplo el lunes 16, 09:00 sigue libre.
  7. Teclado: con `Tab` llegar a un turno libre; Espacio lo selecciona; las flechas pasan al siguiente turno y lo seleccionan; una flecha hacia el turno ocupado no hace nada.
  8. Movimiento reducido: en las herramientas de desarrollo del navegador (Rendering → «Emulate CSS media feature prefers-reduced-motion» → reduce) abrir el cuadro: aparece sin escala ni desvanecimiento; al confirmar, el icono solo se desvanece.
  9. Ancho de móvil: con la ventana a 360 px no hay scroll horizontal y «Tu cita» no se muestra.
- **Verificación hecha:** `pnpm build` (`tsc -b && vite build`) pasa y `pnpm lint` (`oxlint`) no reporta nada. Además se recorrieron estos pasos en un Chrome sin interfaz contra `pnpm dev` (con `StrictMode`): 108 comprobaciones, todas correctas, sin errores ni avisos en la consola y sin peticiones externas, con anchos de 360, 375, 768 y 1280 px y sin scroll horizontal en ninguno (también con los errores a la vez al enviar vacío, con nombres de 70 caracteres sin espacios en el cuadro y en la tarjeta a 360 px, y con «Cancelar» y «Confirmar reserva» en la misma fila a 360 px). Incluyen: los ocho errores a la vez, la cascada, las tres marcas de paso, «Tu cita» pegado a 24 px al hacer scroll, cancelar sin ocupar turno, doble clic con un solo `DEMO-001`, 09:00 ocupado solo para ese médico y fecha, el teclado (Espacio, flechas y la flecha hacia el turno ocupado), el contraste calculado de la tabla de arriba y `prefers-reduced-motion` (cuadro a 0 s; icono y tarjeta solo con opacidad). La prueba usó `puppeteer-core` instalado en una carpeta temporal fuera del proyecto; no es una dependencia del proyecto. Pendiente: ver la pantalla en un móvil real (el sticky y la entrada de la tarjeta nueva se probaron solo en Chrome de escritorio).
- **Alcance:** no se modificaron `src/demo/datos.ts`, `src/demo/esquema.ts`, `src/App.tsx`, `docs/specs/*`, los casos de uso ni `fase-01.md`, `fase-02.md` y `fase-03.md`. Las secciones de las tareas 3 y 4 de este archivo no se editaron.

## Taller 5: integración continua con GitHub Actions (tarea 6, 2026-11-24)

- **Origen:** tarea 6 del harness y Taller 5 del curso: crear un pipeline de integración continua (CI) con GitHub Actions que instale las dependencias y compile el proyecto, probarlo con un error a propósito y entregar un PDF de dos páginas con las capturas. El estudiante pidió completar el taller, incluidos los commits y el envío a GitHub (repositorio público `Wilo1233/proyecto-bootcamp`). Esta sección no reemplaza a ninguna anterior: «tarea 5» sigue siendo el rediseño visual de la demo.
- **Dependencias:** ninguna nueva ni cambiada en npm; `package.json` y `pnpm-lock.yaml` no se tocaron. El workflow usa tres acciones de GitHub, cuyas versiones mayores se comprobaron el 24 de noviembre de 2026 con la API de lanzamientos (`gh api repos/<acción>/releases/latest`): `actions/checkout@v7` (última v7.0.1), `pnpm/action-setup@v6` (v6.1.1) y `actions/setup-node@v7` (v7.1.0). Según su `action.yml`, las tres corren con Node 24.
- **Qué cambió, por archivo:**
  - `.github/workflows/ci.yml` (nuevo): el pipeline. Se dispara en `push` a cualquier rama y en `pull_request`; permisos `contents: read`; un trabajo «Build» en `ubuntu-latest` con límite de 10 minutos y estos pasos: `checkout` (con `persist-credentials: false`), `pnpm/action-setup`, `setup-node` (Node 24, `cache: pnpm`), `pnpm install --frozen-lockfile` y `pnpm build`.
  - `docs/entregas/taller-05-ci.md` y `docs/entregas/taller-05-ci.pdf` (nuevos): la entrega, en dos páginas A4, con las dos capturas en `docs/entregas/taller-05-ci/` (`run-fallida.png` y `run-exitosa.png`).
  - `README.md`: la insignia del estado del CI bajo el título y una sección breve «Integración continua».
  - `docs/proceso.md`: esta sección.
- **Decisiones:**
  - **pnpm sin `version`:** `pnpm/action-setup` lee `packageManager` (`pnpm@11.17.0`). Si además se escribe `version` y difiere, la acción se detiene con «Multiple versions of pnpm specified».
  - **Orden de los pasos:** primero pnpm y después `setup-node`, porque `cache: pnpm` necesita pnpm ya instalado para calcular la carpeta de caché. Se usa una sola caché (la de `setup-node`); desde la versión 6 la caché automática de `setup-node` es solo de npm, así que `cache: pnpm` es explícito.
  - **Node 24** y no `node-version-file`: el campo `engines` dice `>=22.22.0`, un rango abierto que se resolvería a la versión más nueva de Node. Node 24 cumple el rango y es LTS; en local se usa Node 22.23.4.
  - **`--frozen-lockfile`** a propósito: si `pnpm-lock.yaml` no coincide con `package.json`, el CI falla en vez de instalar otra cosa.
  - **Permisos y concurrencia:** solo lectura, porque el trabajo nunca escribe en el repositorio. Una ejecución nueva de un `pull_request` cancela la anterior; las de `push` no se cancelan, para que las ejecuciones roja y verde de la prueba queden registradas.
  - **Solo instala y compila:** `pnpm build` ya revisa los tipos (`tsc -b`) y compila (`vite build`). No se añadió `pnpm lint` porque el taller no lo pide.
  - **El error se hizo en una rama aparte** (`prueba/ci-error`) y esa rama no se fusionó: `main` nunca tuvo el error.
- **Prueba con error controlado:**
  - **Cambio:** en `src/demo/datos.ts`, línea 26, `id: 'general',` pasó a `id: 42,`. La interfaz `Especialidad` declara `id: string`. Es solo un error de tipos: `vite build` no lo detectaría, `tsc -b` sí.
  - **Línea del registro del paso Build:** `src/demo/datos.ts(26,5): error TS2322: Type 'number' is not assignable to type 'string'.`, seguida de `Command failed with exit code 2.` y `Process completed with exit code 2.` GitHub la mostró además como anotación sobre `src/demo/datos.ts#L26`.
  - **Solución:** se restauró `id: 'general',` en la misma rama y se subió. El contenido de la rama quedó idéntico al de `main` (`git diff main` vacío).
- **Ejecuciones registradas** (todas en `https://github.com/Wilo1233/proyecto-bootcamp/actions/runs/<número>`):

  | Rama | Commit | Resultado | Número |
  |---|---|---|---|
  | `main` | `b00c09a` Agregar pipeline de CI con GitHub Actions | Éxito (22 s) | 45527350114 |
  | `prueba/ci-error` | `c80c2e2` Prueba CI: introducir error de tipos controlado | Fallo, paso Build (19 s) | 45527431210 |
  | `prueba/ci-error` | `3806720` Prueba CI: corregir error de tipos | Éxito (22 s) | 45527507707 |

  El commit que añade este texto y el PDF a `main` dispara otra ejecución, visible en la pestaña Actions.
- **Cómo demostrarlo, paso a paso:**
  1. Abrir `https://github.com/Wilo1233/proyecto-bootcamp/actions` y ver las ejecuciones de «CI»: dos verdes y una roja (la de la rama `prueba/ci-error`).
  2. Abrir la ejecución roja (`…/runs/45527431210`): en «Annotations» aparece el error de `src/demo/datos.ts`, línea 26. Con la sesión de GitHub iniciada, el paso «Build» muestra el registro completo; con `gh run view 45527431210 --log-failed` también se ve desde la terminal.
  3. Reproducirlo en local sin riesgo: `git switch -c prueba/local`, cambiar `id: 'general',` por `id: 42,` en la línea 26 de `src/demo/datos.ts` y ejecutar `pnpm build`: falla con el mismo error TS2322. Volver a poner `'general'` y deja de fallar.
- **Verificación hecha:** las tres ejecuciones terminaron como se esperaba (verde, rojo y verde; se comprobó el estado con `gh run view`); el registro fallido contiene la línea TS2322 de arriba; `pnpm build` local en `main` pasa; el PDF mide A4 y tiene dos páginas (se contaron las páginas del archivo y se revisó cada una convertida a imagen). Las capturas se sacaron con Chrome sin interfaz de las páginas públicas de cada ejecución; la página del trabajo («job») exige iniciar sesión para ver el registro, por eso se usó la página de resumen de la ejecución, que sí muestra la anotación del error. El PDF se imprimió con `--print-to-pdf` desde un HTML temporal que no está en el repositorio. Pendiente: no se probó el workflow con un `pull_request` real; el taller solo pide la ejecución por `push`.
- **Alcance:** en `main` no se modificó nada de `src/`, ni `package.json`, `pnpm-lock.yaml`, `docs/specs/*`, los casos de uso, `fase-01.md`, `fase-02.md`, `fase-03.md` o las secciones anteriores de este archivo. La rama `prueba/ci-error` queda en GitHub como evidencia.

## Taller 7: despliegue continuo a Amazon S3 (tarea 7, 2026-11-26)

- **Origen:** tarea 7 del harness y Taller 7 del curso: ampliar el pipeline del Taller 5 para que, además de compilar, guarde el resultado como artefacto y lo despliegue en un bucket de Amazon S3 con alojamiento de sitio web estático, solo cuando el cambio llegue a `main`. El workflow del trabajo de despliegue es el que entrega el docente; solo se añadió el paso de subida del artefacto al trabajo existente. Esta sección no reemplaza a ninguna anterior: «tarea 6» sigue siendo el Taller 5.
- **Dependencias:** ninguna nueva ni cambiada en npm; `package.json` y `pnpm-lock.yaml` no se tocaron. El workflow suma tres acciones de GitHub, todas en la versión `@v4` que usa el taller (decisión: se respeta lo que pide el docente): `actions/upload-artifact@v4`, `actions/download-artifact@v4` y `aws-actions/configure-aws-credentials@v4`. Deriva de versiones comprobada el 26 de noviembre de 2026 (`gh api repos/<acción>/releases/latest` y el `action.yml` de la etiqueta `v4`): las últimas son `upload-artifact` v7.0.2, `download-artifact` v8.0.2 y `configure-aws-credentials` v6.3.1, y las tres etiquetas `@v4` declaran `node20`, que GitHub marca como obsoleto, así que la ejecución puede mostrar un aviso de deprecación; las demás acciones del workflow ya usan Node 24. Además, `AWS_SESSION_TOKEN` implica credenciales temporales (AWS Academy) que caducan al terminar cada sesión del laboratorio y hay que renovar en los secretos.
- **Qué cambió, por archivo:**
  - `.github/workflows/ci.yml`: en el trabajo «Build», un paso nuevo «Subir artefacto» después de `Build` (`actions/upload-artifact@v4`, `name: react-build`, `path: dist/`); y un trabajo nuevo «Deploy AWS S3» (`deploy`, `ubuntu-latest`, `needs: build`, `if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'`) con cuatro pasos: descargar el artefacto en `dist`, configurar las credenciales de AWS, verificar la identidad con `aws sts get-caller-identity` y `aws s3 sync dist/ s3://${{ vars.S3_BUCKET_NAME }}`. No se tocaron `on`, `permissions`, `concurrency` ni los pasos anteriores de «Build».
  - `docs/entregas/taller-07-cd.md` (nuevo): la entrega en Markdown, con el pipeline, la preparación de AWS y de GitHub, los límites conocidos y las partes pendientes marcadas como tales. No hay PDF ni carpeta de capturas todavía.
  - `README.md`: la sección «Integración continua» menciona el trabajo de despliegue, los secretos y variables necesarios (solo sus nombres) y la entrega del Taller 7; el párrafo de «Documentación» menciona esta sección.
  - `docs/proceso.md`: esta sección.
- **Decisiones:**
  - **`needs: build` y la condición del `if`:** el despliegue solo arranca si «Build» termina bien y solo en un `push` a `main`; en otras ramas y en `pull_request` se compila pero no se publica.
  - **Artefacto en vez de recompilar:** el despliegue sube exactamente lo que compiló «Build». Los artefactos de la misma ejecución se comparten con el token de ejecución, y las credenciales de AWS son claves estáticas, así que `permissions: contents: read` basta; no se añadió `id-token: write`.
  - **Secretos y variables:** las tres credenciales (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) van como secretos; la región (`AWS_REGION`) y el nombre del bucket (`S3_BUCKET_NAME`) como variables, porque no son confidenciales. Sus valores no están en el repositorio ni en la documentación.
  - **Sin `--delete`:** `aws s3 sync` no borra del bucket lo que ya no está en `dist/`. Como Vite renombra los archivos de `assets/` en cada compilación, los viejos se acumulan; se dejó así para seguir el taller y no borrar nada del bucket sin querer.
  - **Solo HTTP:** el alojamiento de sitio web de S3 no sirve HTTPS; la dirección tiene el formato `http://<bucket>.s3-website-<región>.amazonaws.com`.
  - **Privacidad en la documentación:** `aws sts get-caller-identity` imprime el identificador de la cuenta y el ARN; por eso en los documentos no hay identificadores de cuenta, ARN reales ni valores de secretos, y las capturas del registro deben taparlos.
- **Cómo demostrarlo, paso a paso:**
  1. En AWS: crear el bucket, activar el alojamiento de sitios web estáticos (documento de índice `index.html`), desactivar «Bloquear todo el acceso público» y añadir una política del bucket que permita `s3:GetObject` a todos (plantilla en `docs/entregas/taller-07-cd.md`, sección 4.1).
  2. En GitHub, «Settings» → «Secrets and variables» → «Actions»: crear los secretos `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `AWS_SESSION_TOKEN` (copiados del laboratorio de AWS Academy de esa sesión) y las variables `AWS_REGION` y `S3_BUCKET_NAME`.
  3. Subir el cambio a `main`: en la pestaña Actions, la ejecución de «CI» muestra «Build» y «Deploy AWS S3» en verde, y en el resumen aparece el artefacto `react-build`.
  4. Abrir `http://<bucket>.s3-website-<región>.amazonaws.com` y ver la demo.
  5. Cambiar algo pequeño y visible en la demo, subirlo a `main`, esperar el nuevo despliegue y recargar el sitio: debe mostrar el cambio.
  6. Comprobar que el despliegue no se dispara fuera de `main`: un `push` a otra rama o un `pull_request` ejecutan «Build» y el trabajo «Deploy AWS S3» aparece omitido.
  7. Si el despliegue falla por credenciales, iniciar de nuevo el laboratorio, renovar los tres secretos y volver a ejecutar el workflow.
- **Verificación hecha:** el `ci.yml` se leyó con un analizador de YAML (versión 2.8.1 del paquete `yaml`, instalada en una carpeta temporal fuera del proyecto): `jobs` tiene `build` y `deploy` al mismo nivel, `deploy` depende de `build` y su condición es la de arriba; «Build» tiene seis pasos y «Deploy AWS S3» cuatro. `pnpm build` local pasa. Se comprobó con la API de GitHub la última versión de cada acción y que las tres etiquetas `@v4` declaran `node20`. Pendiente: no se ha hecho ningún despliegue real. Los secretos y variables del repositorio todavía no están configurados, el bucket de S3 no está creado y por eso faltan la URL pública, los enlaces a las ejecuciones, las capturas y la prueba del cambio visual (todo marcado como «Pendiente» en la entrega). Tampoco se ha comprobado si el taller exige un PDF; si lo pide, se generará después de una ejecución real.
- **Alcance:** no se modificó nada de `src/`, ni `package.json`, `pnpm-lock.yaml`, `docs/specs/*`, los casos de uso, `fase-01.md`, `fase-02.md`, `fase-03.md` o las secciones anteriores de este archivo.
