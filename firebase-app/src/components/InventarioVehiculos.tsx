import type { VehiculoInventario } from "../services/inventarioService";
import "./InventarioVehiculos.css";

interface Props {
  vehiculos: VehiculoInventario[];
  numeroInicial: number;
  cargando: boolean;
  onVerDetalle?: (id: string) => void;
}

const InventarioVehiculos = ({
  vehiculos,
  numeroInicial,
  cargando,
  onVerDetalle,
}: Props) => {
  return (
    <>
      {/* ENCABEZADO */}
      <header className="inv-encabezado">
        <div className="inv-encabezado__contenido">
          <p className="inv-encabezado__etiqueta">
            Taller 9 · Cloud Firestore
          </p>

          <h1 className="inv-encabezado__titulo">
            Inventario de vehículos
          </h1>

          <p className="inv-encabezado__subtitulo">
            Consulta las unidades por marca, disponibilidad, precio,
            carrocería o combustible.
          </p>
        </div>
      </header>

      {/* ESTADO VACÍO */}
      {!cargando && vehiculos.length === 0 ? (
        <div className="inv-lista__vacio">
          <p>No se encontraron vehículos con este criterio.</p>
        </div>
      ) : (
        /* LISTA DE TARJETAS */
        <div
          className={`inv-lista ${
            cargando ? "inv-lista--cargando" : ""
          }`}
          aria-busy={cargando}
        >
          {vehiculos.map((vehiculo, indice) => {
            const {
              id,
              marca,
              modelo,
              anio,
              precio,
              tipo,
              disponible,
              especificaciones,
            } = vehiculo;

            return (
              <article
                key={id}
                className="inv-tarjeta"
                data-tipo={tipo}
              >
                <div className="inv-tarjeta__fila">
                  <span className="inv-tarjeta__tipo">
                    {tipo}
                  </span>

                  <span className="inv-tarjeta__numero">
                    N.º {numeroInicial + indice + 1}
                  </span>
                </div>

                <h3 className="inv-tarjeta__nombre">
                  {marca} <span>{modelo}</span>
                </h3>

                <p className="inv-tarjeta__anio">
                  {anio} · {especificaciones.combustible}
                </p>

                <p className="inv-tarjeta__precio">
                  ${precio.toLocaleString("en-US")}
                </p>

                <div className="inv-tarjeta__fila">
                  <span
                    className={`inv-tarjeta__estado ${
                      disponible
                        ? "inv-tarjeta__estado--si"
                        : "inv-tarjeta__estado--no"
                    }`}
                  >
                    {disponible
                      ? "Disponible"
                      : "No disponible"}
                  </span>

                  {onVerDetalle && (
                    <button
                      className="inv-tarjeta__detalle"
                      onClick={() => onVerDetalle(id)}
                    >
                      Ver detalle
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

export default InventarioVehiculos;