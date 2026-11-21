import { useCallback, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Group,
  Modal,
  Paper,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import {
  ESPECIALIDADES,
  claveTurno,
  fechasDe,
  medicosDe,
  turnosDe,
  type Reserva,
} from './datos.ts'
import { crearEsquema, type ValoresReserva } from './esquema.ts'
import { IconoCheck } from './Iconos.tsx'
import { ListaDatos } from './ListaDatos.tsx'
import { Encabezado, PiePagina, Presentacion } from './Marco.tsx'
import { Paso } from './Paso.tsx'
import { ResumenCita } from './ResumenCita.tsx'
import { TarjetaReserva } from './TarjetaReserva.tsx'

// Lo que muestra el modal «Revisar reserva»: la reserva sin código (todavía no
// existe), más la clave del turno para marcarlo como ocupado al confirmar.
type Revision = Omit<Reserva, 'codigo'> & { clave: string }

// Sirve para la revisión y para la reserva confirmada (esta tiene además código).
function filasDeReserva(datos: Omit<Reserva, 'codigo'>) {
  return [
    ['Especialidad', datos.especialidad],
    ['Médico', datos.medico],
    ['Fecha', datos.fecha],
    ['Hora', datos.hora],
    ['Paciente', datos.paciente],
    ['Acompañante', datos.acompanante ?? 'Va solo'],
    ['Familiar', datos.familiar],
  ] as const
}

export function ReservaDemo() {
  const [opened, { open, close }] = useDisclosure(false)

  // Turnos ocupados (claves médico|fecha|hora). La ref es la fuente de verdad
  // para validar y para el control de la confirmación (se actualiza de forma
  // síncrona); el estado la refleja para pintar los radios deshabilitados.
  const ocupadosRef = useRef(new Set<string>())
  const [ocupados, setOcupados] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  )

  // Protección contra doble clic en «Confirmar reserva»: es síncrona, así que
  // un segundo clic ve el valor nuevo antes de cualquier re-render. Se limpia
  // al abrir la siguiente revisión.
  const confirmandoRef = useRef(false)
  // Contador de códigos. Se lee y se incrementa solo dentro del manejador del
  // clic (nunca dentro de un setState(prev => ...), que StrictMode ejecuta dos
  // veces).
  const contadorRef = useRef(0)

  const [revision, setRevision] = useState<Revision | null>(null)
  const [confirmada, setConfirmada] = useState<Reserva | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])

  // El esquema se crea una sola vez. `estaOcupado` solo se ejecuta al validar
  // (al enviar el formulario), nunca durante el render.
  const estaOcupado = useCallback(
    (clave: string) => ocupadosRef.current.has(clave),
    [],
  )
  // oxlint-disable-next-line react/refs -- crearEsquema solo guarda la función; no lee la ref aquí
  const [esquema] = useState(() => crearEsquema(estaOcupado))

  const form = useForm<ValoresReserva>({
    mode: 'controlled',
    initialValues: {
      especialidadId: '',
      medicoId: '',
      fechaId: '',
      turno: '',
      pacienteNombre: '',
      vaSolo: false,
      acompananteNombre: '',
      familiarNombre: '',
      celular: '',
    },
    validate: schemaResolver(esquema, { sync: true }),
  })

  // Un manejador por paso: guarda lo elegido y vacía los pasos siguientes,
  // porque ya no corresponden al nuevo valor (efecto cascada).
  function elegirEspecialidad(id: string) {
    form.setFieldValue('especialidadId', id)
    form.setFieldValue('medicoId', '')
    form.setFieldValue('fechaId', '')
    form.setFieldValue('turno', '')
  }

  function elegirMedico(id: string) {
    form.setFieldValue('medicoId', id)
    form.setFieldValue('fechaId', '')
    form.setFieldValue('turno', '')
  }

  function elegirFecha(id: string) {
    form.setFieldValue('fechaId', id)
    form.setFieldValue('turno', '')
  }

  function marcarVaSolo(vaSolo: boolean) {
    form.setFieldValue('vaSolo', vaSolo)
    // Si va solo se vacía el acompañante (esto también borra su error).
    if (vaSolo) form.setFieldValue('acompananteNombre', '')
  }

  // Solo se llama cuando el esquema no encontró errores.
  function abrirRevision(valores: ValoresReserva) {
    const especialidad = ESPECIALIDADES.find((e) => e.id === valores.especialidadId)
    const medico = medicosDe(valores.especialidadId).find(
      (m) => m.id === valores.medicoId,
    )
    const fecha = fechasDe(valores.especialidadId, valores.medicoId).find(
      (f) => f.id === valores.fechaId,
    )

    confirmandoRef.current = false
    setConfirmada(null)
    setRevision({
      clave: claveTurno(valores.medicoId, valores.fechaId, valores.turno),
      especialidad: especialidad?.nombre ?? '',
      medico: medico?.nombre ?? '',
      fecha: fecha?.texto ?? '',
      hora: valores.turno,
      // form.onSubmit entrega los valores tal como se escribieron: el trim del
      // esquema no llega hasta aquí, así que se quitan los espacios a mano.
      paciente: valores.pacienteNombre.trim(),
      familiar: valores.familiarNombre.trim(),
      acompanante: valores.vaSolo ? null : valores.acompananteNombre.trim(),
    })
    open()
  }

  function confirmar() {
    if (confirmandoRef.current || revision === null) return
    confirmandoRef.current = true

    // Comprobación final: el turno debe seguir libre.
    if (ocupadosRef.current.has(revision.clave)) {
      confirmandoRef.current = false
      form.setFieldError('turno', 'Ese turno ya está ocupado; elige otro')
      close()
      return
    }

    const numero = contadorRef.current + 1
    contadorRef.current = numero
    const { clave, ...datos } = revision
    const reserva: Reserva = {
      codigo: `DEMO-${String(numero).padStart(3, '0')}`,
      ...datos,
    }

    ocupadosRef.current = new Set(ocupadosRef.current).add(clave)
    setOcupados(ocupadosRef.current)
    setReservas((anteriores) => [...anteriores, reserva])
    setConfirmada(reserva)
    form.reset()
  }

  // Listas de cada paso según lo ya elegido.
  const { especialidadId, medicoId, fechaId } = form.values
  const medicos = medicosDe(especialidadId)
  const fechas = fechasDe(especialidadId, medicoId)
  const turnos = turnosDe(especialidadId, medicoId, fechaId)

  // Solo para pintar (sin validar nada y sin mirar los turnos ocupados): el
  // resumen «Tu cita» y las marcas de «paso completo» salen de lo ya escrito.
  // «Completo» quiere decir «relleno», no «válido»: eso lo decide el esquema al
  // enviar. Nunca se llama aquí a form.isValid() ni al esquema, porque su regla
  // del turno libre lee la ref de turnos ocupados.
  const filasResumen = [
    ['Especialidad', ESPECIALIDADES.find((e) => e.id === especialidadId)?.nombre ?? ''],
    ['Médico', medicos.find((m) => m.id === medicoId)?.nombre ?? ''],
    ['Fecha', fechas.find((f) => f.id === fechaId)?.texto ?? ''],
    ['Hora', form.values.turno],
    ['Paciente', form.values.pacienteNombre.trim()],
  ] as const
  const paso1Listo = form.values.turno !== ''
  const paso2Listo =
    form.values.pacienteNombre.trim() !== '' &&
    (form.values.vaSolo || form.values.acompananteNombre.trim() !== '')
  const paso3Listo =
    form.values.familiarNombre.trim() !== '' && form.values.celular.trim() !== ''

  return (
    <Stack gap={0} mih="100dvh" bg="gray.0">
      <Encabezado />
      <Presentacion />

      <Box component="main" style={{ flex: 1 }}>
        <Container size="lg" py="xl">
          <Grid gap="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <form
                onSubmit={(evento) => form.onSubmit(abrirRevision)(evento)}
                noValidate
              >
                <Stack gap="lg">
                  <Paso
                    numero={1}
                    titulo="Cita"
                    descripcion="Especialidad, médico, fecha y hora"
                    listo={paso1Listo}
                  >
                    <Stack gap="md">
                      {/* value={x || null}: el Select no entiende '' y seguiría
                          mostrando el texto anterior; con null queda vacío. */}
                      {/* Especialidad y Médico en una fila y Fecha en la
                          siguiente, a todo el ancho: así el nombre del médico
                          (con «(ficticio)») cabe sin cortarse. */}
                      <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <Select
                          label="Especialidad"
                          placeholder="Elige una especialidad"
                          withAsterisk
                          allowDeselect={false}
                          data={ESPECIALIDADES.map((e) => ({
                            value: e.id,
                            label: e.nombre,
                          }))}
                          value={especialidadId || null}
                          onChange={(valor) => elegirEspecialidad(valor ?? '')}
                          error={form.errors.especialidadId}
                        />
                        <Select
                          label="Médico"
                          placeholder={
                            especialidadId === ''
                              ? 'Primero elige la especialidad'
                              : 'Elige un médico'
                          }
                          withAsterisk
                          allowDeselect={false}
                          disabled={especialidadId === ''}
                          data={medicos.map((m) => ({ value: m.id, label: m.nombre }))}
                          value={medicoId || null}
                          onChange={(valor) => elegirMedico(valor ?? '')}
                          error={form.errors.medicoId}
                        />
                        <Select
                          label="Fecha"
                          placeholder={
                            medicoId === ''
                              ? 'Primero elige el médico'
                              : 'Elige una fecha'
                          }
                          className="demo-campo-ancho"
                          withAsterisk
                          allowDeselect={false}
                          disabled={medicoId === ''}
                          data={fechas.map((f) => ({ value: f.id, label: f.texto }))}
                          value={fechaId || null}
                          onChange={(valor) => elegirFecha(valor ?? '')}
                          error={form.errors.fechaId}
                        />
                      </SimpleGrid>

                      <Radio.Group
                        label="Turno"
                        description="Elige uno de los turnos disponibles"
                        withAsterisk
                        {...form.getInputProps('turno')}
                      >
                        {fechaId === '' ? (
                          <Text c="dimmed" size="sm" mt="xs">
                            Elige especialidad, médico y fecha para ver los turnos.
                          </Text>
                        ) : (
                          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm" mt="xs">
                            {turnos.map((hora) => {
                              const ocupado = ocupados.has(
                                claveTurno(medicoId, fechaId, hora),
                              )
                              return (
                                <Radio.Card
                                  key={hora}
                                  value={hora}
                                  disabled={ocupado}
                                  className="demo-turno"
                                >
                                  <Group gap="xs" wrap="nowrap" align="center">
                                    <Radio.Indicator size="sm" disabled={ocupado} />
                                    <Text
                                      component="span"
                                      fw={600}
                                      style={{ fontVariantNumeric: 'tabular-nums' }}
                                    >
                                      {ocupado ? `${hora} — Ocupado` : hora}
                                    </Text>
                                  </Group>
                                </Radio.Card>
                              )
                            })}
                          </SimpleGrid>
                        )}
                      </Radio.Group>
                    </Stack>
                  </Paso>

                  <Paso
                    numero={2}
                    titulo="Paciente y acompañante"
                    descripcion="Quién va a la cita y quién lo acompaña"
                    listo={paso2Listo}
                  >
                    <Stack gap="md">
                      <TextInput
                        label="Nombre del paciente"
                        placeholder="Ej.: Ana Pérez"
                        withAsterisk
                        {...form.getInputProps('pacienteNombre')}
                      />
                      <Checkbox
                        label="El paciente va solo"
                        checked={form.values.vaSolo}
                        onChange={(evento) =>
                          marcarVaSolo(evento.currentTarget.checked)
                        }
                      />
                      <TextInput
                        label="Nombre del acompañante"
                        description="Persona que acompaña al paciente a la cita"
                        placeholder="Ej.: María Pérez"
                        withAsterisk={!form.values.vaSolo}
                        disabled={form.values.vaSolo}
                        {...form.getInputProps('acompananteNombre')}
                      />
                    </Stack>
                  </Paso>

                  <Paso
                    numero={3}
                    titulo="Tus datos"
                    descripcion="Para avisarte sobre la cita"
                    listo={paso3Listo}
                  >
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                      <TextInput
                        label="Tu nombre (familiar)"
                        description="Quien hace la reserva"
                        placeholder="Ej.: Luis Pérez"
                        withAsterisk
                        {...form.getInputProps('familiarNombre')}
                      />
                      <TextInput
                        label="Tu celular"
                        description="10 dígitos, empieza por 09"
                        placeholder="Ej.: 0991234567"
                        type="tel"
                        inputMode="numeric"
                        withAsterisk
                        {...form.getInputProps('celular')}
                      />
                    </SimpleGrid>
                  </Paso>

                  <Group justify="flex-end">
                    <Button type="submit" size="md">
                      Revisar reserva
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Grid.Col>

            {/* Solo en pantallas anchas. En el móvil el cuadro «Revisar
                reserva» ya muestra el resumen completo. Sin align en el Grid ni
                overflow en los contenedores: o el sticky no tiene recorrido. */}
            <Grid.Col span={{ base: 12, md: 4 }} visibleFrom="md">
              <Box component="aside" aria-labelledby="tu-cita" pos="sticky" top={24}>
                <ResumenCita filas={filasResumen} />
              </Box>
            </Grid.Col>
          </Grid>

          <Stack gap="sm" role="status" mt="xl">
            <Title order={2} size="h3">
              Reservas confirmadas en esta demo
            </Title>
            {reservas.length === 0 ? (
              <Paper
                p="lg"
                radius="md"
                bg="transparent"
                withBorder
                style={{ borderStyle: 'dashed' }}
              >
                <Text c="dimmed">Todavía no hay reservas confirmadas.</Text>
              </Paper>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                {reservas.map((reserva) => (
                  <TarjetaReserva key={reserva.codigo} reserva={reserva} />
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Container>
      </Box>

      <PiePagina />

      <Modal
        opened={opened}
        onClose={close}
        centered
        title={confirmada ? 'Reserva confirmada' : 'Revisar reserva'}
        styles={{
          title: { fontWeight: 700, fontSize: 'var(--mantine-font-size-lg)' },
        }}
      >
        {confirmada ? (
          <Stack gap="md">
            <Alert
              color="exito"
              variant="light"
              title="Código de demostración"
              icon={
                <span className="demo-exito-icono">
                  <IconoCheck />
                </span>
              }
            >
              <Text
                fw={700}
                size="xl"
                ff="monospace"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {confirmada.codigo}
              </Text>
            </Alert>
            <ListaDatos filas={filasDeReserva(confirmada)} />
            {/* A la izquierda a propósito: el segundo clic de un doble clic en
                «Confirmar reserva» (a la derecha) no cierra este cuadro. */}
            <Group justify="flex-start">
              <Button variant="default" onClick={close}>
                Cerrar
              </Button>
            </Group>
          </Stack>
        ) : revision ? (
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Comprueba los datos antes de confirmar.
            </Text>
            <ListaDatos filas={filasDeReserva(revision)} />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button onClick={confirmar}>Confirmar reserva</Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  )
}
