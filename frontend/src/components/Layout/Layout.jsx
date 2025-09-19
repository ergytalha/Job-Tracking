import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { useAuth } from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Login ve unauthorized sayfalarında Navigation gözükmesin
  const shouldShowNavigation = user && !['/login', '/unauthorized'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavigation && <Navigation />}
      <main className={shouldShowNavigation ? "p-4" : ""}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 