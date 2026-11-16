import ProductoForm from "./components/ProductoForm";
import ProductoLista from "./components/ProductoLista";

import "./App.css";

function App() {
  return (
    <div className="app-container">

      <div className="app-header">
        <h1>Sistema de Gestión de Productos</h1>
        <p>Firebase + React + TypeScript</p>
      </div>

      <div className="app-content">
        <ProductoForm />
        <ProductoLista />
      </div>

    </div>
  );
}

export default App;