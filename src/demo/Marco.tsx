import {
  Alert,
  Badge,
  Box,
  Container,
  Group,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconoCandado,
  IconoInfo,
  IconoLogo,
  IconoPasos,
  IconoRevisar,
} from './Iconos.tsx'

// Cabecera del sitio: logo ficticio, nombre y la marca DEMO siempre visible.
export function Encabezado() {
  return (
    <Box
      component="header"
      bg="white"
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
    >
      <Container size="lg" py="sm">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <IconoLogo />
            <Box>
              <Text fw={700} lh={1.2}>
                Consultorio Ejemplo
              </Text>
              <Text size="xs" c="dimmed" visibleFrom="sm">
                Medicina general · Pediatría · Cardiología
              </Text>
            </Box>
          </Group>
          <Badge color="aviso.8" variant="filled" size="lg">
            DEMO
          </Badge>
        </Group>
      </Container>
    </Box>
  )
}

// Cada punto es verdad en esta demo (no promete nada médico ni de servicio).
const PUNTOS = [
  { icono: <IconoPasos />, texto: 'Tres pasos sencillos' },
  { icono: <IconoRevisar />, texto: 'Revisas antes de confirmar' },
  { icono: <IconoCandado />, texto: 'Sin cuentas ni contraseñas' },
]

// Franja de presentación: título, frase, tres puntos y el aviso DEMO.
export function Presentacion() {
  return (
    <Box
      bg="clinica.0"
      py={{ base: 'lg', md: 'xl' }}
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
    >
      <Container size="lg">
        <Group gap="md" align="center" mb="xs">
          <Title order={1}>
            Reserva un turno para tu familiar 🚀 (desplegado automáticamente)
          </Title>
          <Badge color="clinica" variant="filled" size="lg">
            Versión 2.0
          </Badge>
        </Group>
        <Text size="lg" c="dimmed" maw={640} mb="lg">
          Elige especialidad, médico y horario en tres pasos y revisa todo antes
          de confirmar.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" mb="lg">
          {PUNTOS.map((punto) => (
            <Group key={punto.texto} gap="sm" wrap="nowrap">
              <ThemeIcon variant="light" radius="xl" size={32}>
                {punto.icono}
              </ThemeIcon>
              <Text size="sm" fw={500}>
                {punto.texto}
              </Text>
            </Group>
          ))}
        </SimpleGrid>

        <Alert color="aviso" variant="light" icon={<IconoInfo />}>
          <Text span fw={700}>
            DEMO
          </Text>{' '}
          — datos ficticios en memoria; se pierden al recargar la página. No
          envía mensajes ni usa servidor.
        </Alert>
      </Container>
    </Box>
  )
}

export function PiePagina() {
  return (
    <Box
      component="footer"
      py="lg"
      style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
    >
      <Container size="lg">
        <Text size="sm" c="dimmed">
          DEMO · Consultorio Ejemplo es un nombre ficticio. Médicos, fechas y
          turnos son inventados; nada se envía ni se guarda. No es un servicio
          médico ni atiende emergencias.
        </Text>
      </Container>
    </Box>
  )
}
