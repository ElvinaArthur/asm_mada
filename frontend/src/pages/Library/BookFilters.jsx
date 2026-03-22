// src/pages/Library/BookFilters.jsx
// ✅ Années dynamiques depuis les vrais livres, design cohérent avec LibraryPage

import React, { useState, useEffect, useRef } from "react";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { bookAPI } from "../../services/api/books";

const BookFilters = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);

  // ── Fermer en cliquant dehors ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Chargement catégories ──────────────────────────────────────
  useEffect(() => {
    loadCategories();
    loadYears();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await bookAPI.getCategories();
      // L'API retourne { data: [...] } ou { categories: [...] }
      setCategories(data?.data || data?.categories || []);
    } catch (error) {
      console.error("Erreur catégories:", error);
    }
  };

  // ✅ Années dynamiques : on charge les livres et on extrait les années uniques
  const loadYears = async () => {
    try {
      const response = await bookAPI.getBooks();
      const books = response?.data || [];
      const uniqueYears = [
        ...new Set(books.map((b) => b.year).filter(Boolean)),
      ].sort((a, b) => b - a); // Desc : 2024, 2023...
      setYears(uniqueYears);
    } catch (error) {
      console.error("Erreur années:", error);
    }
  };

  const clearFilters = () => {
    onFilterChange({ category: "all", year: "all" });
    setShowFilters(false);
  };

  const hasActiveFilters = filters.category !== "all" || filters.year !== "all";
  const activeCount =
    (filters.category !== "all" ? 1 : 0) + (filters.year !== "all" ? 1 : 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-medium transition ${
          showFilters || hasActiveFilters
            ? "bg-green-600 text-white border-green-600"
            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <Filter className="w-4 h-4" />
        Filtres
        {activeCount > 0 && (
          <span
            className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
              hasActiveFilters
                ? "bg-white text-green-700"
                : "bg-green-600 text-white"
            }`}
          >
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {showFilters && (
        <div
          className="absolute top-full mt-2 right-0 bg-white border border-gray-200
                        rounded-2xl shadow-xl p-5 w-72 z-40"
        >
          {/* Header dropdown */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filtrer les livres</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            {/* ── Catégorie ────────────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Catégorie
              </label>
              <div
                className="space-y-1 max-h-44 overflow-y-auto pr-1
                              scrollbar-thin scrollbar-thumb-gray-200"
              >
                {[{ name: "all", count: null }, ...categories].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() =>
                      onFilterChange({ ...filters, category: cat.name })
                    }
                    className={`w-full flex items-center justify-between px-3 py-2
                                rounded-lg text-sm transition ${
                                  filters.category === cat.name
                                    ? "bg-green-50 text-green-800 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                  >
                    <span>
                      {cat.name === "all" ? "Toutes les catégories" : cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {cat.count != null && (
                        <span className="text-xs text-gray-400">
                          {cat.count}
                        </span>
                      )}
                      {filters.category === cat.name && (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Année de publication ─────────────────────── */}
            {years.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Année de publication
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onFilterChange({ ...filters, year: "all" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                      filters.year === "all"
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Toutes
                  </button>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() =>
                        onFilterChange({ ...filters, year: String(year) })
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                        filters.year === String(year)
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Effacer filtres ──────────────────────────── */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-red-600 hover:text-red-800
                           border border-red-200 hover:border-red-300
                           rounded-lg transition font-medium"
              >
                Effacer tous les filtres
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
