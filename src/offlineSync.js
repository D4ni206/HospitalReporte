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

const PING_URL = "https://clients3.google.com/generate_204";
const CONNECTION_TIMEOUT = 3000;

// Detectar conexión a internet de forma más confiable
export async function isOnline() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);

    await fetch(PING_URL, {
      method: "GET",
      mode: "no-cors",
      cache: "no-cache",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return true;
  } catch (error) {
    if (typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return false;
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