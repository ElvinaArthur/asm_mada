import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

const VerificationCard = ({
  user,
  selectedUsers,
  setSelectedUsers,
  handleApprove,
  handleOpenRejectModal,
  handleViewProof,
}) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-gray-700">
              {user.firstName?.[0]?.toUpperCase() || "U"}
              {user.lastName?.[0]?.toUpperCase() || "S"}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm">
                {user.createdAt
                  ? `Inscrit le ${formatDate(user.createdAt)}`
                  : "Date inconnue"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedUsers([...selectedUsers, user.id]);
              } else {
                setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
              }
            }}
            className="rounded border-gray-300 h-5 w-5"
          />
        </div>
      </div>

      {/* Informations additionnelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Année de graduation</p>
          <p className="font-medium text-gray-900">
            {user.graduationYear || "Non spécifiée"}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Spécialisation</p>
          <p className="font-medium text-gray-900">
            {user.specialization || "Non spécifiée"}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Justificatif</p>
          <div className="flex items-center gap-2">
            {user.hasProof ? (
              <>
                <FileText className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">Uploadé</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-600">Manquant</span>
              </>
            )}
          </div>
          {user.proof_status === "rejected" && (
            <p className="text-xs text-red-500 mt-1">
              Rejeté: {user.proof_rejection_reason}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleApprove(user.id, user)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Approuver
        </button>
        <button
          onClick={() => handleOpenRejectModal(user.id, user)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Rejeter
        </button>
        {user.hasProof && (
          <button
            onClick={() => handleViewProof(user.id, user)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Voir justificatif
          </button>
        )}
        <a
          href={`mailto:${user.email}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contacter
        </a>
      </div>
    </motion.div>
  );
};

export default VerificationCard;
