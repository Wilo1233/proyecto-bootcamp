// Datos fijos de la demo. Todo es ficticio y vive solo en memoria.

export interface Fecha {
  id: string
  // Texto fijo a propósito: sin Date ni zonas horarias.
  texto: string
  turnos: string[]
}

export interface Medico {
  // Único en todo este archivo: la clave de un turno ocupado no incluye la
  // especialidad (ver claveTurno).
  id: string
  nombre: string
  fechas: Fecha[]
}

export interface Especialidad {
  id: string
  nombre: string
  medicos: Medico[]
}

export const ESPECIALIDADES: Especialidad[] = [
  {
    id: 'general',
    nombre: 'Medicina General',
    medicos: [
      {
        id: 'gral-martin',
        nombre: 'Dr. Martín Prueba (ficticio)',
        fechas: [
          { id: '2026-11-16', texto: 'Lunes 16 de noviembre de 2026', turnos: ['09:00', '09:20', '09:40'] },
          { id: '2026-11-17', texto: 'Martes 17 de noviembre de 2026', turnos: ['09:00', '09:20', '09:40'] },
        ],
      },
      {
        id: 'gral-sofia',
        nombre: 'Dra. Sofía Ejemplo (ficticia)',
        fechas: [
          { id: '2026-11-16', texto: 'Lunes 16 de noviembre de 2026', turnos: ['09:00', '09:20', '09:40'] },
          { id: '2026-11-18', texto: 'Miércoles 18 de noviembre de 2026', turnos: ['10:00', '10:20', '10:40'] },
        ],
      },
    ],
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría',
    medicos: [
      {
        id: 'ped-lucia',
        nombre: 'Dra. Lucía Muestra (ficticia)',
        fechas: [
          { id: '2026-11-17', texto: 'Martes 17 de noviembre de 2026', turnos: ['08:30', '08:50', '09:10'] },
          { id: '2026-11-19', texto: 'Jueves 19 de noviembre de 2026', turnos: ['08:30', '08:50', '09:10'] },
        ],
      },
    ],
  },
  {
    id: 'cardiologia',
    nombre: 'Cardiología',
    medicos: [
      {
        id: 'car-andres',
        nombre: 'Dr. Andrés Simulado (ficticio)',
        fechas: [
          { id: '2026-11-18', texto: 'Miércoles 18 de noviembre de 2026', turnos: ['15:00', '15:30', '16:00'] },
          { id: '2026-11-20', texto: 'Viernes 20 de noviembre de 2026', turnos: ['15:00', '15:30', '16:00'] },
        ],
      },
    ],
  },
]

// Cada paso de la selección depende del anterior. Si el id no existe
// (todavía no se eligió nada), la lista queda vacía.
export function medicosDe(especialidadId: string): Medico[] {
  return ESPECIALIDADES.find((e) => e.id === especialidadId)?.medicos ?? []
}

export function fechasDe(especialidadId: string, medicoId: string): Fecha[] {
  return medicosDe(especialidadId).find((m) => m.id === medicoId)?.fechas ?? []
}

export function turnosDe(
  especialidadId: string,
  medicoId: string,
  fechaId: string,
): string[] {
  return fechasDe(especialidadId, medicoId).find((f) => f.id === fechaId)?.turnos ?? []
}

// Un turno ocupado es la combinación médico + fecha + hora: así, reservar las
// 09:00 con un médico no bloquea las 09:00 de otro médico ni de otro día.
export function claveTurno(medicoId: string, fechaId: string, hora: string) {
  return `${medicoId}|${fechaId}|${hora}`
}

export interface Reserva {
  codigo: string
  especialidad: string
  medico: string
  fecha: string
  hora: string
  paciente: string
  familiar: string
  acompanante: string | null // null = el paciente va solo
}
