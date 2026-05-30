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
	fechaNacimiento: "",
	sexo: "",
	direccion: "",
	telefono: "",
	email: "",
	seguro: "",
	contactoNombre: "",
	contactoTelefono: "",
	triaje: "",
	peso: "",
	talla: "",
	descripcion: "",
	caracteristicas: "",
	alergias: "",
	antecedentes: "",
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
	nombreOperador: usuario?.usuario || "",
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

<input type="date" placeholder="Fecha de nacimiento" value={nuevo.fechaNacimiento} onChange={(e) => setNuevo({ ...nuevo, fechaNacimiento: e.target.value })} />

<select value={nuevo.sexo} onChange={(e) => setNuevo({ ...nuevo, sexo: e.target.value })}>
	<option value="">Sexo</option>
	<option value="M">Masculino</option>
	<option value="F">Femenino</option>
	<option value="O">Otro</option>
</select>

<input placeholder="Teléfono" type="tel" value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} />
<input placeholder="Email" type="email" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} />
<input placeholder="Dirección" value={nuevo.direccion} onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })} />
<input placeholder="Seguro / Obra social" value={nuevo.seguro} onChange={(e) => setNuevo({ ...nuevo, seguro: e.target.value })} />

<input placeholder="Peso (kg)" type="number" value={nuevo.peso} onChange={(e) => setNuevo({ ...nuevo, peso: e.target.value })} />
<input placeholder="Talla (cm)" type="number" value={nuevo.talla} onChange={(e) => setNuevo({ ...nuevo, talla: e.target.value })} />

<input placeholder="Contacto de emergencia - Nombre" value={nuevo.contactoNombre} onChange={(e) => setNuevo({ ...nuevo, contactoNombre: e.target.value })} />
<input placeholder="Contacto de emergencia - Teléfono" value={nuevo.contactoTelefono} onChange={(e) => setNuevo({ ...nuevo, contactoTelefono: e.target.value })} />

<input placeholder="Triaje" value={nuevo.triaje} onChange={(e) => setNuevo({ ...nuevo, triaje: e.target.value })} />

<textarea placeholder="Alergias" value={nuevo.alergias} onChange={(e) => setNuevo({ ...nuevo, alergias: e.target.value })} />
<textarea placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
<textarea placeholder="Antecedentes personales" value={nuevo.antecedentes} onChange={(e) => setNuevo({ ...nuevo, antecedentes: e.target.value })} />
<textarea placeholder="Características" value={nuevo.caracteristicas} onChange={(e) => setNuevo({ ...nuevo, caracteristicas: e.target.value })} />

<button onClick={guardar}>Guardar paciente</button>
</div>
);
}
