// components/directory/MemberDetailsModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Award,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { directoryAPI } from "../../services/directory";

const MemberDetailsModal = ({ isOpen, onClose, memberId, isAdmin = false }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    if (isOpen && memberId) {
      loadMemberDetails();
    }
  }, [isOpen, memberId]);

  const loadMemberDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await directoryAPI.getMemberDetails(memberId);
      setMember(response.profile);
    } catch (err) {
      setError("Impossible de charger les détails du membre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={showFullImage ? () => setShowFullImage(false) : onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Modal principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
          >
            {/* Header avec dégradé */}
            <div className="bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {member?.fullName || "Profil du membre"}
              </h3>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto bg-white">
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asm-green-600"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {member && !loading && (
                <div className="space-y-6">
                  {/* Photo et infos de base */}
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="relative group self-center sm:self-start">
                      <div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-md cursor-pointer"
                        onClick={() =>
                          member.photoUrl && setShowFullImage(true)
                        }
                      >
                        {member.photoUrl ? (
                          <img
                            src={`http://https://asm-mada.onrender.com${member.photoUrl}`}
                            alt={member.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`;
                            }}
                          />
                        ) : (
                          `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`
                        )}
                      </div>

                      {/* Bouton d'agrandissement */}
                      {member.photoUrl && (
                        <button
                          onClick={() => setShowFullImage(true)}
                          className="absolute -bottom-2 -right-2 bg-asm-green-600 text-white p-2 rounded-full shadow-lg hover:bg-asm-green-700 transition"
                          title="Voir en grand"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {member.fullName}
                      </h2>
                      <p className="text-lg text-gray-600">{member.title}</p>
                      {member.isVerified && (
                        <span className="inline-flex items-center px-3 py-1 mt-2 bg-green-100 text-green-800 rounded-full text-sm">
                          <Award className="w-4 h-4 mr-1" />
                          Membre vérifié
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informations de contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    {member.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                        <span className="text-sm break-all">
                          {member.email}
                        </span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{member.location}</span>
                      </div>
                    )}
                    {member.company && (
                      <div className="flex items-center text-gray-700">
                        <Briefcase className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{member.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Biographie */}
                  {member.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Biographie
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                        {member.bio}
                      </p>
                    </div>
                  )}

                  {/* Formation académique */}
                  {member.academicBackground && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-asm-green-600" />
                        Formation
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">
                          {member.academicBackground.degree || ""}{" "}
                          {member.academicBackground.field || ""}
                        </p>
                        <p className="text-gray-600">
                          {member.academicBackground.institution || ""}
                          {member.academicBackground.graduationYear &&
                            ` - ${member.academicBackground.graduationYear}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Postes précédents */}
                  {member.previousPositions?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Expériences précédentes
                      </h3>
                      <div className="space-y-3">
                        {member.previousPositions.map((pos, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium text-gray-900">
                              {pos.title}
                            </p>
                            <p className="text-gray-600">{pos.company}</p>
                            {(pos.startYear || pos.endYear) && (
                              <p className="text-sm text-gray-500 mt-1">
                                {pos.startYear} - {pos.endYear || "présent"}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date d'adhésion */}
                  <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                    Membre depuis{" "}
                    {new Date(member.memberSince).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-asm-green-600 text-white rounded-lg hover:bg-asm-green-700 transition shadow-md"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal d'agrandissement de la photo */}
      {showFullImage && member?.photoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowFullImage(false)}
        >
          {/* Overlay plus sombre */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Image agrandie */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative z-10 w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={`http://https://asm-mada.onrender.com${member.photoUrl}`}
                alt={member.fullName}
                className="max-w-full max-h-[80vh] sm:max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />

              {/* Bouton fermer */}
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 transition z-20"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Bouton zoom out pour mobile */}
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute bottom-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition backdrop-blur-sm sm:hidden"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberDetailsModal;
