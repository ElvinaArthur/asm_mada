import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Lock,
  Download,
  Printer,
  AlertCircle,
} from "lucide-react";

const PDFReader = ({ pdfUrl, bookTitle, bookAuthor, totalPages, onClose }) => {
  const [scale, setScale] = useState(100);

  useEffect(() => {
    // Protection 1: Désactiver le clic droit
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Protection 2: Désactiver les raccourcis clavier
    const handleKeyDown = (e) => {
      // Ctrl+S (Save), Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
        alert(
          "⚠️ Le téléchargement et l'impression sont désactivés pour protéger les droits d'auteur.",
        );
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Construction de l'URL du PDF avec les paramètres de visualisation
  const iframeUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=${scale}`;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col select-none">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Retour"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-medium text-lg">{bookTitle}</h2>
            <p className="text-sm text-gray-400">
              {bookAuthor}
              {totalPages && ` • ${totalPages} pages`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(50, s - 25))}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Zoom arrière"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="px-3 py-1 bg-gray-700 rounded text-sm font-medium min-w-[70px] text-center">
            {scale}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(200, s + 25))}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Zoom avant"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-gray-600 mx-2"></div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Content avec iframe */}
      <div className="flex-1 overflow-hidden bg-gray-800 relative">
        {/* Iframe pour afficher le PDF */}
        <iframe
          src={iframeUrl}
          className="w-full h-full border-0"
          title={bookTitle}
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Watermark de protection - Par-dessus l'iframe */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-[150px] font-bold text-white/3 rotate-45 select-none">
            ASM
          </div>
        </div>

        {/* Overlay transparent pour empêcher certaines interactions */}
        <div
          className="absolute top-0 left-0 w-full h-16 bg-transparent pointer-events-auto"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Footer avec avertissement */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300 font-medium">
              Lecture seule • Téléchargement interdit • © ASM{" "}
              {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Téléchargement : Désactivé</span>
            </div>
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>Impression : Désactivée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
