// components/auth/AdminProtectedRoute.jsx - VERSION CORRIGÉE
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FadeIn } from "../ui/animations/index";
import { useAuth } from "../../hooks/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Afficher le loading tant que l'authentification n'est pas vérifiée
  if (loading) {
    return (
      <FadeIn>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification des autorisations...</p>
          </div>
        </div>
      </FadeIn>
    );
  }

  // DEBUG - Ajoutez ces logs pour voir ce qui se passe
  console.log("=== AdminProtectedRoute DEBUG ===");
  console.log("user:", user);
  console.log("user?.role:", user?.role);
  console.log("isAdmin:", isAdmin);
  console.log("location.pathname:", location.pathname);
  console.log("================================");

  // Si pas d'utilisateur, rediriger vers login
  if (!user) {
    console.log("REDIRECTION: Aucun utilisateur connecté");
    return (
      <Navigate
        to={`/auth?mode=login&redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Si utilisateur n'est pas admin
  if (!isAdmin) {
    console.log("REDIRECTION: Utilisateur n'est pas admin. Rôle:", user?.role);

    // Afficher une page d'erreur au lieu de rediriger vers l'accueil
    return (
      <FadeIn>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-red-600">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Accès administrateur requis
            </h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Vous tentez d'accéder à une page réservée aux administrateurs.
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  Votre rôle actuel:{" "}
                  <span className="font-semibold">
                    {user?.role || "utilisateur"}
                  </span>
                </p>
                <p>
                  Email: <span className="font-semibold">{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                ← Retour à la page précédente
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Aller à l'accueil
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Tableau de bord utilisateur
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Si vous devriez avoir accès à cette page, contactez un
                administrateur.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  // DEBUG - Si tout est bon
  console.log("ACCÈS AUTORISÉ: Utilisateur est admin");

  return children;
};

export default AdminProtectedRoute;
