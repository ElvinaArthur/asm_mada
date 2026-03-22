// frontend/src/pages/admin/users/components/UserDetailsModal.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Mail,
  Calendar,
  User,
  Shield,
  BookOpen,
  GraduationCap,
  Award,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  Ban,
  Clock,
} from "lucide-react";

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return "Non spécifié";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center ${
                user.role === "admin" ? "bg-purple-200" : "bg-blue-200"
              }`}
            >
              <span className="text-2xl font-bold text-gray-700">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statut */}
            <div className="col-span-2 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Statut du compte
              </h3>
              <div className="flex flex-wrap gap-3">
                <span
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    user.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isVerified ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {user.isVerified ? "Vérifié" : "En attente de vérification"}
                </span>

                <span
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                  {user.isActive ? "Actif" : "Bloqué"}
                </span>

                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                </span>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.title && (
                  <div>
                    <p className="text-sm text-gray-500">Titre</p>
                    <p className="font-medium">{user.title}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parcours académique */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Parcours
              </h3>
              <div className="space-y-3">
                {user.graduationYear && (
                  <div>
                    <p className="text-sm text-gray-500">Année de graduation</p>
                    <p className="font-medium">{user.graduationYear}</p>
                  </div>
                )}
                {user.specialization && (
                  <div>
                    <p className="text-sm text-gray-500">Spécialisation</p>
                    <p className="font-medium">{user.specialization}</p>
                  </div>
                )}
                {user.institution && (
                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-medium">{user.institution}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informations professionnelles */}
            {(user.location || user.expertise) && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professionnel
                </h3>
                <div className="space-y-3">
                  {user.location && (
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {user.location}
                      </p>
                    </div>
                  )}
                  {user.expertise && (
                    <div>
                      <p className="text-sm text-gray-500">Expertise</p>
                      <p className="font-medium">{user.expertise}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Statistiques */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                {user.lastLogin && (
                  <div>
                    <p className="text-sm text-gray-500">Dernière connexion</p>
                    <p className="font-medium">{formatDate(user.lastLogin)}</p>
                  </div>
                )}
                {user.publicationsCount > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Publications</p>
                    <p className="font-medium flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {user.publicationsCount} livre(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pied */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;
