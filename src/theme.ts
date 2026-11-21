import {
  Card,
  Checkbox,
  Modal,
  Radio,
  Select,
  TextInput,
  Title,
  createTheme,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  type MantineTransition,
} from '@mantine/core'

// Estilo de toda la app: un verde azulado «clínico», esquinas redondeadas y la
// letra del sistema (sin descargar fuentes externas: system-ui ya da Segoe UI
// Variable en Windows y SF Pro en Apple, no añade peticiones y no mueve el
// diseño al cargar).
const fuente = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

// Verde azulado clínico. El tono 7 (#0f766e) con texto blanco da unos 5,5:1
// (cumple AA). El tono 6 de Mantine (#12b886) con blanco da unos 2,6:1 y no.
const clinica: MantineColorsTuple = [
  '#e6f6f4',
  '#cdebe7',
  '#9fd8d0',
  '#6cc3b8',
  '#43b1a4',
  '#27a396',
  '#14897e',
  '#0f766e',
  '#0d625b',
  '#0a4f4a',
]

// Éxito. Tono 7 (#15803d) con blanco, unos 5,0:1; variante «light» (texto 9
// sobre fondo 1), unos 7:1.
const exito: MantineColorsTuple = [
  '#ebf8ef',
  '#d3efdb',
  '#a7dfb8',
  '#77cd92',
  '#4fbd72',
  '#34b05d',
  '#22a04e',
  '#15803d',
  '#116b33',
  '#0d5628',
]

// Aviso (DEMO). Variante «light» (texto 9 sobre fondo 1), unos 7,1:1. Relleno
// con blanco: el tono 8 da unos 5,8:1 (el 7 solo da unos 4,0:1).
const aviso: MantineColorsTuple = [
  '#fff8e6',
  '#ffefc2',
  '#ffe08a',
  '#ffd052',
  '#f5bd24',
  '#e5a90f',
  '#c98f06',
  '#a87503',
  '#875d02',
  '#6b4900',
]

// Entrada del cuadro de diálogo: escala 0,96 → 1 con opacidad, solo
// transform y opacity. Sustituye al «fade-down» de Mantine.
const entradaModal: MantineTransition = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0.96)' },
  common: { transformOrigin: 'center' },
  transitionProperty: 'transform, opacity',
}

export const tema = createTheme({
  colors: { clinica, exito, aviso },
  primaryColor: 'clinica',
  primaryShade: 7,
  fontFamily: fuente,
  defaultRadius: 'md',
  // Con «reducir movimiento» activado en el sistema, Mantine usa 0 ms en sus
  // transiciones.
  respectReducedMotion: true,
  headings: {
    fontFamily: fuente,
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: 'clamp(1.75rem, 1.35rem + 1.6vw, 2.25rem)',
        lineHeight: '1.2',
        fontWeight: '700',
      },
      h2: { fontSize: '1.25rem', lineHeight: '1.35' },
      h3: { fontSize: '1.0625rem', lineHeight: '1.4' },
    },
  },
  shadows: {
    xs: '0 1px 2px rgb(15 40 38 / 0.05)',
    sm: '0 1px 2px rgb(15 40 38 / 0.06), 0 2px 6px rgb(15 40 38 / 0.06)',
    md: '0 2px 4px rgb(15 40 38 / 0.06), 0 8px 24px rgb(15 40 38 / 0.08)',
  },
  components: {
    Card: Card.extend({
      defaultProps: { radius: 'lg', withBorder: true, padding: 'lg' },
    }),
    // size md = letra de 16 px: iOS no hace zoom al enfocar el campo. El grupo
    // de turnos y la casilla usan el mismo tamaño para que las etiquetas de
    // todo el formulario se vean iguales.
    TextInput: TextInput.extend({ defaultProps: { size: 'md' } }),
    Select: Select.extend({ defaultProps: { size: 'md' } }),
    RadioGroup: Radio.Group.extend({ defaultProps: { size: 'md' } }),
    Checkbox: Checkbox.extend({ defaultProps: { size: 'md' } }),
    Title: Title.extend({ styles: { root: { letterSpacing: '-0.01em' } } }),
    Modal: Modal.extend({
      defaultProps: {
        radius: 'lg',
        padding: 'lg',
        centered: true,
        overlayProps: { backgroundOpacity: 0.45, blur: 2 },
        transitionProps: {
          transition: entradaModal,
          duration: 200,
          exitDuration: 150,
          timingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        },
      },
    }),
  },
})

// Contraste AA. En Mantine 9 estos tres colores de texto no llegan a 4,5:1 con
// los valores por defecto (gris 6 y rojo 6 dan unos 3,3:1 sobre blanco).
export const variablesCss: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-dimmed': 'var(--mantine-color-gray-7)',
    '--mantine-color-error': 'var(--mantine-color-red-9)',
    '--mantine-color-placeholder': 'var(--mantine-color-gray-6)',
  },
  dark: {},
})
