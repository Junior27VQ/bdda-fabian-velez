import { useEffect, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  obtenerVehiculosPaginados,
  VEHICULOS_POR_PAGINA,
  type Vehiculo,
} from "../scripts/consultasVehiculos";
import "./VehiculoListaPaginada.css";

// Prop que llega desde Vehiculos.tsx: true = mostrar la lista, false = ocultarla
interface Props {
  mostrar: boolean;
}

// Un "cursor" es el ultimo documento de una pagina
type Cursor = QueryDocumentSnapshot<DocumentData>;

const VehiculoListaPaginada = ({ mostrar }: Props) => {
  // Los 10 vehiculos de la pagina actual (nunca mas de 10)
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  // Numero de pagina actual (empieza en 1)
  const [pagina, setPagina] = useState(1);
  // cursores[0] = ultimo doc de la pagina 1, cursores[1] = ultimo doc de la pagina 2, etc.
  // El ultimoDocumento de la pagina actual es cursores[pagina - 1].
  const [cursores, setCursores] = useState<Cursor[]>([]);
  // Si existe una pagina siguiente (controla el boton "Siguiente")
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Carga UNA pagina concreta desde Firestore.
  // El cursor de la pagina N es el ultimo documento de la pagina N - 1.
  const cargarPagina = async (numero: number, cursoresActuales: Cursor[]) => {
    setCargando(true);
    setError("");
    try {
      const cursor = numero > 1 ? cursoresActuales[numero - 2] : undefined;
      const resultado = await obtenerVehiculosPaginados(cursor);

      setVehiculos(resultado.vehiculos);
      setHayMas(resultado.hayMas);
      setPagina(numero);

      // Guardamos el ultimo documento de esta pagina para poder avanzar (y volver)
      if (resultado.ultimoDoc) {
        const nuevos = [...cursoresActuales];
        nuevos[numero - 1] = resultado.ultimoDoc;
        setCursores(nuevos);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar la página");
    } finally {
      setCargando(false);
    }
  };

  // Cada vez que el padre activa "mostrar", se carga la primera pagina desde cero
  useEffect(() => {
    if (mostrar) {
      const iniciarCarga = async () => {
        await cargarPagina(1, []);
      };
      iniciarCarga();
    }
    // cargarPagina se redefine en cada render; solo queremos reaccionar a "mostrar"

  }, [mostrar]);

  // Si el padre pide ocultar la lista, no dibujamos nada
  if (!mostrar) return null;

  // Posicion del primer vehiculo de la pagina (pagina 2 empieza en el 11)
  const inicio = (pagina - 1) * VEHICULOS_POR_PAGINA;

  return (
    <section className="paginados">
      <header className="paginados__cabecera">
        <h3 className="paginados__titulo">Vehículos paginados</h3>
        {vehiculos.length > 0 && (
          <p className="paginados__rango">
            Mostrando {inicio + 1} a {inicio + vehiculos.length}
          </p>
        )}
      </header>

      {error && (
        <p className="paginados__error" role="alert">
          {error}
        </p>
      )}

      {/* Mientras carga la siguiente pagina se atenuan las tarjetas actuales */}
      <div
        className={`paginados__lista ${cargando ? "paginados__lista--cargando" : ""}`}
        aria-busy={cargando}
      >
        {vehiculos.map((v, indice) => (
          <article key={v.id} className="pag-tarjeta" data-tipo={v.tipo}>
            <div className="pag-tarjeta__encabezado">
              <span className="pag-tarjeta__tipo">{v.tipo}</span>
              <span className="pag-tarjeta__numero">N.º {inicio + indice + 1}</span>
            </div>

            <h4 className="pag-tarjeta__nombre">
              {v.marca} <span>{v.modelo}</span>
            </h4>

            <p className="pag-tarjeta__precio">${v.precio.toLocaleString("en-US")}</p>

            <p className="pag-tarjeta__detalle">
              Año {v.anio}
              <span className={v.stock === 0 ? "pag-tarjeta__agotado" : ""}>
                {v.stock === 0 ? "Agotado" : `Stock: ${v.stock}`}
              </span>
            </p>
          </article>
        ))}
      </div>

      {!cargando && !error && vehiculos.length === 0 && (
        <p className="paginados__vacio">
          No hay vehículos en la colección. Usa «Generar datos de prueba» primero.
        </p>
      )}

      <nav className="paginados__nav" aria-label="Paginación de vehículos">
        <button
          className="paginados__btn"
          onClick={() => cargarPagina(pagina - 1, cursores)}
          disabled={pagina === 1 || cargando}
        >
          Anterior
        </button>

        <span className="paginados__pagina">Página {pagina}</span>

        <button
          className="paginados__btn"
          onClick={() => cargarPagina(pagina + 1, cursores)}
          disabled={!hayMas || cargando}
        >
          Siguiente
        </button>
      </nav>
    </section>
  );
};

export default VehiculoListaPaginada;