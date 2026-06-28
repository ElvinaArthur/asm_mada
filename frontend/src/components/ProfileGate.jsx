'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/AuthContext';
import { useProfileComplete } from '../hooks/useProfileComplete';
import { AlertTriangle, CheckCircle, ArrowRight, Loader2, Lock, User } from 'lucide-react';

// Grouper les champs manquants par section
function groupBySection(missing) {
  return missing.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});
}

/**
 * Bloque l'accès à une page si :
 * 1. Non authentifié → redirect login
 * 2. Non vérifié → redirect verification-pending
 * 3. Profil incomplet → affiche la page de blocage avec les champs manquants
 */
const ProfileGate = ({ children }) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading, isComplete, missing, progress } = useProfileComplete();

  // Loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-asm-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Vérification du profil…</p>
        </div>
      </div>
    );
  }

  // Non authentifié
  if (!user) {
    router.push('/auth?mode=login');
    return null;
  }

  // Non vérifié (compte en attente)
  const isVerified = user.isVerified === true || user.isVerified === 1;
  if (!isVerified) {
    router.push('/verification-pending');
    return null;
  }

  // Profil incomplet → page de blocage
  if (!isComplete) {
    const grouped = groupBySection(missing);
    const total = 12; // REQUIRED_FIELDS.length

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Card principale */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-amber-50 border-b border-amber-100 p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Accès limité — Profil incomplet
              </h1>
              <p className="text-gray-600 text-sm">
                Pour accéder à la bibliothèque, aux événements et à l'annuaire des membres, votre profil doit être entièrement renseigné.
              </p>
            </div>

            {/* Barre de progression */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Complétion du profil</span>
                <span className="text-sm font-bold text-asm-green-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-asm-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {total - missing.length}/{total} champs complétés — encore {missing.length} à remplir
              </p>
            </div>

            {/* Champs manquants groupés */}
            <div className="p-6 space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(grouped).map(([section, fields]) => (
                <div key={section}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {section}
                  </h3>
                  <div className="space-y-1.5">
                    {fields.map(f => (
                      <div key={f.key} className="flex items-center gap-2 text-sm text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => router.push('/profile')}
                className="w-full bg-asm-green-600 text-white py-3 rounded-xl font-semibold hover:bg-asm-green-700 transition flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Compléter mon profil
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                L'accès sera débloqué automatiquement une fois tous les champs remplis.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profil complet → rendu normal
  return children;
};

export default ProfileGate;
