// frontend/src/pages/admin/verifications/components/ImageViewer.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";

const ImageViewer = ({ isOpen, onClose, imageUrl, filename }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-98 z-[100] flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Barre d'outils */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center z-[101]">
        <div className="flex gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            title="Zoom avant"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            title="Zoom arrière"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            title="Taille réelle"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        <div className="text-white/80 text-sm">{Math.round(scale * 100)}%</div>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Fermer (Échap)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nom du fichier en bas */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm z-[101]">
        {filename}
      </div>

      {/* Image avec zoom et drag */}
      <div
        className="w-full h-full overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
      >
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={imageUrl}
          alt={filename}
          className="select-none"
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "none",
            maxHeight: "none",
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.1s ease",
            cursor: scale > 1 ? "grab" : "default",
          }}
          draggable={false}
        />
      </div>

      {/* Indicateur de zoom */}
      {scale > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full text-sm">
          Faites glisser pour vous déplacer
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
