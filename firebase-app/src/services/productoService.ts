import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

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
