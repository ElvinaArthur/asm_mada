// components/modals/ConfirmDeleteModal.jsx
import React from "react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  message = "Êtes-vous sûr de vouloir effectuer cette action ?",
  confirmText = "Supprimer",
  cancelText = "Annuler",
  loading = false,
  itemName = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6">
            {/* Icone d'alerte */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Titre */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {title}
            </h3>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-2">{message}</p>
              {itemName && (
                <p className="font-semibold text-gray-900 bg-red-50 p-3 rounded-lg border border-red-100 my-3">
                  "{itemName}"
                </p>
              )}
              <p className="text-red-600 text-sm mt-2">
                ⚠️ Cette action est irréversible et définitive.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Traitement...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Toutes les données associées seront définitivement supprimées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
