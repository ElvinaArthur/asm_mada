import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";
import {
  Loader,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  AlertCircle,
} from "lucide-react";

// Configuration pour PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const PDFViewer = ({ pdfUrl, author, bookTitle }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(true);

  // Vérifier si le PDF existe
  useEffect(() => {
    const checkPDF = async () => {
      try {
        const response = await fetch(pdfUrl, { method: "HEAD" });
        if (!response.ok) {
          setPdfExists(false);
          setError("Le document PDF n'est pas disponible");
        }
      } catch (err) {
        setPdfExists(false);
        setError("Impossible de charger le document");
      }
    };

    checkPDF();
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err) => {
    console.error("PDF loading error:", err);
    setError("Erreur de chargement du document PDF");
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  if (!pdfExists) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Document non disponible
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Le fichier PDF "{bookTitle}" n'a pas été trouvé sur le serveur.
          Veuillez vérifier que le fichier existe dans le dossier /pdfs du
          backend.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform -rotate-45 text-center">
            <div className="text-4xl font-bold text-gray-700">{author}</div>
            <div className="text-2xl font-semibold text-gray-600 mt-4">ASM</div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center bg-white rounded-lg shadow-xl px-4 py-2 space-x-4">
          <ControlButton
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            icon={<ChevronLeft className="h-5 w-5" />}
            label="Page précédente"
          />

          <div className="text-sm font-medium text-gray-700">
            Page <span className="font-bold">{pageNumber}</span> sur{" "}
            {numPages || "..."}
          </div>

          <ControlButton
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            icon={<ChevronRight className="h-5 w-5" />}
            label="Page suivante"
          />

          <div className="h-6 w-px bg-gray-300"></div>

          <ControlButton
            onClick={zoomOut}
            disabled={scale <= 0.5}
            icon={<ZoomOut className="h-5 w-5" />}
            label="Zoom arrière"
          />

          <button
            onClick={resetZoom}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            {Math.round(scale * 100)}%
          </button>

          <ControlButton
            onClick={zoomIn}
            disabled={scale >= 3}
            icon={<ZoomIn className="h-5 w-5" />}
            label="Zoom avant"
          />
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="h-full pt-20 pb-8 overflow-auto">
        {isLoading && !error && (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <div className="text-red-500 text-lg font-semibold mb-2">
              {error}
            </div>
            <p className="text-gray-400">URL: {pdfUrl}</p>
          </div>
        )}

        {!error && (
          <div className="flex justify-center p-4">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<LoadingSpinner />}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="shadow-2xl"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}
      </div>

      {/* Message de protection */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full shadow-lg text-sm font-medium">
          ⚠️ Document protégé - Lecture seule
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, disabled, icon, label }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg transition-colors ${
      disabled
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-700 hover:bg-gray-100"
    }`}
    aria-label={label}
  >
    {icon}
  </motion.button>
);

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Loader className="h-8 w-8 text-primary-500" />
  </motion.div>
);

export default PDFViewer;
