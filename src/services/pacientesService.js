import { supabase } from "../supabase/client";

export async function fetchPacientes({ search = "", usuario = null } = {}) {
  let query = supabase.from("pacientes").select("*").order("id", { ascending: false }).limit(500);

  // Filter by operator if user is not admin
  if (usuario && usuario.rol !== "admin") {
    query = query.eq("nombreOperador", usuario.usuario);
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

export async function fetchPacienteById(id) {
  const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).single();
  if (error) {
    throw error;
  }
  return data || null;
}

export async function updatePaciente(id, updates) {
  const { data, error } = await supabase.from("pacientes").update(updates).eq("id", id);
  if (error) {
    throw error;
  }
  return data || [];
}

export async function deletePaciente(id) {
  const { error } = await supabase.from("pacientes").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return true;
}
