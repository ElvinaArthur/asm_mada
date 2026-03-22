// frontend/src/pages/admin/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Save,
  Camera,
  Key,
  Bell,
  Globe,
  Award,
  BookOpen,
  TrendingUp,
  Edit2,
  CheckCircle,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../hooks/AuthContext";

const AdminProfile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    graduationYear: "",
    specialization: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProfile();
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        graduationYear: response.data.graduationYear || "",
        specialization: response.data.specialization || "",
        email: response.data.email || "",
      });
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage({ type: "", text: "" });

      await adminService.updateProfile(formData);

      // Mettre à jour le contexte d'auth
      updateUser({
        ...authUser,
        ...formData,
      });

      setSaveMessage({
        type: "success",
        text: "Profil mis à jour avec succès !",
      });

      setEditing(false);
      loadProfile(); // Recharger les données fraîches

      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Erreur: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const InfoCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="font-semibold text-gray-900">
            {value || "Non spécifié"}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Mon profil
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles et vos préférences
              </p>
            </div>
            <div className="flex gap-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Modifier le profil
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        graduationYear: profile.graduationYear || "",
                        specialization: profile.specialization || "",
                        email: profile.email || "",
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              saveMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {saveMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <p>{saveMessage.text}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white border rounded-full shadow-md hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {profile?.firstName} {profile?.lastName}
                      </h2>
                      <p className="text-gray-600 mb-4">{profile?.email}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          <Shield className="w-3 h-3 inline mr-1" />
                          Administrateur
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Vérifié
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Année de graduation
                      </label>
                      <input
                        type="number"
                        value={formData.graduationYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            graduationYear: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialisation
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialization: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Sociologie du développement"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Année de graduation
                      </p>
                      <p className="font-medium text-gray-900">
                        {profile?.graduationYear || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Spécialisation
                      </p>
                      <p className="font-medium text-gray-900">
                        {profile?.specialization || "Non spécifié"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Activity Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Activités récentes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    42
                  </div>
                  <p className="text-sm text-gray-600">Livres ajoutés</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    156
                  </div>
                  <p className="text-sm text-gray-600">Utilisateurs vérifiés</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    2,458
                  </div>
                  <p className="text-sm text-gray-600">Vues PDF</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    89%
                  </div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="font-medium">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "Date inconnue"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Dernière connexion
                      </p>
                      <p className="font-medium">Aujourd'hui, 10:30</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contributions</p>
                      <p className="font-medium">15 documents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Changer le mot de passe</p>
                    <p className="text-sm text-gray-500">
                      Mettre à jour vos identifiants
                    </p>
                  </div>
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Préférences de notifications</p>
                    <p className="text-sm text-gray-500">Gérer les alertes</p>
                  </div>
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Langue et région</p>
                    <p className="text-sm text-gray-500">Français (FR)</p>
                  </div>
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Badges et réalisations</p>
                    <p className="text-sm text-gray-500">
                      Voir vos récompenses
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Statut du compte
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Votre compte administrateur est actif et vérifié.
              </p>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Actif et vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
