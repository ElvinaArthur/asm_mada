// components/layout/Layout.jsx - VERSION AVEC SÉCURITÉ
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header/Navbar";
import Footer from "./Footer/Footer";
import ScrollToTop from "./ScrollToTop";
import CookieModal from "../ui/modals/CookieModal";
import NewsletterModal from "../ui/modals/NewsletterModal";
import { useAuth } from "../../hooks/AuthContext"; // AJOUTEZ CET IMPORT

const Layout = () => {
  const { user, isAdmin, loading } = useAuth(); // AJOUTEZ
  const navigate = useNavigate(); // AJOUTEZ
  const location = useLocation(); // AJOUTEZ

  // ✅ AJOUTEZ CET EFFET POUR SÉCURISER LES ROUTES
  useEffect(() => {
    if (!loading && user) {
      const path = location.pathname;

      // Si admin et essaie d'accéder au dashboard utilisateur
      if (isAdmin && path === "/dashboard") {
        console.log("Admin détecté, redirection vers /admin");
        navigate("/admin", { replace: true });
      }

      // Si utilisateur normal et essaie d'accéder au dashboard admin
      if (!isAdmin && path === "/admin") {
        console.log(
          "Utilisateur non-admin détecté, redirection vers /dashboard",
        );
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, isAdmin, loading, location, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CookieModal />
      <NewsletterModal />
    </div>
  );
};

export default Layout;
