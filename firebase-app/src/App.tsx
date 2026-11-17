import ProductoForm from "./components/ProductoForm";
import ProductoLista from "./components/ProductoLista";
import { useState } from "react";
import { type Producto } from "./services/productoService";

import "./App.css";

function App() {
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  return (
    <div className="app-container">

      <div className="app-header">
        <h1>Sistema de Gestión de Productos</h1>
        <p>Firebase + React + TypeScript</p>
      </div>

      <div className="app-content">
        <ProductoForm key={productoEditar?.id ?? "nuevo"} productoEditar={productoEditar} />
        <ProductoLista onEditar={setProductoEditar} />
      </div>

    </div>
  );
}

export default App;