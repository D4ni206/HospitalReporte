import { Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>HospitalApp</h2>

        <button onClick={() => navigate("/dashboard")}>
          Inicio
        </button>

        <button onClick={() => navigate("/registrar")}>
          Registrar Paciente
        </button>

        <button onClick={() => navigate("/pacientes")}>
          Lista Pacientes
        </button>

        <button onClick={() => navigate("/consulta")}>
          Consulta / Filtro
        </button>

        <button onClick={() => navigate("/pdf")}>
          Reporte PDF
        </button>

        <button onClick={() => navigate("/excel")}>
          Reporte Excel
        </button>

        <button onClick={() => navigate("/")}>
          Cerrar sesión
        </button>
      </div>

      <div className="contenido">
        <Outlet />
      </div>
    </div>
  );
}
