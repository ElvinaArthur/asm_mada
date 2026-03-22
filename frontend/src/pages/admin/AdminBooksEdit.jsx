// frontend/src/pages/admin/AdminBooksEdit.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  BookOpen,
  User,
  FileText,
  Image,
  Tag,
  Calendar,
  Clock,
  Hash,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const AdminBooksEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [book, setBook] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    pdf: 0,
    thumbnail: 0,
  });
  const [uploadStatus, setUploadStatus] = useState({
    pdf: null,
    thumbnail: null,
  });
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "sociologie",
    year: "",
    pages: "",
    readTime: "",
    fileName: "",
    thumbnail: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: "sociologie", label: "Sociologie" },
    { value: "psychologie", label: "Psychologie" },
    { value: "travail", label: "Travail" },
    { value: "santé", label: "Santé" },
    { value: "environnement", label: "Environnement" },
    { value: "éducation", label: "Éducation" },
    { value: "économie", label: "Économie" },
    { value: "politique", label: "Politique" },
    { value: "histoire", label: "Histoire" },
    { value: "philosophie", label: "Philosophie" },
  ];

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBookById(id);
      const bookData = response.data;

      setBook(bookData);
      setFormData({
        title: bookData.title || "",
        author: bookData.author || "",
        description: bookData.description || "",
        category: bookData.category || "sociologie",
        year: bookData.year || "",
        pages: bookData.pages || "",
        readTime: bookData.readTime || "",
        fileName: bookData.fileName || "",
        thumbnail: bookData.thumbnail || "",
      });
    } catch (error) {
      console.error("Erreur chargement livre:", error);
      alert("Erreur: " + error.message);
      navigate("/admin/books");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.author.trim()) newErrors.author = "L'auteur est requis";
    if (!formData.category) newErrors.category = "La catégorie est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (file, type) => {
    try {
      setUploadStatus((prev) => ({ ...prev, [type]: "uploading" }));

      // Simulation de progression
      const interval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          [type]: Math.min(prev[type] + 10, 90),
        }));
      }, 100);

      // Upload réel
      const response = await adminService.uploadFile(file, type);

      clearInterval(interval);
      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));
      setUploadStatus((prev) => ({ ...prev, [type]: "success" }));

      return response.data.filename;
    } catch (error) {
      setUploadStatus((prev) => ({ ...prev, [type]: "error" }));
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setErrors({});

    try {
      let finalData = { ...formData };

      // Upload des nouveaux fichiers si fournis
      if (pdfFile) {
        const filename = await handleFileUpload(pdfFile, "pdf");
        finalData.fileName = filename;
      }

      if (thumbnailFile) {
        const filename = await handleFileUpload(thumbnailFile, "thumbnail");
        finalData.thumbnail = filename;
      }

      // Mettre à jour le livre
      await adminService.updateBook(id, finalData);

      setSuccess(true);

      // Rediriger après succès
      setTimeout(() => {
        navigate("/admin/books");
      }, 2000);
    } catch (error) {
      console.error("Erreur mise à jour livre:", error);
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer définitivement le livre "${book.title}" ?`)) {
      return;
    }

    try {
      await adminService.deleteBook(id);
      alert("Livre supprimé avec succès !");
      navigate("/admin/books");
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  const FormField = ({
    label,
    icon: Icon,
    children,
    error,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  const UploadBox = ({
    type,
    accept,
    currentFile,
    onFileChange,
    progress,
    status,
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
      <input
        type="file"
        id={`file-${type}`}
        accept={accept}
        onChange={(e) => onFileChange(e.target.files[0])}
        className="hidden"
      />

      <label htmlFor={`file-${type}`} className="cursor-pointer">
        {status === "uploading" ? (
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Téléchargement... {progress}%
            </p>
          </div>
        ) : status === "success" ? (
          <div className="text-green-600">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium">Fichier téléchargé</p>
          </div>
        ) : pdfFile || thumbnailFile ? (
          <div>
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <p className="font-medium">{(pdfFile || thumbnailFile)?.name}</p>
            <p className="text-sm text-gray-600">
              {((pdfFile || thumbnailFile)?.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : currentFile ? (
          <div>
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="font-medium">Fichier actuel</p>
            <p className="text-sm text-gray-600">{currentFile}</p>
            <p className="text-xs text-gray-500 mt-2">Cliquer pour remplacer</p>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">
              Cliquez pour télécharger
            </p>
            <p className="text-sm text-gray-500">
              {type === "pdf"
                ? "PDF uniquement (max 10MB)"
                : "Image (PNG, JPG, max 5MB)"}
            </p>
          </div>
        )}
      </label>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du livre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/books")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la bibliothèque
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Modifier le livre
              </h1>
              <p className="text-gray-600">
                Modifiez les informations du livre
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Supprimer
            </button>
          </div>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Livre mis à jour avec succès !</p>
              <p className="text-sm">Redirection vers la bibliothèque...</p>
            </div>
          </motion.div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Informations du livre
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Titre"
                icon={BookOpen}
                error={errors.title}
                required
              >
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre complet du livre"
                />
              </FormField>

              <FormField
                label="Auteur"
                icon={User}
                error={errors.author}
                required
              >
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de l'auteur"
                />
              </FormField>

              <FormField
                label="Catégorie"
                icon={Tag}
                error={errors.category}
                required
              >
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Année de publication" icon={Calendar}>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                />
              </FormField>

              <FormField label="Nombre de pages" icon={Hash}>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) =>
                    setFormData({ ...formData, pages: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150"
                  min="1"
                />
              </FormField>

              <FormField label="Temps de lecture estimé" icon={Clock}>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex: 30 minutes, 2 heures"
                />
              </FormField>
            </div>

            <div className="mt-6">
              <FormField label="Description" icon={FileText}>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée du livre..."
                />
              </FormField>
            </div>
          </motion.div>

          {/* Fichiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Fichiers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Fichier PDF"
                  icon={FileText}
                  error={errors.pdf}
                >
                  <UploadBox
                    type="pdf"
                    accept=".pdf"
                    currentFile={formData.fileName}
                    onFileChange={setPdfFile}
                    progress={uploadProgress.pdf}
                    status={uploadStatus.pdf}
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Image de couverture" icon={Image}>
                  <UploadBox
                    type="thumbnail"
                    accept="image/*"
                    currentFile={formData.thumbnail}
                    onFileChange={setThumbnailFile}
                    progress={uploadProgress.thumbnail}
                    status={uploadStatus.thumbnail}
                  />
                </FormField>
              </div>
            </div>

            {book && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">
                  Statistiques du livre
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-blue-600">Vues</p>
                    <p className="text-xl font-bold">{book.views || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600">Téléchargements</p>
                    <p className="text-xl font-bold">{book.downloads || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600">Date d'ajout</p>
                    <p className="text-sm">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600">
                      Dernière mise à jour
                    </p>
                    <p className="text-sm">
                      {new Date(book.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Enregistrer les modifications
                </h3>
                <p className="text-sm text-gray-600">
                  Vérifiez toutes les informations avant de sauvegarder
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/books")}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default AdminBooksEdit;
