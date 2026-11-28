import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

export interface Matricula {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  cursoId: string;
  cursoNombre: string;
  estado: string;
  periodo: string;
}

export const crearDatosMatriculas = async () => {
    await setDoc(doc(db, "estudiante", "EST001"),{
        nombre: "Juan Perez",
        email: "juan.perez@example.com",
        estado: "activo",
    });
    await setDoc(doc(db, "cursos", "CUR001"),{
        nombre: "Matematicas",
        codigo: "MAT101",
        estado: "activo",
        creditos: 3,
    });
    await setDoc(doc(db, "matriculas", "MAT001"),{
        estudianteId: "EST001",
        estudianteNombre: "Juan Perez",
        cursoId: "CUR001",
        cursoNombre: "Matematicas",
        estado: "aprobado",
        periodo: "2024-1",
    });
}

/**
 * 1. Cursos de un estudiante
 */
export const obtenerCursosPorEstudiante = async (
  estudianteId: string
): Promise<Matricula[]> => {
  const consulta = query(
    collection(db, "matriculas"),
    where("estudianteId", "==", estudianteId)
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Matricula[];
};

/**
 * 2. Estudiantes de un curso
 */
export const obtenerEstudiantesPorCurso = async (
  cursoId: string
): Promise<Matricula[]> => {
  const consulta = query(
    collection(db, "matriculas"),
    where("cursoId", "==", cursoId)
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Matricula[];
};

/**
 * 3. Matrículas activas
 */
export const obtenerMatriculasActivas = async (): Promise<
  Matricula[]
> => {
  const consulta = query(
    collection(db, "matriculas"),
    where("estado", "==", "activa")
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Matricula[];
};

/**
 * 4. Matrícula por ID
 */
export const obtenerMatriculaPorId = async (
  id: string
): Promise<Matricula | null> => {
  const referencia = doc(db, "matriculas", id);

  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Matricula;
};