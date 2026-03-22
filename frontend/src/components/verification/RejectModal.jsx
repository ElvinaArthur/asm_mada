import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const RejectModal = ({ isOpen, onClose, userToReject, onReject }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !userToReject) return null;

  const rejectionReasons = [
    {
      id: "unreadable",
      label: "📸 Document illisible ou flou",
      description:
        "La qualité de l'image ne permet pas de vérifier les informations",
    },
    {
      id: "invalid",
      label: "❌ Justificatif non valide",
      description: "Document expiré, incorrect ou non conforme",
    },
    {
      id: "incomplete",
      label: "📝 Informations manquantes",
      description:
        "Le document ne contient pas toutes les informations requises",
    },
    {
      id: "duplicate",
      label: "👥 Compte déjà existant",
      description: "Un compte avec ces informations existe déjà",
    },
    {
      id: "not_alumni",
      label: "🎓 Non sociologue/Non alumni",
      description:
        "Le justificatif ne prouve pas l'appartenance à l'association",
    },
    {
      id: "fake",
      label: "⚠️ Document falsifié",
      description: "Le document semble avoir été modifié ou falsifié",
    },
    {
      id: "other",
      label: "🔧 Autre raison",
      description: "Précisez la raison du rejet",
    },
  ];

  const handleSubmit = async () => {
    const finalReason =
      selectedReason === "other"
        ? customReason
        : rejectionReasons.find((r) => r.id === selectedReason)?.label;

    if (!finalReason?.trim()) {
      alert("Veuillez sélectionner une raison ou la renseigner");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(finalReason);
      setSelectedReason("");
      setCustomReason("");
      onClose();
    } catch (error) {
      alert("Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Rejeter la demande d'inscription
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {userToReject.firstName} {userToReject.lastName} •{" "}
                {userToReject.email}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des raisons */}
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
            {rejectionReasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedReason === reason.id
                    ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                    : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{reason.label.split(" ")[0]}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {reason.label}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Champ personnalisé */}
          {selectedReason === "other" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Précisez la raison du rejet
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Ex: Le document n'est pas au bon format, l'année n'est pas visible..."
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                autoFocus
              />
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !selectedReason ||
                (selectedReason === "other" && !customReason.trim()) ||
                isSubmitting
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement...
                </>
              ) : (
                "Confirmer le rejet"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectModal;
