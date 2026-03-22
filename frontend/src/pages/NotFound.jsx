import React from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { FadeIn, HoverEffect } from "../components/ui/animations";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";

const NotFoundPage = () => {
  return (
    <FadeIn>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🔍</span>
              </div>
            </div>
            <h1 className="text-9xl font-bold bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              Page non trouvée
            </h2>
            <p className="text-gray-600 mt-2">
              Désolé, la page que vous recherchez n'existe pas ou a été
              déplacée.
            </p>
          </div>

          <div className="space-y-4">
            <HoverEffect>
              <Link to="/">
                <PrimaryButton className="w-full py-4 flex items-center justify-center">
                  <Home className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </PrimaryButton>
              </Link>
            </HoverEffect>

            <div className="text-gray-500 text-sm">
              <p className="mb-2">Vous pouvez aussi :</p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/library"
                  className="text-asm-green-600 hover:text-asm-green-700 hover:underline"
                >
                  Explorer la bibliothèque
                </Link>
                <Link
                  to="/about"
                  className="text-asm-green-600 hover:text-asm-green-700 hover:underline"
                >
                  Découvrir l'association
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default NotFoundPage;
