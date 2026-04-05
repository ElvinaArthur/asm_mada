// components/directory/MemberListItem.jsx
import React from "react";
import { motion } from "framer-motion";
import { Building, MapPin, UserCheck } from "lucide-react";

const MemberListItem = ({ member, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: "#f9fafb" }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden ${
              member.photoUrl
                ? ""
                : member.avatarColor ||
                  "bg-gradient-to-br from-asm-green-500 to-asm-yellow-500"
            }`}
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
                  e.target.parentElement.className =
                    "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-br from-asm-green-500 to-asm-yellow-500";
                }}
              />
            ) : (
              `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {member.fullName || `${member.firstName} ${member.lastName}`}
            </h3>
            <p className="text-sm text-gray-600">{member.title}</p>
            <div className="flex items-center mt-1 space-x-4">
              {member.company_public && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {member.company_public}
                </span>
              )}
              {member.location_public && (
                <span className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {member.location_public}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {member.isVerified && (
            <span className="text-green-600">
              <UserCheck className="w-5 h-5" />
            </span>
          )}
          <button
            onClick={() => onViewDetails(member.id)}
            className="px-4 py-2 bg-asm-green-600 text-white rounded-lg hover:bg-asm-green-700 transition text-sm"
          >
            Voir profil
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MemberListItem;
