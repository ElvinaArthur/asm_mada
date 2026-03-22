// components/directory/DirectoryViews.jsx
import React from "react";

const DirectoryViews = ({ viewMode, onViewModeChange, total }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Membres de la communauté
        </h2>
        <p className="text-gray-600">{total} membres trouvés</p>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Affichage :</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`px-3 py-1 rounded transition ${
              viewMode === "grid"
                ? "bg-white shadow text-asm-green-600"
                : "text-gray-600"
            }`}
          >
            Grille
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-1 rounded transition ${
              viewMode === "list"
                ? "bg-white shadow text-asm-green-600"
                : "text-gray-600"
            }`}
          >
            Liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectoryViews;
