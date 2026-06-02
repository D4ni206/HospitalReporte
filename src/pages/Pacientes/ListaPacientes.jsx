import { useMemo, useState } from "react";
import { usePacientes } from "../../hooks/usePacientes";
import PacienteTable from "../../components/PacienteTable";
import ReportePDF from "../Reportes/ReportePDF";
import ReporteExcel from "../Reportes/ReporteExcel";
import "./listaPacientes.css";

export default function ListaPacientes() {
  const { pacientes, loading, error, busqueda, setBusqueda } = usePacientes();
  const [sortDesc, setSortDesc] = useState(true);

  const sortedPacientes = useMemo(() => {
    return [...pacientes].sort((a, b) => {
      const aValue = Number(a.id ?? a.dni ?? 0);
      const bValue = Number(b.id ?? b.dni ?? 0);
      return sortDesc ? bValue - aValue : aValue - bValue;
    });
  }, [pacientes, sortDesc]);

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
          <button
            type="button"
            className="sort-button"
            onClick={() => setSortDesc((current) => !current)}
          >
            {sortDesc ? "Mayor → Menor" : "Menor → Mayor"}
          </button>
          <div className="export-buttons">
            <ReportePDF pacientes={sortedPacientes} />
            <ReporteExcel pacientes={sortedPacientes} />
          </div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="error-box">Cargando pacientes...</div>
      ) : (
        <PacienteTable pacientes={sortedPacientes} />
      )}
    </div>
  );
}
