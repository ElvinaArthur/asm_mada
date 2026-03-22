import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import { SlideUp } from "../ui/animations/index";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useAuth } from "../../hooks/AuthContext";
import { useUserData } from "../../contexts/UserDataContext";

const LibraryAccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats } = useUserData();

  return (
    <SlideUp>
      <div className="bg-gradient-to-br from-asm-green-500 to-asm-green-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Accès à la bibliothèque</h2>
        <p className="mb-6 opacity-90">
          {user?.isVerified
            ? `Vous avez accès à toutes les ressources (${stats?.booksRead || 0} livres lus)`
            : "Accès limité en attente de vérification"}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-3" />
            <span>Livres et publications</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-3" />
            <span>Articles scientifiques</span>
          </div>
          <div
            className={`flex items-center ${!user?.isVerified ? "opacity-50" : ""}`}
          >
            {user?.isVerified ? (
              <CheckCircle className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            <span>Ressources exclusives</span>
          </div>
        </div>

        <PrimaryButton
          onClick={() => navigate("/library")}
          className="w-full bg-white text-asm-green-600 hover:bg-gray-100"
        >
          Accéder à la bibliothèque
        </PrimaryButton>

        {user?.isVerified && (
          <div className="mt-4 text-center text-sm text-white/80">
            {stats?.booksReading > 0 && (
              <span>{stats.booksReading} livre(s) en cours de lecture</span>
            )}
          </div>
        )}
      </div>
    </SlideUp>
  );
};

export default LibraryAccess;
