import { useEffect, useState } from "react";
import {
  consultarInventario,
  VEHICULOS_POR_PAGINA,
  type Cursor,
  type FiltroInventario,
  type VehiculoInventario,
} from "../services/inventarioService";

import InventarioVehiculos from "./InventarioVehiculos";
import NavegacionPaginas from "./NavegacionPaginas";
import DetalleVehiculo from "./DetalleVehiculo";

import "./InventarioApp.css";

const describirFiltro = (
  filtro: FiltroInventario
): string => {
  switch (filtro.patron) {
    case "todos":
      return "Todo el inventario";

    case "marca":
      return `Marca: ${filtro.marca}`;

    case "disponibles":
      return "Solo disponibles";

    case "rangoPrecio":
      return `Precio entre $${filtro.min.toLocaleString(
        "en-US"
      )} y $${filtro.max.toLocaleString("en-US")}`;

    case "tipo":
      return `Carrocería: ${filtro.tipo}`;

    case "combustible":
      return `Combustible: ${filtro.combustible}`;
  }
};

const InventarioApp = () => {
  const [filtro, setFiltro] = useState<FiltroInventario>({patron: "todos"});
  const [vehiculos, setVehiculos] = useState<VehiculoInventario[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [cursores, setCursores] = useState<Cursor[]>([]);
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarPagina = async (numero: number, filtroActual: FiltroInventario, cursoresActuales: Cursor[]) => {
    setCargando(true);
    setError("");

    try {
      const cursor = numero > 1 ? cursoresActuales[numero - 2] : undefined;

      const resultado = await consultarInventario(filtroActual, cursor);

      setFiltro(filtroActual);
      setVehiculos(resultado.vehiculos);
      setHayMas(resultado.hayMas);
      setPagina(numero);

      const nuevos = [...cursoresActuales];

      if (resultado.ultimoDoc) {
        nuevos[numero - 1] = resultado.ultimoDoc;
      }

      setCursores(nuevos);
    } catch (e) {
      setVehiculos([]);
      setHayMas(false);

      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const iniciar = async () => { await cargarPagina(1, { patron: "todos" }, [] );
    };

    iniciar();
  }, []);

  const handleBuscar = (nuevoFiltro: FiltroInventario) => {
    cargarPagina(1, nuevoFiltro, []);
  };

  const inicio = (pagina - 1) * VEHICULOS_POR_PAGINA;

  const enlaceIndice = error.match(/https:\/\/\S+/)?.[0];

  const resumen = `${describirFiltro(filtro)}${
    vehiculos.length > 0
      ? ` · mostrando ${inicio + 1} a ${
          inicio + vehiculos.length
        }`
      : ""
  }`;

  return (
    <div className="inventario">
      <main className="inventario__contenido">
        {error && (
          <div
            className="inventario__error"
            role="alert"
          >
            <p>{error}</p>

            {enlaceIndice && (
              <a
                href={enlaceIndice}
                target="_blank"
                rel="noreferrer"
              >
                Crear el índice en Firebase
                Console
              </a>
            )}
          </div>
        )}

        <InventarioVehiculos
          vehiculos={vehiculos}
          numeroInicial={inicio}
          cargando={cargando}
          onBuscar={handleBuscar}
          resumen={resumen}
          onVerDetalle={setVehiculoSeleccionado}
        />

        <NavegacionPaginas
          pagina={pagina}
          hayMas={hayMas}
          cargando={cargando}
          onAnterior={() => cargarPagina(pagina - 1, filtro, cursores)}
          onSiguiente={() => cargarPagina(pagina + 1, filtro, cursores)}
        />

        {vehiculoSeleccionado && (
          <DetalleVehiculo
            id={vehiculoSeleccionado}
            onCerrar={() => setVehiculoSeleccionado(null)}
          />
        )}
      </main>
    </div>
  );
};

export default InventarioApp;