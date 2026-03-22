// frontend/src/pages/VerificationRequired.jsx
import React from "react";
import { ShieldAlert, Clock, Upload, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UploadProof from "../components/verification/UploadProof";

const VerificationRequired = () => {
  const { user } = useAuth();

  const statusMessages = {
    pending: {
      title: "Vérification en attente",
      message:
        "Votre compte est en attente de vérification par un administrateur.",
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
      color: "yellow",
    },
    rejected: {
      title: "Demande rejetée",
      message:
        "Votre demande a été rejetée. Veuillez contacter l'administration.",
      icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
      color: "red",
    },
    default: {
      title: "Vérification requise",
      message:
        "Vous devez soumettre un justificatif pour accéder à la bibliothèque.",
      icon: <ShieldAlert className="w-8 h-8 text-blue-500" />,
      color: "blue",
    },
  };

  const status = user?.status || "default";
  const statusInfo = statusMessages[status] || statusMessages.default;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              {statusInfo.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {statusInfo.title}
            </h1>
            <p className="text-gray-600">{statusInfo.message}</p>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Instructions de vérification :
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-700">
                  Téléchargez votre carte de membre ou certificat d'adhésion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-700">
                  Le document doit être clair et lisible
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-700">
                  Vérification manuelle par un administrateur (24-48h)
                </span>
              </li>
            </ul>
          </div>

          {/* Formulaire d'upload */}
          {status !== "pending" && (
            <div className="mb-8">
              <UploadProof />
            </div>
          )}

          {/* Contact */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>Contact : </span>
              <a
                href="mailto:admin@bibliotheque.com"
                className="text-blue-600 hover:underline"
              >
                admin@bibliotheque.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequired;
