import { usePacientes } from "../../hooks/usePacientes";
import PacienteTable from "../../components/PacienteTable";
import ReportePDF from "../Reportes/ReportePDF";
import ReporteExcel from "../Reportes/ReporteExcel";
import "./listaPacientes.css";

export default function ListaPacientes() {
  const { pacientes, loading, error, busqueda, setBusqueda } = usePacientes();

  return (
    <div className="lista-pacientes">
      <div className="lista-header">
        <h1>Lista Pacientes</h1>

        <div className="lista-actions">
          <input
            className="buscador"
            placeholder="Buscar por nombre, apellido o DNI"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="export-buttons">
            <ReportePDF pacientes={pacientes} />
            <ReporteExcel pacientes={pacientes} />
          </div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="error-box">Cargando pacientes...</div>
      ) : (
        <PacienteTable pacientes={pacientes} />
      )}
    </div>
  );
}
