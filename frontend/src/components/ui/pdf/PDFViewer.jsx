import React, { useEffect } from "react";
import {
  ExternalLink,
  Lock,
  AlertCircle,
  BookOpen,
  X,
  Download,
  Eye,
} from "lucide-react";

const PDFViewer = ({ pdfUrl, bookTitle, bookAuthor, onClose }) => {
  // Ouvrir automatiquement dans un nouvel onglet
  useEffect(() => {
    // Ouvrir le PDF dans un nouvel onglet avec paramètres de visualisation
    const url = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center p-8">
      {/* Contenu informatif */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{bookTitle}</h2>
              <p className="text-gray-600 mt-1">{bookAuthor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Message principal */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <Eye className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Document ouvert dans un nouvel onglet
              </h3>
              <p className="text-green-800">
                Le PDF s'ouvre automatiquement dans un nouvel onglet de votre
                navigateur pour une meilleure expérience de lecture.
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3 mb-6">
          <a
            href={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
          >
            <ExternalLink className="w-5 h-5" />
            Rouvrir le document
          </a>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition font-semibold"
          >
            Retour à la bibliothèque
          </button>
        </div>

        {/* Avertissement protection */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-2">
                Protection des droits d'auteur
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Lecture en ligne uniquement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>
                    Le téléchargement peut être limité par votre navigateur
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Reproduction et distribution interdites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>
                    © Association des Sociologues Malgaches (ASM) 2026
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Note technique */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Note :</p>
              <p>
                Si le document ne s'ouvre pas automatiquement, veuillez
                autoriser les pop-ups pour ce site dans les paramètres de votre
                navigateur, puis cliquez sur "Rouvrir le document".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
