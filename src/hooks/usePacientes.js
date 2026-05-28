import { useState, useEffect } from "react";
import { fetchPacientes } from "../services/pacientesService";

export function usePacientes(initialSearch = "") {
  const [busqueda, setBusqueda] = useState(initialSearch);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPacientes({ search: busqueda });
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
  }, [busqueda]);

  return { pacientes, loading, error, busqueda, setBusqueda };
}
