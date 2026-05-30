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

// Detectar conexión a internet de forma más confiable
export async function isOnline() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch("http://www.google.com/favicon.ico", { 
      method: "HEAD", 
      mode: "no-cors",
      signal: controller.signal 
    });
    clearTimeout(timeout);
    return true;
  } catch {
    // Si falla, confía en navigator.onLine
    return navigator.onLine;
  }
}

export async function syncPendingPacientes() {
  const online = await isOnline();
  if (!online) {
    return { synced: false, reason: "offline" };
  }

  const pending = getPendingPacientes();
  if (pending.length === 0) {
    return { synced: true, count: 0 };
  }

  try {
    // Sanitizar campos vacíos
    const sanitized = pending.map((p) => {
      const paciente = { ...p };
      if (paciente.fechaNacimiento === "") paciente.fechaNacimiento = null;
      return paciente;
    });

    const { data, error } = await supabase.from("pacientes").insert(sanitized);
    if (error) {
      console.warn("Sync failed", error);
      return { synced: false, reason: error.message || "sync error" };
    }

    clearPendingPacientes();
    return { synced: true, count: pending.length, data };
  } catch (error) {
    console.error("Sync error:", error);
    return { synced: false, reason: error.message || "unknown error" };
  }
}