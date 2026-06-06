import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAppStore } from "./store";
import AuthPage from "./components/AuthPage";
import WorkspacePage from "./components/WorkspacePage";

export default function App() {
  const { user, loading, bootstrap } = useAppStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (loading) {
    return (
      <div className="app-loader">
        <LoaderCircle className="spin" size={28} />
        <span>Opening your workspace...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/*"
        element={user ? <WorkspacePage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
