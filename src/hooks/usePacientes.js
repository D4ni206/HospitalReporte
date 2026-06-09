import { useState, useEffect, useCallback } from "react";
import { fetchPacientes } from "../services/pacientesService";
import { useAuth } from "../context/AuthContext";

const CARPA_STATUS = {
  "Carpa A": "Heridas leves",
  "Carpa B": "Observación",
  "Carpa C": "Urgencias",
  "Carpa D": "Disponible",
};

export function usePacientes(initialSearch = "") {
  const { usuario } = useAuth();
  const [busqueda, setBusqueda] = useState(initialSearch);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshPacientes = useCallback(
    async (searchTerm = busqueda) => {
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
    },
    [usuario]
  );

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      refreshPacientes(busqueda);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [busqueda, refreshPacientes]);

  return { pacientes, loading, error, busqueda, setBusqueda, refreshPacientes };
}
