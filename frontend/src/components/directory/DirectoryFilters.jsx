// components/directory/DirectoryFilters.jsx
import React from "react";
import { Search, MapPin, Filter } from "lucide-react";

const FilterButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition ${
      active
        ? "bg-gradient-to-r from-asm-green-600 to-asm-green-700 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {Icon && <Icon className="w-4 h-4 mr-2" />}
    {label}
  </button>
);

const DirectoryFilters = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedRegion,
  onRegionChange,
  activeFilter,
  onFilterChange,
  regions,
  typeFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Barre de recherche */}
      <form onSubmit={onSearchSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un membre par nom, profession, entreprise..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-asm-green-600 text-white rounded-lg hover:bg-asm-green-700"
          >
            Rechercher
          </button>
        </div>
      </form>

      {/* Filtres par région */}
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-700 font-medium">
            Filtrer par région :
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <FilterButton
              key={region.id}
              active={selectedRegion === region.id}
              onClick={() => onRegionChange(region.id)}
              icon={MapPin}
              label={region.label}
            />
          ))}
        </div>
      </div>

      {/* Filtres par type */}
      <div>
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-700 font-medium">Filtrer par type :</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <FilterButton
              key={filter.id}
              active={activeFilter === filter.id}
              onClick={() => onFilterChange(filter.id)}
              label={filter.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectoryFilters;
