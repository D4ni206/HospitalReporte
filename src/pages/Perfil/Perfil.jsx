import { useAuth } from "../../context/AuthContext";

export default function Perfil() {
	const { usuario } = useAuth();

	return (
		<div>
			<h1>👤 Perfil</h1>
			<h2>Nombre: {usuario?.nombre}</h2>
			<h2>Rol: {usuario?.rol}</h2>
			<h2>Carpa asignada: {usuario?.carpa}</h2>
		</div>
	);
}