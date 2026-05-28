import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "../../supabase/client";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function buildRows(data = []) {
  return data.map((p) => ({
    ID: p.id,
    Nombre: p.nombre,
    Apellido: p.apellido,
    DNI: p.dni,
    Triaje: p.triaje,
    Descripción: p.descripcion,
    UsuarioID: p.usuarioId,
    NombreOperador: p.nombreperador,
    FechaRegistro: formatDate(p.fechaRegistro),
    Características: p.caracteristicas,
  }));
}

async function loadPacientes() {
  const { data, error } = await supabase.from("pacientes").select("*");
  if (error) {
    throw error;
  }
  return data || [];
}

export default function ReporteExcel({ pacientes }) {
  const generarExcel = async () => {
    let data = pacientes;
    if (!data || data.length === 0) {
      data = await loadPacientes();
    }

    const rows = buildRows(data);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "pacientes.xlsx");
  };

  return (
    <button type="button" onClick={generarExcel}>
      Exportar Excel
    </button>
  );
}
