import { z } from 'zod/v4'
import { claveTurno } from './datos.ts'

// El esquema se construye una sola vez. Las dos reglas del final son del
// objeto completo (no de un campo) porque necesitan mirar varios campos a la
// vez: «turno libre» usa médico + fecha + hora, y «acompañante» depende de la
// casilla «va solo». Zod las ejecuta aunque otros campos ya tengan errores de
// longitud o formato, así que todos los errores salen juntos al enviar.
export function crearEsquema(estaOcupado: (clave: string) => boolean) {
  return z
    .object({
      especialidadId: z.string().min(1, { error: 'Elige una especialidad' }),
      medicoId: z.string().min(1, { error: 'Elige un médico' }),
      fechaId: z.string().min(1, { error: 'Elige una fecha' }),
      turno: z.string().min(1, { error: 'Elige un turno' }),
      pacienteNombre: z
        .string()
        .trim()
        .min(2, { error: 'Escribe el nombre del paciente (al menos 2 caracteres)' }),
      vaSolo: z.boolean(),
      acompananteNombre: z.string().trim(),
      familiarNombre: z
        .string()
        .trim()
        .min(2, { error: 'Escribe tu nombre (al menos 2 caracteres)' }),
      // Un solo mensaje cubre también el campo vacío.
      celular: z
        .string()
        .regex(/^09\d{8}$/, {
          error: 'Escribe un celular de 10 dígitos que empiece por 09',
        }),
    })
    .refine(
      (valores) =>
        valores.turno === '' ||
        !estaOcupado(claveTurno(valores.medicoId, valores.fechaId, valores.turno)),
      { path: ['turno'], error: 'Ese turno ya está ocupado; elige otro' },
    )
    .refine(
      (valores) => valores.vaSolo || valores.acompananteNombre.length >= 2,
      {
        path: ['acompananteNombre'],
        error:
          'Escribe el nombre del acompañante (al menos 2 caracteres) o marca «El paciente va solo»',
      },
    )
}

export type ValoresReserva = z.infer<ReturnType<typeof crearEsquema>>
