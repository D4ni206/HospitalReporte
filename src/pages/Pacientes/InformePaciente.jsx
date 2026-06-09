import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { fetchPacienteById } from "../../services/pacientesService";
import "./consultaPaciente.css";

export default function InformePaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState(true);
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
          return;
        }
        setPaciente(loaded);
      } catch (err) {
        setError(err?.message || "Error cargando paciente.");
      } finally {
        setLoading(false);
      }
    }

    loadPaciente();
  }, [id]);

  const generarInforme = () => {
    if (!paciente) return;

    const doc = new jsPDF();
    const title = `Informe personal - ${paciente.nombre || "Paciente"} ${paciente.apellido || ""}`;
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    doc.text(`DNI: ${paciente.dni || "N/A"}`, 20, 32);
    doc.text(`Triaje: ${paciente.triaje || "N/A"}`, 20, 40);
    doc.text(`Operador: ${paciente.nombreOperador || paciente.nombreperador || "N/A"}`, 20, 48);

    const content = nota.trim() || "Sin contenido adicional.";
    const wrappedContent = doc.splitTextToSize(content, 170);
    doc.text("Informe:", 20, 60);
    doc.text(wrappedContent, 20, 70);
    doc.save(`informe-personal-${paciente.dni || paciente.id || "paciente"}.pdf`);
  };

  return (
    <div className="consulta">
      <div className="tabla">
        <button onClick={() => navigate("/pacientes")} style={{ marginBottom: "20px" }}>
          ← Volver a pacientes
        </button>
        <h1>📝 Informe personal</h1>
        {loading ? (
          <p>Cargando paciente...</p>
        ) : error ? (
          <p className="error-box">{error}</p>
        ) : (
          <>
            <p>
              <strong>Paciente:</strong> {paciente.nombre} {paciente.apellido}
            </p>
            <p>
              <strong>DNI:</strong> {paciente.dni}
            </p>
            <p>
              <strong>Triaje:</strong> {paciente.triaje}
            </p>
            <textarea
              className="buscador"
              rows="10"
              placeholder="Escribe aquí el informe personal del paciente..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              style={{ minHeight: "220px", resize: "vertical" }}
            />
            <button onClick={generarInforme} style={{ marginTop: "16px" }}>
              Generar PDF del informe
            </button>
          </>
        )}
      </div>
    </div>
  );
}
