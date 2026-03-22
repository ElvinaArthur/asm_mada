// frontend/src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Globe,
  Shield,
  Bell,
  Mail,
  Database,
  Upload,
  Lock,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "ASM Alumni",
    siteDescription: "Bibliothèque numérique des anciens",
    contactEmail: "contact@asm-alumni.com",
    maxFileSize: "10",
    requireVerification: true,
    allowRegistration: true,
    maintenanceMode: false,
    emailNotifications: true,
    autoApproveUsers: false,
    defaultUserRole: "user",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error("Erreur chargement paramètres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage({ type: "", text: "" });

      await adminService.updateSettings(settings);

      setSaveMessage({
        type: "success",
        text: "Paramètres sauvegardés avec succès !",
      });

      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Erreur lors de la sauvegarde: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const ToggleSetting = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Paramètres du site
              </h1>
              <p className="text-gray-600">
                Configurez les paramètres de votre plateforme
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadSettings}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Actualiser
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
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
              <AlertCircle className="w-5 h-5" />
            )}
            <p>{saveMessage.text}</p>
          </motion.div>
        )}

        {/* General Settings */}
        <SettingSection title="Général" icon={Globe}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  handleChange("siteDescription", e.target.value)
                }
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contact
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection title="Sécurité et accès" icon={Shield}>
          <div className="space-y-1">
            <ToggleSetting
              label="Vérification manuelle des utilisateurs"
              description="Les administrateurs doivent vérifier chaque nouvel utilisateur"
              checked={settings.requireVerification}
              onChange={() =>
                handleChange(
                  "requireVerification",
                  !settings.requireVerification,
                )
              }
            />
            <ToggleSetting
              label="Autoriser les nouvelles inscriptions"
              description="Permettre aux nouveaux utilisateurs de s'inscrire"
              checked={settings.allowRegistration}
              onChange={() =>
                handleChange("allowRegistration", !settings.allowRegistration)
              }
            />
            <ToggleSetting
              label="Mode maintenance"
              description="Le site est temporairement indisponible pour les utilisateurs"
              checked={settings.maintenanceMode}
              onChange={() =>
                handleChange("maintenanceMode", !settings.maintenanceMode)
              }
            />
          </div>
        </SettingSection>

        {/* File Settings */}
        <SettingSection title="Fichiers" icon={Upload}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille maximale des fichiers (MB)
              </label>
              <select
                value={settings.maxFileSize}
                onChange={(e) => handleChange("maxFileSize", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5 MB</option>
                <option value="10">10 MB</option>
                <option value="20">20 MB</option>
                <option value="50">50 MB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle par défaut des nouveaux utilisateurs
              </label>
              <select
                value={settings.defaultUserRole}
                onChange={(e) =>
                  handleChange("defaultUserRole", e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">Utilisateur standard</option>
                <option value="member">Membre vérifié</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <div className="space-y-1">
            <ToggleSetting
              label="Notifications par email"
              description="Envoyer des emails pour les nouvelles activités"
              checked={settings.emailNotifications}
              onChange={() =>
                handleChange("emailNotifications", !settings.emailNotifications)
              }
            />
            <ToggleSetting
              label="Approbation automatique"
              description="Approuver automatiquement les utilisateurs après vérification"
              checked={settings.autoApproveUsers}
              onChange={() =>
                handleChange("autoApproveUsers", !settings.autoApproveUsers)
              }
            />
          </div>
        </SettingSection>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              Zone dangereuse
            </h3>
          </div>
          <p className="text-red-700 mb-6">
            Ces actions sont irréversibles. Utilisez avec précaution.
          </p>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2">
              <Database className="w-5 h-5" />
              Réinitialiser la base de données
            </button>
            <button className="w-full px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Supprimer tous les utilisateurs non vérifiés
            </button>
            <button className="w-full px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Révoquer tous les tokens JWT
            </button>
          </div>
        </motion.div>

        {/* System Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations système
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Environnement</p>
              <p className="font-medium">Production</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Dernière sauvegarde</p>
              <p className="font-medium">Il y a 2 heures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
