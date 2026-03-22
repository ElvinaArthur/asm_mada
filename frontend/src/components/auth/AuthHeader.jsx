import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { FadeIn, HoverEffect } from "../ui/animations/index";
import PrimaryButton from "../ui/buttons/PrimaryButton";

const AuthHeader = ({ isLogin = true }) => {
  return (
    <FadeIn>
      <div className="text-center mb-12">
        <Link to="/" className="inline-block">
          <HoverEffect>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 bg-clip-text text-transparent">
                  ASM
                </h1>
                <p className="text-gray-600">Espace membres</p>
              </div>
            </div>
          </HoverEffect>
        </Link>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isLogin
            ? "Connectez-vous à votre compte"
            : "Rejoignez notre association"}
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          {isLogin
            ? "Accédez à toutes les ressources de la bibliothèque et participez aux événements exclusifs"
            : "Créez votre compte professionnel pour accéder aux ressources scientifiques de l'ASM"}
        </p>
      </div>
    </FadeIn>
  );
};

export default AuthHeader;
