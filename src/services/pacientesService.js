import { supabase } from "../supabase/client";

export async function fetchPacientes({ search = "" } = {}) {
  let query = supabase.from("pacientes").select("*").order("id", { ascending: false }).limit(500);

  if (search.trim()) {
    const term = search.trim().replace(/%/g, "\\%");
    const filter = `nombre.ilike.%${term}%,apellido.ilike.%${term}%,dni.ilike.%${term}%`;
    query = query.or(filter);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data || [];
}
