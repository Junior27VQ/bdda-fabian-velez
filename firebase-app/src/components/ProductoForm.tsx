import { useState, type SyntheticEvent } from 'react'
import { addProducto, updateProducto, type Producto } from '../services/productoService';
import './ProductoForm.css';

interface Props {
  productoEditar: Producto | null;
}

function ProductoForm({ productoEditar }: Props) {
  const [nombre, setNombre] = useState(productoEditar?.nombre ?? "");
  const [precio, setPrecio] = useState(productoEditar?.precio.toString() ?? "");
  const [stock, setStock] = useState(productoEditar?.stock.toString() ?? "");

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    try {
      if (productoEditar) {
        await updateProducto(productoEditar.id, nombre, parseFloat(precio), parseInt(stock));
        alert("Producto actualizado: " + JSON.stringify({ nombre, precio, stock }));
      } else {
        await addProducto(nombre, parseFloat(precio), parseInt(stock));
        alert("Producto agregado: " + JSON.stringify({ nombre, precio, stock }));
      }
      // Al crear o actualizar el producto, se limpian los campos del formulario
      setNombre("");
      setPrecio("");
      setStock("");
    } catch (e) {
      alert("Ocurrio un error al agregar el producto: " + e);
    }
  };

  return (
    <div className="contenedor">
      <div className="card">
        <h1>Registro de Productos</h1>

        <form onSubmit={handleSubmit}>
          <div className="grupo">
            <label>Nombre del producto</label>
            <input
              type="text"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="grupo">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>

          <div className="grupo">
            <label>Stock</label>
            <input
              type="number"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            {productoEditar ? "Actualizar Producto" : "Guardar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductoForm;