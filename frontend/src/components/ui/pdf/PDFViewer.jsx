'use client';
import React, { useEffect, useState } from "react";
import { Lock, BookOpen, X, Loader2, AlertCircle } from "lucide-react";

const PDFViewer = ({ pdfUrl, bookTitle, bookAuthor, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let objectUrl = null;

    const loadPDF = async () => {
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
        setBlobUrl(objectUrl);
        setStatus("ready");
      } catch {
        setErrorMsg("Erreur réseau. Vérifiez votre connexion.");
        setStatus("error");
      }
    };

    loadPDF();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen className="w-5 h-5 text-green-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{bookTitle}</p>
            {bookAuthor && <p className="text-xs text-gray-500 truncate">{bookAuthor}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-2 py-1">
            <Lock className="w-3 h-3" /> Lecture seule · © ASM 2026
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Fermer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Corps */}
      <div className="flex-1 min-h-0 relative">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            <p className="text-gray-600">Chargement du document sécurisé…</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-8">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Impossible d'ouvrir le document</h3>
              <p className="text-gray-600 text-sm mb-6">{errorMsg}</p>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
              >
                Retour à la bibliothèque
              </button>
            </div>
          </div>
        )}

        {status === "ready" && blobUrl && (
          <iframe
            src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-full border-0"
            title={bookTitle}
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
