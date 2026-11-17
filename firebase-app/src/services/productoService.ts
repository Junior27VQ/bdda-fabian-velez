import { db } from "../firebase";
import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}

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

export const getProductos = async (): Promise<Producto[]> => {
  const querySnapshot = await getDocs(collection(db, "productos"));

  const productos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Producto[];

  return productos;
};

export const updateProducto = async (id: string, nombre: string, precio: number, stock: number) => {
  const productoRef = doc(db, "productos", id);
  await updateDoc(productoRef, {nombre, precio, stock});
}
