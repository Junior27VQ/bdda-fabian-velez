import { useEffect, useState } from "react";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  obtenerProductosPaginados,
  type Producto,
} from "../services/productoService";

import "./ProductoListaPaginada.css";

export const ProductoListaPaginada = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [ultimoDoc, setUltimoDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [historialProductos, setHistorialProductos] = useState<Producto[][]>([]);

  const [historialCursores, setHistorialCursores] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([]);

  const [paginaActual, setPaginaActual] = useState(1);

  const [hayMasDatos, setHayMasDatos] = useState(true);

  const [cargando, setCargando] = useState(false);

  const [error, setError] = useState("");

  const cargarPrimeraPagina = async () => {
    try {
      setCargando(true);

      const resultado = await obtenerProductosPaginados();

      setProductos(resultado.productos);

      setUltimoDoc(resultado.ultimoDoc);

      if (resultado.cantidad < 5) {
        setHayMasDatos(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  const handleSiguiente = async () => {
    if (!hayMasDatos) return;

    try {
      setCargando(true);
      setError("");

      setHistorialProductos((prev) => [
        ...prev,
        productos,
      ]);

      setHistorialCursores((prev) => [
        ...prev,
        ultimoDoc,
      ]);

      const resultado =
        await obtenerProductosPaginados(
          ultimoDoc ?? undefined
        );

      if (resultado.productos.length === 0) {
        setHayMasDatos(false);
        return;
      }

      setProductos(resultado.productos);

      setUltimoDoc(resultado.ultimoDoc);

      setPaginaActual((prev) => prev + 1);

      if (resultado.cantidad < 5) {
        setHayMasDatos(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  const handleAnterior = () => {
    if (
      historialProductos.length === 0 || historialCursores.length === 0
    ) {
      return;
    }

    const nuevosProductos = [...historialProductos];

    const nuevosCursores = [...historialCursores];

    const productosAnteriores = nuevosProductos.pop();

    const cursorAnterior = nuevosCursores.pop();

    if (productosAnteriores) {
      setProductos(productosAnteriores);
    }

    setUltimoDoc(cursorAnterior ?? null);

    setHistorialProductos(nuevosProductos);

    setHistorialCursores(nuevosCursores);

    setPaginaActual((prev) => Math.max(prev - 1, 1));

    setHayMasDatos(true);
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarPrimeraPagina();
    };

    iniciar();
  }, []);

  return (
    <div className="producto-lista-paginada">

      <h2>Lista de Productos</h2>

      <p className="pagina"> Página {paginaActual} </p>

      {error && ( <p className="error"> {error} </p> )}

      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-item">
            <h3> {producto.nombre} </h3>

            <p> <strong>Precio:</strong> {" "} ${producto.precio} </p>

            <p> <strong>Stock:</strong> {" "} {producto.stock} </p>
          </div>
        ))}
      </div>

      <div className="acciones">
        <button
          onClick={handleAnterior}
          disabled={ cargando || paginaActual === 1 }
          className="btn-anterior"
        >
          ⬅ Anterior
        </button>

        {hayMasDatos && (
          <button
            onClick={handleSiguiente}
            disabled={cargando}
            className="btn-siguiente"
          >
            {cargando ? "Cargando..." : "Siguiente ➡"}
          </button>
        )}
      </div>

    </div>
  );
};