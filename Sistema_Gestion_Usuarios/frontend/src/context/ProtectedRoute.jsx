import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // 👈 ruta corregida

export default function ProtectedRoute({ children, rol }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ textAlign: "center" }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />; // No logueado
  if (rol && user.Id_Rol !== rol) return <Navigate to="/" replace />; // Rol no permitido

  return children;
}
