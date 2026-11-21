import { Card, Text, Title } from '@mantine/core'
import { ListaDatos } from './ListaDatos.tsx'

// Resumen «Tu cita» (columna derecha en pantallas anchas). Solo muestra lo que
// ya se eligió; lo que falta aparece como «Pendiente». No es una región en
// vivo (cambia con cada letra escrita y saturaría a un lector de pantalla).
export function ResumenCita({
  filas,
}: {
  filas: ReadonlyArray<readonly [string, string]>
}) {
  return (
    <Card shadow="sm">
      <Title order={2} id="tu-cita" mb="md">
        Tu cita
      </Title>
      <ListaDatos filas={filas} vacio="Pendiente" />
      <Text size="sm" c="dimmed" mt="md">
        Revisarás todo antes de confirmar.
      </Text>
    </Card>
  )
}
