import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { FadeIn, SlideUp } from "../../components/ui/animations";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import AuthHeader from "../../components/auth/AuthHeader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <FadeIn>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <AuthHeader isLogin={true} />

          <SlideUp>
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {!isSubmitted ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Réinitialiser votre mot de passe
                  </h2>

                  <p className="text-gray-600 mb-6">
                    Entrez votre adresse email et nous vous enverrons un lien
                    pour réinitialiser votre mot de passe.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>

                    <PrimaryButton
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4"
                    >
                      {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                    </PrimaryButton>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Email envoyé !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vérifiez votre boîte de réception pour le lien de
                    réinitialisation.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/auth?mode=login"
                  className="flex items-center text-asm-green-600 hover:text-asm-green-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </FadeIn>
  );
};

export default ForgotPasswordPage;
