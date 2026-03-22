import React from "react";
import { Search } from "lucide-react";

const FiltersBar = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  setPagination,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous</option>
            <option value="with_proof">Avec justificatif</option>
            <option value="without_proof">Sans justificatif</option>
            <option value="today">Aujourd'hui</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
