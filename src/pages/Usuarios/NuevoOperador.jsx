import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import "../Pacientes/registrar.css";

export default function NuevoOperador() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("operador");
  const [carpa, setCarpa] = useState("TODOS");
  const [loading, setLoading] = useState(false);

  if (!usuario || usuario?.rol !== "admin") {
    return (
      <div className="registrar">
        <div className="registrar-container">
          <h1>Acceso denegado</h1>
          <p>Solo los administradores pueden crear nuevos operadores.</p>
        </div>
      </div>
    );
  }

  async function crearOperador(event) {
    event.preventDefault();

    if (!nuevoUsuario.trim() || !password.trim()) {
      alert("Debe ingresar usuario y contraseña para el nuevo operador.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from("usuarios").insert([
      {
        usuario: nuevoUsuario.trim(),
        password: password.trim(),
        rol,
        carpa,
      },
    ]);

    setLoading(false);

    if (error) {
      console.warn("Error creando nuevo operador", error);
      alert("No se pudo crear el operador. Revisa la configuración de Supabase.");
      return;
    }

    alert("Operador creado correctamente.");
    setNuevoUsuario("");
    setPassword("");
    navigate("/pacientes");
  }

  return (
    <div className="registrar">
      <div className="registrar-container">
        <h1>Nuevo Operador</h1>
        <p>Registra un usuario con rol de operador.</p>

        <form className="form-section" onSubmit={crearOperador}>
          <div className="form-grid full">
            <div className="form-group">
              <label>Usuario</label>
              <input
                required
                placeholder="Nombre de usuario"
                value={nuevoUsuario}
                onChange={(e) => setNuevoUsuario(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid full">
            <div className="form-group">
              <label>Contraseña</label>
              <input
                required
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid full">
            <div className="form-group">
              <label>Rol</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="operador">operador</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          <div className="form-grid full">
            <div className="form-group">
              <label>Carpa asignada</label>
              <select value={carpa} onChange={(e) => setCarpa(e.target.value)}>
                <option value="TODOS">TODOS</option>
                <option value="Carpa A">Carpa A</option>
                <option value="Carpa B">Carpa B</option>
                <option value="Carpa C">Carpa C</option>
                <option value="Carpa D">Carpa D</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit-split"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "⏳ Creando..." : "Crear Operador"}
          </button>
        </form>
      </div>
    </div>
  );
}
