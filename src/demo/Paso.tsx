import type { ReactNode } from 'react'
import { Card, Group, Text, ThemeIcon, Title, VisuallyHidden } from '@mantine/core'
import { IconoCheck } from './Iconos.tsx'

// Cada sección del formulario: un número (o una marca si ya está completa), un
// título, una frase de ayuda y su contenido en una tarjeta. `listo` solo dice
// «esto ya está rellenado»; no valida nada (la validación es del esquema).
export function Paso({
  numero,
  titulo,
  descripcion,
  listo = false,
  children,
}: {
  numero: number
  titulo: string
  descripcion?: string
  listo?: boolean
  children: ReactNode
}) {
  return (
    <Card shadow="xs">
      <Group gap="sm" mb="md" wrap="nowrap" align="flex-start">
        <ThemeIcon
          radius="xl"
          size={32}
          variant={listo ? 'filled' : 'light'}
          fw={700}
          style={{ flexShrink: 0 }}
        >
          {listo ? <IconoCheck /> : numero}
        </ThemeIcon>
        <div>
          <Title order={2}>
            {titulo}
            {listo ? <VisuallyHidden> (completo)</VisuallyHidden> : null}
          </Title>
          {descripcion ? (
            <Text size="sm" c="dimmed">
              {descripcion}
            </Text>
          ) : null}
        </div>
      </Group>
      {children}
    </Card>
  )
}
