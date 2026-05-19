import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";


export function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

