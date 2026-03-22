import React from "react";
import { User, Mail, Briefcase, MapPin, Award, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const MemberCard = ({ member }) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      {/* Member Header */}
      <div className="relative h-32 bg-gradient-to-r from-asm-green-500 to-asm-yellow-500"></div>

      {/* Avatar */}
      <div className="relative -mt-12 flex justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
      </div>

      {/* Member Info */}
      <div className="p-6 pt-4 text-center">
        <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
        <p className="text-asm-green-600 font-medium">{member.role}</p>
        <p className="text-gray-600 text-sm mt-1">{member.specialization}</p>

        {/* Stats */}
        <div className="flex justify-center space-x-6 my-4">
          <div className="text-center">
            <div className="font-bold text-gray-900">{member.years || "0"}</div>
            <div className="text-xs text-gray-500">Années</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">
              {member.projects || "0"}
            </div>
            <div className="text-xs text-gray-500">Projets</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">
              {member.publications || "0"}
            </div>
            <div className="text-xs text-gray-500">Publications</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm text-gray-600">
          {member.location && (
            <div className="flex items-center justify-center">
              <MapPin className="w-3 h-3 mr-2" />
              <span>{member.location}</span>
            </div>
          )}
          {member.company && (
            <div className="flex items-center justify-center">
              <Briefcase className="w-3 h-3 mr-2" />
              <span>{member.company}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-3 mt-6 pt-4 border-t border-gray-200">
          <a
            href={`mailto:${member.email}`}
            className="p-2 text-gray-600 hover:text-asm-green-600 hover:bg-gray-100 rounded-full transition"
            aria-label="Envoyer un email"
          >
            <Mail className="w-4 h-4" />
          </a>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
              aria-label="Profil LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MemberCard;
