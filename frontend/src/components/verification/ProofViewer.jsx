// frontend/src/pages/admin/verifications/components/ProofViewer.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  AlertCircle,
  Loader,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// ============================================
// COMPOSANT IMAGE VIEWER (PLEIN ÉCRAN)
// ============================================
const ImageViewer = ({ isOpen, onClose, imageUrl, filename }) => {
  // Empêcher le scroll en arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Raccourci clavier Echap pour fermer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-98 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Bouton fermer - GRAND X en haut à droite */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[101]"
        aria-label="Fermer"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Nom du fichier en bas */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
        {filename}
      </div>

      {/* Image en taille réelle avec scroll */}
      <div
        className="w-full h-full overflow-auto flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          src={imageUrl}
          alt={filename}
          className="max-w-none"
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "none",
            maxHeight: "none",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT PROOF VIEWER PRINCIPAL
// ============================================
const ProofViewer = ({ filename, mimetype, onDownload }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // ============ CHARGEMENT DE L'IMAGE ============
  useEffect(() => {
    if (!filename) return;
    if (!mimetype?.startsWith("image/")) {
      setLoading(false);
      return;
    }

    const loadImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        // ESSAI 1: Endpoint admin preview
        const previewUrl = `http://https://asm-mada.onrender.com/api/proofs/admin/proof/preview/${filename}`;

        try {
          const response = await fetch(previewUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log("Preview failed, trying direct:", e);
        }

        // ESSAI 2: Accès direct via uploads
        const directUrl = `http://https://asm-mada.onrender.com/uploads/proofs/${filename}`;
        const directResponse = await fetch(directUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (directResponse.ok) {
          const blob = await directResponse.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          setError("Impossible de charger l'image");
        }
      } catch (err) {
        console.error("❌ Erreur chargement image:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // Cleanup
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [filename, mimetype, retryCount]);

  // ============ GESTIONNAIRES ============
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleOpenViewer = () => {
    if (imageUrl) {
      setIsViewerOpen(true);
    }
  };

  // ============ RENDU ============

  // ----- CAS: Pas de fichier -----
  if (!filename) {
    return (
      <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Aucun justificatif uploadé</p>
        <p className="text-gray-500 text-sm mt-2">
          L'utilisateur n'a pas encore fourni de document
        </p>
      </div>
    );
  }

  // ----- CAS: Chargement -----
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
        <div className="relative">
          <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin opacity-50"></div>
          </div>
        </div>
        <p className="text-gray-600 font-medium">
          Chargement du justificatif...
        </p>
        <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
      </div>
    );
  }

  // ----- CAS: Erreur de chargement -----
  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-8 text-center border-2 border-red-200">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h4 className="text-lg font-semibold text-red-800 mb-2">
          Erreur de chargement
        </h4>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Réessayer
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2.5 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>
      </div>
    );
  }

  // ----- CAS: Image (PNG, JPG, etc.) -----
  if (mimetype?.startsWith("image/")) {
    return (
      <>
        <div className="space-y-3">
          {/* Miniature cliquable */}
          <div
            className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 cursor-pointer group relative hover:border-blue-300 transition-all"
            onClick={handleOpenViewer}
          >
            {/* Badge "Cliquer pour agrandir" */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Agrandir</span>
            </div>

            {/* Image miniature */}
            <div className="relative max-h-[500px] overflow-hidden flex items-center justify-center p-2 bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={imageUrl}
                alt="Justificatif"
                className="max-w-full h-auto object-contain max-h-[400px] group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay au survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Barre d'information */}
            <div className="border-t bg-white px-4 py-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {filename}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Image
              </span>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-500 text-center italic">
            Cliquez sur l'image pour l'afficher en taille réelle
          </p>
        </div>

        {/* 📸 VIEWER PLEIN ÉCRAN */}
        <ImageViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          imageUrl={imageUrl}
          filename={filename}
        />
      </>
    );
  }

  // ----- CAS: PDF -----
  if (mimetype === "application/pdf") {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
        <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-12 h-12 text-red-600" />
        </div>
        <h4 className="text-xl font-semibold text-gray-900 mb-3">
          Document PDF
        </h4>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          La prévisualisation n'est pas disponible pour ce format. Téléchargez
          le fichier pour le consulter.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onDownload}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            Télécharger le PDF
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">{filename}</p>
      </div>
    );
  }

  // ----- CAS: Autre type de fichier -----
  return (
    <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-10 h-10 text-gray-500" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        Format non reconnu
      </h4>
      <p className="text-gray-600 mb-6">
        Ce type de fichier ne peut pas être prévisualisé.
      </p>
      <button
        onClick={onDownload}
        className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2 mx-auto transition-colors"
      >
        <Download className="w-4 h-4" />
        Télécharger
      </button>
      <p className="text-xs text-gray-400 mt-4">{filename}</p>
    </div>
  );
};

export default ProofViewer;
