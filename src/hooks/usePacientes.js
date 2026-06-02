import { useState, useEffect } from "react";
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

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const filterByCarpa = usuario && usuario.rol !== "admin" && usuario.carpa && usuario.carpa !== "TODOS";
        const filterStatus = filterByCarpa ? CARPA_STATUS[usuario.carpa] : undefined;
        const data = await fetchPacientes({ search: busqueda, usuario, carpaStatus: filterStatus });
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
  }, [busqueda, usuario]);

  return { pacientes, loading, error, busqueda, setBusqueda };
}
