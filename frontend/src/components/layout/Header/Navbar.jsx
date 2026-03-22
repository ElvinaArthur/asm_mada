// src/components/layout/Header/Navbar.jsx — VERSION MISE À JOUR
// Changements : avatar avec vraie photo, lien /settings remplacé par /profile dans le menu user

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  BookOpen,
  User,
  LogOut,
  Settings,
  X,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../../ui/forms/SearchBar";
import { HoverEffect } from "../../ui/animations";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { useAuth } from "../../../hooks/AuthContext";

const API_BASE = "http://localhost:3000";

// ─── Petit composant avatar réutilisable ──────────────────────────
const UserAvatar = ({ user, size = "md" }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const photoUrl = user?.photoUrl
    ? user.photoUrl.startsWith("http")
      ? user.photoUrl
      : `${API_BASE}${user.photoUrl}`
    : null;

  if (photoUrl && !imgError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden ring-2 ring-white shadow flex-shrink-0`}
      >
        <img
          src={photoUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback : initiales
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials || <User className="w-4 h-4" />}
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuOpen && !e.target.closest(".user-menu"))
        setUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen]);

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Bibliothèque", path: "/library" },
    { name: "Événements", path: "/events" },
    { name: "Association", path: "/about" },
    { name: "Membres", path: "/members" },
    { name: "Contact", path: "/contact" },
  ];

  const userMenuItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: LayoutDashboard },
    { name: "Mon profil", path: "/profile", icon: User },
    // Paramètres → redirige vers profil jusqu'à ce que la page existe
    { name: "Paramètres", path: "/settings", icon: Settings },
    ...(isAdmin
      ? [{ name: "Administration", path: "/admin", icon: Settings }]
      : []),
    {
      name: "Déconnexion",
      action: () => {
        logout();
        navigate("/");
        setUserMenuOpen(false);
      },
      icon: LogOut,
      danger: true,
    },
  ];

  const mobileMenuItems = [
    { name: "Accueil", path: "/" },
    { name: "Bibliothèque", path: "/library" },
    { name: "Événements", path: "/events" },
    { name: "Association", path: "/about" },
    { name: "Membres", path: "/members" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
                  <img
                    src="/logo.png"
                    alt="Logo ASM"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              </motion.div>
              <div>
                <h1 className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 bg-clip-text text-transparent">
                  ASM
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                  Association des Sociologues Malagasy
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "text-asm-green-700 font-semibold"
                      : "text-gray-700 hover:text-asm-green-600"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-asm-green-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-asm-green-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {!user ? (
                <HoverEffect>
                  <Link to="/auth?mode=login">
                    <PrimaryButton className="flex items-center space-x-2 px-6 py-2.5">
                      <User className="w-4 h-4" />
                      <span>Se connecter</span>
                    </PrimaryButton>
                  </Link>
                </HoverEffect>
              ) : (
                <div className="relative user-menu">
                  {/* Bouton avatar */}
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-1.5 hover:bg-gray-100 rounded-xl transition"
                  >
                    <UserAvatar user={user} size="md" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {user.firstName || "Utilisateur"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.isVerified ? "✓ Vérifié" : "⏳ En attente"}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden"
                      >
                        {/* Info utilisateur */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <UserAvatar user={user} size="lg" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-sm">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {user.email}
                              </p>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                                  user.isVerified
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {user.isVerified
                                  ? "✓ Vérifié"
                                  : "⏳ En attente"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="py-1">
                          {userMenuItems.map((item) =>
                            item.action ? (
                              <button
                                key={item.name}
                                onClick={item.action}
                                className={`w-full flex items-center px-4 py-2.5 text-sm transition ${
                                  item.danger
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <item.icon
                                  className={`w-4 h-4 mr-3 ${item.danger ? "text-red-400" : "text-gray-400"}`}
                                />
                                {item.name}
                              </button>
                            ) : (
                              <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                              >
                                <item.icon className="w-4 h-4 mr-3 text-gray-400" />
                                {item.name}
                              </Link>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-asm-green-600 hover:bg-gray-100 rounded-lg transition"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Desktop */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden lg:block border-t border-gray-200"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <SearchBar onClose={() => setIsSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">Menu</h2>
                    <p className="text-xs text-gray-500">ASM Alumni</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {/* Nav Links */}
                <nav className="space-y-1">
                  {mobileMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition ${
                        location.pathname === item.path
                          ? "bg-asm-green-50 text-asm-green-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="my-5 border-t border-gray-200" />

                {/* Auth Mobile */}
                {user ? (
                  <div className="space-y-4">
                    {/* User card */}
                    <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center space-x-3">
                      <UserAvatar user={user} size="md" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 text-xs rounded-full ${
                            user.isVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.isVerified ? "✓ Vérifié" : "⏳ En attente"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />{" "}
                        Tableau de bord
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                      >
                        <User className="w-4 h-4 text-gray-400" /> Mon profil
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-purple-700 hover:bg-purple-50 rounded-lg text-sm"
                        >
                          <Settings className="w-4 h-4 text-purple-400" />{" "}
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                      >
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth?mode=login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 bg-asm-green-600 text-white font-medium rounded-lg hover:bg-asm-green-700 transition"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 border-2 border-asm-green-600 text-asm-green-600 font-medium rounded-lg hover:bg-asm-green-50 transition"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { UserAvatar };
export default Navbar;
