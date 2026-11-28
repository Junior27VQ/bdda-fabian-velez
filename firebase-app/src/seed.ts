import { db } from "./firebase.ts";
import { collection, doc, setDoc } from "firebase/firestore";

// MOLDE DE CADA DOCUMENTO 
interface VehiculoSeed {
  id: string; // será el ID del documento (VEH001...), no un campo guardado
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback";
  disponible: boolean;
  // Objeto anidado (Map en Firestore)
  especificaciones: {
    motor: string;
    combustible: "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico";
    transmision: "Manual" | "Automática";
  };
}

// DATOS DE PRUEBA (40 vehículos coherentes: marcas, tipos, combustibles y precios variados)
const vehiculos: VehiculoSeed[] = [
  // ---- Sedan ----
  { id: "VEH001", marca: "Toyota", modelo: "Corolla", anio: 2025, precio: 24500, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH002", marca: "Honda", modelo: "Civic", anio: 2024, precio: 27800, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "1.5 Turbo", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH003", marca: "Mazda", modelo: "Mazda 3", anio: 2023, precio: 25900, tipo: "Sedan", disponible: false,
    especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH004", marca: "Hyundai", modelo: "Elantra", anio: 2024, precio: 23400, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH005", marca: "Nissan", modelo: "Sentra", anio: 2022, precio: 19800, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "1.8", combustible: "Gasolina", transmision: "Manual" } },
  { id: "VEH006", marca: "Volkswagen", modelo: "Jetta", anio: 2026, precio: 31500, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "1.4 Turbo", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH007", marca: "Kia", modelo: "K3", anio: 2021, precio: 18900, tipo: "Sedan", disponible: false,
    especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Manual" } },
  { id: "VEH008", marca: "Toyota", modelo: "Camry", anio: 2025, precio: 35500, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "2.5", combustible: "Híbrido", transmision: "Automática" } },
  { id: "VEH009", marca: "Tesla", modelo: "Model 3", anio: 2025, precio: 42900, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "Dual Motor", combustible: "Eléctrico", transmision: "Automática" } },
  { id: "VEH010", marca: "BYD", modelo: "Seal", anio: 2025, precio: 44900, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "Motor trasero 230 kW", combustible: "Eléctrico", transmision: "Automática" } },
  { id: "VEH011", marca: "Chevrolet", modelo: "Onix", anio: 2023, precio: 17500, tipo: "Sedan", disponible: true,
    especificaciones: { motor: "1.2 Turbo", combustible: "Gasolina", transmision: "Manual" } },
  { id: "VEH012", marca: "Honda", modelo: "Accord", anio: 2024, precio: 36100, tipo: "Sedan", disponible: false,
    especificaciones: { motor: "1.5 Turbo", combustible: "Gasolina", transmision: "Automática" } },

  // ---- SUV ----
  { id: "VEH013", marca: "Toyota", modelo: "RAV4", anio: 2025, precio: 38900, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.5", combustible: "Híbrido", transmision: "Automática" } },
  { id: "VEH014", marca: "Hyundai", modelo: "Tucson", anio: 2024, precio: 34200, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH015", marca: "Kia", modelo: "Sportage", anio: 2023, precio: 33500, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH016", marca: "Mazda", modelo: "CX-5", anio: 2024, precio: 36700, tipo: "SUV", disponible: false,
    especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH017", marca: "Nissan", modelo: "Kicks", anio: 2022, precio: 21900, tipo: "SUV", disponible: true,
    especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH018", marca: "Ford", modelo: "Explorer", anio: 2026, precio: 58500, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.3 Turbo", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH019", marca: "Honda", modelo: "HR-V", anio: 2025, precio: 32800, tipo: "SUV", disponible: true,
    especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH020", marca: "Chevrolet", modelo: "Tracker", anio: 2024, precio: 24900, tipo: "SUV", disponible: true,
    especificaciones: { motor: "1.2 Turbo", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH021", marca: "Volkswagen", modelo: "Tiguan", anio: 2025, precio: 41500, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.0 Turbo", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH022", marca: "Mitsubishi", modelo: "Outlander", anio: 2023, precio: 35200, tipo: "SUV", disponible: false,
    especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH023", marca: "Kia", modelo: "Sorento", anio: 2025, precio: 43800, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.2", combustible: "Diésel", transmision: "Automática" } },
  { id: "VEH024", marca: "Hyundai", modelo: "Santa Fe", anio: 2026, precio: 45900, tipo: "SUV", disponible: true,
    especificaciones: { motor: "2.5", combustible: "Híbrido", transmision: "Automática" } },
  { id: "VEH025", marca: "Tesla", modelo: "Model Y", anio: 2025, precio: 49900, tipo: "SUV", disponible: true,
    especificaciones: { motor: "Dual Motor", combustible: "Eléctrico", transmision: "Automática" } },
  { id: "VEH026", marca: "BYD", modelo: "Song Plus", anio: 2024, precio: 32900, tipo: "SUV", disponible: true,
    especificaciones: { motor: "1.5 Plug-in", combustible: "Híbrido", transmision: "Automática" } },
  { id: "VEH027", marca: "Suzuki", modelo: "Vitara", anio: 2022, precio: 27200, tipo: "SUV", disponible: true,
    especificaciones: { motor: "1.4 Turbo", combustible: "Gasolina", transmision: "Manual" } },
  { id: "VEH028", marca: "Renault", modelo: "Duster", anio: 2023, precio: 26500, tipo: "SUV", disponible: true,
    especificaciones: { motor: "1.3 Turbo", combustible: "Gasolina", transmision: "Manual" } },

  // ---- Pickup ----
  { id: "VEH029", marca: "Toyota", modelo: "Hilux", anio: 2025, precio: 42000, tipo: "Pickup", disponible: true,
    especificaciones: { motor: "2.8", combustible: "Diésel", transmision: "Automática" } },
  { id: "VEH030", marca: "Ford", modelo: "Ranger", anio: 2024, precio: 44800, tipo: "Pickup", disponible: true,
    especificaciones: { motor: "2.0", combustible: "Diésel", transmision: "Automática" } },
  { id: "VEH031", marca: "Chevrolet", modelo: "D-Max", anio: 2023, precio: 35900, tipo: "Pickup", disponible: true,
    especificaciones: { motor: "3.0", combustible: "Diésel", transmision: "Manual" } },
  { id: "VEH032", marca: "Nissan", modelo: "Frontier", anio: 2022, precio: 39500, tipo: "Pickup", disponible: false,
    especificaciones: { motor: "2.3", combustible: "Diésel", transmision: "Automática" } },
  { id: "VEH033", marca: "Mitsubishi", modelo: "L200", anio: 2024, precio: 37200, tipo: "Pickup", disponible: true,
    especificaciones: { motor: "2.4", combustible: "Diésel", transmision: "Manual" } },
  { id: "VEH034", marca: "Ford", modelo: "F-150", anio: 2026, precio: 55900, tipo: "Pickup", disponible: true,
    especificaciones: { motor: "3.5", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH035", marca: "Chevrolet", modelo: "Colorado", anio: 2025, precio: 40800, tipo: "Pickup", disponible: false,
    especificaciones: { motor: "2.8", combustible: "Diésel", transmision: "Automática" } },
  { id: "VEH036", marca: "Mazda", modelo: "BT-50", anio: 2023, precio: 33800, tipo: "Pickup", disponible: true,
    especificaciones: { motor: "3.0", combustible: "Diésel", transmision: "Manual" } },

  // ---- Hatchback ----
  { id: "VEH037", marca: "Kia", modelo: "Rio", anio: 2024, precio: 16500, tipo: "Hatchback", disponible: true,
    especificaciones: { motor: "1.4", combustible: "Gasolina", transmision: "Manual" } },
  { id: "VEH038", marca: "Suzuki", modelo: "Swift", anio: 2023, precio: 15800, tipo: "Hatchback", disponible: true,
    especificaciones: { motor: "1.2", combustible: "Gasolina", transmision: "Manual" } },
  { id: "VEH039", marca: "Volkswagen", modelo: "Golf", anio: 2025, precio: 29900, tipo: "Hatchback", disponible: true,
    especificaciones: { motor: "1.4 Turbo", combustible: "Gasolina", transmision: "Automática" } },
  { id: "VEH040", marca: "Toyota", modelo: "Yaris", anio: 2023, precio: 17900, tipo: "Hatchback", disponible: true,
    especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Automática" } },
];

// FUNCIÓN QUE SUBE LOS DATOS
const sembrar = async () => {
  // Referencia a la colección principal (se crea sola al escribir el primer documento)
  const coleccion = collection(db, "inventarioVehiculos");

  for (const vehiculo of vehiculos) {
    // Separamos el id del resto: el id será el nombre del documento, no un campo dentro de él
    const { id, ...datos } = vehiculo;

    // setDoc escribe en el documento con ESE id. Si ya existe, lo sobrescribe,
    // por eso el script se puede repetir sin crear duplicados.
    // (addDoc se usa cuando se quiere que Firestore invente el ID; aquí queremos VEH001, VEH002...)
    await setDoc(doc(coleccion, id), datos);
    console.log(`OK ${id} - ${datos.marca} ${datos.modelo}`);
  }

  console.log(`\nSiembra terminada: ${vehiculos.length} vehículos en "inventarioVehiculos".`);
};

sembrar()
  .then(() => process.exit(0)) // Firestore deja la conexión abierta; salimos manualmente
  .catch((error) => {
    console.error("Error durante la siembra:", error);
    process.exit(1);
  }); 