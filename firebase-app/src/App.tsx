//import ProductoForm from "./components/ProductoForm";
//import ProductoLista from "./components/ProductoLista";
//import { useState } from "react";
//import { getProductosDisponibles, /*type Producto */} from "./services/productoService";

import "./App.css";
import { ProductoListaPaginada } from "./components/ProductoListaPaginada";
//import Vehiculos from "./components/Vehiculos";

function App() {
  //const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  return (
    <div className="app-container">

      {/* <div className="app-header">
        <h1>Sistema de Gestión de Productos</h1>
        <p>Firebase + React + TypeScript</p>
      </div>

      <div className="app-content">
        <ProductoForm key={productoEditar?.id ?? "nuevo"} productoEditar={productoEditar} />
        <ProductoLista onEditar={setProductoEditar} />
      </div>*/}
      {/*<button onClick={async () => {
        const productosDisponibles = await getProductosDisponibles();
        console.log("Productos disponibles:", productosDisponibles);
      }}>Consultar Productos Disponibles</button>*/}
      {/*<div>
        <Vehiculos />
      </div>*/}
      <div>
        <h1>Productos</h1>
        <ProductoListaPaginada />
      </div>
    </div>
  );
}

export default App;