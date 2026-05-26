import { useEffect, useState } from "react";
import "./consultaPaciente.css";

export default function ConsultaPaciente() {
	const [pacientes, setPacientes] = useState([]);
	const [busqueda, setBusqueda] = useState("");

	useEffect(() => {
		fetch("https://randomuser.me/api/?results=50")
			.then((r) => r.json())
			.then((data) => {
				setPacientes(data.results);
			});
	}, []);

	const filtrados = pacientes.filter((p) =>
		(p.name.first + " " + p.name.last).toLowerCase().includes(busqueda.toLowerCase())
	);

	return (
		<div className="consulta">
			<h1>🔍 Consulta pacientes</h1>

			<input
				className="buscador"
				placeholder="Buscar paciente..."
				value={busqueda}
				onChange={(e) => setBusqueda(e.target.value)}
			/>

			<div className="tabla">
				<table>
					<thead>
						<tr>
							<th>Foto</th>
							<th>Nombre</th>
							<th>Correo</th>
							<th>Edad</th>
							<th>Ciudad</th>
						</tr>
					</thead>
					<tbody>
						{filtrados.map((p, i) => (
							<tr key={i}>
								<td>
									<img src={p.picture.thumbnail} />
								</td>
								<td>
									{p.name.first} {p.name.last}
								</td>
								<td>{p.email}</td>
								<td>{p.dob.age}</td>
								<td>{p.location.city}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}