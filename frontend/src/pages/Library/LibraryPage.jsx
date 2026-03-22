// src/pages/Library/LibraryPage.jsx
// ✅ Spinner unifié, BookFilters intégré, stats vues/lectures réelles

import React, { useState, useEffect, useCallback } from "react";
import { Search, Grid, List, X, BookOpen } from "lucide-react";
import { bookAPI } from "../../services/api/books";
import BookGrid from "./BookGrid";
import BookFilters from "./BookFilters";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0 });
  const [filters, setFilters] = useState({ category: "all", year: "all" });

  // ── Chargement principal ───────────────────────────────────────
  const loadBooks = useCallback(
    async (overrideFilters) => {
      try {
        setLoading(true);
        const activeFilters = overrideFilters ?? filters;
        const params = {};

        if (activeFilters.category !== "all")
          params.category = activeFilters.category;
        if (activeFilters.year !== "all") params.year = activeFilters.year;

        const response = await bookAPI.getBooks(params);
        setBooks(response.data || []);
        setStats({ total: response.total || response.data?.length || 0 });
      } catch (error) {
        console.error("❌ Erreur chargement livres:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadBooks();
  }, [filters]);

  // ── Recherche ──────────────────────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }

    try {
      setLoading(true);
      const response = await bookAPI.searchBooks(searchQuery);
      setBooks(response.data || []);
      setStats({ total: response.total || response.data?.length || 0 });
    } catch (error) {
      console.error("❌ Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    loadBooks();
  };

  // ── Changement de filtres ─────────────────────────────────────
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // loadBooks sera déclenché par le useEffect sur filters
  };

  // ── Vues : nombre d'actifs ─────────────────────────────────────
  const totalViews = books.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalDownloads = books.reduce((acc, b) => acc + (b.downloads || 0), 0);
  const hasActiveFilters =
    filters.category !== "all" || filters.year !== "all" || searchQuery;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ── Header sticky ─────────────────────────────────────── */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {/* Titre + stats + modes */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-4xl">📚</span>
                Bibliothèque ASM
              </h1>

              {/* ✅ Stats réelles issues des données chargées */}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>
                  <span className="font-semibold text-gray-900">
                    {stats.total}
                  </span>{" "}
                  livre{stats.total > 1 ? "s" : ""}
                </span>
                {!loading && totalViews > 0 && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>
                      <span className="font-semibold text-gray-900">
                        {totalViews.toLocaleString("fr-FR")}
                      </span>{" "}
                      vues
                    </span>
                    <span className="text-gray-300">·</span>
                    <span>
                      <span className="font-semibold text-gray-900">
                        {totalDownloads.toLocaleString("fr-FR")}
                      </span>{" "}
                      lectures
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Modes d'affichage */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Mode grille"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition ${
                  viewMode === "list"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Mode liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barre de recherche + bouton filtres */}
          <div className="flex gap-3 items-center">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un livre, un auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 border-2 border-gray-200 rounded-xl
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           text-sm transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* ✅ BookFilters intégré proprement */}
            <BookFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Badge filtres actifs */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {filters.category !== "all" && (
                <span
                  className="inline-flex items-center gap-1 bg-green-100 text-green-800
                                 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {filters.category}
                  <button
                    onClick={() =>
                      setFilters((f) => ({ ...f, category: "all" }))
                    }
                  >
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}
              {filters.year !== "all" && (
                <span
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800
                                 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {filters.year}
                  <button
                    onClick={() => setFilters((f) => ({ ...f, year: "all" }))}
                  >
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700
                                 text-xs font-medium px-3 py-1 rounded-full"
                >
                  "{searchQuery}"
                  <button onClick={clearSearch}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({ category: "all", year: "all" });
                  clearSearch();
                }}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Contenu ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          // ✅ Ton spinner unifié — plus de spinner inline custom
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun livre trouvé
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}"`
                : "Aucun livre disponible pour ces filtres"}
            </p>
            <button
              onClick={() => {
                setFilters({ category: "all", year: "all" });
                setSearchQuery("");
                loadBooks({ category: "all", year: "all" });
              }}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg
                         hover:bg-green-700 transition text-sm font-medium"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="mb-5 text-sm text-gray-500">
                <span className="font-semibold text-gray-800">
                  {books.length}
                </span>{" "}
                résultat{books.length > 1 ? "s" : ""} pour «{searchQuery}»
              </p>
            )}
            <BookGrid books={books} viewMode={viewMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
