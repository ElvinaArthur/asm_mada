// frontend/src/pages/admin/verifications/components/ProofModal.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  X,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import ProofViewer from "./ProofViewer"; // 👈 IMPORTE LE NOUVEAU COMPOSANT

const ProofModal = ({
  isOpen,
  onClose,
  proofDetails,
  selectedUser,
  downloadProof,
  handleApprove,
  handleOpenRejectModal,
}) => {
  if (!isOpen || !proofDetails) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Justificatif d'adhésion
            </h2>
            <p className="text-gray-600">
              {selectedUser?.firstName} {selectedUser?.lastName} -{" "}
              {selectedUser?.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {proofDetails.proof ? (
            <div className="space-y-6">
              {/* Informations du fichier */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Informations du document
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom du fichier</p>
                    <p className="font-medium break-all">
                      {proofDetails.proof.originalname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taille</p>
                    <p className="font-medium">
                      {formatFileSize(proofDetails.proof.size)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{proofDetails.proof.mimetype}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Uploadé le</p>
                    <p className="font-medium">
                      {formatDate(proofDetails.proof.uploaded_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p
                      className={`font-medium ${
                        proofDetails.proof.status === "approved"
                          ? "text-green-600"
                          : proofDetails.proof.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {proofDetails.proof.status === "approved" &&
                        "✅ Approuvé"}
                      {proofDetails.proof.status === "rejected" && "❌ Rejeté"}
                      {proofDetails.proof.status === "pending" &&
                        "⏳ En attente"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 📸 COMPOSANT DE VISUALISATION */}
              <ProofViewer
                filename={proofDetails.proof.filename}
                mimetype={proofDetails.proof.mimetype}
                onDownload={() => downloadProof(proofDetails.proof.filename)}
              />

              {/* Historique des rejets */}
              {proofDetails.proof.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Raison du rejet
                  </h3>
                  <p className="text-red-700">
                    {proofDetails.proof.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun justificatif uploadé
              </h3>
              <p className="text-gray-600">
                Cet utilisateur n'a pas encore uploadé de justificatif
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t p-6 flex justify-between items-center">
          <div className="flex gap-3">
            {proofDetails?.proof && (
              <button
                onClick={() => downloadProof(proofDetails.proof.filename)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            {proofDetails?.proof && selectedUser?.isVerified !== 1 && (
              <>
                <button
                  onClick={() =>
                    handleOpenRejectModal(selectedUser.id, selectedUser)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeter
                </button>
                <button
                  onClick={() => handleApprove(selectedUser.id, selectedUser)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approuver
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProofModal;
