import { getProductos, deleteProducto, type Producto } from "../services/productoService";
import { useEffect, useState } from "react";
import './ProductoLista.css';

interface Props {
  onEditar: (producto: Producto) => void;
}

const ProductoLista = ({ onEditar }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
        try {
            const productosData = await getProductos();
            setProductos(productosData);
        }
        catch (error) {
            console.error("Error al obtener los productos: ", error);
        }
    };

    fetchProductos();
  }, [productos]);

  const handleEliminar = async (id: string) => {
    const confirmar = window.confirm(
        "¿Está seguro de eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      await deleteProducto(id);
      alert("Producto eliminado");
      // Actualizar la lista de productos después de eliminar
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
    }
  };

 return (
    <div className="lista-container">
      <div className="lista-card">
        <h1>Productos Registrados</h1>

        {productos.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => (

                <article
                key={producto.id}
                className="producto-card"
                >
                <h3>{producto.nombre}</h3>

                <div className="info">
                    <span>Precio</span>
                    <strong>${producto.precio.toFixed(2)}</strong>
                </div>

                <div className="info">
                    <span>Stock</span>
                    <strong>{producto.stock}</strong>
                </div>

                <div className="acciones">
                    <button className="btn-editar" onClick={() => onEditar(producto)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(producto.id)}>Eliminar</button>
                </div>

                </article>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductoLista;