// src/pages/user/UserSettings.jsx
// Page paramètres utilisateur — évite le 404
// Pour l'instant redirige vers le profil avec les sections sensibles

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import {
  Settings,
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
  Shield,
  Palette,
} from "lucide-react";

const UserSettings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("account");

  // ── Changement de mot de passe ─────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      return setPwMsg({
        type: "error",
        text: "Les mots de passe ne correspondent pas.",
      });
    }
    if (pwForm.next.length < 8) {
      return setPwMsg({
        type: "error",
        text: "Le mot de passe doit faire au moins 8 caractères.",
      });
    }
    setPwLoading(true);
    setPwMsg({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://asm-mada.onrender.com/api/user/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: pwForm.current,
            newPassword: pwForm.next,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setPwMsg({
          type: "success",
          text: "Mot de passe mis à jour avec succès !",
        });
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        setPwMsg({
          type: "error",
          text: data.message || "Erreur lors du changement.",
        });
      }
    } catch {
      setPwMsg({ type: "error", text: "Erreur réseau, veuillez réessayer." });
    } finally {
      setPwLoading(false);
    }
  };

  // ── Préférences notifications (état local, pas de backend encore) ──
  const [notifPrefs, setNotifPrefs] = useState({
    newEvents: true,
    newBooks: true,
    accountUpdates: true,
  });

  const sections = [
    { id: "account", label: "Compte", icon: User },
    { id: "security", label: "Sécurité", icon: Lock },
    { id: "notifs", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Confidentialité", icon: Shield },
  ];

  const PwField = ({ id, label, field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPw[field] ? "text" : "password"}
          value={pwForm[field]}
          onChange={(e) =>
            setPwForm((f) => ({ ...f, [field]: e.target.value }))
          }
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
        <button
          type="button"
          onClick={() => setShowPw((s) => ({ ...s, [field]: !s[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPw[field] ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              <Settings className="w-7 h-7 text-green-600" /> Paramètres
            </h1>
            <p className="text-gray-500">
              Gérez votre compte et vos préférences
            </p>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium"
          >
            <User className="w-4 h-4" /> Modifier le profil
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar sections */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-md overflow-hidden">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm transition border-l-2 ${
                    activeSection === s.id
                      ? "bg-green-50 text-green-700 border-green-600 font-medium"
                      : "text-gray-700 border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <s.icon
                      className={`w-4 h-4 ${activeSection === s.id ? "text-green-600" : "text-gray-400"}`}
                    />
                    {s.label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* ── Compte ─────────────────────────────────────── */}
            {activeSection === "account" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Informations du compte
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Nom complet
                      </p>
                      <p className="text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Modifier
                    </Link>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Modifier
                    </Link>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Statut du compte
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user?.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user?.isVerified
                          ? "✓ Vérifié"
                          : "⏳ En attente de vérification"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Membre depuis
                      </p>
                      <p className="text-gray-600 text-sm">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "fr-FR",
                              { year: "numeric", month: "long" },
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="mt-8 pt-6 border-t border-red-100">
                  <h3 className="text-sm font-semibold text-red-600 mb-3">
                    Zone dangereuse
                  </h3>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Vous allez être déconnecté. Continuer ?",
                        )
                      )
                        logout();
                    }}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm"
                  >
                    Se déconnecter de tous les appareils
                  </button>
                </div>
              </div>
            )}

            {/* ── Sécurité ────────────────────────────────────── */}
            {activeSection === "security" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Changer le mot de passe
                </h2>
                {pwMsg.text && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      pwMsg.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {pwMsg.text}
                  </div>
                )}
                <form onSubmit={handleChangePw} className="space-y-4 max-w-sm">
                  <PwField
                    id="current"
                    label="Mot de passe actuel"
                    field="current"
                  />
                  <PwField
                    id="next"
                    label="Nouveau mot de passe"
                    field="next"
                  />
                  <PwField
                    id="confirm"
                    label="Confirmer le nouveau"
                    field="confirm"
                  />
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {pwLoading ? "Enregistrement…" : "Mettre à jour"}
                  </button>
                </form>
              </div>
            )}

            {/* ── Notifications ───────────────────────────────── */}
            {activeSection === "notifs" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Préférences de notifications
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "newEvents",
                      label: "Nouveaux événements",
                      desc: "Soyez informé des prochains événements ASM",
                    },
                    {
                      key: "newBooks",
                      label: "Nouveaux livres",
                      desc: "Notification lors d'ajout de documents à la bibliothèque",
                    },
                    {
                      key: "accountUpdates",
                      label: "Mises à jour du compte",
                      desc: "Vérification, modifications importantes",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifPrefs[key] ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifPrefs[key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  * Les préférences de notifications seront sauvegardées
                  prochainement.
                </p>
              </div>
            )}

            {/* ── Confidentialité ─────────────────────────────── */}
            {activeSection === "privacy" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Confidentialité du profil
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Contrôlez quelles informations sont visibles dans l'annuaire.
                  Ces paramètres se gèrent directement depuis votre profil.
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Gérer la confidentialité dans Mon Profil
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
