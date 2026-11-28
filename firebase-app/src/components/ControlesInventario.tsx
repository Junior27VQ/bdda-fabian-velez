import { useState } from "react";
import {
  COMBUSTIBLES,
  MARCAS,
  TIPOS,
  type Combustible,
  type FiltroInventario,
  type TipoVehiculo,
} from "../services/inventarioService";

import "./ControlesInventario.css";

interface Props {
  cargando: boolean;
  pagina: number;
  hayMas: boolean;

  onBuscar: (filtro: FiltroInventario) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

type Patron = FiltroInventario["patron"];

const PATRONES: { valor: Patron; etiqueta: string; consulta: string }[] = [
  {
    valor: "todos",
    etiqueta: "Todo el inventario",
    consulta: 'orderBy("precio")',
  },
  {
    valor: "marca",
    etiqueta: "Por marca",
    consulta: 'where("marca", "==", …) + orderBy("precio")',
  },
  {
    valor: "disponibles",
    etiqueta: "Solo disponibles",
    consulta: 'where("disponible", "==", true) + orderBy("precio")',
  },
  {
    valor: "rangoPrecio",
    etiqueta: "Rango de precio",
    consulta:
      'where("precio", ">=", min) + where("precio", "<=", max)',
  },
  {
    valor: "tipo",
    etiqueta: "Por carrocería",
    consulta: 'where("tipo", "==", …) + orderBy("precio")',
  },
  {
    valor: "combustible",
    etiqueta: "Por combustible",
    consulta:
      'where("especificaciones.combustible", "==", …) + orderBy("precio")',
  },
];

const ControlesInventario = ({
  cargando,
  pagina,
  hayMas,
  onBuscar,
  onAnterior,
  onSiguiente,
}: Props) => {
  const [patron, setPatron] = useState<Patron>("todos");
  const [marca, setMarca] = useState<string>(MARCAS[0]);
  const [tipo, setTipo] = useState<TipoVehiculo>(TIPOS[0]);
  const [combustible, setCombustible] = useState<Combustible>(
    COMBUSTIBLES[0]
  );

  const [minimo, setMinimo] = useState("");
  const [maximo, setMaximo] = useState("");
  const [errorRango, setErrorRango] = useState("");

  const cambiarPatron = (nuevo: Patron) => {
    setPatron(nuevo);
    setErrorRango("");
  };

  const handleBuscar = () => {
    switch (patron) {
      case "todos":
        onBuscar({ patron: "todos" });
        break;

      case "disponibles":
        onBuscar({ patron: "disponibles" });
        break;

      case "marca":
        onBuscar({ patron: "marca", marca });
        break;

      case "tipo":
        onBuscar({ patron: "tipo", tipo });
        break;

      case "combustible":
        onBuscar({ patron: "combustible", combustible });
        break;

      case "rangoPrecio": {
        const min = Number(minimo);
        const max = Number(maximo);

        if (minimo === "" || maximo === "" || min > max) {
          setErrorRango(
            "Ingresa un rango válido: ambos valores y el mínimo no puede superar al máximo."
          );
          return;
        }

        setErrorRango("");

        onBuscar({
          patron: "rangoPrecio",
          min,
          max,
        });

        break;
      }
    }
  };

  const patronActual = PATRONES.find(
    (p) => p.valor === patron
  );

  return (
    <>
      {/* PANEL DE FILTROS */}

      <form
        className="inv-filtros"
        onSubmit={(e) => {
          e.preventDefault();
          handleBuscar();
        }}
      >
        <h2 className="inv-filtros__titulo">
          Consultas
        </h2>

        <div
          className="inv-filtros__patrones"
          role="group"
          aria-label="Patrón de consulta"
        >
          {PATRONES.map((p) => (
            <button
              key={p.valor}
              type="button"
              className={`inv-filtros__chip ${
                patron === p.valor
                  ? "inv-filtros__chip--activo"
                  : ""
              }`}
              aria-pressed={patron === p.valor}
              onClick={() => cambiarPatron(p.valor)}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        <div className="inv-filtros__fila">
          {patron === "marca" && (
            <label className="inv-filtros__campo">
              <span>Marca</span>

              <select
                value={marca}
                onChange={(e) =>
                  setMarca(e.target.value)
                }
              >
                {MARCAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          )}

          {patron === "tipo" && (
            <label className="inv-filtros__campo">
              <span>Tipo de carrocería</span>

              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(
                    e.target.value as TipoVehiculo
                  )
                }
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          )}

          {patron === "combustible" && (
            <label className="inv-filtros__campo">
              <span>Combustible</span>

              <select
                value={combustible}
                onChange={(e) =>
                  setCombustible(
                    e.target.value as Combustible
                  )
                }
              >
                {COMBUSTIBLES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}

          {patron === "rangoPrecio" && (
            <>
              <label className="inv-filtros__campo">
                <span>Precio mínimo ($)</span>

                <input
                  type="number"
                  min={0}
                  placeholder="Ej: 20000"
                  value={minimo}
                  onChange={(e) =>
                    setMinimo(e.target.value)
                  }
                />
              </label>

              <label className="inv-filtros__campo">
                <span>Precio máximo ($)</span>

                <input
                  type="number"
                  min={0}
                  placeholder="Ej: 40000"
                  value={maximo}
                  onChange={(e) =>
                    setMaximo(e.target.value)
                  }
                />
              </label>
            </>
          )}

          <button
            className="inv-filtros__buscar"
            type="submit"
            disabled={cargando}
          >
            {cargando ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {errorRango && (
          <p className="inv-filtros__error">
            {errorRango}
          </p>
        )}

        <p className="inv-filtros__consulta">
          Consulta: <code>{patronActual?.consulta}</code>{" "}
          + <code>limit(10)</code>
        </p>
      </form>

      {/* NAVEGACIÓN DE PÁGINAS */}

      <nav
        className="inv-nav"
        aria-label="Paginación del inventario"
      >
        <button
          className="inv-nav__boton"
          onClick={onAnterior}
          disabled={pagina === 1 || cargando}
        >
          Anterior
        </button>

        <span className="inv-nav__pagina">
          Página {pagina}
        </span>

        <button
          className="inv-nav__boton"
          onClick={onSiguiente}
          disabled={!hayMas || cargando}
        >
          Siguiente
        </button>
      </nav>
    </>
  );
};

export default ControlesInventario;