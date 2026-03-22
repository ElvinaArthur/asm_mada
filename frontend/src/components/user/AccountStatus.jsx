import React from "react";
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { SlideUp } from "../ui/animations/index";
import { useAuth } from "../../hooks/AuthContext";

const AccountStatus = () => {
  const { user } = useAuth();

  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculer la date d'expiration (1 an après inscription)
  const getExpirationDate = () => {
    if (!user?.memberSince) return "Non disponible";
    const start = new Date(user.memberSince);
    const expiration = new Date(start);
    expiration.setFullYear(expiration.getFullYear() + 1);
    return formatDate(expiration);
  };

  return (
    <SlideUp>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-3 text-asm-green-500" />
          Statut du compte
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Adhésion</span>
            <span className="font-medium text-gray-900">Annuelle</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date d'inscription</span>
            <span className="font-medium text-gray-900">
              {formatDate(user?.memberSince || user?.createdAt)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Expire le</span>
            <span className="font-medium text-gray-900">
              {getExpirationDate()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Niveau d'accès</span>
            <span className="font-medium text-asm-green-600">
              {user?.role === "admin" ? "Administrateur" : "Membre"}
            </span>
          </div>
        </div>

        {user?.isVerified === 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-yellow-600 mb-3">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">En attente de vérification</span>
            </div>
            <p className="text-sm text-gray-600">
              Votre compte est en cours de vérification par un administrateur.
            </p>
          </div>
        )}

        {user?.isVerified === 1 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-green-600 mb-3">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Compte vérifié</span>
            </div>
            <p className="text-sm text-gray-600">
              Vous avez accès à toutes les fonctionnalités.
            </p>
          </div>
        )}
      </div>
    </SlideUp>
  );
};

export default AccountStatus;
