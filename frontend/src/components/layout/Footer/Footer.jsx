// src/components/layout/Footer/Footer.jsx — VERSION MISE À JOUR
// Suppression section "Ressources"
// Ajout colonne "Légal" avec tous les liens obligatoires

import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import FooterLinks from "./FooterLinks";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content — 4 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ── Brand ─────────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo ASM"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-asm-green-400 to-asm-yellow-400 bg-clip-text text-transparent">
                  ASM
                </h3>
                <p className="text-gray-400 text-xs leading-tight">
                  Association des Sociologues Malagasy
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Promouvant l'excellence en sociologie à Madagascar depuis 1990. Un
              réseau d'alumni engagés pour la recherche et le développement
              social.
            </p>

            {/* Contact inline dans la brand card (mobile-first) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Antananarivo, Madagascar</span>
              </div>
              <a
                href="mailto:contact@asm.mg"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>contact@asm.mg</span>
              </a>
            </div>

            <SocialIcons />
          </div>

          {/* ── Navigation ────────────────────────────────────── */}
          <FooterLinks
            title="Navigation"
            links={[
              { name: "Accueil", path: "/" },
              { name: "Bibliothèque", path: "/library" },
              { name: "Événements", path: "/events" },
              { name: "Membres", path: "/members" },
              { name: "À propos", path: "/about" },
              { name: "Contact", path: "/contact" },
            ]}
          />

          {/* ── Espace membres ────────────────────────────────── */}
          <FooterLinks
            title="Espace membres"
            links={[
              { name: "Se connecter", path: "/auth?mode=login" },
              { name: "S'inscrire", path: "/auth?mode=register" },
              { name: "Mon tableau de bord", path: "/dashboard" },
              { name: "Mon profil", path: "/profile" },
              { name: "Paramètres", path: "/settings" },
            ]}
          />

          {/* ── Légal ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Informations légales
              <div className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-to-r from-asm-green-500 to-asm-yellow-500" />
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Conditions d'utilisation", path: "/legal/terms" },
                {
                  name: "Politique de confidentialité",
                  path: "/legal/privacy",
                },
                { name: "Politique des cookies", path: "/legal/cookies" },
                { name: "Mentions légales", path: "/legal/mentions" },
                { name: "Traitement des données (RGPD)", path: "/legal/rgpd" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-gray-400 hover:text-white transition-all duration-200 text-sm"
                  >
                    <span className="h-px w-0 bg-gradient-to-r from-asm-green-500 to-asm-yellow-500 group-hover:w-4 mr-3 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} ASM — Association des Sociologues Malagasy. Tous
              droits réservés.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link
                to="/legal/privacy"
                className="hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
              <span className="text-gray-700">·</span>
              <Link
                to="/legal/terms"
                className="hover:text-white transition-colors"
              >
                Conditions
              </Link>
              <span className="text-gray-700">·</span>
              <Link
                to="/legal/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
              <span className="text-gray-700">·</span>
              <Link
                to="/legal/mentions"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
