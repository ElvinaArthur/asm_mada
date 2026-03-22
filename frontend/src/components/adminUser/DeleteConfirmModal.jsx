// frontend/src/pages/admin/users/components/DeleteConfirmModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2, User } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isBulk = false,
  selectedCount = 0,
}) => {
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isBulk || confirmText === "SUPPRIMER") {
      onConfirm();
      setConfirmText("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* En-tête avec couleur d'alerte */}
        <div className="bg-red-600 p-6 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            {isBulk
              ? "Supprimer plusieurs utilisateurs ?"
              : "Supprimer cet utilisateur ?"}
          </h3>
          <p className="text-red-100 text-sm">Cette action est irréversible</p>
        </div>

        {/* Corps du modal */}
        <div className="p-6">
          {/* Détails de la suppression */}
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            {isBulk ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <p className="font-semibold text-red-900">
                    {selectedCount} utilisateur(s) sélectionné(s)
                  </p>
                  <p className="text-sm text-red-700">
                    Tous ces comptes seront définitivement supprimés
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                  {user?.firstName ? (
                    <span className="font-bold text-red-800">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  ) : (
                    <User className="w-6 h-6 text-red-700" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-red-700 break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Avertissements */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">Toutes les données</span>{" "}
                associées à {isBulk ? "ces comptes" : "ce compte"} seront
                définitivement effacées
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">
                  Favoris, commentaires et historique
                </span>{" "}
                seront perdus
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">
                  Cette action ne peut pas être annulée
                </span>
              </p>
            </div>
          </div>

          {/* Confirmation - UNIQUEMENT pour suppression individuelle */}
          {!isBulk && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Tapez{" "}
                <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  SUPPRIMER
                </span>{" "}
                pour confirmer :
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="SUPPRIMER"
                autoFocus
              />
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                setConfirmText("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isBulk && confirmText !== "SUPPRIMER"}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>

          {/* Message secondaire */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Seuls les comptes utilisateurs standards peuvent être supprimés
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;
