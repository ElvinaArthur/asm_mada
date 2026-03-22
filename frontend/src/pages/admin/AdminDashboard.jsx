import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  User,
  Calendar,
  Upload,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Shield,
  Plus,
  Bell,
  Award,
  BookMarked,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { adminService } from "../../services/adminService";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fonction pour déterminer la vue active basée sur l'URL
  const getActiveView = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/dashboard") return "dashboard";
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/books")) return "books";
    if (path.includes("/admin/verifications")) return "verifications";
    if (path.includes("/admin/events")) return "events";
    if (path.includes("/admin/settings")) return "settings";
    if (path.includes("/admin/profile")) return "profile";
    return "dashboard";
  };

  const activeView = getActiveView();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data.data);

      // Simuler des activités récentes
      setRecentActivities([
        {
          id: 1,
          type: "user",
          action: "Inscription",
          user: "John Doe",
          time: "10 min ago",
          link: "/admin/users",
        },
        {
          id: 2,
          type: "book",
          action: "Ajout livre",
          title: "Sociologie Moderne",
          time: "1 heure ago",
          link: "/admin/books",
        },
        {
          id: 3,
          type: "verification",
          action: "Compte vérifié",
          user: "Jane Smith",
          time: "2 heures ago",
          link: "/admin/verifications",
        },
        {
          id: 4,
          type: "view",
          action: "PDF consulté",
          title: "Psychologie Sociale",
          time: "3 heures ago",
          link: "/admin/books",
        },
      ]);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cartes de statistiques
  const StatCard = ({ title, value, icon: Icon, color, change, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm mt-2 ${change > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}% vs mois dernier
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  // Quick Action Button
  const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white border rounded-xl p-5 text-left hover:shadow-md transition-all ${color}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-opacity-10">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </motion.button>
  );

  // Composant NavItem avec liens corrigés
  const NavItem = ({
    icon: Icon,
    label,
    count,
    active,
    onClick,
    isMobile = false,
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "text-gray-700 hover:bg-gray-100"
      } ${isMobile ? "text-sm" : ""}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            active ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de Bord Admin
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenue,{" "}
                <span className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Shield className="w-4 h-4" />
                <span>Administrateur</span>
              </div>

              <button
                onClick={() => navigate("/admin/profile")} // CORRIGÉ
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Mon Profil</span>
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation latérale pour desktop + barre supérieure pour mobile */}
      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <NavItem
              icon={BarChart3}
              label="Dashboard"
              active={activeView === "dashboard"}
              onClick={() => navigate("/admin")}
            />
            <NavItem
              icon={Users}
              label="Utilisateurs"
              count={stats?.totals?.pendingUsers || 0}
              active={activeView === "users"}
              onClick={() => navigate("/admin/users")} // CORRIGÉ
            />
            <NavItem
              icon={BookOpen}
              label="Bibliothèque"
              count={stats?.totals?.books || 0}
              active={activeView === "books"}
              onClick={() => navigate("/admin/books")} // CORRIGÉ
            />
            <NavItem
              icon={CheckCircle}
              label="Vérifications"
              active={activeView === "verifications"}
              onClick={() => navigate("/admin/verifications")} // CORRIGÉ
            />
            <NavItem
              icon={Calendar}
              label="Événements"
              active={activeView === "events"}
              onClick={() => navigate("/admin/events")} // CORRIGÉ
            />
            <NavItem
              icon={Settings}
              label="Paramètres"
              active={activeView === "settings"}
              onClick={() => navigate("/admin/settings")} // CORRIGÉ
            />
          </nav>

          {/* Stats rapides sidebar */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Statistiques rapides
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Utilisateurs actifs</span>
                <span className="font-semibold">
                  {stats?.totals?.users || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livres en ligne</span>
                <span className="font-semibold">
                  {stats?.totals?.books || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total des vues</span>
                <span className="font-semibold">
                  {stats?.totals?.views || 0}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Navigation mobile */}
          <div className="lg:hidden mb-6">
            <div className="flex overflow-x-auto gap-2 pb-2">
              {[
                { id: "dashboard", label: "Dashboard", path: "/admin" },
                { id: "users", label: "Utilisateurs", path: "/admin/users" },
                { id: "books", label: "Livres", path: "/admin/books" },
                {
                  id: "verifications",
                  label: "Vérifications",
                  path: "/admin/verifications",
                },
                { id: "events", label: "Événements", path: "/admin/events" },
                {
                  id: "settings",
                  label: "Paramètres",
                  path: "/admin/settings",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeView === item.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Bonjour, {user?.firstName} 👋
                    </h2>
                    <p className="text-blue-100">
                      Voici un aperçu de votre plateforme aujourd'hui
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/books/add")}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Ajouter un livre
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Utilisateurs totaux"
                  value={stats?.totals?.users || 0}
                  icon={Users}
                  color="bg-blue-500"
                  change={12}
                  onClick={() => navigate("/admin/users")} // CORRIGÉ
                />
                <StatCard
                  title="Livres en ligne"
                  value={stats?.totals?.books || 0}
                  icon={BookOpen}
                  color="bg-green-500"
                  change={8}
                  onClick={() => navigate("/admin/books")} // CORRIGÉ
                />
                <StatCard
                  title="En attente"
                  value={stats?.totals?.pendingUsers || 0}
                  icon={Clock}
                  color="bg-yellow-500"
                  change={-5}
                  onClick={() => navigate("/admin/verifications")} // CORRIGÉ
                />
                <StatCard
                  title="Total vues"
                  value={stats?.totals?.views || 0}
                  icon={Eye}
                  color="bg-purple-500"
                  change={24}
                  onClick={() => navigate("/admin/books")} // CORRIGÉ
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickAction
                  title="Vérifier les comptes"
                  description="Approuver les nouvelles inscriptions"
                  icon={CheckCircle}
                  color="hover:border-green-200 hover:bg-green-50"
                  onClick={() => navigate("/admin/verifications")} // CORRIGÉ
                />
                <QuickAction
                  title="Ajouter un livre"
                  description="Publier un nouveau document"
                  icon={Upload}
                  color="hover:border-blue-200 hover:bg-blue-50"
                  onClick={() => navigate("/admin/books/add")} // CORRIGÉ
                />
                <QuickAction
                  title="Voir la bibliothèque"
                  description="Consulter tous les livres"
                  icon={FileText}
                  color="hover:border-purple-200 hover:bg-purple-50"
                  onClick={() => navigate("/admin/books")} // CORRIGÉ
                />
              </div>

              {/* Recent Activities & Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activités récentes */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Activités récentes
                    </h3>
                    <button
                      onClick={() => navigate("/admin/verifications")} // CORRIGÉ
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(activity.link)}
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {activity.type === "user" && (
                            <Users className="w-5 h-5 text-gray-600" />
                          )}
                          {activity.type === "book" && (
                            <BookOpen className="w-5 h-5 text-gray-600" />
                          )}
                          {activity.type === "verification" && (
                            <CheckCircle className="w-5 h-5 text-gray-600" />
                          )}
                          {activity.type === "view" && (
                            <Eye className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.user || activity.title}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catégories populaires */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Livres par catégorie
                  </h3>
                  <div className="space-y-4">
                    {stats?.categories?.slice(0, 5).map((cat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/books?category=${cat.category}`)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {cat.count}
                            </span>
                          </div>
                          <span className="text-gray-700">{cat.category}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  État du système
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/admin/settings")} // CORRIGÉ
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Serveur API</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      En ligne et opérationnel
                    </p>
                  </div>
                  <div
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/admin/settings")} // CORRIGÉ
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Base de données</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Connectée et synchronisée
                    </p>
                  </div>
                  <div
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/admin/settings")} // CORRIGÉ
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Stockage fichiers</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      85% d'espace disponible
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Message pour les autres vues */}
          {activeView !== "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                {activeView === "users" && (
                  <Users className="w-16 h-16 mx-auto" />
                )}
                {activeView === "books" && (
                  <BookOpen className="w-16 h-16 mx-auto" />
                )}
                {activeView === "verifications" && (
                  <CheckCircle className="w-16 h-16 mx-auto" />
                )}
                {activeView === "events" && (
                  <Calendar className="w-16 h-16 mx-auto" />
                )}
                {activeView === "settings" && (
                  <Settings className="w-16 h-16 mx-auto" />
                )}
                {activeView === "profile" && (
                  <User className="w-16 h-16 mx-auto" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeView === "profile" &&
                  "Redirection vers la page Profil..."}
                {activeView === "settings" &&
                  "Redirection vers les Paramètres..."}
                {activeView === "users" &&
                  "Redirection vers la gestion des Utilisateurs..."}
                {activeView === "books" &&
                  "Redirection vers la Bibliothèque..."}
                {activeView === "verifications" &&
                  "Redirection vers les Vérifications..."}
                {activeView === "events" &&
                  "Redirection vers les Événements..."}
              </h3>
              <p className="text-gray-600 mb-4">
                Si la redirection ne se fait pas automatiquement, cliquez sur le
                lien correspondant dans le menu.
              </p>
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retour au Dashboard
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

// Composant NavItem séparé (identique à celui défini plus haut)
const NavItem = ({ icon: Icon, label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
      active
        ? "bg-blue-50 text-blue-700 border border-blue-200"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
    {count !== undefined && (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          active ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export default AdminDashboard;
