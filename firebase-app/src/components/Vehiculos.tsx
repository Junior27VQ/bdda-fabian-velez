import { useEffect, useState } from "react";
import {
  getVehiculosDisponibles,
  getSUVDisponibles,
  getVehiculosPorRangoPrecio,
  getSedanesRecientes,
  type Vehiculo,
} from "../scripts/consultasVehiculos";
import {
  generarVehiculos,
  completarVehiculos,
  contarVehiculos,
} from "../scripts/generarVehiculos";
import VehiculoListaPaginada from "./VehiculoListaPaginada";
import "./Vehiculos.css";

// Lista de consultas: cada una tiene su nombre, una descripcion corta y la funcion que la ejecuta.
// Al recorrer este arreglo con map evitamos repetir cuatro botones casi iguales.
const consultas = [
  { nombre: "Consulta 1", detalle: "Disponibles por precio", ejecutar: getVehiculosDisponibles },
  { nombre: "Consulta 2", detalle: "SUV disponibles", ejecutar: getSUVDisponibles },
  { nombre: "Consulta 3", detalle: "Precio entre 20.000 y 40.000", ejecutar: getVehiculosPorRangoPrecio },
  { nombre: "Consulta 4", detalle: "Sedan desde 2023 (reto)", ejecutar: getSedanesRecientes },
];

// Cantidad minima de vehiculos
const MINIMO_VEHICULOS = 40;

// Por debajo de este numero de unidades mostramos el stock como "bajo"
const STOCK_BAJO = 3;

const Vehiculos = () => {
  // Resultados de la ultima consulta ejecutada
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  // Nombre de la consulta activa (null = todavia no se ejecuto ninguna)
  const [activa, setActiva] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  // true = se muestra la lista paginada (se le pasa como prop al componente hijo)
  const [mostrarPaginados, setMostrarPaginados] = useState(false);
  // Cantidad de vehiculos que hay en Firestore (null = todavia no se sabe)
  const [totalVehiculos, setTotalVehiculos] = useState<number | null>(null);
  // true mientras se esta guardando: evita un segundo clic
  const [generando, setGenerando] = useState(false);
  const [completando, setCompletando] = useState(false);

  // Valores derivados del total: deciden que botones se deshabilitan
  const datosGenerados = totalVehiculos !== null && totalVehiculos > 0;
  const coleccionCompleta = totalVehiculos !== null && totalVehiculos >= MINIMO_VEHICULOS;

  // Al abrir la pagina se consulta cuantos vehiculos hay (conteo en el servidor, sin descargarlos)
  useEffect(() => {
    contarVehiculos()
      .then((total) => setTotalVehiculos(total))
      .catch(() => {
        // si falla el conteo, el boton queda habilitado
      });
  }, []);

  // Ejecuta una consulta y controla los estados de carga, resultado y error
  const ejecutar = async (nombre: string, consulta: () => Promise<Vehiculo[]>) => {
    setCargando(true);
    setError("");
    setMensaje("");
    setActiva(nombre);
    setMostrarPaginados(false); // la lista paginada se oculta
    try {
      setVehiculos(await consulta());
    } catch (e) {
      // Si falta un indice, el mensaje trae el enlace de Firebase Console
      setVehiculos([]);
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  const handleGenerar = async () => {
    setError("");
    setGenerando(true);
    try {
      const total = await generarVehiculos();
      setMensaje(`Se guardaron ${total} vehículos en Firestore.`);
      setTotalVehiculos(await contarVehiculos()); // actualiza el total real de Firestore
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron guardar los vehículos");
    } finally {
      setGenerando(false);
    }
  };

  // Al mostrar la lista paginada se limpian los resultados de las consultas
  const togglePaginados = () => {
    if (!mostrarPaginados) {
      setActiva(null);
      setVehiculos([]);
      setError("");
    }
    setMostrarPaginados(!mostrarPaginados);
  };

  // Agrega los vehiculos que faltan para llegar a 40
  const handleCompletar = async () => {
    setError("");
    setCompletando(true);
    try {
      const { agregados, total } = await completarVehiculos(MINIMO_VEHICULOS);
      setTotalVehiculos(total); // si total >= 40 el boton queda deshabilitado
      setMensaje(
        agregados === 0
          ? `Ya hay ${total} vehículos, no se agregó ninguno.`
          : `Se agregaron ${agregados} vehículos. Total en la colección: ${total}.`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron completar los vehículos");
    } finally {
      setCompletando(false);
    }
  };

  // Extrae el enlace del error "The query requires an index..." para mostrarlo clicable
  const enlaceIndice = error.match(/https:\/\/\S+/)?.[0];

  // Devuelve la clase de color segun el stock de cada vehiculo
  const estadoStock = (stock: number) =>
    stock === 0 ? "agotado" : stock <= STOCK_BAJO ? "bajo" : "disponible";

  return (
    <section className="vehiculos">
      <header className="vehiculos__cabecera">
        <h2 className="vehiculos__titulo">Vehículos</h2>
        <div className="vehiculos__acciones">
          <button
            className="btn btn--secundario"
            onClick={handleGenerar}
            disabled={datosGenerados || generando}
            title={datosGenerados ? "La colección ya tiene datos de prueba" : undefined}
          >
            Generar datos de prueba
          </button>
          <button
            className="btn btn--secundario"
            onClick={handleCompletar}
            disabled={coleccionCompleta || completando}
            title={
              coleccionCompleta
                ? `La colección ya tiene ${totalVehiculos} vehículos`
                : undefined
            }
          >
            Completar a {MINIMO_VEHICULOS} vehículos
          </button>
        </div>
      </header>

      <div className="vehiculos__consultas">
        {consultas.map((c) => (
          <button
            key={c.nombre}
            className={`btn btn--consulta ${activa === c.nombre ? "btn--activa" : ""}`}
            onClick={() => ejecutar(c.nombre, c.ejecutar)}
          >
            <strong>{c.nombre}</strong>
            <span>{c.detalle}</span>
          </button>
        ))}
      </div>

      <div className="vehiculos__paginacion">
        <button
          className={`btn btn--consulta ${mostrarPaginados ? "btn--activa" : ""}`}
          onClick={togglePaginados}
        >
          <strong>
            {mostrarPaginados ? "Ocultar vehículos paginados" : "Cargar vehículos paginados"}
          </strong>
          <span>Lista de 10 en 10 con Anterior y Siguiente</span>
        </button>
      </div>

      {/* Componente hijo: recibe el boolean como prop */}
      <VehiculoListaPaginada mostrar={mostrarPaginados} />

      {mensaje && <p className="aviso aviso--ok">{mensaje}</p>}
      {cargando && <p className="aviso">Cargando vehículos...</p>}

      {error && (
        <div className="aviso aviso--error" role="alert">
          <p>{error}</p>
          {enlaceIndice && (
            <a href={enlaceIndice} target="_blank" rel="noreferrer">
              Crear el índice en Firebase Console
            </a>
          )}
        </div>
      )}

      {activa && !cargando && !error && (
        <>
          <h3 className="vehiculos__resultado">
            {activa}: {vehiculos.length}{" "}
            {vehiculos.length === 1 ? "resultado" : "resultados"}
          </h3>

          {vehiculos.length === 0 ? (
            <p className="aviso">Ningún vehículo cumple con esta consulta.</p>
          ) : (
            <div className="vehiculos__lista">
              {vehiculos.map((v) => (
                // data-tipo permite que el CSS cambie el color de la tarjeta segun el tipo
                <article key={v.id} className="tarjeta" data-tipo={v.tipo}>
                  <div className="tarjeta__encabezado">
                    <span className="tarjeta__tipo">{v.tipo}</span>
                    <span className="tarjeta__anio">{v.anio}</span>
                  </div>

                  <h4 className="tarjeta__nombre">
                    {v.marca} <span>{v.modelo}</span>
                  </h4>

                  <p className="tarjeta__precio">${v.precio.toLocaleString("en-US")}</p>

                  <p className={`tarjeta__stock tarjeta__stock--${estadoStock(v.stock)}`}>
                    {v.stock === 0
                      ? "Agotado"
                      : `${v.stock} ${v.stock === 1 ? "unidad" : "unidades"}`}
                  </p>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Vehiculos;