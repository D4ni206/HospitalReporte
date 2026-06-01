import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import "./Login.css";

export default function Login() {
	const [usuario, setUsuario] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();
	const userRef = useRef(null);

	async function ingresar(e) {
		e.preventDefault(); // Evita que la página se recargue por defecto
		const ok = await login(usuario, password);
		if (ok) navigate("/dashboard");
		else alert("Usuario o contraseña incorrectos");
	}

	useEffect(() => {
		// intenta limpiar cualquier autofill al montar
		try {
			if (userRef && userRef.current) userRef.current.value = "";
			setUsuario("");
		} catch (e) {
			/* no hacer nada */
		}
	}, []);

	return (
		<div className="split-login-screen">
			<div className="split-login-left">
				<div className="hospital-logo-container">
					<img src={logo} alt="Logo Hospital" className="hospital-logo-web" />
				</div>

				<div className="left-text-footer">
					<span className="app-badge">HOSPITAL SAN JUAN DE DIOS</span>
					<h1>SISTEMA DE INFORMES EMERGENCIA, SISMO</h1>
				</div>

				<div style={{ height: 24 }} />
			</div>

			<div className="split-login-right">
				<div className="right-content">
					<div className="form-card">
						<div className="logo-center">
							<img src={logo} alt="Logo Hospital" className="hospital-logo-web" />
						</div>

						<form className="hospital-form-split" onSubmit={ingresar}>
							<div className="form-input-wrapper">
								<label>Usuario</label>
								<input
									placeholder="usuario@ejemplo.com"
									value={usuario} // Usar 'value' en lugar de 'defaultValue' para controlarlo con useState
									onChange={(e) => setUsuario(e.target.value)}
									autoComplete="off"
									ref={userRef}
								/>
							</div>

							<div className="form-input-wrapper">
								<label>Contraseña</label>
								<input
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div className="form-input-wrapper" style={{ marginTop: "16px" }}>
								<button type="submit" className="btn-submit-split">
									Ingresar
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}