import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { FadeIn, SlideUp } from "../../components/ui/animations";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulation d'envoi d'email
    setTimeout(() => {
      if (email && email.includes("@")) {
        setSuccess(true);
        console.log("Reset email sent to:", email);
      } else {
        setError("Veuillez entrer une adresse email valide.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <SlideUp>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-asm-green-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Mot de passe oublié
            </h2>
            <p className="text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {success ? (
            <FadeIn>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-50 rounded-full mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email envoyé avec succès !
                </h3>
                <p className="text-gray-600 mb-6">
                  Consultez votre boîte de réception ({email}) et suivez les
                  instructions pour réinitialiser votre mot de passe.
                </p>
                <div className="space-y-3">
                  <PrimaryButton
                    onClick={() => (window.location.href = `mailto:${email}`)}
                    className="w-full"
                  >
                    Ouvrir ma boîte mail
                  </PrimaryButton>
                  <Link
                    to="/auth"
                    className="block text-center text-asm-green-600 hover:text-asm-green-700 font-medium"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                    placeholder="exemple@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <PrimaryButton
                type="submit"
                disabled={loading}
                className="w-full py-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </div>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </PrimaryButton>
            </form>
          )}

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Vous n'avez pas reçu l'email ?{" "}
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-asm-green-600 hover:text-asm-green-700 font-medium"
              >
                Réessayer
              </button>
            </p>
          </div>
        </div>
      </SlideUp>
    </div>
  );
};

export default ForgotPassword;
