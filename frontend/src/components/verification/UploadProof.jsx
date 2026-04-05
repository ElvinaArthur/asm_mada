// frontend/src/components/verification/UploadProof.jsx
import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

const UploadProof = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedProof, setUploadedProof] = useState(null);
  const fileInputRef = useRef(null);

  // Charger le justificatif existant
  React.useEffect(() => {
    loadExistingProof();
  }, []);

  const loadExistingProof = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "https://asm-mada.onrender.com/api/proofs/my-proof",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUploadedProof(data.data);
        }
      }
    } catch (error) {
      console.error("Erreur chargement justificatif:", error);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(selectedFile.type)) {
      setError("Seuls les fichiers JPG, PNG et PDF sont acceptés");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Le fichier ne doit pas dépasser 5MB");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("proof", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(
        "https://asm-mada.onrender.com/api/proofs/upload-proof",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Justificatif envoyé avec succès ! Votre compte est en attente de vérification.",
        );
        setFile(null);
        loadExistingProof();

        // Réinitialiser le champ de fichier
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(data.message || "Erreur lors de l'upload");
      }
    } catch (error) {
      setError(error.message || "Erreur lors de l'envoi du fichier");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/")) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (mimetype === "application/pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            En attente
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Approuvé
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Justificatif d'adhésion
          </h1>
          <p className="text-gray-600">
            Téléversez votre carte de membre ou certificat pour vérifier votre
            compte
          </p>
        </div>

        {/* Justificatif existant */}
        {uploadedProof && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>Justificatif actuel</span>
                {getStatusBadge(uploadedProof.status)}
              </h3>

              <div className="flex items-center gap-4 mb-4">
                {getFileIcon(uploadedProof.mimetype)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {uploadedProof.originalname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedProof.size)} • Uploadé le{" "}
                    {formatDate(uploadedProof.uploaded_at)}
                  </p>
                </div>
                <a
                  href={`https://asm-mada.onrender.com/api/proofs/download/${uploadedProof.filename}`}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  download
                >
                  Télécharger
                </a>
              </div>

              {uploadedProof.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Raison du rejet
                  </h4>
                  <p className="text-red-700">
                    {uploadedProof.rejection_reason}
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    Veuillez téléverser un nouveau justificatif
                  </p>
                </div>
              )}

              {uploadedProof.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700">
                    Votre justificatif est en cours de vérification par un
                    administrateur. Vous serez notifié par email une fois
                    vérifié.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zone d'upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

          <input
            ref={fileInputRef}
            type="file"
            id="proof-upload"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <label htmlFor="proof-upload" className="cursor-pointer block">
            <p className="text-gray-700 mb-2">
              {file ? file.name : "Cliquez pour sélectionner un fichier"}
            </p>
            <span className="text-blue-600 hover:text-blue-700 font-medium">
              {file ? "Changer de fichier" : "Parcourir..."}
            </span>
          </label>

          <p className="text-sm text-gray-500 mt-4">
            Formats acceptés : JPG, PNG, PDF (max 5MB)
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Bouton d'upload */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {uploadedProof
                  ? "Remplacer le justificatif"
                  : "Envoyer pour vérification"}
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">Instructions :</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                1
              </div>
              <span>
                Téléversez une photo claire de votre carte de membre ou
                certificat
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                2
              </div>
              <span>
                Le document doit être lisible et en français ou en anglais
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                3
              </div>
              <span>
                Vérification manuelle par un administrateur sous 24-48h
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                4
              </div>
              <span>
                Vous recevrez une notification par email une fois vérifié
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadProof;
