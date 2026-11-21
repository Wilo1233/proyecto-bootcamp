---
slug: "agenda-consultorio-tech"
title: "Diseño técnico: agenda del consultorio y base común"
description: "Diseño técnico propuesto de la agenda de la secretaria (ingreso, Horarios y Citas) y de la base común del frontend: rutas, layouts, proveedores, store de sesión y árbol de carpetas."
spec_kind: spec-tech
status: approved
created_at: "2026-11-11T01:08:18.697Z"
last_updated: "2026-11-11T01:34:07.254Z"
source_spec: agenda-consultorio
---
> **Estado:** borrador para la revisión del estudiante. Es un diseño propuesto; nada de lo descrito está implementado ni instalado. Las partes marcadas como **hipótesis (BQ-01)** dependen de un servicio remoto que todavía no existe.

## Fuente y evidencia actual

**Especificación funcional de origen (`sourceSpec`):** `agenda-consultorio` (aprobada; revisión vigente con `lastUpdated` 2026-11-09T06:02:21.247Z). Casos fuente: `publicar-horarios` y `consultar-citas` (aprobados).

**Papel de este documento (D62):** además del diseño de la agenda de la secretaria, define lo común del frontend: la tabla completa de rutas, los layouts, los proveedores, el store de sesión y las convenciones de carpetas. Los `spec-tech` de `reserva-cita` y `gestion-cita-codigo` (por redactar) lo referencian en lugar de repetirlo. Las filas de pantallas del familiar indican su caso de origen; sus reglas siguen perteneciendo a sus especificaciones.

**Base existente (hechos comprobados el 2026-11-10):**

- Aplicación Vite + React + TypeScript. `package.json`: `react` y `react-dom` 19.2.8, `typescript` 6.0.3, `vite` 8.2.2, `oxlint`. Scripts: `dev`, `build` (`tsc -b && vite build`), `lint` y `preview`. `src/` contiene solo la plantilla (`main.tsx`, `App.tsx`, estilos y assets).
- **No instalados:** `react-router`, `@tanstack/react-query`, `zustand`, `zod`, `@mantine/core`, `@mantine/hooks` y `@mantine/form`.
- **No existe un servicio remoto (BQ-01).** `ahk health` falla en Windows al invocar `health.bat`; el build ejecutado directamente funciona (fases 1 y 2).

**Fuentes documentales:** ver «Fuentes consultadas» al final de la sección de dependencias. Todas se consultaron el 2026-11-10.

## Límites, contratos y diseño

### Stack (propuesto, no instalado)

| Paquete | Versión de la cohorte | Compatibilidad declarada (registro npm, 2026-11-10) | Responsabilidad en el producto |
|---|---|---|---|
| `react` / `react-dom` | 19.2.8 (instalados) | — | Componentes, props y estado local |
| `react-router` | 8.3.1 | peer `react`/`react-dom` >= 19.2.7; `node` >= 22.22.0 | Navegación en modo declarativo (D63–D68) |
| `@tanstack/react-query` | 5.102.8 | peer `react` ^18 \|\| ^19 | Datos remotos (**hipótesis BQ-01**, D72) |
| `zustand` | 5.0.15 | todas sus dependencias pares son opcionales | Sesión de la secretaria en el cliente (D69) |
| `zod` | 4.4.3 | publica la entrada `./v4` | Schemas; se importa desde `zod/v4` |
| `@mantine/core` | 9.4.1 | peer `react`/`react-dom` ^19.2.0 y `@mantine/hooks` 9.4.1 | Componentes visuales y Modal (D71) |
| `@mantine/hooks` | 9.4.1 | exigido por `@mantine/core` (misma versión) | `useDisclosure` |
| `@mantine/form` | 9.4.1 | peer `react` ^19.2.0 | Formularios con `schemaResolver` (D70) |

No se añade `mantine-form-zod-resolver` (Mantine 9 trae `schemaResolver`), ni una librería de notificaciones, ni loaders o actions del router.

### Proveedores (propuesta)

En `main.tsx`: `MantineProvider` → `QueryClientProvider` (un único `QueryClient`) → `BrowserRouter` → `AppRoutes`. Zustand no necesita proveedor.

### Tabla de rutas (D63–D68, modo declarativo)

| Ruta | Pantalla | Grupo | Parámetros | Casos de origen | Al abrir o recargar la URL directamente |
|---|---|---|---|---|---|
| `/` | Inicio | Público (`index`) | — | `reservar-cita`, `consultar-cita-codigo` | Muestra las dos opciones |
| `/reservar` | Reservar cita | Público | `?especialidad=…&dia=…` (D65) | `reservar-cita` | Restaura la especialidad y el día; el horario y el formulario empiezan vacíos |
| `/mi-cita` | Mi cita | Público | Ninguno: el código vive solo en el formulario (D64) | `consultar-cita-codigo`, `cancelar-cita`, `cambiar-cita` | El campo del código aparece vacío; consultar, cancelar y cambiar ocurren dentro de esta ruta |
| `/personal/ingreso` | Ingreso del personal | Personal, sin protección | Destino previo en `location.state` (D67) | `publicar-horarios`, `consultar-citas` (condición previa) | Muestra el formulario de ingreso |
| `/personal` | — | Personal, protegido | — | — | Propuesta: redirige a `/personal/citas` |
| `/personal/horarios` | Horarios | Personal, protegido | — | `publicar-horarios` | Sin sesión en el store: redirige al ingreso (con `replace`) guardando el destino |
| `/personal/citas` | Citas | Personal, protegido | `?dia=…&medico=…` (D66); la búsqueda vive en la pantalla | `consultar-citas` | Igual que Horarios; después de ingresar vuelve con el mismo día y médico |
| `*` | No encontrada | Público | — | — | Mensaje y enlace a Inicio |

Estructura propuesta:

```tsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route index element={<HomePage />} />
    <Route path="reservar" element={<ReservarPage />} />
    <Route path="mi-cita" element={<MiCitaPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
  <Route path="personal" element={<StaffLayout />}>
    <Route path="ingreso" element={<IngresoPage />} />
    <Route element={<RequireStaff />}>
      <Route index element={<Navigate to="citas" replace />} />
      <Route path="horarios" element={<HorariosPage />} />
      <Route path="citas" element={<CitasPage />} />
    </Route>
  </Route>
</Routes>
```

- **Layouts.** `PublicLayout` contiene el marco del familiar con enlaces a Inicio, Reservar y Mi cita. `StaffLayout` contiene el marco del personal; el menú (Horarios, Citas, el nombre y «Salir») solo se muestra con sesión. El familiar nunca ve el menú del personal (D63).
- **Guardia (D63).** `RequireStaff` lee `isSignedIn` del store. Sin sesión, navega a `/personal/ingreso` con `replace` y guarda en `state` la ruta pedida (incluidos `?dia` y `?medico`). Con sesión, muestra el `<Outlet/>`. **Es una guardia visual, no una autorización:** RN-18 exige que el servidor rechace las operaciones sin sesión (BQ-01).
- **Después de ingresar (D67).** Se navega con `replace` al destino guardado solo si empieza con `/personal/` y no es el propio ingreso. En cualquier otro caso, o sin destino, se va a `/personal/citas`. Que Citas sea la pantalla más usada es un supuesto sin datos.
- **Atrás.** Cambiar la especialidad o el día (D65), o el día o el médico (D66), crea entradas en el historial, así que «atrás» las recorre. Las redirecciones de la guardia y del ingreso usan `replace`, así que «atrás» no vuelve al ingreso.
- **Parámetros inválidos (D68).** Se valida su forma al dibujar, sin `useEffect`. Si un parámetro no es válido, se usa el valor por defecto (sin especialidad elegida, hoy o todos los médicos) y se muestra un aviso visible; por ejemplo: «La fecha del enlace no es válida; se muestra hoy». La existencia (que la especialidad exista, que el día no esté completo o que el médico exista) se comprueba con datos remotos (BQ-01). Queda como pregunta abierta cuándo se quita el parámetro inválido de la URL.

### Store de sesión de la secretaria (D69)

`useStaffSessionStore`, creado con `create<StaffSession>()(...)` de Zustand 5:

- **Estado:** `isSignedIn: boolean` (inicial `false`) y `displayName: string | null` (inicial `null`).
- **Acciones:** `signIn(displayName)` y `signOut()`.
- **Quién lo modifica:**
  - `IngresoPage` llama a `signIn` solo cuando el servidor acepta el ingreso.
  - `StaffLayout` llama a `signOut` con «Salir» (el cierre de sesión en el servidor depende de BQ-01).
  - El manejo de una respuesta de «sesión vencida» en las consultas del personal llama a `signOut`.
- **Quién lo consume (con selectores):** `RequireStaff` (`isSignedIn`), `StaffLayout` (`isSignedIn` y `displayName`), `IngresoPage` y `CitasPage` (`isSignedIn`, como condición `enabled` de la consulta de citas).
- **Qué no guarda:**
  - la contraseña ni ningún token;
  - el conteo de intentos ni la espera (RN-19 la aplica el servidor);
  - citas, turnos ni médicos (TanStack Query);
  - valores de formularios (Mantine Form).
- **Sin `persist`.** Al recargar, `isSignedIn` vuelve a `false` y la guardia lleva al ingreso (costo aceptado en D69).

### Diseño de la agenda

**Ingreso (condición previa de PR-01 y PR-02).** Usa un formulario con usuario y contraseña, ambos obligatorios; en el cliente solo se comprueba que no estén vacíos. La verificación de la contraseña, el mensaje «usuario o contraseña incorrectos» sin decir cuál dato falla y la espera de 15 minutos tras 5 intentos (RN-19) los aplica el servidor (BQ-01). La pantalla muestra lo que el servidor responda.

**Horarios (PR-01).**

- **Datos remotos (hipótesis BQ-01):**
  - la lista de médicos con su especialidad, con clave `['medicos']`;
  - los turnos publicados de un médico en un día, con clave `['turnos', medicoId, dia]`.
- **Formulario de publicación (Mantine Form):** médico, día, hora de inicio, hora de fin y duración ∈ {15, 20, 30, 45, 60} (RN-20, RN-21). En el cliente se valida la forma de B2: campos obligatorios, el día no es anterior a hoy y la hora de fin es posterior a la de inicio. Propuesta pendiente de revisión: usar la misma cadena Zod → `schemaResolver` que el formulario de reserva (D70).
- **Quién garantiza cada regla:** la división en turnos completos y los minutos sobrantes (RN-22), los turnos que ya empezaron (RN-23) y la superposición (RN-24) los garantiza el servidor, que es la fuente única de los turnos. El cálculo de RN-22 puede escribirse además como una función pura para una vista previa (propuesta pendiente).
- **Publicar (mutación, hipótesis):** la respuesta del servidor trae el resumen (turnos publicados, minutos sobrantes, no publicados por haber empezado o por superponerse), que se muestra (paso 7). Al terminar bien se invalidan `['turnos', medicoId, dia]` y `['turnos-libres', especialidad]` (D72), para que el familiar vea los turnos nuevos.
- **Quitar un turno libre (mutación, hipótesis; B3 y B4):** sin confirmación adicional, porque B3 no la pide (D71). Si sale bien, se invalidan las mismas claves. Si el servidor responde «ya reservado» (B4), se muestra el mensaje y el turno queda igual.
- **B8 (salir sin confirmar):** los valores viven en Mantine Form, dentro de la pantalla; al salir se descartan y no se publica nada.

**Citas (PR-02).**

- **Filtros (D66).** El día y el médico se leen de la URL con `useSearchParams`; por defecto, hoy y todos los médicos. Si son inválidos, aplica D68.
- **Consulta (hipótesis BQ-01).** Clave `['citas', dia, medico]`, con `enabled: isSignedIn`. Estados:
  - cargando;
  - error, con «reintentar»;
  - vacío (C1);
  - éxito, ordenado por hora (RN-26).
- **Búsqueda (RN-27).** El texto vive en el estado local de la pantalla (`useState`), no en la URL. La lista visible se **deriva al dibujar** aplicando una función pura que busca el texto en cualquier parte del nombre y apellido, sin importar mayúsculas ni tildes. «Sin coincidencias» (C2) también es un valor derivado. Si hay varias coincidencias (C3), se muestran todas con hora y médico.
- **Datos visibles (RN-26):**
  - hora, médico y especialidad;
  - paciente, y si es menor de edad;
  - acompañante;
  - nombre y teléfono del familiar.

  Nunca se muestran el código, el correo ni el canal. Propuesta: el servidor no debería enviar esos campos a esta pantalla (BQ-01).

### Árbol de carpetas (plan propuesto; no son archivos generados)

```
src/
  main.tsx                      # proveedores
  app/
    AppRoutes.tsx               # tabla de rutas
    query-client.ts             # QueryClient único
  layouts/
    PublicLayout.tsx
    StaffLayout.tsx
  pages/
    HomePage.tsx
    NotFoundPage.tsx
  features/
    staff-session/
      staff-session-store.ts    # Zustand (D69)
      RequireStaff.tsx          # guardia visual (D63)
      IngresoPage.tsx
    agenda/
      HorariosPage.tsx
      PublicarBloqueForm.tsx
      CitasPage.tsx
      filtrar-citas.ts          # búsqueda pura (RN-27)
    reserva/                    # detalle en el spec-tech de reserva-cita
    mi-cita/                    # detalle en el spec-tech de gestion-cita-codigo
  shared/
    url-params/
      leer-parametros.ts        # validación de parámetros (D68)
  services/                     # acceso remoto: se crea cuando exista un contrato (BQ-01)
```

Las carpetas usan kebab-case y los componentes, PascalCase. `services/` no se crea vacía: depende de BQ-01.

## Dependencias, despliegue, riesgos y validación

**Dependencia externa bloqueante (BQ-01).** Se necesita un servicio que ofrezca médicos, turnos, citas y la sesión de la secretaria, con RN-18 y RN-19 aplicadas en el servidor. Sin él no pueden comprobarse TanStack Query, la autorización real, RN-19, la publicación ni la consulta de citas. No se inventan endpoints.

**Riesgos y cómo reducirlos:**

1. **Versión de React Router.** Context7 no ofrece una versión fijada 8.x (la más alta listada es la 7.13.0). La documentación vigente del sitio oficial enlaza la API v8. Al implementar, revisar las notas de la versión 8 para el modo declarativo.
2. **Versión de Zustand.** Se consultó la documentación de la 5.0.14 y la cohorte usa la 5.0.15, una diferencia de parche. Al implementar, comprobar el changelog.
3. **Confundir la guardia visual con autorización.** Se documenta que la seguridad depende del servidor y se prevé una prueba de petición sin sesión (bloqueada por BQ-01).
4. **Volver a ingresar al recargar.** Es un costo aceptado (D69); D67 reduce lo que se pierde.
5. **Limpiar un parámetro inválido de la URL sin `useEffect`.** Es una pregunta abierta.
6. **`ahk health` falla.** Bloquea el flujo de tareas de AHK; queda pendiente de consultar al docente.

**Despliegue.** No se define en este documento: es una pregunta abierta del plan de construcción.

**Verificación prevista (nada ejecutado todavía):**

| Qué se comprueba | Comprobación prevista | Herramienta | Límite de la evidencia |
|---|---|---|---|
| RN-27 (CA-02.4, CA-02.5) | Prueba pura de `filtrar-citas`: «jose» encuentra a José Pérez y a Josefina Ruiz; «jose perez» solo a José Pérez | Vitest (de la cohorte; no instalado) | No prueba la pantalla |
| D68 | Prueba pura de `leer-parametros`: una fecha inválida devuelve hoy y un aviso | Vitest | Solo la forma; la existencia depende de BQ-01 |
| D69 | Prueba pura de `signIn` y `signOut` del store | Vitest | No prueba el servidor |
| D63 y D67 | Recorrido en el navegador: abrir `/personal/citas?dia=…` sin sesión → ingreso → vuelve con el día | Navegador (`pnpm dev`) | Guardia visual; requiere un ingreso real (BQ-01) |
| RN-18 | Una petición sin sesión es rechazada | Servicio remoto | Bloqueado por BQ-01 |
| Build | `pnpm build` (o `health.bat` ejecutado directamente) | Vite y TypeScript | No demuestra las integraciones |

**Fases de implementación (orden propuesto; detalle en el plan de construcción):**

1. Instalar las dependencias de la cohorte; proveedores, rutas, layouts y `NotFoundPage`.
2. Store de sesión y guardia, con pruebas puras.
3. Citas: filtros en la URL y búsqueda pura.
4. Horarios: formulario.
5. Integración remota cuando se resuelva BQ-01.

**Fuentes consultadas (2026-11-10):**

| Librería | Versión de la cohorte | Fuente | Concepto | Enlace |
|---|---|---|---|---|
| React Router | 8.3.1 | Context7 `/websites/reactrouter` (documentación vigente) | Modo declarativo, rutas de layout, `index`, `:param`, `*` | https://reactrouter.com/start/declarative/routing |
| React Router | 8.3.1 | Context7 `/websites/reactrouter` | `useSearchParams` | https://reactrouter.com/api/hooks/useSearchParams |
| React Router | 8.3.1 | Context7 `/websites/reactrouter` | `useNavigate` (`replace`, `state`) y `useLocation` | https://reactrouter.com/api/hooks/useNavigate |
| Zustand | 5.0.15 | Context7 `/pmndrs/zustand` v5.0.14 | `create<T>()()`, selectores, `persist` opcional | https://github.com/pmndrs/zustand/blob/v5.0.14/docs/learn/guides/beginner-typescript.md |
| Mantine Form | 9.4.1 | Context7 `/mantinedev/mantine` 9.0.0 | `schemaResolver` con `zod/v4` | https://github.com/mantinedev/mantine/blob/9.0.0/apps/mantine.dev/src/pages/form/schema-validation.mdx |
| TanStack Query | 5.102.8 | Context7 `/websites/tanstack_query_framework_react` | `queryKey`, `enabled`, estados e invalidación | https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations |
| Todos | — | Registro npm (`npm view`) | Versiones y dependencias pares | https://www.npmjs.com/ |

## Decisiones y preguntas abiertas

**Decisiones del estudiante que aplica este documento** (detalle y motivos en `docs/proceso.md`):

- D61: un `spec-tech` por especificación funcional.
- D62: este documento contiene lo común.
- D63: dos grupos con layout y una guardia visual.
- D64: el código no va en la URL.
- D65: la especialidad y el día van en la URL.
- D66: el día y el médico van en la URL; la búsqueda, en la pantalla.
- D67: después de ingresar, se vuelve al destino pedido; por defecto, a Citas.
- D68: un parámetro inválido usa el valor por defecto y muestra un aviso.
- D69: store de Zustand para la sesión, sin tokens ni persistencia.
- D72: las invalidaciones de `['turnos-libres', especialidad]` al publicar o quitar turnos.

**Supuesto:** Citas es la pantalla que más usa la secretaria (D67), sin datos de uso.

**Propuestas del agente pendientes de revisión del estudiante:**

- el orden de los proveedores;
- los nombres de las rutas, componentes y archivos;
- que `/personal` redirija a Citas;
- el árbol de carpetas;
- usar Zod también en el ingreso y en la publicación;
- la vista previa de RN-22 en el cliente;
- el contenido de `NotFoundPage`.

**Preguntas abiertas:**

- BQ-01: servicio remoto, sesión y cierre de sesión en el servidor.
- ¿Cuándo se quita de la URL un parámetro inválido?
- ¿El alcance incluye publicar la aplicación? ¿Dónde?
