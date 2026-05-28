import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../../supabase/client";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

async function loadPacientes() {
  const { data, error } = await supabase.from("pacientes").select("*");
  if (error) {
    throw error;
  }
  return data || [];
}

export default function ReportePDF({ pacientes }) {
  const generarPDF = async () => {
    let data = pacientes;
    if (!data || data.length === 0) {
      data = await loadPacientes();
    }

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("Hospital Reporte - Pacientes", 20, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 28);

    autoTable(doc, {
      startY: 36,
      head: [[
        "ID",
        "Nombre",
        "Apellido",
        "DNI",
        "Triaje",
        "Descripción",
        "Usuario ID",
        "Operador",
        "Fecha registro",
        "Características"
      ]],
      body: data.map((p) => [
        p.id,
        p.nombre,
        p.apellido,
        p.dni,
        p.triaje,
        p.descripcion,
        p.usuarioId,
        p.nombreperador,
        formatDate(p.fechaRegistro),
        p.caracteristicas,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 59, 99] },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      theme: "striped",
    });

    doc.save("reporte-pacientes.pdf");
  };

  return (
    <button type="button" onClick={generarPDF}>
      Exportar PDF
    </button>
  );
}
