import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, mode = "login" }) => {
  const [authMode, setAuthMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }

    if (authMode === "register") {
      if (!formData.firstName) {
        newErrors.firstName = "Prénom requis";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Nom requis";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirmation requise";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    setLoading(true);

    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (authMode === "login") {
        toast.success("Connexion réussie !");
        // Ici, tu appellerais ton API : await authService.login(formData)
      } else {
        toast.success("Inscription réussie !");
        // Ici, tu appellerais ton API : await authService.register(formData)
      }

      onClose();
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.success("Connexion Google - À implémenter");
    // Ici, tu intégrerais Google OAuth
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {authMode === "login" ? "Connexion" : "Inscription"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {authMode === "login"
                      ? "Accédez à votre compte ASM"
                      : "Rejoignez l'Association des Sociologues Malagasy"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Google Auth */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center space-x-3 border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition"
                  disabled={loading}
                >
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <span>
                    {authMode === "login"
                      ? "Se connecter avec Google"
                      : "S'inscrire avec Google"}
                  </span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Ou continuer avec email
                    </span>
                  </div>
                </div>

                {/* Registration Fields */}
                {authMode === "register" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                            errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Jean"
                          disabled={loading}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                            errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Dupont"
                          disabled={loading}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="votre@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword
                          ? "Cacher le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password (Register only) */}
                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-asm-green-600 to-asm-green-700 hover:from-asm-green-700 hover:to-asm-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      {authMode === "login" ? "Connexion..." : "Inscription..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {authMode === "login" ? (
                        <>
                          <LogIn className="w-5 h-5 mr-2" />
                          Se connecter
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          S'inscrire
                        </>
                      )}
                    </div>
                  )}
                </button>

                {/* Toggle Mode */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    {authMode === "login"
                      ? "Pas encore membre ? "
                      : "Déjà membre ? "}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-asm-green-600 hover:text-asm-green-700 font-medium transition"
                    >
                      {authMode === "login" ? "S'inscrire" : "Se connecter"}
                    </button>
                  </p>
                </div>

                {/* Forgot Password (Login only) */}
                {authMode === "login" && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => toast.info("Fonctionnalité à venir")}
                      className="text-sm text-asm-green-600 hover:text-asm-green-700"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  En continuant, vous acceptez nos{" "}
                  <button
                    onClick={() => toast.info("Conditions à venir")}
                    className="text-asm-green-600 hover:underline"
                  >
                    Conditions d'utilisation
                  </button>{" "}
                  et notre{" "}
                  <button
                    onClick={() => toast.info("Politique à venir")}
                    className="text-asm-green-600 hover:underline"
                  >
                    Politique de confidentialité
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
