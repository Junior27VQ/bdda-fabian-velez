import { useState, type SyntheticEvent } from 'react'
import './App.css'
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

function App() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        nombre: nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock)
      });
      console.log("Document written with ID: ", docRef.id);
      // Clear the form fields after successful submission
      setNombre("");
      setPrecio("");
      setStock("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="App">
      <h1>Formulario de Producto</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
          type='text'
          placeholder='Nombre'
          value={nombre}
          onChange={(e)=> setNombre(e.target.value)}
          />
          <input
          type='number'
          placeholder='Precio'
          value={precio}
          onChange={(e)=> setPrecio(e.target.value)}
          />
          <input
          type='number'
          placeholder='Stock'
          value={stock}
          onChange={(e)=> setStock(e.target.value)}
          />
          <button type='submit'>Guardar</button>
        </form>
      </div>
    </div>
      
      
  )
}

export default App
