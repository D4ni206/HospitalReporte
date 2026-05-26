/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [usuario, setUsuario] = useState(null);

	async function login(user, pass) {
		const { data, error } = await supabase
			.from("usuarios")
			.select("*")
			.eq("usuario", user)
			.eq("password", pass)
			.maybeSingle();

		if (error || !data) return false;

		setUsuario(data);
		localStorage.setItem("user", JSON.stringify(data));
		return true;
	}

	function logout() {
		setUsuario(null);
		localStorage.removeItem("user");
	}

	return (
		<AuthContext.Provider value={{ usuario, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}