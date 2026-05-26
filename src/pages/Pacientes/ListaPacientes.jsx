import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const { usuario } = useAuth();

  useEffect(() => {
    let mounted = true;
    async function load() {
      let query = supabase.from("pacientes").select("*");
      if (usuario && usuario.rol && usuario.rol.toLowerCase() !== "admin") {
        query = query.eq("carpa", usuario.carpa);
      }
      const { data } = await query;
      if (mounted) setPacientes(data || []);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [usuario]);

  return (
    <div>
      <h1>Pacientes</h1>
      <table>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id || p.nombre}>
              <td>{p.nombre}</td>
              <td>{p.carpa}</td>
              <td>{p.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
