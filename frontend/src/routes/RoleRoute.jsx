import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ children, roles }) => {
  const { user } = useAuth();
  return user && roles.includes(user.role) ? children : <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;
