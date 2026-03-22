// frontend/src/pages/admin/AdminBooks.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Tag,
  User,
  Calendar,
  Hash,
  Clock,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const AdminBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, [pagination.page]);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, categoryFilter, statusFilter]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllBooks({
        page: pagination.page,
        limit: pagination.limit,
        category: categoryFilter !== "all" ? categoryFilter : "",
        search: searchTerm || "",
      });

      setBooks(response.data || []);
      setFilteredBooks(response.data || []);

      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Erreur chargement livres:", error);
      alert("Erreur: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Simuler les catégories (remplacer par API réelle)
      const categoriesList = [
        { name: "sociologie", count: 5 },
        { name: "psychologie", count: 3 },
        { name: "travail", count: 2 },
        { name: "santé", count: 2 },
        { name: "environnement", count: 2 },
        { name: "éducation", count: 1 },
      ];
      setCategories(categoriesList);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // Filtre recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtre catégorie
    if (categoryFilter !== "all") {
      filtered = filtered.filter((book) => book.category === categoryFilter);
    }

    // Filtre statut (à implémenter selon vos besoins)
    if (statusFilter === "popular") {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (statusFilter === "recent") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    setFilteredBooks(filtered);
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (
      !confirm(
        `Supprimer le livre "${bookTitle}" ? Cette action est irréversible.`,
      )
    ) {
      return;
    }

    try {
      await adminService.deleteBook(bookId);
      alert("Livre supprimé avec succès !");
      loadBooks();
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) {
      alert("Sélectionnez au moins un livre");
      return;
    }

    if (
      !confirm(`Supprimer ${selectedBooks.length} livre(s) sélectionné(s) ?`)
    ) {
      return;
    }

    try {
      // Implémenter la suppression multiple
      for (const bookId of selectedBooks) {
        await adminService.deleteBook(bookId);
      }

      alert("Livres supprimés avec succès !");
      loadBooks();
      setSelectedBooks([]);
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  const handleBulkExport = () => {
    if (selectedBooks.length === 0) {
      alert("Sélectionnez au moins un livre");
      return;
    }

    // Implémenter l'export
    alert(
      `Export de ${selectedBooks.length} livre(s) (fonctionnalité à implémenter)`,
    );
  };

  const BookCard = ({ book }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative">
        {book.thumbnail ? (
          <img
            src={`/api/books/${book.id}/thumbnail`}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded text-xs font-medium">
            {book.category}
          </span>
        </div>

        {/* Actions overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={() =>
                window.open(`/api/books/${book.id}/view`, "_blank")
              }
              className="p-2 bg-white/90 backdrop-blur-sm rounded hover:bg-white"
              title="Voir"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => navigate(`/admin/books/edit/${book.id}`)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded hover:bg-white"
              title="Modifier"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => handleDeleteBook(book.id, book.title)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded hover:bg-white"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <User className="w-3 h-3" />
              {book.author}
            </p>
          </div>
          <input
            type="checkbox"
            checked={selectedBooks.includes(book.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedBooks([...selectedBooks, book.id]);
              } else {
                setSelectedBooks(selectedBooks.filter((id) => id !== book.id));
              }
            }}
            className="rounded border-gray-300"
          />
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {book.description || "Aucune description disponible"}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">Pages</div>
            <div className="font-semibold text-gray-900 flex items-center justify-center gap-1">
              <Hash className="w-3 h-3" />
              {book.pages || "N/A"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Vues</div>
            <div className="font-semibold text-gray-900">{book.views || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Téléch.</div>
            <div className="font-semibold text-gray-900">
              {book.downloads || 0}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/api/books/${book.id}/view`, "_blank")}
            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 flex items-center justify-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Voir
          </button>
          <button
            onClick={() => handleDeleteBook(book.id, book.title)}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border p-5 animate-pulse"
        >
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Gestion de la bibliothèque
              </h1>
              <p className="text-gray-600">
                Gérez tous les livres de votre bibliothèque numérique
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkExport}
                disabled={selectedBooks.length === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exporter ({selectedBooks.length})
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedBooks.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer ({selectedBooks.length})
              </button>
              <button
                onClick={() => navigate("/admin/books/add")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter un livre
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total livres</p>
                <p className="text-2xl font-bold">
                  {pagination.total || books.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vues totales</p>
                <p className="text-2xl font-bold">
                  {books.reduce((sum, book) => sum + (book.views || 0), 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Téléchargements</p>
                <p className="text-2xl font-bold">
                  {books.reduce((sum, book) => sum + (book.downloads || 0), 0)}
                </p>
              </div>
              <Download className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Catégories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Tag className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un livre par titre, auteur ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les livres</option>
                <option value="popular">Plus populaires</option>
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
              </select>
              <button
                onClick={loadBooks}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Catégories rapides
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                categoryFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategoryFilter(cat.name)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  categoryFilter === cat.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm
                ? "Aucun livre trouvé"
                : "Aucun livre dans la bibliothèque"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Essayez avec d'autres termes de recherche"
                : "Commencez par ajouter votre premier livre"}
            </p>
            <button
              onClick={() => navigate("/admin/books/add")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un livre
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: pageNum }))
                      }
                      className={`w-10 h-10 rounded-lg ${
                        pagination.page === pageNum
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {pagination.pages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: pagination.pages,
                        }))
                      }
                      className={`w-10 h-10 rounded-lg ${
                        pagination.page === pagination.pages
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {pagination.pages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Bulk Selection Info */}
        {selectedBooks.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>{selectedBooks.length} livre(s) sélectionné(s)</span>
            <button
              onClick={() => setSelectedBooks([])}
              className="ml-4 p-1 hover:bg-blue-700 rounded"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;
