import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const priorityConfig = [
  {
    id: "1",
    label: "Prioridad 1",
    triajeValue: "Prioridad 1",
    capacity: 500,
    borderColor: "crimson",
  },
  {
    id: "2",
    label: "Prioridad 2",
    triajeValue: "Prioridad 2",
    capacity: 500,
    borderColor: "goldenrod",
  },
  {
    id: "3",
    label: "Prioridad 3",
    triajeValue: "Prioridad 3",
    capacity: 500,
    borderColor: "green",
  },
  {
    id: "4",
    label: "Prioridad 4",
    triajeValue: "Prioridad 4",
    capacity: 500,
    borderColor: "#2a2a2a",
  },
];

const PRIORIDAD_STATUS = {
  A: "Prioridad 1",
  B: "Prioridad 2",
  C: "Prioridad 3",
  D: "Prioridad 4",
};

export default function Dashboard() {
  const { usuario } = useAuth();
  const [displayCounts, setDisplayCounts] = useState(
    carpasConfig.reduce((acc, carpa) => ({ ...acc, [carpa.id]: 0 }), {})
  );
  const [actualCounts, setActualCounts] = useState(
    carpasConfig.reduce((acc, carpa) => ({ ...acc, [carpa.id]: 0 }), {})
  );
  const [loading, setLoading] = useState(true);

  const assignedCarpaId = usuario?.carpa?.replace?.("Carpa ", "") || usuario?.carpa;
  const visibleCarpas =
    usuario?.rol !== "admin" && usuario?.carpa && usuario.carpa !== "TODOS"
      ? priorityConfig.filter(
          (priority) => priority.triajeValue === PRIORIDAD_STATUS[assignedCarpaId]
        )
      : priorityConfig;

  // Fetch patient counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        let query = supabase.from("pacientes").select("triaje", { count: "exact" });

        const assignedStatus =
          usuario?.rol !== "admin" && usuario?.carpa && usuario.carpa !== "TODOS"
            ? PRIORIDAD_STATUS[assignedCarpaId]
            : undefined;

        if (assignedStatus) {
          query = query.eq("triaje", assignedStatus);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching patient counts:", error);
          return;
        }

        // Count patients by triaje (prioridad)
        const counts = priorityConfig.reduce((acc, priority) => {
          acc[priority.id] = (data || []).filter(
            (p) => p.triaje === priority.triajeValue
          ).length;
          return acc;
        }, {});

        setActualCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching counts:", error);
        setLoading(false);
      }
    };

    if (usuario?.usuario) {
      fetchCounts();
      // Set up real-time subscription
      const subscription = supabase
        .channel("pacientes-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "pacientes" },
          () => fetchCounts()
        )
        .subscribe();

      const interval = setInterval(() => {
        fetchCounts();
      }, 10000);

      return () => {
        clearInterval(interval);
        subscription.unsubscribe();
      };
    }
  }, [usuario]);

  // Animate count display
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCounts((prev) => {
        const next = { ...prev };
        let updated = false;

        carpasConfig.forEach((carpa) => {
          if (prev[carpa.id] < actualCounts[carpa.id]) {
            next[carpa.id] = Math.min(prev[carpa.id] + 1, actualCounts[carpa.id]);
            updated = true;
          }
        });

        if (!updated) {
          clearInterval(interval);
        }

        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [actualCounts]);

  return (
    <div className="dashboard">
      <div className="content">
        <div className="top">
          <div className="page-title">
            <span className="section-label">HospitalApp</span>
            <h1>Carpas</h1>
            <p className="page-description">
              {usuario?.rol === "admin"
                ? "Conteo total de todas las carpas en tiempo real."
                : `Conteo de carpas del operador: ${usuario?.usuario}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Cargando conteos...</p>
          </div>
        ) : (
          <div className="carpa-grid">
            {visibleCarpas.map((priority) => (
              <div
                key={priority.id}
                className="carpa-card"
                style={{ borderColor: priority.borderColor }}
              >
                <div className="carpa-card-header">
                  <span className="carpa-label">{priority.label}</span>
                  <span className="carpa-status">{priority.triajeValue}</span>
                </div>

                <div className="carpa-body">
                  <div className="carpa-count-label">conteo</div>
                  <div className="carpa-count-value">
                    {displayCounts[priority.id]}/{priority.capacity}
                  </div>
                </div>

                <div className="carpa-progress">
                  <div
                    className="carpa-progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        (displayCounts[carpa.id] / carpa.capacity) * 100
                      )}%`,
                      backgroundColor: carpa.borderColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
