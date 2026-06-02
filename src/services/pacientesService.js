import { supabase } from "../supabase/client";

export async function fetchPacientes({ search = "", usuario = null, carpaStatus } = {}) {
  let query = supabase.from("pacientes").select("*").order("id", { ascending: false }).limit(500);

  // Filter by assigned carpa for non-admin users
  if (carpaStatus) {
    query = query.eq("triaje", carpaStatus);
  }

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
