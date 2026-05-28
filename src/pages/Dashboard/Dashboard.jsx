import { useEffect, useState } from "react";
import "./Dashboard.css";

const carpasData = [
  {
    id: "A",
    status: "Heridas leves",
    count: 0,
    capacity: 500,
    borderColor: "green",
  },
  {
    id: "B",
    status: "Observación",
    count: 82,
    capacity: 120,
    borderColor: "goldenrod",
  },
  {
    id: "C",
    status: "Urgencias",
    count: 18,
    capacity: 60,
    borderColor: "crimson",
  },
  {
    id: "D",
    status: "Disponible",
    count: 12,
    capacity: 170,
    borderColor: "#2a2a2a",
  },
];

export default function Dashboard() {
  const [displayCounts, setDisplayCounts] = useState(
    carpasData.reduce((acc, carpa) => ({ ...acc, [carpa.id]: 0 }), {})
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCounts((prev) => {
        const next = { ...prev };
        let updated = false;

        carpasData.forEach((carpa) => {
          if (prev[carpa.id] < carpa.count) {
            next[carpa.id] = Math.min(prev[carpa.id] + 1, carpa.count);
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
  }, []);

  return (
    <div className="dashboard">
      <div className="content">
        <div className="top">
          <div className="page-title">
            <span className="section-label">HospitalApp</span>
            <h1>Carpas</h1>
            <p className="page-description">
              Monitorea el estado de las carpas en tiempo real y revisa su capacidad actual.
            </p>
          </div>
        </div>

        <div className="carpa-grid">
          {carpasData.map((carpa) => (
            <div key={carpa.id} className="carpa-card" style={{ borderColor: carpa.borderColor }}>
              <div className="carpa-card-header">
                <span className="carpa-label">CARPA {carpa.id}</span>
                <span className="carpa-status">{carpa.status}</span>
              </div>

              <div className="carpa-body">
                <div className="carpa-count-label">conteo</div>
                <div className="carpa-count-value">{displayCounts[carpa.id]} / {carpa.capacity}</div>
              </div>

              <div className="carpa-progress">
                <div
                  className="carpa-progress-fill"
                  style={{
                    width: `${Math.min(100, (displayCounts[carpa.id] / carpa.capacity) * 100)}%`,
                    backgroundColor: carpa.borderColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
