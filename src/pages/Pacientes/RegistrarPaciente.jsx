import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import "./registrar.css";

const PRIORIDAD_OPTIONS = [
	{ value: "", label: "Seleccionar prioridad..." },
	{ value: "Heridas leves", label: "Heridas leves" },
	{ value: "Observación", label: "Observación" },
	{ value: "Urgencias", label: "Urgencias" },
	{ value: "Disponible", label: "Disponible" },
];

const createNuevoPaciente = () => ({
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
});

export default function RegistrarPaciente() {
	const { usuario } = useAuth();
	const assignedPriority = usuario?.rol !== "admin" ? (usuario?.prioridad || usuario?.triaje || "") : "";
	const prioridadOptions = assignedPriority && !PRIORIDAD_OPTIONS.some((option) => option.value === assignedPriority)
		? [...PRIORIDAD_OPTIONS, { value: assignedPriority, label: assignedPriority }]
		: PRIORIDAD_OPTIONS;
	const navigate = useNavigate();
	const [nuevo, setNuevo] = useState(createNuevoPaciente());
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!usuario) {
			navigate("/");
		}
		if (usuario?.rol !== "admin") {
			const assignedPriority = usuario?.prioridad || usuario?.triaje || "";
			if (assignedPriority) {
				setNuevo((prev) => ({ ...prev, triaje: assignedPriority }));
			}
		}
	}, [usuario, navigate]);

	const resetForm = () => {
		setNuevo(createNuevoPaciente());
	};

	const buildPaciente = () => ({
		...nuevo,
		usuarioId: usuario?.id || usuario?.usuario || "",
		nombreOperador: usuario?.usuario || "",
		fechaRegistro: new Date().toISOString().slice(0, 10),
	});

	async function guardar() {
		setLoading(true);
		const paciente = buildPaciente();

		if (!paciente.dni?.trim() || !paciente.nombre?.trim() || !paciente.apellido?.trim() || !paciente.triaje?.trim()) {
			alert("Los campos DNI, Nombre, Apellido y Prioridad son obligatorios.");
			setLoading(false);
			return;
		}

		try {
			const { error } = await supabase.from("pacientes").insert([paciente]);
			if (error) {
				console.warn("Error guardando paciente en Supabase", error);
				alert("Ocurrió un error al guardar el paciente.");
				setLoading(false);
				return;
			}

			alert("Paciente registrado correctamente.");
			resetForm();
		} catch (error) {
			console.warn("Error de red o servidor al guardar paciente", error);
			alert("Ocurrió un error al guardar el paciente.");
		} finally {
			setLoading(false);
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
		

			<h1>➕ Registrar Paciente</h1>

			<div className="registrar-container">
				{/* Datos Personales */}
				<div className="form-section">
					<div className="form-section-title">📋 Datos Personales</div>
					<div className="form-grid">
						<div className="form-group">
							<label>DNI</label>
							<input required placeholder="Documento de identidad" value={nuevo.dni} onChange={(e) => setNuevo({ ...nuevo, dni: e.target.value })} />
						</div>
						<div className="form-group">
							<label>Nombre</label>
							<input required placeholder="Nombre completo" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
						</div>
					</div>
					<div className="form-grid">
						<div className="form-group">
							<label>Apellido</label>
							<input required placeholder="Apellido" value={nuevo.apellido} onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })} />
						</div>
						<div className="form-group">
							<label>Fecha de Nacimiento</label>
							<input type="date" value={nuevo.fechaNacimiento} onChange={(e) => setNuevo({ ...nuevo, fechaNacimiento: e.target.value })} />
						</div>
					</div>
					<div className="form-grid">
						<div className="form-group">
							<label>Sexo</label>
							<select value={nuevo.sexo} onChange={(e) => setNuevo({ ...nuevo, sexo: e.target.value })}>
								<option value="">Seleccionar...</option>
								<option value="M">Masculino</option>
								<option value="F">Femenino</option>
								<option value="O">Otro</option>
							</select>
						</div>
						<div className="form-group">
							<label>Dirección</label>
							<input placeholder="Dirección de residencia" value={nuevo.direccion} onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })} />
						</div>
					</div>
				</div>

				{/* Información Médica y Seguro */}
				<div className="form-section">
					<div className="form-section-title">⚕️ Información Médica</div>
					<div className="form-grid full">
						<div className="form-group">
							<label>Seguro / Obra Social</label>
							<input placeholder="Tipo de cobertura" value={nuevo.seguro} onChange={(e) => setNuevo({ ...nuevo, seguro: e.target.value })} />
						</div>
					</div>
				</div>

				{/* Triaje y Observaciones */}
				<div className="form-section">
						<div className="form-section-title">🏥 Prioridad y Observaciones</div>
						<div className="form-grid full">
							<div className="form-group">
								<label>Prioridad</label>
								<select
									value={nuevo.triaje}
									onChange={(e) => setNuevo({ ...nuevo, triaje: e.target.value })}
									required
									disabled={usuario?.rol !== "admin" && !!assignedPriority}
								>
									{prioridadOptions.map((option) => (
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
							<textarea placeholder="Descripción general del caso" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
						</div>
					</div>
					<div className="form-grid full">
						<div className="form-group">
							<label>Características</label>
							<textarea placeholder="Características adicionales" value={nuevo.caracteristicas} onChange={(e) => setNuevo({ ...nuevo, caracteristicas: e.target.value })} />
						</div>
					</div>
				</div>

				<button onClick={guardar} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
					{loading ? "⏳ Guardando..." : "💾 Guardar Paciente"}
				</button>
			</div>
		</div>
	);
}
