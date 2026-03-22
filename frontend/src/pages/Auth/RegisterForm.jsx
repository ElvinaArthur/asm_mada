import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, User, Mail, Lock, FileText, Calendar } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    profession: "",
    password: "",
    confirmPassword: "",
    membershipProof: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          membershipProof: "Fichier trop volumineux (max 5MB)",
        });
        return;
      }
      setFormData({ ...formData, membershipProof: file });
      setErrors({ ...errors, membershipProof: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Email invalide";
    if (formData.password.length < 8)
      newErrors.password = "Minimum 8 caractères";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.membershipProof)
      newErrors.membershipProof = "Justificatif requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      });

      // Ici, vous enverriez les données à votre API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   body: formDataToSend
      // });

      // Simuler une réponse
      setTimeout(() => {
        setIsSubmitting(false);
        alert(
          "Inscription réussie ! Votre compte sera activé après vérification.",
        );
        navigate("/auth?mode=login");
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ submit: "Erreur lors de l'inscription" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Prénom
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
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Nom
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
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline w-4 h-4 mr-2" />
          Email professionnel
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent`}
          placeholder="exemple@institution.mg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
            placeholder="+261 XX XX XXX XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Date de naissance
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profession
        </label>
        <input
          type="text"
          value={formData.profession}
          onChange={(e) =>
            setFormData({ ...formData, profession: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
          placeholder="Sociologue, Chercheur, Enseignant..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="inline w-4 h-4 mr-2" />
            Mot de passe
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
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="inline w-4 h-4 mr-2" />
            Confirmer le mot de passe
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
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-asm-green-50 border-2 border-dashed border-asm-green-200 rounded-xl p-6">
        <div className="text-center">
          <Upload className="w-12 h-12 text-asm-green-500 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">
            Justificatif d'adhésion
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Téléchargez votre bordereau d'inscription ou quittus de paiement
          </p>

          <div className="relative">
            <input
              type="file"
              id="membershipProof"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="membershipProof"
              className="inline-flex items-center px-6 py-3 bg-asm-green-600 text-white font-medium rounded-lg hover:bg-asm-green-700 transition cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choisir un fichier
            </label>
          </div>

          {formData.membershipProof && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-asm-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formData.membershipProof.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(formData.membershipProof.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, membershipProof: null })
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}

          {errors.membershipProof && (
            <p className="text-red-500 text-sm mt-2">
              {errors.membershipProof}
            </p>
          )}

          <p className="text-gray-500 text-xs mt-4">
            Formats acceptés: PDF, JPG, PNG (max 5MB)
          </p>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 px-6 bg-gradient-to-r from-asm-green-500 to-asm-green-600 text-white font-semibold rounded-lg hover:from-asm-green-600 hover:to-asm-green-700 transition-all shadow-lg ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting
          ? "Inscription en cours..."
          : "S'inscrire et envoyer pour vérification"}
      </button>

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
