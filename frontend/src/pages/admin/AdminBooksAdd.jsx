'use client';
import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Upload, BookOpen, User, FileText, Image, Tag,
  Calendar, Clock, Hash, CheckCircle, AlertCircle, Loader2, X, Plus,
} from "lucide-react";
import { adminService } from "../../services/adminService";

// Catégories thématiques ASM — couvrent catalogue actuel et futur
const CATEGORIES = [
  { value: "sociologie-generale",       label: "Sociologie générale" },
  { value: "sociologie-rurale",         label: "Sociologie rurale" },
  { value: "sociologie-urbaine",        label: "Sociologie urbaine" },
  { value: "methodes-recherche",        label: "Méthodes de recherche" },
  { value: "statistiques-sociales",     label: "Statistiques sociales" },
  { value: "travail-emploi",            label: "Travail et emploi" },
  { value: "famille-demographie",       label: "Famille et démographie" },
  { value: "education-jeunesse",        label: "Éducation et jeunesse" },
  { value: "genre-inegalites",          label: "Genre et inégalités" },
  { value: "sante-societe",             label: "Santé et société" },
  { value: "environnement-developpement", label: "Environnement et développement" },
  { value: "politique-institutions",    label: "Politique et institutions" },
  { value: "economie-sociale",          label: "Économie sociale" },
  { value: "histoire-sociale",          label: "Histoire sociale de Madagascar" },
  { value: "numerique-societe",         label: "Numérique et société" },
  { value: "migrations",               label: "Migrations et mobilités" },
];

// Suggestions de mots-clés fréquents pour guider l'admin
const KEYWORD_SUGGESTIONS = [
  "Madagascar", "inégalités", "terrain", "enquête", "quantitatif", "qualitatif",
  "entretien", "SPSS", "R", "migrations", "rural", "urbain", "famille",
  "jeunesse", "genre", "pauvreté", "développement", "communauté", "identité",
  "mobilisation", "institution", "politique publique", "santé mentale",
  "fracture numérique", "réseaux sociaux", "diaspora", "Antananarivo",
];

const AdminBooksAdd = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const keywordRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "sociologie-generale",
    year: "",
    pages: "",
    readTime: "",
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  }, [errors]);

  // ── Keywords tag input ──────────────────────────────────────────
  const addKeyword = (kw) => {
    const clean = kw.trim().toLowerCase();
    if (clean && !keywords.includes(clean)) {
      setKeywords(prev => [...prev, clean]);
    }
    setKeywordInput("");
    setShowSuggestions(false);
  };

  const removeKeyword = (kw) => setKeywords(prev => prev.filter(k => k !== kw));

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (keywordInput.trim()) addKeyword(keywordInput);
    } else if (e.key === "Backspace" && !keywordInput && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const filteredSuggestions = KEYWORD_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(keywordInput.toLowerCase()) && !keywords.includes(s.toLowerCase())
  );

  // ── Validation ──────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.author.trim()) newErrors.author = "L'auteur est requis";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!pdfFile) newErrors.pdf = "Un fichier PDF est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("author", formData.author);
      uploadData.append("description", formData.description);
      uploadData.append("category", formData.category);
      if (formData.year) uploadData.append("year", formData.year);
      if (formData.pages) uploadData.append("pages", formData.pages);
      if (formData.readTime) uploadData.append("readTime", formData.readTime);
      uploadData.append("keywords", keywords.join(","));
      uploadData.append("pdf", pdfFile);
      if (thumbnailFile) uploadData.append("thumbnail", thumbnailFile);

      const response = await fetch("/api/admin/books", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors de l'ajout");

      setSuccess(true);
      setTimeout(() => router.push("/admin/books"), 2000);
    } catch (error) {
      console.error("Erreur ajout livre:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Sub-components ──────────────────────────────────────────────
  const FormField = ({ label, icon: Icon, children, error, required = false }) => (
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
          <AlertCircle className="w-4 h-4" />{error}
        </p>
      )}
    </div>
  );

  const FileUploadBox = ({ type, accept, file, onFileChange, label }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
      <input type="file" id={`file-${type}`} accept={accept}
        onChange={e => { const f = e.target.files[0]; if (f) onFileChange(f); }}
        className="hidden" />
      <label htmlFor={`file-${type}`} className="cursor-pointer">
        {file ? (
          <div>
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-xs text-gray-500 mt-2">Cliquer pour changer</p>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Cliquez pour télécharger</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.push("/admin/books")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />Retour à la bibliothèque
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ajouter un nouveau livre</h1>
          <p className="text-gray-600">Remplissez les informations du livre et téléchargez les fichiers</p>
        </div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Livre ajouté avec succès !</p>
              <p className="text-sm">Redirection vers la bibliothèque...</p>
            </div>
          </motion.div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" /><p>{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations du livre</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Titre" icon={BookOpen} error={errors.title} required>
                <input type="text" value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre complet du livre" />
              </FormField>

              <FormField label="Auteur" icon={User} error={errors.author} required>
                <input type="text" value={formData.author}
                  onChange={e => handleInputChange("author", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de l'auteur" />
              </FormField>

              <FormField label="Catégorie" icon={Tag} error={errors.category} required>
                <select value={formData.category}
                  onChange={e => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Année de publication" icon={Calendar}>
                <input type="number" value={formData.year}
                  onChange={e => handleInputChange("year", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024" min="1900" max="2100" />
              </FormField>

              <FormField label="Nombre de pages" icon={Hash}>
                <input type="number" value={formData.pages}
                  onChange={e => handleInputChange("pages", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150" min="1" />
              </FormField>

              <FormField label="Temps de lecture estimé" icon={Clock}>
                <input type="text" value={formData.readTime}
                  onChange={e => handleInputChange("readTime", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex: 30 minutes, 2 heures" />
              </FormField>
            </div>

            <div className="mt-6">
              <FormField label="Description" icon={FileText}>
                <textarea value={formData.description}
                  onChange={e => handleInputChange("description", e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée du livre..." />
              </FormField>
            </div>

            {/* Mots-clés */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Mots-clés thématiques
                  <span className="text-xs text-gray-400 font-normal">(Entrée ou virgule pour ajouter)</span>
                </span>
              </label>

              {/* Tags existants */}
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map(kw => (
                    <span key={kw}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {kw}
                      <button type="button" onClick={() => removeKeyword(kw)}
                        className="hover:text-blue-600 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input + autocomplete */}
              <div className="relative">
                <input
                  ref={keywordRef}
                  type="text"
                  value={keywordInput}
                  onChange={e => { setKeywordInput(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={handleKeywordKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tapez un mot-clé et appuyez sur Entrée..."
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map(s => (
                      <button key={s} type="button"
                        onMouseDown={() => addKeyword(s)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex items-center gap-2">
                        <Plus className="w-3 h-3 text-gray-400" />{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Ces mots-clés permettent une recherche fine dans la bibliothèque. Ex : &ldquo;inégalités&rdquo;, &ldquo;Madagascar&rdquo;, &ldquo;méthodes qualitatives&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Fichiers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Fichiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Fichier PDF" icon={FileText} error={errors.pdf} required>
                <FileUploadBox type="pdf" accept=".pdf" file={pdfFile}
                  onFileChange={setPdfFile} label="PDF uniquement (max 50MB)" />
              </FormField>
              <FormField label="Image de couverture" icon={Image}>
                <FileUploadBox type="thumbnail" accept="image/*" file={thumbnailFile}
                  onFileChange={setThumbnailFile} label="Image (PNG, JPG, max 5MB)" />
              </FormField>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Prêt à publier</h3>
                <p className="text-sm text-gray-600">Vérifiez toutes les informations avant de publier</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => router.push("/admin/books")}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Publication en cours...</>
                  ) : (
                    <><CheckCircle className="w-5 h-5" />Publier le livre</>
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

export default AdminBooksAdd;
