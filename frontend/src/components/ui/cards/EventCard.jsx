import React from "react";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      {/* Event Image/Header */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
            {event.type || "Événement"}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Metadata */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          {event.speaker && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Par {event.speaker}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-6 line-clamp-3">
          {event.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {event.attendees || "0"} participants
          </div>
          <button className="flex items-center text-asm-green-600 hover:text-asm-green-700 font-medium">
            <span>Voir détails</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
