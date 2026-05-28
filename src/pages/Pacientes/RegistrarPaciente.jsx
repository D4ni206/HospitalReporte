import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import { savePendingPaciente, syncPendingPacientes, getPendingPacientes } from "../../offlineSync";
import "./registrar.css";

const createNuevoPaciente = () => ({
dni: "",
nombre: "",
apellido: "",
triaje: "",
descripcion: "",
caracteristicas: "",
});

export default function RegistrarPaciente() {
const { usuario } = useAuth();
const navigate = useNavigate();
const [offlineMode, setOfflineMode] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);
const [pendingCount, setPendingCount] = useState(() => getPendingPacientes().length);
const [nuevo, setNuevo] = useState(createNuevoPaciente());

useEffect(() => {
if (!usuario) {
navigate("/");
}
}, [usuario, navigate]);

useEffect(() => {
const handleOnline = async () => {
setOfflineMode(false);
setPendingCount(getPendingPacientes().length);
const result = await syncPendingPacientes();
if (result.synced && result.count > 0) {
alert(`Se sincronizaron ${result.count} registro(s) pendientes.`);
setPendingCount(0);
} else if (!result.synced && result.reason !== "offline") {
console.warn("Sync error:", result.reason);
}
};

const handleOffline = () => {
setOfflineMode(true);
};

window.addEventListener("online", handleOnline);
window.addEventListener("offline", handleOffline);

return () => {
window.removeEventListener("online", handleOnline);
window.removeEventListener("offline", handleOffline);
};
}, []);

const resetForm = () => {
setNuevo(createNuevoPaciente());
};

const buildPaciente = () => ({
...nuevo,
usuarioId: usuario?.id || usuario?.usuario || "",
nombreperador: usuario?.usuario || "",
fechaRegistro: new Date().toISOString().slice(0, 10),
});

const saveLocal = (paciente) => {
savePendingPaciente(paciente);
setPendingCount(getPendingPacientes().length);
alert("Sin conexión: el paciente se guardó localmente y se sincronizará cuando haya internet.");
resetForm();
};

async function guardar() {
const paciente = buildPaciente();

if (!navigator.onLine) {
saveLocal(paciente);
return;
}

try {
const { error } = await supabase.from("pacientes").insert([paciente]);
if (error) {
console.warn("Error guardando paciente en Supabase", error);
saveLocal(paciente);
return;
}

alert("Paciente registrado correctamente.");
resetForm();
setPendingCount(getPendingPacientes().length);
if (getPendingPacientes().length > 0) {
const result = await syncPendingPacientes();
if (result.synced && result.count > 0) {
alert(`Se sincronizaron ${result.count} registro(s) pendientes.`);
setPendingCount(0);
}
}
} catch (error) {
console.warn("Error de red o servidor al guardar paciente", error);
saveLocal(paciente);
}
}

if (!usuario) {
return (
<div className="registrar">
<h1>➕ Registrar paciente</h1>
<p>Cargando usuario...</p>
</div>
);
}

return (
<div className="registrar">
<h1>➕ Registrar paciente</h1>
{offlineMode && (
<div className="offline-banner">
Sin conexión. Los nuevos registros se guardan localmente.
{pendingCount > 0 && ` (${pendingCount} pendiente${pendingCount > 1 ? "s" : ""})`}
</div>
)}
{pendingCount > 0 && !offlineMode && (
<div className="offline-banner" style={{ background: "#d1f7dc", color: "#166534", borderColor: "#a7f3d0" }}>
Hay {pendingCount} registro(s) pendientes por sincronizar.
<button
type="button"
onClick={async () => {
const result = await syncPendingPacientes();
if (result.synced) {
alert(`Se sincronizaron ${result.count} registro(s) pendientes.`);
setPendingCount(0);
} else {
alert(`No se pudo sincronizar: ${result.reason || 'error'}`);
}
}}
style={{ marginLeft: 16, padding: "10px 14px", borderRadius: 10, background: "#0b6a4f", color: "white", border: "none", cursor: "pointer" }}
>
Sincronizar ahora
</button>
</div>
)}

<input placeholder="DNI" value={nuevo.dni} onChange={(e) => setNuevo({ ...nuevo, dni: e.target.value })} />
<input placeholder="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
<input placeholder="Apellido" value={nuevo.apellido} onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })} />
<input placeholder="Triaje" value={nuevo.triaje} onChange={(e) => setNuevo({ ...nuevo, triaje: e.target.value })} />

<textarea placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
<textarea placeholder="Características" value={nuevo.caracteristicas} onChange={(e) => setNuevo({ ...nuevo, caracteristicas: e.target.value })} />

<button onClick={guardar}>Guardar paciente</button>
</div>
);
}
