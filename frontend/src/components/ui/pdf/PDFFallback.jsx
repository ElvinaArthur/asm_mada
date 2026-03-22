import React from "react";
import { ExternalLink, AlertCircle, Lock } from "lucide-react";

const PDFFallback = ({ pdfUrl, bookTitle, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-between">
        <button
          onClick={onClose}
          className="hover:bg-gray-700 px-3 py-1 rounded"
        >
          ← Retour
        </button>
        <h2 className="font-medium">{bookTitle}</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />
        <h3 className="text-xl text-white font-semibold mb-4">
          Lecteur avancé non disponible
        </h3>
        <p className="text-gray-300 text-center mb-8 max-w-md">
          Vous pouvez ouvrir le PDF dans un nouvel onglet.
        </p>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 mb-4"
        >
          <ExternalLink className="w-5 h-5" />
          Ouvrir le PDF
        </a>

        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 max-w-md">
          <div className="flex items-center gap-2 text-red-300 mb-2">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Protection des droits</span>
          </div>
          <ul className="text-red-200 text-sm space-y-1">
            <li>• Lecture en ligne uniquement</li>
            <li>• Téléchargement interdit</li>
            <li>• Reproduction interdite</li>
            <li>• © ASM {new Date().getFullYear()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFFallback;
