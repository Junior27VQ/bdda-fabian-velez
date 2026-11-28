import "./NavegacionPaginas.css";

interface Props {
  pagina: number; 
  hayMas: boolean; 
  cargando: boolean;
  onAnterior: () => void;
  onSiguiente: () => void;
}

// Barra de navegación Anterior / Siguiente.
const NavegacionPaginas = ({ pagina, hayMas, cargando, onAnterior, onSiguiente }: Props) => {
  return (
    <nav className="inv-nav" aria-label="Paginación del inventario">

      <button className="inv-nav__boton" onClick={onAnterior} disabled={pagina === 1 || cargando}>
        Anterior
      </button>

      <span className="inv-nav__pagina">Página {pagina}</span>

      <button className="inv-nav__boton" onClick={onSiguiente} disabled={!hayMas || cargando}>
        Siguiente
      </button>
    </nav>
  );
};

export default NavegacionPaginas;