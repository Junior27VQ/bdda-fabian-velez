import { db } from "../firebase";
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc, onSnapshot, type Unsubscribe } from "firebase/firestore";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}
// funcion de suscripcion a los productos en tiempo real
export const suscribirProductos = (
  onData: (productos: Producto[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  return onSnapshot(
    collection(db, "productos"),
    (snapshot) => {
      const productos = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Producto[];

      onData(productos);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
};

// CRUD 
// funcion para agregar un producto a la base de datos
export const addProducto = async (
  nombre: string,
  precio: number,
  stock: number
) => {
  const docRef = await addDoc(
    collection(db, "productos"),
    {
      nombre,
      precio,
      stock,
    }
  );

  return docRef.id;
};

// funcion para obtener todos los productos de la base de datos
export const getProductos = async (): Promise<Producto[]> => {
  const querySnapshot = await getDocs(collection(db, "productos"));

  const productos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Producto[];

  return productos;
};

// funcion para actualizar un producto en la base de datos
export const updateProducto = async (id: string, nombre: string, precio: number, stock: number) => {
  const productoRef = doc(db, "productos", id);
  await updateDoc(productoRef, {nombre, precio, stock});
}

// funcion para eliminar un producto de la base de datos
export const deleteProducto = async (id: string) => {
  const productoRef = doc(db, "productos", id);
  await deleteDoc(productoRef);
}