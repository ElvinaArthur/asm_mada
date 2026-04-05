// src/pages/auth/VerificationPending.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Mail, RefreshCw, LogOut } from "lucide-react";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";

const VerificationPending = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Erreur parsing user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const checkVerificationStatus = async () => {
    try {
      setCheckingStatus(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth?mode=login");
        return;
      }

      const response = await fetch(
        "http://https://asm-mada.onrender.com/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.user.isVerified) {
          // L'utilisateur est vérifié, rediriger vers le dashboard
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else if (data.success && !data.user.isVerified) {
          // Toujours en attente
          alert("Votre compte est toujours en attente de vérification.");
        }
      }
    } catch (error) {
      console.error("Erreur vérification statut:", error);
      alert("Erreur lors de la vérification du statut");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth?mode=login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Compte en attente de vérification
            </h1>
            <p className="text-gray-600">
              Bonjour <span className="font-semibold">{user?.firstName}</span>,
              votre compte est actuellement en cours de vérification.
            </p>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Prochaines étapes :
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <span>Votre inscription a été reçue avec succès</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <span>
                  Un administrateur vérifie votre justificatif d'adhésion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <span>
                  Vous recevrez un email de confirmation une fois vérifié
                </span>
              </li>
            </ul>
          </div>

          {/* Délai estimé */}
          <div className="border-t border-b py-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Délai estimé</p>
              <p className="text-lg font-semibold text-gray-900">
                24 à 48 heures
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Vous pouvez vérifier votre statut en rafraîchissant cette page
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Mail className="w-5 h-5" />
              <span>Questions ? Contactez-nous :</span>
            </div>
            <a
              href="mailto:admin@asm-alumni.com"
              className="block text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              admin@asm-alumni.com
            </a>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <PrimaryButton
              onClick={checkVerificationStatus}
              disabled={checkingStatus}
              className="w-full py-3"
            >
              {checkingStatus ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Vérification...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Vérifier mon statut
                </div>
              )}
            </PrimaryButton>
            <SecondaryButton onClick={handleLogout} className="w-full py-3">
              <div className="flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                Se déconnecter
              </div>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
