import { Fragment } from 'react'

// Lista de «etiqueta → valor» (una <dl>). Sirve para el cuadro de revisión, la
// reserva confirmada y el resumen «Tu cita». Con `vacio`, un valor '' se
// muestra con ese texto en gris (por ejemplo «Pendiente»).
export function ListaDatos({
  filas,
  vacio,
}: {
  filas: ReadonlyArray<readonly [string, string]>
  vacio?: string
}) {
  return (
    <dl className="demo-datos">
      {filas.map(([etiqueta, valor]) => (
        <Fragment key={etiqueta}>
          <dt>{etiqueta}</dt>
          {valor === '' && vacio !== undefined ? (
            <dd className="demo-datos-vacio">{vacio}</dd>
          ) : (
            <dd>{valor}</dd>
          )}
        </Fragment>
      ))}
    </dl>
  )
}
