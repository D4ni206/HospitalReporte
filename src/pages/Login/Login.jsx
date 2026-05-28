import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
	const [usuario, setUsuario] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();
	const userRef = useRef(null);

	async function ingresar() {
		const ok = await login(usuario, password);
		if (ok) navigate("/dashboard");
		else alert("Usuario incorrecto");
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
					<img src="../assets/logo.png" alt="logo" className="hospital-logo-web" />
				</div>

				<div className="left-text-footer">
					<span className="app-badge">HOSPITAL SAN JUAN DE DIOS</span>
					<h1>SISTEMA DE INFORMAS </h1>
				</div>

				<div style={{ height: 24 }} />
			</div>

			<div className="split-login-right">
				<div className="right-content">
					<div className="form-card">
						<div className="logo-center">
							<img src="/logo.png" alt="logo" className="hospital-logo-web" />
						</div>

						<div className="hospital-form-split">
							<div className="form-input-wrapper">
								<label>Usuario</label>
								<input
									placeholder="usuario@ejemplo.com"
									defaultValue={usuario}
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

							<div style={{ marginBottom: 12 }}>
								<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
									<input type="checkbox" /> <span style={{ fontSize: 14 }}>Acepto la política de privacidad</span>
								</label>
							</div>

							<button className="btn-submit-split" onClick={ingresar}>
								Ingresar
							</button>

							<div className="footer-text-split">Step 1/3</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}