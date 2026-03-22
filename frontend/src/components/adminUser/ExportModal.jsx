// frontend/src/pages/admin/users/components/ExportModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Download, FileText, CheckCircle, Users } from "lucide-react";

const ExportModal = ({
  isOpen,
  onClose,
  onExport,
  totalUsers,
  filteredCount,
}) => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportScope, setExportScope] = useState("filtered");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      format: exportFormat,
      scope: exportScope,
      includeHeaders,
      dateRange,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Exporter les utilisateurs
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Statistiques */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  {filteredCount} utilisateur(s) filtré(s)
                </p>
                <p className="text-xs text-blue-600">
                  Sur {totalUsers} au total
                </p>
              </div>
            </div>
          </div>

          {/* Format d'export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Format du fichier
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat("csv")}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  exportFormat === "csv"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileText
                  className={`w-6 h-6 ${
                    exportFormat === "csv" ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    exportFormat === "csv" ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  CSV
                </span>
                <span className="text-xs text-gray-400">Compatible Excel</span>
              </button>

              <button
                onClick={() => setExportFormat("json")}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  exportFormat === "json"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileText
                  className={`w-6 h-6 ${
                    exportFormat === "json" ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    exportFormat === "json" ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  JSON
                </span>
                <span className="text-xs text-gray-400">Format brut</span>
              </button>
            </div>
          </div>

          {/* Périmètre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Utilisateurs à exporter
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={exportScope === "filtered"}
                  onChange={(e) => setExportScope(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Résultats actuels</p>
                  <p className="text-sm text-gray-500">
                    {filteredCount} utilisateur(s) avec les filtres appliqués
                  </p>
                </div>
                {exportScope === "filtered" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={exportScope === "all"}
                  onChange={(e) => setExportScope(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Tous les utilisateurs
                  </p>
                  <p className="text-sm text-gray-500">
                    {totalUsers} utilisateur(s) au total
                  </p>
                </div>
                {exportScope === "all" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </label>
            </div>
          </div>

          {/* Options supplémentaires */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                Inclure les en-têtes de colonnes
              </span>
            </label>
          </div>
        </div>

        {/* Pied */}
        <div className="border-t p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
