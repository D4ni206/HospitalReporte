import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
	const [usuario, setUsuario] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	async function ingresar() {
		const ok = await login(usuario, password);
		if (ok) navigate("/dashboard");
		else alert("Usuario incorrecto");
	}

	return (
		<div>
			<input placeholder="usuario" onChange={(e) => setUsuario(e.target.value)} />
			<input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
			<button onClick={ingresar}>Ingresar</button>
		</div>
	);
}