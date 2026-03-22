import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  FadeIn,
  SlideUp,
  HoverEffect,
  TypewriterEffect,
} from "../../components/ui/animations/index";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["contact@asm.mg", "info@asm.mg"],
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      details: ["+261 34 00 000 00", "+261 32 00 000 00"],
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      details: ["Antananarivo 101", "Madagascar"],
      color: "from-yellow-500 to-amber-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horaires",
      details: ["Lun-Ven: 8h-17h", "Sam: 8h-12h"],
      color: "from-purple-500 to-pink-600",
    },
  ];

  const contactCategories = [
    { value: "general", label: "Question générale" },
    { value: "membership", label: "Adhésion" },
    { value: "events", label: "Événements" },
    { value: "library", label: "Bibliothèque" },
    { value: "technical", label: "Support technique" },
    { value: "partnership", label: "Partenariat" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });

      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-8 md:py-6 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-asm-green-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        {/* Animated Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-asm-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-asm-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Phone className="w-4 h-4 text-asm-green-300" />
              <span className="text-sm text-white">Besoin d'aide ?</span>
            </div>
          </FadeIn>

          <SlideUp delay={0.3}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="block bg-gradient-to-r from-asm-green-400 to-asm-yellow-400 bg-clip-text text-transparent">
                <span className="block">
                  {" "}
                  Notre Équipe est là
                  <span className="text-white"> pour vous répondre</span>
                </span>
              </span>
            </h1>
          </SlideUp>

          <FadeIn delay={0.5}>
            <TypewriterEffect
              text="Rejoignez la communauté des sociologues à Madagascar"
              speed={30}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
              cursor={false}
            />
          </FadeIn>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information - Left Column */}
          <div className="lg:col-span-1">
            <FadeIn>
              <div className="sticky top-24 space-y-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-asm-green-600" />
                    Informations de contact
                  </h2>

                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="group">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-3`}
                        >
                          <div className="text-white">{info.icon}</div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Réseaux sociaux
                    </h3>
                    <div className="flex space-x-4">
                      {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(
                        (network) => (
                          <button
                            key={network}
                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-asm-green-100 hover:text-asm-green-600 transition"
                          >
                            {network.charAt(0)}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* FAQ Quick Links */}
                <div className="bg-gradient-to-br from-asm-green-50 to-asm-yellow-50 rounded-3xl p-8 border border-asm-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Questions fréquentes
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Comment devenir membre ?",
                      "Accès à la bibliothèque",
                      "Tarifs des événements",
                      "Publications scientifiques",
                    ].map((question, index) => (
                      <li key={index}>
                        <a
                          href={`/faq#q${index + 1}`}
                          className="text-gray-700 hover:text-asm-green-600 hover:underline flex items-center"
                        >
                          <span className="w-2 h-2 bg-asm-green-500 rounded-full mr-3"></span>
                          {question}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/faq"
                    className="inline-flex items-center text-asm-green-600 font-medium mt-6 hover:underline"
                  >
                    Voir toutes les FAQ
                    <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form - Right Column */}
          <div className="lg:col-span-2">
            <SlideUp delay={0.3}>
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Envoyez-nous un message
                </h2>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-1">
                          Message envoyé avec succès !
                        </h3>
                        <p className="text-green-700">
                          Nous vous répondrons dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-2" />
                        Votre nom complet
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent transition"
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Adresse email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent transition"
                        placeholder="jean.dupont@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Category & Subject */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent transition bg-white"
                      >
                        {contactCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent transition"
                        placeholder="Objet de votre message"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent transition resize-none"
                      placeholder="Décrivez-nous votre demande..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <HoverEffect>
                      <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 text-lg"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Envoi en cours...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Send className="w-5 h-5 mr-3" />
                            Envoyer le message
                          </span>
                        )}
                      </PrimaryButton>
                    </HoverEffect>
                  </div>

                  {/* Privacy Note */}
                  <p className="text-center text-gray-600 text-sm">
                    En soumettant ce formulaire, vous acceptez notre{" "}
                    <a
                      href="/privacy"
                      className="text-asm-green-600 hover:underline"
                    >
                      politique de confidentialité
                    </a>
                    . Nous ne partagerons jamais vos informations.
                  </p>
                </form>
              </div>
            </SlideUp>

            {/* Map Section */}
            <FadeIn delay={0.5}>
              <div className="mt-12 bg-gradient-to-br from-asm-green-50 to-asm-yellow-50 rounded-3xl p-8 border border-asm-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Notre localisation
                </h3>

                {/* Map Placeholder */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-asm-green-100 to-asm-yellow-100 mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-asm-green-600 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium">
                        Antananarivo, Madagascar
                      </p>
                      <p className="text-gray-600">
                        Localisation exacte sur demande
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-asm-green-600 mb-2">
                      48h
                    </div>
                    <div className="text-gray-700">Délai de réponse moyen</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-asm-green-600 mb-2">
                      100%
                    </div>
                    <div className="text-gray-700">Messages traités</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-asm-green-600 mb-2">
                      4.9/5
                    </div>
                    <div className="text-gray-700">Satisfaction client</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Emergency Contact */}
            <SlideUp delay={0.6}>
              <div className="mt-12 bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 rounded-3xl p-8 text-white">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Contact d'urgence
                    </h3>
                    <p className="mb-4 opacity-90">
                      Pour les urgences concernant les événements ou
                      l'assistance technique
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="tel:+261340000001"
                        className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition"
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        Urgence technique
                      </a>
                      <a
                        href="mailto:urgence@asm.mg"
                        className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition"
                      >
                        <Mail className="w-5 h-5 mr-3" />
                        Email urgent
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
