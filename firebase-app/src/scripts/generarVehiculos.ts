import { db } from "../firebase";
import { doc, writeBatch } from "firebase/firestore";

interface Vehiculo {
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  anio: number;
  tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback";
}

// Datos de Prueba
const vehiculos: Vehiculo[] = [
  // Sedan
  { marca: "Toyota", modelo: "Corolla", precio: 24500, stock: 8, anio: 2025, tipo: "Sedan" },
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
];

// Funcion encargada de generar los vehiculos en la base de datos
export const generarVehiculos = async () => {

    // Crear un batch para realizar la escritura en lote
  const batch = writeBatch(db);

  // Ciclo for para recorer el arreglo de vehiculos y agregarlos a la base de datos
  vehiculos.forEach((vehiculo) => {
    const docRef = doc(db, "vehiculos");
    batch.set(docRef, vehiculo);
  });

  try {
    await batch.commit();
    console.log("Vehículos generados exitosamente.");
  } catch (error) {
    console.error("Error al generar vehículos:", error);
  }
}
