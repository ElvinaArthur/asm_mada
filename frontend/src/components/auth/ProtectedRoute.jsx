// components/auth/ProtectedRoute.jsx - COMPATIBLE AVEC NEW_AuthContext
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

const ProtectedRoute = ({
  children,
  requireVerification = false,
  adminOnly = false,
}) => {
  const { user, loading } = useAuth(); // ← Utilise 'loading' pas 'isLoading'

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Pas connecté → Redirect login
  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // Admin only
  if (adminOnly && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès restreint
          </h2>
          <p className="text-gray-600 mb-6">
            Cette section est réservée aux administrateurs.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    );
  }

  // Vérification requise
  if (requireVerification && !user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vérification en cours
          </h2>
          <p className="text-gray-600 mb-6">
            Votre compte est en cours de vérification par l'administrateur.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    );
  }

  // Tout est OK → Afficher le contenu
  return children;
};

export default ProtectedRoute;
