'use client';
import React, { useEffect, useState } from "react";
import {
  Lock,
  AlertCircle,
  BookOpen,
  X,
  Loader2,
} from "lucide-react";

const PDFViewer = ({ pdfUrl, bookTitle, bookAuthor, onClose }) => {
  const [status, setStatus] = useState("loading"); // loading | open | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let objectUrl = null;

    const openPDF = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(pdfUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.status === 401 || res.status === 403) {
          setErrorMsg("Accès non autorisé. Vérifiez que votre compte est validé.");
          setStatus("error");
          return;
        }
        if (!res.ok) {
          setErrorMsg(`Impossible de charger le document (erreur ${res.status}).`);
          setStatus("error");
          return;
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        // Ouvrir dans un nouvel onglet — URL temporaire locale, non téléchargeable
        const newTab = window.open(objectUrl, "_blank", "noopener,noreferrer");
        if (!newTab) {
          setErrorMsg("Le navigateur a bloqué le pop-up. Autorisez les pop-ups pour ce site puis réessayez.");
          setStatus("error");
          return;
        }

        setStatus("open");

        // Révoquer le blob URL après 5 min (le PDF est déjà chargé dans l'onglet)
        setTimeout(() => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }, 5 * 60 * 1000);
      } catch (err) {
        setErrorMsg("Erreur réseau. Vérifiez votre connexion et réessayez.");
        setStatus("error");
      }
    };

    openPDF();

    return () => {
      // Ne pas révoquer immédiatement — l'onglet est encore en train de charger
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{bookTitle}</h2>
              {bookAuthor && <p className="text-gray-500 text-sm mt-1">{bookAuthor}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* État : chargement */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-8 gap-4">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            <p className="text-gray-600 text-center">Chargement du document sécurisé…</p>
          </div>
        )}

        {/* État : ouvert */}
        {status === "open" && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-5">
            <p className="text-green-800 font-semibold mb-1">Document ouvert dans un nouvel onglet ✓</p>
            <p className="text-green-700 text-sm">
              Le document s'affiche dans votre navigateur. Si l'onglet ne s'est pas ouvert,
              autorisez les pop-ups pour ce site.
            </p>
          </div>
        )}

        {/* État : erreur */}
        {status === "error" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 mb-1">Impossible d'ouvrir le document</p>
              <p className="text-red-800 text-sm">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Protection DRM */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Lecture en ligne uniquement — téléchargement désactivé</li>
              <li>• Reproduction et distribution interdites</li>
              <li>• © Association des Sociologues Malgaches (ASM) 2026</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition font-semibold"
        >
          Retour à la bibliothèque
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
