import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  User,
  MessageSquare,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const subjects = [
    "Question générale",
    "Adhésion à l'association",
    "Demande de partenariat",
    "Problème technique",
    "Suggestion d'amélioration",
    "Autre",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nom requis";
    }

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.subject) {
      newErrors.subject = "Sujet requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message requis";
    } else if (formData.message.length < 10) {
      newErrors.message = "Minimum 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    setLoading(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Message envoyé avec succès !");

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "contact@asm.mg",
      href: "mailto:contact@asm.mg",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Téléphone",
      value: "+261 34 XX XX XXX",
      href: "tel:+26134XXXXXXX",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Horaires",
      value: "Lun-Ven: 8h-17h",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Contactez-nous
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Association des Sociologues Malagasy
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Contact Info Sidebar */}
                <div className="lg:col-span-1 bg-gradient-to-b from-asm-green-50 to-asm-yellow-50 p-6 lg:p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Informations de contact
                      </h3>
                      <div className="space-y-4">
                        {contactInfo.map((info, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <div className="text-asm-green-600">
                                {info.icon}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {info.title}
                              </p>
                              {info.href ? (
                                <a
                                  href={info.href}
                                  className="text-gray-600 hover:text-asm-green-600 transition"
                                >
                                  {info.value}
                                </a>
                              ) : (
                                <p className="text-gray-600">{info.value}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Pourquoi nous contacter ?
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-asm-green-500 mr-2" />
                          Demande d'adhésion
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-asm-green-500 mr-2" />
                          Questions sur la bibliothèque
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-asm-green-500 mr-2" />
                          Propositions de partenariat
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-asm-green-500 mr-2" />
                          Suggestions d'amélioration
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Nous nous engageons à répondre à toutes vos demandes
                        dans un délai de 48 heures ouvrables.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2 p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Jean Dupont"
                            disabled={loading}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="votre@email.com"
                            disabled={loading}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone (optional) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                            placeholder="+261 34 XX XX XXX"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sujet *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className={`w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent ${
                            errors.subject
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={loading}
                        >
                          <option value="">Sélectionnez un sujet</option>
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                        {errors.subject && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent resize-none ${
                            errors.message
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Décrivez votre demande en détail..."
                          disabled={loading}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        {errors.message ? (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.message}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Minimum 10 caractères
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {formData.message.length}/1000
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-asm-green-600 to-asm-green-700 hover:from-asm-green-700 hover:to-asm-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Envoi en cours...
                          </div>
                        ) : (
                          "Envoyer le message"
                        )}
                      </button>
                    </div>

                    {/* Privacy Note */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        En soumettant ce formulaire, vous acceptez que vos
                        informations soient traitées conformément à notre{" "}
                        <button
                          type="button"
                          onClick={() =>
                            toast.info("Politique de confidentialité à venir")
                          }
                          className="text-asm-green-600 hover:underline"
                        >
                          politique de confidentialité
                        </button>
                        .
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
