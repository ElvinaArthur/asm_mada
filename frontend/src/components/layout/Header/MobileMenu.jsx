import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  Bell,
  ChevronRight,
  Home,
  Book,
  Calendar,
  Users,
  User as UserIcon,
  MessageCircle,
  X,
} from "lucide-react";
import SearchBar from "../../ui/forms/SearchBar";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { FadeIn } from "../../ui/animations";

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  currentPath,
  user,
  logout,
}) => {
  const userMenuItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: User },
    { name: "Mon profil", path: "/profile", icon: User },
    { name: "Notifications", path: "/notifications", icon: Bell, badge: 3 },
    { name: "Paramètres", path: "/settings", icon: Settings },
  ];

  // Définir les icônes pour les liens
  const getIconForNavItem = (name) => {
    switch (name) {
      case "Accueil":
        return Home;
      case "Bibliothèque":
        return Book;
      case "Événements":
        return Calendar;
      case "Association":
        return Users;
      case "Membres":
        return UserIcon;
      case "Contact":
        return MessageCircle;
      default:
        return ChevronRight;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - visible sur mobile ET tablette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" // Changé de md:hidden à lg:hidden
          />

          {/* Menu Panel - visible sur mobile ET tablette */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden" // Changé de md:hidden à lg:hidden
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-asm-green-50 to-asm-yellow-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Menu ASM
                    </h2>
                    <p className="text-sm text-gray-600">
                      Association des Sociologues Malagasy
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Info (if logged in) */}
              {user && (
                <FadeIn>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 rounded-full flex items-center justify-center shadow">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full border ${
                            user.isVerified
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {user.isVerified ? "✓ Vérifié" : "⏳ En attente"}
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <SearchBar onClose={onClose} compact />
              </div>

              {/* Navigation - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-2">
                  <div className="mb-4">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Navigation principale
                    </h3>
                    <div className="space-y-1">
                      {navItems.map((item, index) => {
                        const Icon = getIconForNavItem(item.name);
                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                              currentPath === item.path
                                ? "bg-gradient-to-r from-asm-green-50 to-asm-green-100 text-asm-green-700 border border-asm-green-200"
                                : "text-gray-700 hover:bg-gray-50 hover:text-asm-green-600"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 mr-3 ${
                                currentPath === item.path
                                  ? "text-asm-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <span className="font-medium flex-1">
                              {item.name}
                            </span>
                            {item.submenu && (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sous-menus */}
                  {navItems
                    .filter((item) => item.submenu && item.submenu.length > 0)
                    .map((item) => (
                      <div key={`sub-${item.name}`} className="mb-4">
                        <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.name}
                        </h4>
                        <div className="space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={onClose}
                              className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition ${
                                currentPath === subItem.path
                                  ? "bg-asm-green-50 text-asm-green-700 pl-6"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-asm-green-600 pl-6"
                              }`}
                            >
                              <ChevronRight className="w-3 h-3 mr-3 text-gray-400" />
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}

                  {/* User Menu Items */}
                  {user && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Mon compte
                      </h3>
                      <div className="space-y-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-asm-green-600 transition"
                          >
                            <div className="flex items-center">
                              <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                              <span className="font-medium">{item.name}</span>
                            </div>
                            {item.badge && (
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}

                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            logout();
                            onClose();
                          }}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                        >
                          <div className="flex items-center">
                            <LogOut className="w-5 h-5 mr-3" />
                            <span className="font-medium">Déconnexion</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50">
                {!user ? (
                  <div className="p-4 space-y-3">
                    <Link
                      to="/auth?mode=login"
                      onClick={onClose}
                      className="block"
                    >
                      <PrimaryButton className="w-full flex items-center justify-center py-3">
                        <User className="w-5 h-5 mr-2" />
                        Se connecter
                      </PrimaryButton>
                    </Link>
                    <p className="text-center text-gray-600 text-sm">
                      Pas encore membre ?{" "}
                      <Link
                        to="/auth?mode=register"
                        onClick={onClose}
                        className="text-asm-green-600 font-medium hover:underline"
                      >
                        S'inscrire
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-xs text-gray-500 text-center">
                      © {new Date().getFullYear()} ASM • Tous droits réservés
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
