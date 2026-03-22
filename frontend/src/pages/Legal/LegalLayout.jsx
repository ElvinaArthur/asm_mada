// src/pages/Legal/LegalLayout.jsx
// Layout commun pour toutes les pages légales

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";

const legalLinks = [
  { path: "/legal/terms", label: "Conditions d'utilisation" },
  { path: "/legal/privacy", label: "Politique de confidentialité" },
  { path: "/legal/cookies", label: "Politique des cookies" },
  { path: "/legal/mentions", label: "Mentions légales" },
  { path: "/legal/rgpd", label: "Données & RGPD" },
];

const LegalLayout = ({ title, lastUpdated, children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600 transition">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Informations légales
              </p>
              <nav className="space-y-1">
                {legalLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition ${
                      location.pathname === l.path
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
                {lastUpdated && (
                  <p className="text-sm text-gray-400">
                    Dernière mise à jour : {lastUpdated}
                  </p>
                )}
              </div>
              <div
                className="prose prose-gray prose-sm max-w-none
                prose-headings:font-semibold prose-headings:text-gray-800
                prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-li:text-gray-600 prose-ul:mt-2
                prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline"
              >
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
