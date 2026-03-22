// src/components/auth/RegisterForm.jsx - VERSION COMPLÈTE ET CORRIGÉE
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  User,
  Mail,
  Lock,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";
import PrimaryButton from "../ui/buttons/PrimaryButton";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    graduationYear: "",
    specialization: "",
    proof: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFormData({ ...formData, proof: null });
      setErrors({ ...errors, proof: "" });
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        proof: "Format non supporté. Utilisez JPG, PNG ou PDF uniquement.",
      });
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        proof: "Fichier trop volumineux (maximum 5MB)",
      });
      return;
    }

    setFormData({ ...formData, proof: file });
    setErrors({ ...errors, proof: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des champs requis
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Validation mot de passe
    if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Validation justificatif
    if (!formData.proof) {
      newErrors.proof = "Le justificatif d'adhésion est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Créer FormData pour l'upload
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName.trim());
      formDataToSend.append("lastName", formData.lastName.trim());
      formDataToSend.append("email", formData.email.trim().toLowerCase());
      formDataToSend.append("password", formData.password);

      if (formData.graduationYear) {
        formDataToSend.append("graduationYear", formData.graduationYear);
      }

      if (formData.specialization) {
        formDataToSend.append("specialization", formData.specialization.trim());
      }

      // IMPORTANT: Le champ doit s'appeler "proof" côté backend
      formDataToSend.append("proof", formData.proof);

      setUploadProgress(25);

      // Envoyer la requête
      const response = await fetch(
        "http://localhost:3000/api/register/register",
        {
          method: "POST",
          body: formDataToSend,
          // NE PAS mettre Content-Type, le navigateur le gère automatiquement avec FormData
        },
      );

      setUploadProgress(75);

      const data = await response.json();

      setUploadProgress(100);

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Stocker le token et l'utilisateur
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Rediriger vers la page d'attente de vérification
      setTimeout(() => {
        navigate("/verification-pending");
      }, 1000);
    } catch (error) {
      console.error("Erreur inscription:", error);
      setErrors({
        submit:
          error.message || "Une erreur est survenue lors de l'inscription",
      });
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, proof: null });
    setErrors({ ...errors, proof: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prénom et Nom */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent`}
            placeholder="Votre prénom"
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent`}
            placeholder="Votre nom"
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline w-4 h-4 mr-2" />
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent`}
          placeholder="exemple@email.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Année de graduation et Spécialisation */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Année de graduation
          </label>
          <input
            type="number"
            value={formData.graduationYear}
            onChange={(e) =>
              setFormData({ ...formData, graduationYear: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
            placeholder="2020"
            min="1950"
            max={new Date().getFullYear()}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécialisation
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
            placeholder="Sociologie générale, du travail..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="inline w-4 h-4 mr-2" />
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent`}
            placeholder="Minimum 8 caractères"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="inline w-4 h-4 mr-2" />
            Confirmer le mot de passe <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent`}
            placeholder="Retapez votre mot de passe"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* Upload justificatif */}
      <div
        className={`bg-asm-green-50 border-2 border-dashed rounded-xl p-6 ${
          errors.proof ? "border-red-500" : "border-asm-green-200"
        }`}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 text-asm-green-500 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">
            Justificatif d'adhésion <span className="text-red-500">*</span>
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Téléchargez votre bordereau d'inscription ou quittance de paiement
          </p>

          {!formData.proof ? (
            <div className="relative">
              <input
                type="file"
                id="proofUpload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isSubmitting}
              />
              <label
                htmlFor="proofUpload"
                className={`inline-flex items-center px-6 py-3 bg-asm-green-600 text-white font-medium rounded-lg hover:bg-asm-green-700 transition cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Choisir un fichier
              </label>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {formData.proof.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(formData.proof.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isSubmitting}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {errors.proof && (
            <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.proof}
            </p>
          )}

          <p className="text-gray-500 text-xs mt-4">
            Formats acceptés: PDF, JPG, PNG (max 5MB)
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Inscription en cours...
            </span>
            <span className="text-sm font-medium text-blue-900">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Erreur globale */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{errors.submit}</p>
        </div>
      )}

      {/* Bouton submit */}
      <PrimaryButton
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Inscription en cours...
          </div>
        ) : (
          "S'inscrire et envoyer pour vérification"
        )}
      </PrimaryButton>

      {/* Conditions */}
      <p className="text-center text-gray-600 text-sm">
        En vous inscrivant, vous acceptez nos{" "}
        <a href="/terms" className="text-asm-green-600 hover:underline">
          conditions d'utilisation
        </a>{" "}
        et notre{" "}
        <a href="/privacy" className="text-asm-green-600 hover:underline">
          politique de confidentialité
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
