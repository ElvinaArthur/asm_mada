// components/events/EventRegistrationModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Users, CheckCircle } from "lucide-react";
import PrimaryButton from "../ui/buttons/PrimaryButton";

const EventRegistrationModal = ({ isOpen, onClose, event }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    attendees: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler l'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);

      setTimeout(() => {
        onClose();
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          attendees: 1,
          notes: "",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur inscription:", error);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Inscription confirmée !
              </h3>
              <p className="text-gray-300 mb-6">
                Vous êtes inscrit à{" "}
                <span className="text-emerald-400 font-medium">
                  "{event?.title}"
                </span>
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Un email de confirmation vous a été envoyé.</p>
                <p>Présentez-vous 15 minutes avant le début.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      S'inscrire à l'événement
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{event?.title}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline w-4 h-4 mr-2 text-gray-500" />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline w-4 h-4 mr-2 text-gray-500" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="inline w-4 h-4 mr-2 text-gray-500" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                      placeholder="+261 34 00 000 00"
                    />
                  </div>

                  {/* Attendees */}
                  {event?.max_attendees && event.max_attendees > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Users className="inline w-4 h-4 mr-2 text-gray-500" />
                        Nombre de participants
                      </label>
                      <select
                        name="attendees"
                        value={formData.attendees}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                      >
                        {[...Array(Math.min(event.max_attendees, 10))].map(
                          (_, i) => (
                            <option
                              key={i + 1}
                              value={i + 1}
                              className="bg-gray-900"
                            >
                              {i + 1} personne{i + 1 > 1 ? "s" : ""}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Informations complémentaires
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
                      placeholder="Allergies alimentaires, besoins spécifiques..."
                    />
                  </div>

                  {/* Price summary */}
                  {event?.price && parseFloat(event.price) > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total à payer</span>
                        <span className="text-lg font-semibold text-emerald-400">
                          {(
                            parseFloat(event.price) * formData.attendees
                          ).toLocaleString()}{" "}
                          MGA
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Le paiement se fera sur place
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <PrimaryButton
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Traitement...
                      </div>
                    ) : (
                      "Confirmer l'inscription"
                    )}
                  </PrimaryButton>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventRegistrationModal;
