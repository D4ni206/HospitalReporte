import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const carpasConfig = [
  {
    id: "A",
    status: "Heridas leves",
    capacity: 500,
    borderColor: "green",
  },
  {
    id: "B",
    status: "Observación",
    capacity: 120,
    borderColor: "goldenrod",
  },
  {
    id: "C",
    status: "Urgencias",
    capacity: 60,
    borderColor: "crimson",
  },
  {
    id: "D",
    status: "Disponible",
    capacity: 170,
    borderColor: "#2a2a2a",
  },
];

export default function Dashboard() {
  const { usuario } = useAuth();
  const [displayCounts, setDisplayCounts] = useState(
    carpasConfig.reduce((acc, carpa) => ({ ...acc, [carpa.id]: 0 }), {})
  );
  const [actualCounts, setActualCounts] = useState(
    carpasConfig.reduce((acc, carpa) => ({ ...acc, [carpa.id]: 0 }), {})
  );
  const [loading, setLoading] = useState(true);

  // Fetch patient counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        let query = supabase.from("pacientes").select("triaje", { count: "exact" });

        // If user is not admin, filter by operator
        if (usuario?.rol !== "admin") {
          query = query.eq("nombreOperador", usuario?.usuario);
        }

        const { data, error, count } = await query;

        if (error) {
          console.error("Error fetching patient counts:", error);
          return;
        }

        // Count patients by triaje (carpa)
        const counts = carpasConfig.reduce((acc, carpa) => {
          acc[carpa.id] = (data || []).filter(
            (p) => p.triaje && p.triaje.toLowerCase().includes(carpa.status.toLowerCase())
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

      return () => {
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
            {carpasConfig.map((carpa) => (
              <div
                key={carpa.id}
                className="carpa-card"
                style={{ borderColor: carpa.borderColor }}
              >
                <div className="carpa-card-header">
                  <span className="carpa-label">CARPA {carpa.id}</span>
                  <span className="carpa-status">{carpa.status}</span>
                </div>

                <div className="carpa-body">
                  <div className="carpa-count-label">conteo</div>
                  <div className="carpa-count-value">
                    {displayCounts[carpa.id]} / {carpa.capacity}
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
