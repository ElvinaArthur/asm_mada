// frontend/src/pages/admin/users/components/UsersHeader.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Trash2, Users } from "lucide-react";

const UsersHeader = ({
  selectedCount = 0,
  onBulkVerify,
  onBulkDelete,
  onExport,
  onOpenExportModal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des utilisateurs
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Gérez les inscriptions, les autorisations et les comptes
          </p>
        </div>

        <div className="flex gap-3">
          {selectedCount > 0 && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onBulkVerify}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm"
              >
                <CheckCircle className="w-5 h-5" />
                Vérifier ({selectedCount})
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors shadow-sm"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer ({selectedCount})
              </motion.button>
            </>
          )}

          <button
            onClick={onOpenExportModal}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UsersHeader;
