import { db } from "../firebase";
import { collection, doc, getDoc,  getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import type { DocumentData, QueryConstraint, QueryDocumentSnapshot } from "firebase/firestore";

// Nombre de la colección principal 
const COLECCION = "inventarioVehiculos";

// Cuántos documentos se piden por página
export const VEHICULOS_POR_PAGINA = 10;

// ---------- Valores permitidos ----------
// "as const" convierte el arreglo en una lista de valores fijos. Así TypeScript
// puede derivar el tipo a partir de ella y los <select> usan la misma lista:
// una sola fuente de verdad.
export const TIPOS = ["Sedan", "SUV", "Pickup", "Hatchback"] as const;
export const COMBUSTIBLES = ["Gasolina", "Diésel", "Híbrido", "Eléctrico"] as const;
export const TRANSMISIONES = ["Manual", "Automática"] as const;


export const MARCAS = [
  "BYD", "Chevrolet", "Ford", "Honda", "Hyundai", "Kia", "Mazda",
  "Mitsubishi", "Nissan", "Renault", "Suzuki", "Tesla", "Toyota", "Volkswagen",
] as const;

export type TipoVehiculo = (typeof TIPOS)[number];
export type Combustible = (typeof COMBUSTIBLES)[number];
export type Transmision = (typeof TRANSMISIONES)[number];

// Objeto anidado: en Firestore es un Map dentro del documento
export interface EspecificacionesVehiculo {
  motor: string;
  combustible: Combustible;
  transmision: Transmision;
}

export interface VehiculoInventario {
  id: string; // ID del documento (VEH001...). No se guarda como campo: lo añadimos al leer
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  tipo: TipoVehiculo;
  disponible: boolean;
  especificaciones: EspecificacionesVehiculo;
}

// Un "cursor" es el último documento de una página: sirve para pedir la siguiente
export type Cursor = QueryDocumentSnapshot<DocumentData>;

// Lo que devuelve cada página
export interface PaginaInventario {
  vehiculos: VehiculoInventario[];
  ultimoDoc?: Cursor; // cursor de ESTA página (undefined si vino vacía)
  hayMas: boolean; // true si existe una página siguiente
}

// ---------- Consulta paginada base ----------
// Recibe los filtros (where) que correspondan al patrón de acceso y un cursor opcional.
// Siempre ordena por precio y trae como máximo 10 documentos.
export const obtenerPagina = async (
  filtros: QueryConstraint[] = [],
  cursor?: Cursor
): Promise<PaginaInventario> => {
  const coleccion = collection(db, COLECCION);

  // Restricciones comunes: los filtros del patrón + el orden
  const base = [...filtros, orderBy("precio", "asc")];

  // Con cursor: startAfter(cursor) = "empieza DESPUÉS de ese documento"
  const consulta = cursor
    ? query(coleccion, ...base, startAfter(cursor), limit(VEHICULOS_POR_PAGINA))
    : query(coleccion, ...base, limit(VEHICULOS_POR_PAGINA));

  const snapshot = await getDocs(consulta);

  // Convertimos cada documento en un objeto, agregando el id
  const vehiculos = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as VehiculoInventario[];

  // El último documento de esta página será el cursor de la siguiente
  const ultimoDoc = snapshot.docs[snapshot.docs.length - 1];

  // ¿Existe otra página? Si vino incompleta (<10), no. Si vino completa, preguntamos
  // por UN documento más (limit(1)) para evitar mostrar un "Siguiente" que lleve a una página vacía.
  let hayMas = false;
  if (snapshot.docs.length === VEHICULOS_POR_PAGINA && ultimoDoc) {
    const siguiente = await getDocs(
      query(coleccion, ...base, startAfter(ultimoDoc), limit(1))
    );
    hayMas = !siguiente.empty;
  }

  return { vehiculos, ultimoDoc, hayMas };
};

// ---------- Patrones de acceso ----------
// Unión discriminada: cada patrón lleva su nombre ("patron") y SOLO los datos que necesita.
// TypeScript nos obliga a manejar todos los casos y evita combinaciones inválidas
// (por ejemplo, un filtro de marca sin marca).
export type FiltroInventario =
  | { patron: "todos" } // PA1
  | { patron: "marca"; marca: string } // PA2
  | { patron: "disponibles" } // PA3
  | { patron: "rangoPrecio"; min: number; max: number } // PA4
  | { patron: "tipo"; tipo: TipoVehiculo } // PA5
  | { patron: "combustible"; combustible: Combustible }; // PA6

// Traduce un patrón de acceso a los where() de Firestore.
// El filtrado ocurre en el SERVIDOR: nunca se descarga la colección para filtrar con JS.
export const restriccionesDeFiltro = (filtro: FiltroInventario): QueryConstraint[] => {
  switch (filtro.patron) {
    case "todos":
      return [];
    case "marca":
      return [where("marca", "==", filtro.marca)];
    case "disponibles":
      return [where("disponible", "==", true)];
    case "rangoPrecio":
      // Rango sobre el mismo campo por el que se ordena (precio): no necesita índice compuesto
      return [where("precio", ">=", filtro.min), where("precio", "<=", filtro.max)];
    case "tipo":
      return [where("tipo", "==", filtro.tipo)];
    case "combustible":
      // Campo dentro del objeto anidado: se accede con notación de punto
      return [where("especificaciones.combustible", "==", filtro.combustible)];
  }
};

// Función que usarán los componentes: una página del inventario según el patrón elegido
export const consultarInventario = (
  filtro: FiltroInventario,
  cursor?: Cursor
): Promise<PaginaInventario> => obtenerPagina(restriccionesDeFiltro(filtro), cursor);

// ---------- Detalle de un vehículo por su ID ----------
// getDoc lee UN documento puntual (una sola lectura). Devuelve null si no existe.
export const obtenerVehiculoPorId = async (id: string): Promise<VehiculoInventario | null> => {
  const snapshot = await getDoc(doc(db, COLECCION, id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as VehiculoInventario;
};
