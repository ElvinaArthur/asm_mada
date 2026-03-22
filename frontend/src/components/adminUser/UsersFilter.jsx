// frontend/src/pages/admin/users/components/UsersFilters.jsx
import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

const UsersFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  onReset,
}) => {
  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || roleFilter !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
          >
            <option value="all">📋 Tous les statuts</option>
            <option value="pending">⏳ En attente</option>
            <option value="verified">✅ Vérifiés</option>
            <option value="blocked">🚫 Bloqués</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
          >
            <option value="all">👥 Tous les rôles</option>
            <option value="user">👤 Utilisateurs</option>
            <option value="admin">🛡️ Administrateurs</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
          <span className="text-sm text-gray-500">Filtres actifs:</span>
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
              Recherche: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {statusFilter !== "all" && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
              Statut:{" "}
              {statusFilter === "pending"
                ? "En attente"
                : statusFilter === "verified"
                  ? "Vérifié"
                  : "Bloqué"}
              <button
                onClick={() => setStatusFilter("all")}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {roleFilter !== "all" && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
              Rôle: {roleFilter === "admin" ? "Admin" : "Utilisateur"}
              <button
                onClick={() => setRoleFilter("all")}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UsersFilters;
