import { usePacientes } from "../../hooks/usePacientes";
import PacienteTable from "../../components/PacienteTable";
import "./consultaPaciente.css";

export default function ConsultaPaciente() {
const { pacientes, loading, error, busqueda, setBusqueda } = usePacientes();

return (
<div className="consulta">
<h1>🔍 Consulta pacientes</h1>

<input
className="buscador"
placeholder="Buscar por nombre, apellido o DNI"
value={busqueda}
onChange={(e) => setBusqueda(e.target.value)}
/>

{error && <div className="error-box">{error}</div>}

<div className="tabla">
{loading ? (
<p>Cargando pacientes...</p>
) : (
<PacienteTable pacientes={pacientes} />
)}
</div>
</div>
);
}
