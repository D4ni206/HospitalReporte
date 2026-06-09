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

  const refreshPacientes = useCallback(async (searchTerm = busqueda) => {
    setLoading(true);
    setError(null);

      try {
        const data = await fetchPacientes({ search: busqueda, usuario });
        if (!active) return;
        setPacientes(data);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Error cargando pacientes");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [busqueda, refreshPacientes]);

  return { pacientes, loading, error, busqueda, setBusqueda, refreshPacientes };
}
