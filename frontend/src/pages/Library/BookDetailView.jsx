import React, { useState } from "react";
import {
  X,
  BookOpen,
  User,
  Calendar,
  Eye,
  ChevronLeft,
  Download,
  Clock,
  FileText,
  Lock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PDFViewer } from "../../components/ui/pdf";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const BookDetailView = ({ book, onClose }) => {
  const [showPDF, setShowPDF] = useState(false);
  const [imageError, setImageError] = useState(false);

  const thumbnailUrl = `${API_URL}/books/${book.id}/thumbnail`;

  const pdfUrl = `${API_URL}/books/${book.id}/view`;

  if (showPDF) {
    return (
      <PDFViewer
        pdfUrl={pdfUrl}
        bookTitle={book.title}
        bookAuthor={book.author}
        totalPages={book.pages}
        onClose={() => setShowPDF(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header fixe */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 shadow-sm z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-900 transition group"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition" />
            <span className="font-medium">Retour à la bibliothèque</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne gauche - Couverture et action */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Thumbnail */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                {!imageError ? (
                  <img
                    src={thumbnailUrl}
                    alt={book.title}
                    className="w-full h-auto object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Bouton de lecture */}
              <button
                onClick={() => setShowPDF(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition" />
                Lire le document
              </button>

              {/* Bouton alternatif - Ouverture directe */}
              <a
                href={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Ouvrir dans un nouvel onglet
              </a>

              {/* Avertissement protection */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Protection des droits
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Lecture en ligne uniquement</li>
                      <li>• Téléchargement interdit</li>
                      <li>• Reproduction interdite</li>
                      <li>• Impression désactivée</li>
                      <li>• © ASM {new Date().getFullYear()}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Statistiques
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Vues
                    </span>
                    <span className="font-semibold">{book.views || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Lectures
                    </span>
                    <span className="font-semibold">{book.downloads || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Détails */}
          <div className="md:col-span-2">
            {/* Badge catégorie */}
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
                {book.category}
              </span>
            </div>

            {/* Titre et auteur */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {book.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium text-lg">{book.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{book.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{book.views || 0} vues</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {book.description}
              </p>
            </div>

            {/* Informations détaillées */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Informations
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Nombre de pages</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {book.pages}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Temps de lecture</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {book.readTime}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Année de publication</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {book.year}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">Catégorie</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 capitalize">
                    {book.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Note importante */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Note importante
                  </h4>
                  <p className="text-sm text-blue-800">
                    Ce document est protégé par les droits d'auteur. La lecture
                    est autorisée uniquement en ligne via notre plateforme
                    sécurisée. Toute reproduction, distribution ou utilisation
                    commerciale est strictement interdite sans autorisation
                    préalable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailView;
