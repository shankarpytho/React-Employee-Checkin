import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const role = localStorage.getItem("role"); // Get the user role

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role if necessary
  if (role === "admin" && window.location.pathname === "/home") {
    return <Navigate to="/employee-history" replace />;
  } else if (role === "employee" && window.location.pathname === "/employee-history") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
