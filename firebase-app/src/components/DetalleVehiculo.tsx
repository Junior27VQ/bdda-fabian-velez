import { useEffect, useState } from "react";
import { obtenerVehiculoPorId, type VehiculoInventario } from "../services/inventarioService";
import "./DetalleVehiculo.css";

interface Props {
  id: string; 
  onCerrar: () => void;
}

const DetalleVehiculo = ({ id, onCerrar }: Props) => {
  const [vehiculo, setVehiculo] = useState<VehiculoInventario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    obtenerVehiculoPorId(id)
      .then((resultado) => {
        if (cancelado) return;
        if (resultado) setVehiculo(resultado);
        else setError("Este vehículo ya no existe en el inventario.");
      })
      .catch((e) => {
        if (!cancelado) setError(e instanceof Error ? e.message : "No se pudo cargar el detalle");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  // Cerrar con la tecla Escape y bloquear el scroll de la página mientras está abierta
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  return (
    // Clic en el fondo oscuro = cerrar
    <div className="inv-detalle__fondo" onClick={onCerrar}>
      {/* stopPropagation: un clic dentro de la ventana NO debe cerrarla */}
      <div
        className="inv-detalle"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inv-detalle-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="inv-detalle__cerrar" onClick={onCerrar} aria-label="Cerrar detalle">
          ✕
        </button>

        {cargando && <p className="inv-detalle__mensaje">Cargando detalle...</p>}
        {error && <p className="inv-detalle__mensaje inv-detalle__mensaje--error">{error}</p>}

        {vehiculo && (
          <>
            <p className="inv-detalle__codigo">{vehiculo.id}</p>
            <h2 className="inv-detalle__titulo" id="inv-detalle-titulo">
              {vehiculo.marca} {vehiculo.modelo}
            </h2>
            <p className="inv-detalle__subtitulo">
              {vehiculo.tipo} · {vehiculo.anio}
            </p>

            <div className="inv-detalle__resumen">
              <span className="inv-detalle__precio">${vehiculo.precio.toLocaleString("en-US")}</span>
              <span
                className={`inv-detalle__estado ${
                  vehiculo.disponible ? "inv-detalle__estado--si" : "inv-detalle__estado--no"
                }`}
              >
                {vehiculo.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>

            {/* Objeto anidado (Map): se lee como vehiculo.especificaciones.motor, etc. */}
            <h3 className="inv-detalle__seccion">Especificaciones</h3>
            <dl className="inv-detalle__specs">
              <div>
                <dt>Motor</dt>
                <dd>{vehiculo.especificaciones.motor}</dd>
              </div>
              <div>
                <dt>Combustible</dt>
                <dd>{vehiculo.especificaciones.combustible}</dd>
              </div>
              <div>
                <dt>Transmisión</dt>
                <dd>{vehiculo.especificaciones.transmision}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </div>
  );
};

export default DetalleVehiculo;