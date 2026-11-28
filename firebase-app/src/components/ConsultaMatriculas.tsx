import { useState } from "react";

import {
  obtenerCursosPorEstudiante,
  obtenerEstudiantesPorCurso,
  obtenerMatriculasActivas,
  obtenerMatriculaPorId,
  type Matricula,
} from "../services/matriculaService";

import "./ConsultaMatriculas.css";

export const ConsultaMatriculas = () => {
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const limpiar = () => {
    setError("");
    setMatriculas([]);
  };

  const consultarCursosEstudiante = async () => {
    try {
      setCargando(true);
      limpiar();

      const resultado =
        await obtenerCursosPorEstudiante(
          valorBusqueda
        );

      setMatriculas(resultado);
    } catch (e) {
      setError("Error al consultar"+ e);
    } finally {
      setCargando(false);
    }
  };

  const consultarEstudiantesCurso = async () => {
    try {
      setCargando(true);
      limpiar();

      const resultado =
        await obtenerEstudiantesPorCurso(
          valorBusqueda
        );

      setMatriculas(resultado);
    } catch (e) {
      setError("Error al consultar"+ e);
    } finally {
      setCargando(false);
    }
  };

  const consultarActivas = async () => {
    try {
      setCargando(true);
      limpiar();

      const resultado =
        await obtenerMatriculasActivas();

      setMatriculas(resultado);
    } catch (e) {
      setError("Error al consultar"+ e);
    } finally {
      setCargando(false);
    }
  };

  const consultarPorId = async () => {
    try {
      setCargando(true);
      limpiar();

      const resultado =
        await obtenerMatriculaPorId(
          valorBusqueda
        );

      if (resultado) {
        setMatriculas([resultado]);
      } else {
        setError("No se encontró la matrícula");
      }
    } catch (e) {
      setError("Error al consultar"+ e);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="consulta-matriculas">

      <h2>Consultas de Matrículas</h2>

      <input
        type="text"
        placeholder="Ingrese ID"
        value={valorBusqueda}
        onChange={(e) =>
          setValorBusqueda(e.target.value)
        }
      />

      <div className="botones">

        <button
          onClick={consultarCursosEstudiante}
        >
          Cursos de Estudiante
        </button>

        <button
          onClick={consultarEstudiantesCurso}
        >
          Estudiantes de Curso
        </button>

        <button
          onClick={consultarActivas}
        >
          Matrículas Activas
        </button>

        <button
          onClick={consultarPorId}
        >
          Matrícula por ID
        </button>

      </div>

      {cargando && <p>Cargando...</p>}

      {error && (
        <p className="error">{error}</p>
      )}

      {matriculas.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Periodo</th>
            </tr>
          </thead>

          <tbody>
            {matriculas.map((matricula) => (
              <tr key={matricula.id}>
                <td>{matricula.id}</td>
                <td>
                  {matricula.estudianteNombre}
                </td>
                <td>
                  {matricula.cursoNombre}
                </td>
                <td>
                  {matricula.estado}
                </td>
                <td>
                  {matricula.periodo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};