import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import { savePendingPaciente, syncPendingPacientes, getPendingPacientes } from "../../offlineSync";
import "./registrar.css";

export default function RegistrarPaciente() {
	const { usuario } = useAuth();
	const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
	const [pendingCount, setPendingCount] = useState(getPendingPacientes().length);

	const [nuevo, setNuevo] = useState({
		dni: "",
		nombre: "",
		edad: "",
		sexo: "",
		estado: "",
		carpa: usuario.rol.toLowerCase() === "admin" ? "" : usuario.carpa,
	});

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

	async function guardar() {
		const paciente = {
			...nuevo,
			registrado_por: usuario.usuario,
		};

		const saveLocal = () => {
			savePendingPaciente(paciente);
			setPendingCount(getPendingPacientes().length);
			alert("Sin conexión: el paciente se guardó localmente y se sincronizará cuando haya internet.");
			setNuevo({ dni: "", nombre: "", edad: "", sexo: "", estado: "", carpa: usuario.carpa });
		};

		if (!navigator.onLine) {
			saveLocal();
			return;
		}

		try {
			const { error } = await supabase.from("pacientes").insert([paciente]);
			if (error) {
				console.warn("Error guardando paciente en Supabase", error);
				saveLocal();
				return;
			}

			alert("Paciente registrado correctamente.");
			setNuevo({ dni: "", nombre: "", edad: "", sexo: "", estado: "", carpa: usuario.carpa });
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
			saveLocal();
		}
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
					<button type="button" onClick={async () => {
						const result = await syncPendingPacientes();
						if (result.synced) {
							alert(`Se sincronizaron ${result.count} registro(s) pendientes.`);
							setPendingCount(0);
						} else {
							alert(`No se pudo sincronizar: ${result.reason || 'error'}`);
						}
					}} style={{ marginLeft: 16, padding: "10px 14px", borderRadius: 10, background: "#0b6a4f", color: "white", border: "none", cursor: "pointer" }}>
						Sincronizar ahora
					</button>
				</div>
			)}

			<input
				placeholder="DNI"
				value={nuevo.dni}
				onChange={(e) => setNuevo({ ...nuevo, dni: e.target.value })}
			/>

			<input
				placeholder="Nombre"
				value={nuevo.nombre}
				onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
			/>

			<input
				placeholder="Edad"
				value={nuevo.edad}
				onChange={(e) => setNuevo({ ...nuevo, edad: e.target.value })}
			/>

			<select value={nuevo.sexo} onChange={(e) => setNuevo({ ...nuevo, sexo: e.target.value })}>
				<option value="">Sexo</option>
				<option value="Masculino">Masculino</option>
				<option value="Femenino">Femenino</option>
			</select>

			<select value={nuevo.estado} onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}>
				<option value="">Estado</option>
				<option value="Leve">Leve</option>
				<option value="Moderado">Moderado</option>
				<option value="Crítico">Crítico</option>
			</select>

			{usuario.rol.toLowerCase() === "admin" && (
				<select value={nuevo.carpa} onChange={(e) => setNuevo({ ...nuevo, carpa: e.target.value })}>
					<option value="">CarpaA</option>
					<option value="CarpaB">CarpaB</option>
					<option value="CarpaC">CarpaC</option>
					<option value="CarpaD">CarpaD</option>
				</select>
			)}

			<button onClick={guardar}>Guardar paciente</button>
		</div>
	);
}