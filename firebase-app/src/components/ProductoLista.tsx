import { getProductos, type Producto } from "../services/productoService";
import { useEffect, useState } from "react";
import './ProductoLista.css';

const ProductoLista = () => {
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
  }, []);

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

                </article>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductoLista;