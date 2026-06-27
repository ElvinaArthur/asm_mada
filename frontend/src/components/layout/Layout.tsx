'use client';
// components/layout/Layout.tsx - VERSION NEXT.JS APP ROUTER
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "./Header/Navbar";
import Footer from "./Footer/Footer";
import ScrollToTop from "./ScrollToTop";
import CookieModal from "../ui/modals/CookieModal";
import NewsletterModal from "../ui/modals/NewsletterModal";
import { useAuth } from "../../hooks/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth() as { user: unknown; isAdmin: boolean; loading: boolean };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user) {
      // Si admin et essaie d'accéder au dashboard utilisateur
      if (isAdmin && pathname === "/dashboard") {
        console.log("Admin détecté, redirection vers /admin");
        router.replace("/admin");
      }

      // Si utilisateur normal et essaie d'accéder au dashboard admin
      if (!isAdmin && pathname === "/admin") {
        console.log("Utilisateur non-admin détecté, redirection vers /dashboard");
        router.replace("/dashboard");
      }
    }
  }, [user, isAdmin, loading, router, pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <CookieModal />
      <NewsletterModal />
    </div>
  );
};

export default Layout;
