// src/components/modals/NewsletterModal.jsx
// ✅ CORRECTIONS :
//   1. Timer protégé contre les re-renders (ref au lieu de closure)
//   2. Exit intent sur mouseleave document (plus fiable que beforeunload)
//   3. Lien confidentialité → /legal/privacy (cohérent avec le nouveau footer)
//   4. Spinner du bouton aligné avec le design de l'app

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle, Gift, BookOpen, Users } from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton";

const DELAY_MS = 5000; // 5 secondes avant affichage

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const timerRef = useRef(null);
  const exitBound = useRef(false);

  // ── Vérification localStorage (une seule fois au mount) ────────
  const hasSeenModal = () => !!localStorage.getItem("asm_newsletter_seen");
  const hasSubscribed = () =>
    !!localStorage.getItem("asm_newsletter_subscribed");

  // ── Timer d'affichage initial ──────────────────────────────────
  useEffect(() => {
    // Ne pas afficher si déjà vu ou déjà inscrit
    if (hasSeenModal() || hasSubscribed()) return;

    // ✅ FIX : on stocke le timer dans une ref pour ne pas le perdre
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_MS);

    // Nettoyage si le composant est démonté avant les 5s
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // [] = une seule fois au mount, pas de re-run

  // ── Exit intent : souris qui sort par le haut de la page ───────
  useEffect(() => {
    if (hasSeenModal() || hasSubscribed()) return;

    const handleMouseLeave = (e) => {
      // Déclenche seulement si la souris sort par le haut (intention de fermer l'onglet)
      if (e.clientY <= 0 && !exitBound.current && !isOpen) {
        exitBound.current = true;

        // Annuler le timer initial s'il n'a pas encore déclenché
        if (timerRef.current) clearTimeout(timerRef.current);

        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isOpen]);

  // ── Validation email ───────────────────────────────────────────
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // ── Soumission ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    // TODO : remplacer par un vrai appel API
    // await api.post("/newsletter/subscribe", { email })
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.setItem("asm_newsletter_subscribed", "true");

      // Fermer la modal après 3s de succès
      setTimeout(() => {
        handleClose();
      }, 3000);
    }, 1500);
  };

  // ── Fermeture ──────────────────────────────────────────────────
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("asm_newsletter_seen", "true");
  };

  const benefits = [
    { icon: <BookOpen className="w-5 h-5" />, text: "Publications exclusives" },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Invitations aux événements privés",
    },
    {
      icon: <Gift className="w-5 h-5" />,
      text: "Contenu gratuit et réductions",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
                     flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-3xl
                       shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Bouton fermer */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400
                         hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* ── Colonne gauche — visuel ──────────────────── */}
              <div
                className="hidden md:flex bg-gradient-to-br from-asm-green-600
                              to-asm-green-800 p-8 flex-col justify-center
                              items-center text-white text-center relative overflow-hidden"
              >
                {/* Cercles décoratifs */}
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full" />

                <div className="relative z-10">
                  <div
                    className="w-20 h-20 bg-white/20 rounded-full
                                  flex items-center justify-center mx-auto mb-6"
                  >
                    <Mail className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Ne manquez rien !</h3>
                  <p className="opacity-80 text-sm mb-8">
                    Rejoignez +500 sociologues déjà inscrits
                  </p>

                  <div className="space-y-4 text-left">
                    {benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 bg-white/20 rounded-full
                                        flex items-center justify-center flex-shrink-0"
                        >
                          {b.icon}
                        </div>
                        <span className="text-sm">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Colonne droite — formulaire ──────────────── */}
              <div className="p-8 md:p-10">
                {!isSuccess ? (
                  <>
                    <div className="mb-7">
                      <div
                        className="w-14 h-14 bg-green-50 rounded-2xl
                                      flex items-center justify-center mb-5"
                      >
                        <Mail className="w-7 h-7 text-asm-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Newsletter ASM
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Recevez nos publications, événements et actualités
                        directement dans votre boîte mail.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Votre adresse email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                          className={`w-full px-4 py-3 rounded-xl border-2 text-sm
                                      focus:outline-none focus:ring-2 focus:ring-asm-green-500
                                      focus:border-transparent transition ${
                                        emailError
                                          ? "border-red-400"
                                          : "border-gray-200"
                                      }`}
                          placeholder="votre@email.com"
                          required
                        />
                        {emailError && (
                          <p className="text-red-500 text-xs mt-1.5">
                            {emailError}
                          </p>
                        )}
                      </div>

                      {/* Bouton soumission */}
                      <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            {/* Spinner cohérent avec le reste de l'app */}
                            <span className="relative w-4 h-4">
                              <span className="absolute inset-0 border-2 border-white/30 rounded-full" />
                              <span className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </span>
                            Inscription...
                          </span>
                        ) : (
                          "S'inscrire à la newsletter"
                        )}
                      </PrimaryButton>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full text-center text-gray-400 hover:text-gray-600
                                   text-sm transition py-1"
                      >
                        Non merci
                      </button>
                    </form>

                    <p className="text-gray-400 text-xs mt-5 text-center">
                      En vous inscrivant, vous acceptez notre{" "}
                      <a
                        href="/legal/privacy"
                        className="text-asm-green-600 hover:underline"
                      >
                        politique de confidentialité
                      </a>
                      . Désinscription à tout moment.
                    </p>
                  </>
                ) : (
                  /* ── État succès ────────────────────────────── */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.15 }}
                      className="w-20 h-20 bg-green-50 rounded-full
                                 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Bienvenue !
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Inscription confirmée. Vérifiez votre boîte mail.
                    </p>

                    <div className="bg-green-50 rounded-2xl p-5 mb-6 text-left">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        🎁 Votre cadeau de bienvenue
                      </p>
                      <p className="text-sm text-gray-600">
                        Accès gratuit à notre e-book «&nbsp;Introduction à la
                        Sociologie Malagasy&nbsp;»
                      </p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="text-asm-green-600 hover:text-asm-green-700
                                 text-sm font-medium transition"
                    >
                      Continuer à naviguer →
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
