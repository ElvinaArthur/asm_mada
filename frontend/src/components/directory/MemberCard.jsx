// components/directory/MemberCard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Building,
  MapPin,
  EyeOff,
  UserCheck,
  ChevronRight,
} from "lucide-react";

const MemberCard = ({ member, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-6">
        {/* En-tête membre */}
        <div className="flex items-start mb-4">
          {/* Remplacer la div actuelle par ceci */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 overflow-hidden ${
              member.photoUrl
                ? ""
                : member.avatarColor ||
                  "bg-gradient-to-br from-asm-green-500 to-asm-yellow-500"
            }`}
          >
            {member.photoUrl ? (
              <img
                src={`https://asm-mada.onrender.com${member.photoUrl}`}
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
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {member.fullName || `${member.firstName} ${member.lastName}`}
                </h3>
                <p className="text-sm text-gray-600">{member.title}</p>
              </div>
              {member.isVerified && (
                <div className="flex items-center text-green-600 text-sm">
                  <UserCheck className="w-4 h-4 mr-1" />
                  <span>Vérifié</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails publics */}
        <div className="space-y-3 mb-6">
          {member.company_public && (
            <div className="flex items-center text-gray-700">
              <Building className="w-4 h-4 mr-3 text-gray-500" />
              <span className="text-sm">{member.company_public}</span>
            </div>
          )}
          {member.location_public && (
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 mr-3 text-gray-500" />
              <span className="text-sm">{member.location_public}</span>
            </div>
          )}
          {(!member.company_public || !member.location_public) && (
            <div className="flex items-center text-gray-400 text-xs">
              <EyeOff className="w-3 h-3 mr-1" />
              <span>Certaines informations sont privées</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Membre depuis{" "}
            {new Date(member.memberSince || Date.now()).getFullYear()}
          </div>
          <button
            onClick={() => onViewDetails(member.id)}
            className="flex items-center px-3 py-1 text-sm text-asm-green-600 hover:text-asm-green-700 font-medium"
          >
            Voir profil
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MemberCard;
