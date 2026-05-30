/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { supabase } from "../supabase/client";

const defaultAuth = { usuario: null, login: async () => false, logout: () => {} };
const AuthContext = createContext(defaultAuth);

function loadStoredUser() {
	const stored = localStorage.getItem("user");
	if (!stored) return null;
	try {
		return JSON.parse(stored);
	} catch {
		return null;
	}
}

export function AuthProvider({ children }) {
	const [usuario, setUsuario] = useState(loadStoredUser());

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
	return useContext(AuthContext) || defaultAuth;
}