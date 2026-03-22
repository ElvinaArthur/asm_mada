import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Mail, Settings, Shield } from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

const CookieModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [consent, setConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    newsletter: false,
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem("asm_cookie_consent");
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      newsletter: true,
    };
    setConsent(allConsent);
    localStorage.setItem("asm_cookie_consent", JSON.stringify(allConsent));
    setIsOpen(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem("asm_cookie_consent", JSON.stringify(consent));
    setIsOpen(false);

    // Si newsletter est coché, ouvrir la modal newsletter
    if (consent.newsletter) {
      setTimeout(() => {
        // Vous pouvez déclencher la newsletter modal ici
        // Par exemple : newsletterRef.current.open();
      }, 1000);
    }
  };

  const handleRejectAll = () => {
    const rejectedConsent = {
      essential: true, // Toujours nécessaire
      analytics: false,
      marketing: false,
      newsletter: false,
    };
    setConsent(rejectedConsent);
    localStorage.setItem("asm_cookie_consent", JSON.stringify(rejectedConsent));
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Cookie Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-asm-green-50 to-asm-yellow-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Cookie className="w-6 h-6 text-asm-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Gestion des cookies
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm">
                  Nous utilisons des cookies pour améliorer votre expérience.
                </p>
              </div>

              {!preferencesOpen ? (
                /* Main View */
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Choisissez comment vous souhaitez que l'ASM utilise vos
                    données. Les cookies essentiels sont toujours actifs.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Cookies essentiels
                        </p>
                        <p className="text-sm text-gray-500">
                          Nécessaires au fonctionnement du site
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        Toujours actif
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Settings className="w-5 h-5 text-blue-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Analytique</p>
                        <p className="text-sm text-gray-500">
                          Comprendre l'utilisation du site
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-purple-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Newsletter</p>
                        <p className="text-sm text-gray-500">
                          Recevoir nos actualités
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PrimaryButton onClick={handleAcceptAll} className="w-full">
                      Tout accepter
                    </PrimaryButton>

                    <SecondaryButton
                      onClick={() => setPreferencesOpen(true)}
                      className="w-full"
                    >
                      Personnaliser
                    </SecondaryButton>

                    <button
                      onClick={handleRejectAll}
                      className="w-full text-center text-gray-600 hover:text-gray-800 py-2"
                    >
                      Refuser tout
                    </button>
                  </div>
                </div>
              ) : (
                /* Preferences View */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-900">Préférences</h4>
                    <button
                      onClick={() => setPreferencesOpen(false)}
                      className="text-sm text-asm-green-600 hover:text-asm-green-700"
                    >
                      ← Retour
                    </button>
                  </div>

                  <div className="space-y-6 mb-8">
                    {/* Essential - Always on */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Essentiels</p>
                        <p className="text-sm text-gray-500">
                          Fonctionnalités de base
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="sr-only"
                        />
                        <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Analytique</p>
                        <p className="text-sm text-gray-500">
                          Améliorer le site
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.analytics}
                          onChange={(e) =>
                            setConsent({
                              ...consent,
                              analytics: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-asm-green-600"></div>
                      </label>
                    </div>

                    {/* Newsletter */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Newsletter</p>
                        <p className="text-sm text-gray-500">
                          Actualités et publications
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.newsletter}
                          onChange={(e) =>
                            setConsent({
                              ...consent,
                              newsletter: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-asm-green-600"></div>
                      </label>
                    </div>
                  </div>

                  <PrimaryButton
                    onClick={handleAcceptSelected}
                    className="w-full"
                  >
                    Enregistrer les préférences
                  </PrimaryButton>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieModal;
