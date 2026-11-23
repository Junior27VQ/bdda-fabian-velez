import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy} from "firebase/firestore";
import type { Query } from "firebase/firestore";

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  anio: number;
  tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback";
}

// Referencia a la coleccion "vehiculos"
const vehiculosRef = collection(db, "vehiculos");

// Funcion auxiliar: ejecuta una consulta y convierte los documentos en objetos Vehiculo.
// Asi no repetimos el mismo codigo de conversion en cada consulta.
// Si falta un indice, getDocs lanza un error cuyo mensaje trae el enlace para crearlo.
const ejecutarConsulta = async (consulta: Query): Promise<Vehiculo[]> => {
  const querySnapshot = await getDocs(consulta);
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Vehiculo[];
};

// Consulta 1: vehiculos disponibles, de menor a mayor precio
export const getVehiculosDisponibles = async (): Promise<Vehiculo[]> => {
  const consulta = query(
    vehiculosRef,
    where("stock", ">", 0),
    orderBy("precio", "asc")
  );
  return ejecutarConsulta(consulta);
};

// Consulta 2: SUV disponibles, de menor a mayor precio
export const getSUVDisponibles = async (): Promise<Vehiculo[]> => {
  const consulta = query(
    vehiculosRef,
    where("tipo", "==", "SUV"),
    where("stock", ">", 0),
    orderBy("precio", "asc")
  );
  return ejecutarConsulta(consulta);
};

// Consulta 3: precio entre 20000 y 40000 con stock, de menor a mayor precio
export const getVehiculosPorRangoPrecio = async (): Promise<Vehiculo[]> => {
  const consulta = query(
    vehiculosRef,
    where("precio", ">=", 20000),
    where("precio", "<=", 40000),
    where("stock", ">", 0),
    orderBy("precio", "asc")
  );
  return ejecutarConsulta(consulta);
};

// Consulta 4 (reto): Sedan desde 2023 con stock, del año mas reciente al mas antiguo
export const getSedanesRecientes = async (): Promise<Vehiculo[]> => {
  const consulta = query(
    vehiculosRef,
    where("tipo", "==", "Sedan"),
    where("anio", ">=", 2023),
    where("stock", ">", 0),
    orderBy("anio", "desc")
  );
  return ejecutarConsulta(consulta);
};