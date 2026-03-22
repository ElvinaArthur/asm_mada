import React from "react";
import { BookOpen, Download, Eye, Calendar, Clock } from "lucide-react";

const BookCard = ({ book }) => {
  // Construire les URLs complètes
  const thumbnailUrl = `http://localhost:3000${book.thumbnailUrl}`;
  const pdfUrl = `http://localhost:3000${book.pdfUrl}`;

  // Couleurs par catégorie
  const getCategoryColor = (category) => {
    const colors = {
      sociologie: "bg-blue-100 text-blue-800",
      psychologie: "bg-purple-100 text-purple-800",
      santé: "bg-green-100 text-green-800",
      travail: "bg-orange-100 text-orange-800",
      environnement: "bg-emerald-100 text-emerald-800",
      éducation: "bg-amber-100 text-amber-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-asm-green-50 to-asm-yellow-50 relative overflow-hidden">
        {book.thumbnail ? (
          <img
            src={thumbnailUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              e.target.style.display = "none";
              e.target.parentElement.classList.add(
                "bg-gradient-to-br",
                "from-asm-green-100",
                "to-asm-yellow-100",
              );
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-asm-green-200" />
          </div>
        )}

        {/* Catégorie badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.category)}`}
          >
            {book.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-asm-green-600 transition-colors">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3">Par {book.author}</p>

        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{book.year}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{book.readTime}</span>
            </div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {book.pages} pages
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center text-xs text-gray-400 mb-4 space-x-4">
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            <span>{book.views || 0} vues</span>
          </div>
          <div className="flex items-center">
            <Download className="w-3 h-3 mr-1" />
            <span>{book.downloads || 0} téléch.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-asm-green-600 hover:bg-asm-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Lire
          </a>
          <a
            href={pdfUrl}
            download={`${book.title}.pdf`}
            className="flex-1 border border-asm-green-600 text-asm-green-600 hover:bg-asm-green-50 py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
