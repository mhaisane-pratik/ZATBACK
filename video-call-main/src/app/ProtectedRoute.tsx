import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  // 🔥 DEV MODE: allow access
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
