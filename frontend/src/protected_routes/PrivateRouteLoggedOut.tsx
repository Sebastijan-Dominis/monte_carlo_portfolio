import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteLoggedOutProps {
  children: ReactNode;
}

function PrivateRouteLoggedOut({ children }: PrivateRouteLoggedOutProps) {
  const isAuthenticated = !!localStorage.getItem("token");

  return !isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRouteLoggedOut;
