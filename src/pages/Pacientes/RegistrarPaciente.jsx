import { useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import "./registrar.css";

export default function RegistrarPaciente() {
	const { usuario } = useAuth();

	const [nuevo, setNuevo] = useState({
		dni: "",
		nombre: "",
		edad: "",
		sexo: "",
		estado: "",
		carpa: usuario.rol.toLowerCase() === "admin" ? "" : usuario.carpa,
	});

	async function guardar() {
		const { error } = await supabase.from("pacientes").insert([
			{
				...nuevo,
				registrado_por: usuario.usuario,
			},
		]);

		if (!error) {
			alert("Paciente registrado");
			setNuevo({ dni: "", nombre: "", edad: "", sexo: "", estado: "", carpa: usuario.carpa });
		}
	}

	return (
		<div className="registrar">
			<h1>➕ Registrar paciente</h1>

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

			<select onChange={(e) => setNuevo({ ...nuevo, sexo: e.target.value })}>
				<option>Sexo</option>
				<option>Masculino</option>
				<option>Femenino</option>
			</select>

			<select onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}>
				<option>Estado</option>
				<option>Leve</option>
				<option>Moderado</option>
				<option>Crítico</option>
			</select>

			{usuario.rol.toLowerCase() === "admin" && (
				<select onChange={(e) => setNuevo({ ...nuevo, carpa: e.target.value })}>
					<option>CarpaA</option>
					<option>CarpaB</option>
					<option>CarpaC</option>
					<option>CarpaD</option>
				</select>
			)}

			<button onClick={guardar}>Guardar paciente</button>
		</div>
	);
}