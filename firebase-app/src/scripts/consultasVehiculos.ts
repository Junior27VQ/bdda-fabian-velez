import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter} from "firebase/firestore";
import type { DocumentData, Query, QueryDocumentSnapshot } from "firebase/firestore";

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

export const getDeportivoDisponible = async (): Promise<Vehiculo[]> => {
  const consulta = query(
    vehiculosRef,
    where("tipo", "==", "Deportivo"),
    where("stock", ">", 0),
    orderBy("precio", "asc")
  );
  return ejecutarConsulta(consulta);
};

// ==========================================================
// PAGINACION
// ==========================================================

// Cantidad de vehiculos por pagina
export const VEHICULOS_POR_PAGINA = 10;

// Lo que devuelve cada pagina: los vehiculos, el cursor y si existe una pagina siguiente
export interface PaginaVehiculos {
  vehiculos: Vehiculo[];
  ultimoDoc?: QueryDocumentSnapshot<DocumentData>;
  hayMas: boolean;
}

// Si recibe ultimoDoc, trae los 10 que vienen DESPUES de ese documento (startAfter).
// Si no lo recibe, trae los primeros 10.
export const obtenerVehiculosPaginados = async (
  ultimoDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginaVehiculos> => {
  const consulta = ultimoDoc
    ? query(
        vehiculosRef,
        orderBy("precio", "asc"),
        startAfter(ultimoDoc),
        limit(VEHICULOS_POR_PAGINA)
      )
    : query(vehiculosRef, orderBy("precio", "asc"), limit(VEHICULOS_POR_PAGINA));

  const snapshot = await getDocs(consulta);

  const vehiculos = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Vehiculo[];

  // El ultimo documento de esta pagina sera el cursor de la siguiente
  const nuevoUltimoDoc = snapshot.docs[snapshot.docs.length - 1];

  // Para saber si el boton "Siguiente" debe estar activo:
  // si la pagina vino incompleta (menos de 10), ya no hay mas datos.
  // Si vino completa, preguntamos por UN solo documento mas (limit(1)) para confirmarlo.
  let hayMas = false;
  if (snapshot.docs.length === VEHICULOS_POR_PAGINA && nuevoUltimoDoc) {
    const siguiente = await getDocs(
      query(vehiculosRef, orderBy("precio", "asc"), startAfter(nuevoUltimoDoc), limit(1))
    );
    hayMas = !siguiente.empty;
  }

  return { vehiculos, ultimoDoc: nuevoUltimoDoc, hayMas };
};