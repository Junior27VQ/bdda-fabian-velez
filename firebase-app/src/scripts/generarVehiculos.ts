import { db } from "../firebase";
import { collection, doc, getCountFromServer, writeBatch } from "firebase/firestore";

interface Vehiculo {
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  anio: number;
  tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback" | "Deportivo";
}

// Datos de Prueba
const vehiculos: Vehiculo[] = [
  // Sedan
  { marca: "Honda", modelo: "Civic", precio: 27800, stock: 5, anio: 2024, tipo: "Sedan" },
  { marca: "Mazda", modelo: "Mazda 3", precio: 25900, stock: 3, anio: 2023, tipo: "Sedan" },
  { marca: "Hyundai", modelo: "Elantra", precio: 22400, stock: 0, anio: 2022, tipo: "Sedan" },
  { marca: "Nissan", modelo: "Sentra", precio: 19800, stock: 12, anio: 2021, tipo: "Sedan" },
  { marca: "Volkswagen", modelo: "Jetta", precio: 31500, stock: 6, anio: 2026, tipo: "Sedan" },
  { marca: "Kia", modelo: "K3", precio: 18900, stock: 0, anio: 2020, tipo: "Sedan" },
  // SUV
  { marca: "Toyota", modelo: "RAV4", precio: 38900, stock: 7, anio: 2025, tipo: "SUV" },
  { marca: "Hyundai", modelo: "Tucson", precio: 34200, stock: 10, anio: 2024, tipo: "SUV" },
  { marca: "Kia", modelo: "Sportage", precio: 33500, stock: 4, anio: 2023, tipo: "SUV" },
  { marca: "Mazda", modelo: "CX-5", precio: 36700, stock: 0, anio: 2022, tipo: "SUV" },
  { marca: "Nissan", modelo: "Kicks", precio: 21900, stock: 15, anio: 2021, tipo: "SUV" },
  { marca: "Ford", modelo: "Explorer", precio: 58500, stock: 2, anio: 2026, tipo: "SUV" },
  // Pickup
  { marca: "Toyota", modelo: "Hilux", precio: 42000, stock: 9, anio: 2025, tipo: "Pickup" },
  { marca: "Ford", modelo: "Ranger", precio: 44800, stock: 6, anio: 2024, tipo: "Pickup" },
  { marca: "Chevrolet", modelo: "D-Max", precio: 35900, stock: 11, anio: 2023, tipo: "Pickup" },
  { marca: "Nissan", modelo: "Frontier", precio: 39500, stock: 0, anio: 2022, tipo: "Pickup" },
  { marca: "Mitsubishi", modelo: "L200", precio: 37200, stock: 5, anio: 2020, tipo: "Pickup" },
  // Hatchback
  { marca: "Kia", modelo: "Rio", precio: 16500, stock: 20, anio: 2024, tipo: "Hatchback" },
  { marca: "Suzuki", modelo: "Swift", precio: 15800, stock: 14, anio: 2023, tipo: "Hatchback" },
  { marca: "Chevrolet", modelo: "Spark", precio: 15000, stock: 18, anio: 2021, tipo: "Hatchback" },
  { marca: "Volkswagen", modelo: "Golf", precio: 29900, stock: 3, anio: 2025, tipo: "Hatchback" },
  { marca: "Mazda", modelo: "Mazda 2", precio: 18500, stock: 7, anio: 2022, tipo: "Hatchback" },
  { marca: "Hyundai", modelo: "i20", precio: 17200, stock: 1, anio: 2026, tipo: "Hatchback" },
  //Deportibos
  {marca: "Porsche", modelo: "911", precio: 120000, stock: 2, anio: 2025, tipo: "Deportivo"},
  {marca: "Chevrolet", modelo: "Corvette", precio: 65000, stock: 3, anio: 2024, tipo: "Deportivo"},
  {marca: "Ford", modelo: "Mustang", precio: 55000, stock: 5, anio: 2023, tipo: "Deportivo"},
  {marca: "Nissan", modelo: "GT-R", precio: 115000, stock: 1, anio: 2026, tipo: "Deportivo"},
  {marca: "BMW", modelo: "M4", precio: 72000, stock: 4, anio: 2022, tipo: "Deportivo"},
];

// Funcion encargada de generar los vehiculos en la base de datos
export const generarVehiculos = async () => {

    // Crear un batch para realizar la escritura en lote
  const batch = writeBatch(db);

  // Ciclo for para recorer el arreglo de vehiculos y agregarlos a la base de datos
  vehiculos.forEach((vehiculo) => {
    const docRef = doc(collection(db, "vehiculos"));
    batch.set(docRef, vehiculo);
  });

    await batch.commit();
    return vehiculos.length; // Retorna la cantidad de vehiculos generados
  
}

// 24 vehiculos adicionales 
const vehiculosExtra: Vehiculo[] = [
  { marca: "Toyota", modelo: "Yaris", precio: 17900, stock: 13, anio: 2023, tipo: "Hatchback" },
  { marca: "Honda", modelo: "HR-V", precio: 32800, stock: 6, anio: 2025, tipo: "SUV" },
  { marca: "Chevrolet", modelo: "Onix", precio: 17500, stock: 9, anio: 2024, tipo: "Sedan" },
  { marca: "Nissan", modelo: "Versa", precio: 20500, stock: 0, anio: 2021, tipo: "Sedan" },
  { marca: "Ford", modelo: "F-150", precio: 55900, stock: 4, anio: 2026, tipo: "Pickup" },
  { marca: "Hyundai", modelo: "Accent", precio: 16900, stock: 17, anio: 2022, tipo: "Sedan" },
  { marca: "Kia", modelo: "Seltos", precio: 28500, stock: 8, anio: 2024, tipo: "SUV" },
  { marca: "Mazda", modelo: "CX-30", precio: 30900, stock: 2, anio: 2023, tipo: "SUV" },
  { marca: "Volkswagen", modelo: "Tiguan", precio: 41500, stock: 5, anio: 2025, tipo: "SUV" },
  { marca: "Chevrolet", modelo: "Silverado", precio: 52400, stock: 3, anio: 2024, tipo: "Pickup" },
  { marca: "Toyota", modelo: "Tacoma", precio: 47500, stock: 7, anio: 2022, tipo: "Pickup" },
  { marca: "Honda", modelo: "Fit", precio: 19200, stock: 0, anio: 2020, tipo: "Hatchback" },
  { marca: "Peugeot", modelo: "208", precio: 20800, stock: 11, anio: 2025, tipo: "Hatchback" },
  { marca: "Renault", modelo: "Duster", precio: 26500, stock: 14, anio: 2023, tipo: "SUV" },
  { marca: "Suzuki", modelo: "Vitara", precio: 27200, stock: 6, anio: 2021, tipo: "SUV" },
  { marca: "BMW", modelo: "Serie 3", precio: 49900, stock: 1, anio: 2026, tipo: "Sedan" },
  { marca: "Mitsubishi", modelo: "Outlander", precio: 35200, stock: 4, anio: 2024, tipo: "SUV" },
  { marca: "Kia", modelo: "Sorento", precio: 43800, stock: 5, anio: 2025, tipo: "SUV" },
  { marca: "Hyundai", modelo: "Santa Fe", precio: 45900, stock: 3, anio: 2026, tipo: "SUV" },
  { marca: "Nissan", modelo: "X-Trail", precio: 37900, stock: 9, anio: 2022, tipo: "SUV" },
  { marca: "Mazda", modelo: "Mazda 6", precio: 33900, stock: 2, anio: 2021, tipo: "Sedan" },
  { marca: "Honda", modelo: "Accord", precio: 36100, stock: 6, anio: 2024, tipo: "Sedan" },
  { marca: "Fiat", modelo: "Argo", precio: 15500, stock: 16, anio: 2023, tipo: "Hatchback" },
  { marca: "Chevrolet", modelo: "Colorado", precio: 40800, stock: 0, anio: 2025, tipo: "Pickup" },
];

// Agrega solo los vehiculos que faltan para llegar al minimo (por defecto 40).
// Es seguro ejecutarla mas de una vez: si ya hay 40 o mas, no agrega nada.
export const completarVehiculos = async (
  minimo = 40
): Promise<{ agregados: number; total: number }> => {
  const vehiculosRef = collection(db, "vehiculos");

  // getCountFromServer cuenta los documentos en el servidor SIN descargarlos
  const conteo = await getCountFromServer(vehiculosRef);
  const actuales = conteo.data().count;

  const faltan = minimo - actuales;
  if (faltan <= 0) {
    return { agregados: 0, total: actuales };
  }

  const batch = writeBatch(db);
  vehiculosExtra.slice(0, faltan).forEach((vehiculo) => {
    batch.set(doc(vehiculosRef), vehiculo);
  });
  await batch.commit();

  const agregados = Math.min(faltan, vehiculosExtra.length);
  return { agregados, total: actuales + agregados };
};

// Cuenta cuantos vehiculos hay en Firestore sin descargarlos.
// Se usa para deshabilitar el boton "Generar datos de prueba" cuando ya hay datos.
export const contarVehiculos = async (): Promise<number> => {
  const conteo = await getCountFromServer(collection(db, "vehiculos"));
  return conteo.data().count;
};