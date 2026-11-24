import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    const requestedPath = `${location.pathname}${location.search}`;
    const signinUrl =
      requestedPath && requestedPath !== "/dashboard"
        ? `/signin?returnTo=${encodeURIComponent(requestedPath)}`
        : "/signin";
    return <Navigate to={signinUrl} replace />;
  }

  return <>{children}</>;
}
