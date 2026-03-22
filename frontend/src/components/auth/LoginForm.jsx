// src/components/auth/LoginForm.jsx - VERSION CORRIGÉE
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { SlideUp } from "../ui/animations/index";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useAuth } from "../../hooks/AuthContext";

const LoginForm = () => {
  const { login, error: authError, setError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError("");

    if (!formData.email || !formData.password) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: formData.email,
        password: formData.password,
      });
      // La redirection est gérée dans le contexte AuthContext
    } catch (err) {
      setLocalError(err.message || "Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SlideUp>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
            placeholder="votre@email.com"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <Lock className="inline w-4 h-4 mr-2" />
              Mot de passe
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-asm-green-600 hover:text-asm-green-700 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
            placeholder="Votre mot de passe"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
            className="h-4 w-4 text-asm-green-600 focus:ring-asm-green-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Se souvenir de moi
          </label>
        </div>

        {/* Afficher les erreurs */}
        {(localError || authError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{localError || authError}</p>
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connexion en cours...
            </div>
          ) : (
            "Se connecter"
          )}
        </PrimaryButton>

        {/* Message info */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>
            Pas encore de compte ?{" "}
            <Link
              to="/auth?mode=register"
              className="text-asm-green-600 hover:text-asm-green-700 font-medium underline"
            >
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </form>
    </SlideUp>
  );
};

export default LoginForm;
