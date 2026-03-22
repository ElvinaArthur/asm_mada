import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StaggerChildren, SlideUp } from "../../components/ui/animations";
import AuthHeader from "../../components/auth/AuthHeader";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";
import { useAuth } from "../../hooks/AuthContext"; // AJOUTEZ CET IMPORT

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") !== "register",
  );

  useEffect(() => {
    const mode = searchParams.get("mode");
    setIsLogin(mode !== "register");
  }, [searchParams]);

  // Si en cours de chargement ou utilisateur déjà connecté
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <AuthHeader isLogin={isLogin} />

        <StaggerChildren>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <SlideUp delay={0.1}>
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {isLogin ? "Avantages membres" : "Processus d'inscription"}
                  </h3>

                  {isLogin ? (
                    <ul className="space-y-6">
                      <li className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Bibliothèque complète
                          </h4>
                          <p className="text-gray-600">
                            Accès à toutes les publications scientifiques
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Événements exclusifs
                          </h4>
                          <p className="text-gray-600">
                            Colloques et formations réservés aux membres
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Réseau professionnel
                          </h4>
                          <p className="text-gray-600">
                            Rencontrez d'autres sociologues de Madagascar
                          </p>
                        </div>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-6">
                      <li className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Remplissez le formulaire
                          </h4>
                          <p className="text-gray-600">
                            Informations personnelles et professionnelles
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Téléchargez votre justificatif
                          </h4>
                          <p className="text-gray-600">
                            Bordereau d'inscription ou quittance de paiement
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Attendez la vérification
                          </h4>
                          <p className="text-gray-600">
                            Validation par l'administrateur sous 48h
                          </p>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </SlideUp>

            {/* Right Column - Form */}
            <SlideUp delay={0.2}>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                {/* Toggle */}
                <div className="flex space-x-4 mb-8">
                  <PrimaryButton
                    onClick={() => navigate("/auth?mode=login")}
                    className={`flex-1 ${!isLogin ? "opacity-50" : ""}`}
                  >
                    Connexion
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() => navigate("/auth?mode=register")}
                    className={`flex-1 ${isLogin ? "opacity-50" : ""}`}
                  >
                    Inscription
                  </SecondaryButton>
                </div>

                {/* Form */}
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </div>
            </SlideUp>
          </div>
        </StaggerChildren>
      </div>
    </div>
  );
};

export default AuthPage;
