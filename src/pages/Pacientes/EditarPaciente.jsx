import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPacienteById, updatePaciente } from "../../services/pacientesService";
import "./registrar.css";

const PRIORIDAD_OPTIONS = [
  { value: "", label: "Seleccionar prioridad..." },
  { value: "Heridas leves", label: "Heridas leves" },
  { value: "Observación", label: "Observación" },
  { value: "Urgencias", label: "Urgencias" },
  { value: "Disponible", label: "Disponible" },
];

const createEmptyPaciente = () => ({
  dni: "",
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  sexo: "",
  direccion: "",
  seguro: "",
  triaje: "",
  descripcion: "",
  caracteristicas: "",
  usuarioId: "",
  nombreOperador: "",
  fechaRegistro: "",
});

export default function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(createEmptyPaciente());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function loadPaciente() {
      setLoading(true);
      setError(null);
      try {
        const loaded = await fetchPacienteById(id);
        if (!loaded) {
          setError("Paciente no encontrado.");
          setPaciente(createEmptyPaciente());
          return;
        }
        setPaciente({
          dni: loaded.dni || "",
          nombre: loaded.nombre || "",
          apellido: loaded.apellido || "",
          fechaNacimiento: loaded.fechaNacimiento || "",
          sexo: loaded.sexo || "",
          direccion: loaded.direccion || "",
          seguro: loaded.seguro || "",
          triaje: loaded.triaje || "",
          descripcion: loaded.descripcion || "",
          caracteristicas: loaded.caracteristicas || "",
          usuarioId: loaded.usuarioId || "",
          nombreOperador: loaded.nombreOperador || "",
          fechaRegistro: loaded.fechaRegistro || "",
        });
      } catch (err) {
        setError(err?.message || "Error cargando paciente.");
      } finally {
        setLoading(false);
      }
    }

    loadPaciente();
  }, [id]);

  const handleChange = (field, value) => {
    setPaciente((prev) => ({ ...prev, [field]: value }));
  };

  async function handleGuardar() {
    if (!paciente.dni?.trim() || !paciente.nombre?.trim() || !paciente.apellido?.trim() || !paciente.triaje?.trim()) {
      alert("Los campos DNI, Nombre, Apellido y Prioridad son obligatorios.");
      return;
    }

    setSaving(true);
    try {
      await updatePaciente(id, {
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fechaNacimiento: paciente.fechaNacimiento,
        sexo: paciente.sexo,
        direccion: paciente.direccion,
        seguro: paciente.seguro,
        triaje: paciente.triaje,
        descripcion: paciente.descripcion,
        caracteristicas: paciente.caracteristicas,
        usuarioId: paciente.usuarioId,
        nombreOperador: paciente.nombreOperador,
        fechaRegistro: paciente.fechaRegistro,
      });
      alert("Paciente actualizado correctamente.");
      navigate("/pacientes");
    } catch (err) {
      console.error("Error actualizando paciente:", err);
      alert("No se pudo actualizar el paciente. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="registrar">
      <h1>✏️ Editar Paciente</h1>
      {loading ? (
        <div className="error-box">Cargando paciente...</div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : (
        <div className="registrar-container">
          <div className="form-section">
            <div className="form-section-title">📋 Datos Personales</div>
            <div className="form-grid">
              <div className="form-group">
                <label>DNI</label>
                <input required placeholder="Documento de identidad" value={paciente.dni} onChange={(e) => handleChange("dni", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input required placeholder="Nombre completo" value={paciente.nombre} onChange={(e) => handleChange("nombre", e.target.value)} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Apellido</label>
                <input required placeholder="Apellido" value={paciente.apellido} onChange={(e) => handleChange("apellido", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" value={paciente.fechaNacimiento} onChange={(e) => handleChange("fechaNacimiento", e.target.value)} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Sexo</label>
                <select value={paciente.sexo} onChange={(e) => handleChange("sexo", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input placeholder="Dirección de residencia" value={paciente.direccion} onChange={(e) => handleChange("direccion", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">⚕️ Información Médica</div>
            <div className="form-grid full">
              <div className="form-group">
                <label>Seguro / Obra Social</label>
                <input placeholder="Tipo de cobertura" value={paciente.seguro} onChange={(e) => handleChange("seguro", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">🏥 Prioridad y Observaciones</div>
            <div className="form-grid full">
              <div className="form-group">
                <label>Prioridad</label>
                <select value={paciente.triaje} onChange={(e) => handleChange("triaje", e.target.value)} required>
                  {PRIORIDAD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-grid full">
              <div className="form-group">
                <label>Descripción</label>
                <textarea placeholder="Descripción general del caso" value={paciente.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} />
              </div>
            </div>
            <div className="form-grid full">
              <div className="form-group">
                <label>Características</label>
                <textarea placeholder="Características adicionales" value={paciente.caracteristicas} onChange={(e) => handleChange("caracteristicas", e.target.value)} />
              </div>
            </div>
          </div>

          <button onClick={handleGuardar} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}
