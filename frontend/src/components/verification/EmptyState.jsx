import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border p-12 text-center"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        Aucune vérification en attente
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Toutes les demandes d'inscription ont été traitées. Revenez plus tard ou
        consultez la liste complète des membres.
      </p>
      <button
        onClick={() => navigate("/admin/users")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 transition-colors"
      >
        <Users className="w-5 h-5" />
        Voir tous les utilisateurs
      </button>
    </motion.div>
  );
};

export default EmptyState;
