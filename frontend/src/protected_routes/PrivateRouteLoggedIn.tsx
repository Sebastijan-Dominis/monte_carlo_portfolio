import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteLoggedInProps {
  children: ReactNode;
}

function PrivateRouteLoggedIn({ children }: PrivateRouteLoggedInProps) {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRouteLoggedIn;
