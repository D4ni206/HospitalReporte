import { supabase } from "./supabase/client";

const PENDING_KEY = "pendingPacientes";

function safeParse(value) {
  try {
    return JSON.parse(value) || [];
  } catch (error) {
    return [];
  }
}

export function getPendingPacientes() {
  const stored = localStorage.getItem(PENDING_KEY);
  return safeParse(stored);
}

export function savePendingPaciente(paciente) {
  const current = getPendingPacientes();
  const next = [...current, { ...paciente }];
  localStorage.setItem(PENDING_KEY, JSON.stringify(next));
}

export function clearPendingPacientes() {
  localStorage.removeItem(PENDING_KEY);
}

export async function syncPendingPacientes() {
  if (!navigator.onLine) {
    return { synced: false, reason: "offline" };
  }

  const pending = getPendingPacientes();
  if (pending.length === 0) {
    return { synced: true, count: 0 };
  }

  // Sanitizar campos antes de enviar a Supabase
  const sanitized = pending.map((p) => {
    const paciente = { ...p };
    if (paciente.peso === "" || paciente.peso === undefined) paciente.peso = null;
    if (paciente.talla === "" || paciente.talla === undefined) paciente.talla = null;
    if (paciente.fechaNacimiento === "") paciente.fechaNacimiento = null;
    return paciente;
  });

  const { data, error } = await supabase.from("pacientes").insert(sanitized);
  if (error) {
    console.warn("Sync failed", error);
    return { synced: false, reason: error.message || "sync error" };
  }

  clearPendingPacientes()
  return { synced: true, count: pending.length, data };
}