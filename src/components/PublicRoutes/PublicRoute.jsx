import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const isAuthenticated = document.cookie.includes("token");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
