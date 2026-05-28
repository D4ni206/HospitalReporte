import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { syncPendingPacientes } from "./offlineSync";

export default function App() {
  useEffect(() => {
    syncPendingPacientes();

    const handleOnline = () => {
      syncPendingPacientes();
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}