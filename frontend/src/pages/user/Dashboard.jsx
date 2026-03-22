// src/pages/user/Dashboard.jsx - VERSION SIMPLE ET PROPRE
import React from "react";
import {
  User,
  LogOut,
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";
import { useUserData } from "../../contexts/UserDataContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { stats, loading, recentActivity } = useUserData();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-white/80">Membre ASM</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isVerified
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {user.isVerified ? "Compte vérifié" : "En vérification"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert si non vérifié */}
        {!user.isVerified && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <div className="flex">
              <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Vérification en cours
                </h3>
                <p className="text-yellow-700">
                  Votre compte est en cours de vérification par l'administrateur
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Livres lus"
            value={stats.booksRead}
            color="bg-blue-500"
            loading={loading}
          />
          <StatCard
            icon={FileText}
            label="En cours"
            value={stats.booksReading}
            color="bg-green-500"
            loading={loading}
          />
          <StatCard
            icon={Calendar}
            label="Événements"
            value={stats.eventsAttended}
            color="bg-yellow-500"
            loading={loading}
          />
          <StatCard
            icon={Clock}
            label="Jours restants"
            value={stats.daysRemaining}
            color="bg-purple-500"
            loading={loading}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Actions rapides */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Accès rapide
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                  href="/library"
                  icon={BookOpen}
                  label="Bibliothèque"
                  color="from-blue-500 to-blue-600"
                />
                <QuickActionCard
                  href="/profile"
                  icon={User}
                  label="Mon profil"
                  color="from-green-500 to-green-600"
                />
                <QuickActionCard
                  href="/events"
                  icon={Calendar}
                  label="Événements"
                  color="from-yellow-500 to-yellow-600"
                />
                <QuickActionCard
                  href="/documents"
                  icon={FileText}
                  label="Documents"
                  color="from-purple-500 to-purple-600"
                />
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Activité récente
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucune activité récente
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Infos compte */}
          <div className="space-y-8">
            <AccountInfo user={user} />
            <LibraryAccess user={user} stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Composants helpers
const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        )}
      </div>
      <div
        className={`${color} w-12 h-12 rounded-xl flex items-center justify-center`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ href, icon: Icon, label, color }) => (
  <a
    href={href}
    className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white text-center hover:shadow-xl transition-all`}
  >
    <Icon className="w-8 h-8 mx-auto mb-3" />
    <span className="font-medium">{label}</span>
  </a>
);

const ActivityIcon = ({ type }) => {
  const icons = {
    book_read: <BookOpen className="w-5 h-5 text-blue-600" />,
    event_registered: <Calendar className="w-5 h-5 text-green-600" />,
    login: <User className="w-5 h-5 text-gray-600" />,
  };
  return icons[type] || <FileText className="w-5 h-5 text-gray-600" />;
};

const AccountInfo = ({ user }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <User className="w-6 h-6 mr-3 text-green-500" />
      Statut du compte
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Adhésion</span>
        <span className="font-medium text-gray-900">Annuelle</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Email</span>
        <span className="font-medium text-gray-900 text-sm">{user.email}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Niveau</span>
        <span className="font-medium text-green-600">
          {user.role === "admin" ? "Admin" : "Membre"}
        </span>
      </div>
    </div>
  </div>
);

const LibraryAccess = ({ user, stats }) => (
  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
    <h2 className="text-xl font-bold mb-4">Accès bibliothèque</h2>
    <p className="mb-6 opacity-90">
      {user.isVerified
        ? `${stats.booksRead} livres lus`
        : "Accès limité en attente de vérification"}
    </p>
    <a
      href="/library"
      className="block w-full bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-center font-medium transition"
    >
      Accéder à la bibliothèque
    </a>
  </div>
);

export default Dashboard;
