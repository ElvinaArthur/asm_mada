import React, { useState } from "react";
import { BookOpen, Eye, Calendar, Download } from "lucide-react";
import BookDetailView from "./BookDetailView";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const BookGrid = ({ books = [], viewMode = "grid" }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  if (selectedBook) {
    return (
      <BookDetailView
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-500">Aucun livre disponible</p>
      </div>
    );
  }

  const handleImageError = (bookId) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }));
  };

  // Mode Grille
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="bg-white rounded-xl shadow hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 duration-300 overflow-hidden group"
          >
            {/* Thumbnail avec fallback */}
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
              {!imageErrors[book.id] ? (
                <img
                  src={`${API_URL}/books/${book.id}/thumbnail`}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={() => handleImageError(book.id)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                  <BookOpen className="w-16 h-16 text-green-600" />
                </div>
              )}

              {/* Badge catégorie */}
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {book.category}
              </div>

              {/* Overlay au survol */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  Voir les détails
                </span>
              </div>
            </div>

            {/* Informations du livre */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-green-600 transition min-h-[2.5rem]">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1 mb-3">
                {book.author}
              </p>

              {/* Stats */}
              <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {book.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {book.year || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {book.downloads || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mode Liste
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          onClick={() => setSelectedBook(book)}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer flex items-center gap-4 transition-all hover:border-green-200 border border-transparent"
        >
          {/* Thumbnail miniature */}
          <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {!imageErrors[book.id] ? (
              <img
                src={`${API_URL}/books/${book.id}/thumbnail`}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(book.id)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {book.title}
              </h3>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                {book.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {book.author}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2">
              {book.description}
            </p>
          </div>

          {/* Stats à droite */}
          <div className="text-right ml-4 flex-shrink-0">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {book.year || "N/A"}
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-1 justify-end">
                <Eye className="w-3 h-3" />
                {book.views || 0} vues
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Download className="w-3 h-3" />
                {book.downloads || 0} DL
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
