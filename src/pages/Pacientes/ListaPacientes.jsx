import { usePacientes } from "../../hooks/usePacientes";
import { useNavigate } from "react-router-dom";
import PacienteTable from "../../components/PacienteTable";
import ReportePDF from "../Reportes/ReportePDF";
import ReporteExcel from "../Reportes/ReporteExcel";
import { deletePaciente } from "../../services/pacientesService";
import "./listaPacientes.css";

export default function ListaPacientes() {
  const { pacientes, loading, error, busqueda, setBusqueda, refreshPacientes } = usePacientes();
  const navigate = useNavigate();

  async function handleDeletePaciente(id) {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este paciente?");
    if (!confirmDelete) return;

    try {
      await deletePaciente(id);
      alert("Paciente eliminado correctamente.");
      refreshPacientes();
    } catch (err) {
      console.error("Error eliminando paciente:", err);
      alert("No se pudo eliminar el paciente. Intenta de nuevo.");
    }
  }

  const handleEditPaciente = (id) => {
    navigate(`/pacientes/${id}/editar`);
  };

  const handleCreateInforme = (id) => {
    navigate(`/pacientes/${id}/informe`);
  };

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
        <PacienteTable
          pacientes={pacientes}
          onEdit={handleEditPaciente}
          onDelete={handleDeletePaciente}
          onInforme={handleCreateInforme}
        />
      )}
    </div>
  );
}
