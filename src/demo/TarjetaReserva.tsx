import { Badge, Card, Divider, Group, Text } from '@mantine/core'
import type { Reserva } from './datos.ts'

// Una reserva ya confirmada, en la lista «Reservas confirmadas en esta demo».
// No es interactiva (sin hover ni clic); la animación de entrada está en
// index.css (clase demo-reserva).
export function TarjetaReserva({ reserva }: { reserva: Reserva }) {
  return (
    <Card padding="md" className="demo-reserva">
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <Badge color="exito" variant="light" size="lg" ff="monospace">
          {reserva.codigo}
        </Badge>
        <Text fw={700} size="lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {reserva.hora}
        </Text>
      </Group>
      <Text fw={600}>
        {reserva.especialidad} · {reserva.medico}
      </Text>
      <Text size="sm" c="dimmed">
        {reserva.fecha}
      </Text>
      <Divider my="sm" />
      <Text size="sm">Paciente: {reserva.paciente}</Text>
      <Text size="sm">Acompañante: {reserva.acompanante ?? 'Va solo'}</Text>
      <Text size="sm">Familiar: {reserva.familiar}</Text>
    </Card>
  )
}
