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
    const width = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(22, 59, 99);
    doc.rect(0, 0, width, 60, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Informe personal", 20, 38);

    // Paciente y datos clave
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Paciente: ${paciente.nombre || "N/A"} ${paciente.apellido || ""}`.trim(), 20, 52);
    doc.text(`DNI: ${paciente.dni || "N/A"}`, 120, 52);
    doc.text(`Triaje: ${paciente.triaje || "N/A"}`, 20, 64);
    doc.text(`Operador: ${paciente.nombreOperador || paciente.nombreperador || "N/A"}`, 120, 64);

    // Sección de caso
    doc.setTextColor(22, 59, 99);
    doc.setFontSize(14);
    doc.text("Resumen del caso", 20, 88);
    doc.setFontSize(12);
    const descripcion = paciente.descripcion?.trim() || "No hay descripción del caso.";
    const descripcionLines = doc.splitTextToSize(descripcion, width - 40);
    doc.text(descripcionLines, 20, 100);

    let currentY = 100 + descripcionLines.length * 7 + 16;
    doc.setFontSize(14);
    doc.text("Características", 20, currentY);
    doc.setFontSize(12);
    const caracteristicas = paciente.caracteristicas?.trim() || "No se informaron características.";
    const caracteristicasLines = doc.splitTextToSize(caracteristicas, width - 40);
    doc.text(caracteristicasLines, 20, currentY + 12);

    currentY += 12 + caracteristicasLines.length * 7 + 16;
    doc.setFillColor(245, 248, 252);
    doc.rect(20, currentY, width - 40, 100, "F");
    doc.setTextColor(22, 59, 99);
    doc.setFontSize(14);
    doc.text("Observaciones personales", 26, currentY + 18);

    doc.setFontSize(12);
    const notaContent = nota.trim() || "Sin contenido adicional.";
    const notaLines = doc.splitTextToSize(notaContent, width - 52);
    doc.text(notaLines, 26, currentY + 34);

    doc.save(`informe-personal-${paciente.dni || paciente.id || "paciente"}.pdf`);
  };

  return (
    <div className="consulta informe-page">
      <div className="informe-header">
        <button className="back-button" onClick={() => navigate("/pacientes")}>
          ← Volver a pacientes
        </button>
        <div>
          <h1>📝 Informe personal</h1>
          <p className="subtitle">Formato claro y moderno con detalles del caso, descripción y características.</p>
        </div>
      </div>

      <div className="informe-body">
        {loading ? (
          <p>Cargando paciente...</p>
        ) : error ? (
          <p className="error-box">{error}</p>
        ) : (
          <>
            <section className="info-card">
              <div className="card-title">Datos del paciente</div>
              <div className="info-grid">
                <div className="info-item">
                  <span>Nombre</span>
                  <strong>{paciente.nombre} {paciente.apellido}</strong>
                </div>
                <div className="info-item">
                  <span>DNI</span>
                  <strong>{paciente.dni || "N/A"}</strong>
                </div>
                <div className="info-item">
                  <span>Triaje</span>
                  <strong>{paciente.triaje || "N/A"}</strong>
                </div>
                <div className="info-item">
                  <span>Operador</span>
                  <strong>{paciente.nombreOperador || paciente.nombreperador || "N/A"}</strong>
                </div>
              </div>
            </section>

            <section className="case-card">
              <div className="card-title">Resumen del caso</div>
              <p>{paciente.descripcion?.trim() || "No hay descripción del caso."}</p>
            </section>

            <section className="case-card">
              <div className="card-title">Características</div>
              <p>{paciente.caracteristicas?.trim() || "No se informaron características."}</p>
            </section>

            <section className="report-card">
              <div className="card-title">Informe personal</div>
              <textarea
                className="informe-textarea"
                rows="10"
                placeholder="Redacta aquí el informe personal del paciente..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
              <button className="generate-button" onClick={generarInforme}>
                Generar PDF del informe
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
