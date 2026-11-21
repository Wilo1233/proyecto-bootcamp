import type { ReactNode } from 'react'

// Iconos en SVG dentro del propio código (trazos de 24×24 estilo «feather»):
// sin librería de iconos y sin archivos que descargar. Son decorativos, así que
// van ocultos para los lectores de pantalla (el texto de al lado dice lo mismo).
function Trazo({ tamano, children }: { tamano: number; children: ReactNode }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

// Logo ficticio: un cuadrado redondeado verde azulado con un corazón blanco.
// A propósito no es una cruz (la cruz roja es un emblema protegido) ni imita a
// ninguna clínica real.
export function IconoLogo({ tamano = 32 }: { tamano?: number }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        width="32"
        height="32"
        rx="8"
        style={{ fill: 'var(--mantine-color-clinica-7)' }}
      />
      <path
        transform="translate(6 6) scale(0.833)"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconoCheck({ tamano = 18 }: { tamano?: number }) {
  return (
    <Trazo tamano={tamano}>
      <polyline points="20 6 9 17 4 12" />
    </Trazo>
  )
}

export function IconoInfo({ tamano = 18 }: { tamano?: number }) {
  return (
    <Trazo tamano={tamano}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </Trazo>
  )
}

export function IconoPasos({ tamano = 18 }: { tamano?: number }) {
  return (
    <Trazo tamano={tamano}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </Trazo>
  )
}

export function IconoRevisar({ tamano = 18 }: { tamano?: number }) {
  return (
    <Trazo tamano={tamano}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <polyline points="9 14 11 16 15 12" />
    </Trazo>
  )
}

export function IconoCandado({ tamano = 18 }: { tamano?: number }) {
  return (
    <Trazo tamano={tamano}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Trazo>
  )
}
