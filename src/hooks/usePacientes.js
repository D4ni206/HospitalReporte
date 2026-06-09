import { useState, useEffect, useCallback } from "react";
import { fetchPacientes } from "../services/pacientesService";
import { useAuth } from "../context/AuthContext";

export function usePacientes(initialSearch = "") {
  const { usuario } = useAuth();
  const [busqueda, setBusqueda] = useState(initialSearch);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshPacientes = useCallback(async (searchTerm = busqueda) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPacientes({ search: searchTerm, usuario });
      setPacientes(data);
    } catch (err) {
      setError(err?.message || "Error cargando pacientes");
    } finally {
      setLoading(false);
    }
  }, [busqueda, usuario]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      await refreshPacientes(busqueda);
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [busqueda, refreshPacientes]);

  return { pacientes, loading, error, busqueda, setBusqueda, refreshPacientes };
}
