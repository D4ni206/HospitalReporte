import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

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

        {usuario?.rol === "admin" && (
          <button onClick={() => navigate("/nuevo-operador")}>
            Nuevo Operador
          </button>
        )}

        <button onClick={() => navigate("/pacientes")}>
          Lista Pacientes
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
