// components/events/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ChevronRight,
  Star,
} from "lucide-react";
import EventImage from "./EventImage";

const EventCard = ({ event }) => {
  const getImageUrl = () => {
    // Priorité à imageUrl
    if (event.imageUrl && event.imageUrl !== "/default-event.jpg") {
      return event.imageUrl.startsWith("/")
        ? `http://https://asm-mada.onrender.com${event.imageUrl}`
        : event.imageUrl;
    }

    // Sinon utiliser l'image si elle existe
    if (event.image) {
      return `http://https://asm-mada.onrender.com/uploads/events/${event.image}`;
    }

    // Fallback à l'image par défaut
    return "http://https://asm-mada.onrender.com/default-event.jpg";
  };

  // Formatage date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Badge statut
  const getStatusBadge = (status) => {
    const badges = {
      upcoming: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "À venir",
      },
      past: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Passé",
      },
    };
    const badge = badges[status] || badges.upcoming;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  // Badge type
  const getTypeBadge = (type) => {
    const colors = {
      Colloque: "bg-purple-100 text-purple-700",
      Formation: "bg-blue-100 text-blue-700",
      Conférence: "bg-emerald-100 text-emerald-700",
      Atelier: "bg-amber-100 text-amber-700",
      Séminaire: "bg-rose-100 text-rose-700",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
          colors[type] || "bg-gray-100 text-gray-700"
        }`}
      >
        <Tag className="w-3 h-3 mr-1" />
        {type}
      </span>
    );
  };
  const imageUrl = getImageUrl();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      // components/events/EventCard.jsx - Section image modifiée
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-blue-100 overflow-hidden">
        {/* Container pour assurer le bon ratio */}
        <div className="absolute inset-0">
          <EventImage
            event={event}
            className="w-full h-full group-hover:scale-110 transition-transform duration-300"
            objectFit="cover"
            objectPosition="center"
            showOverlay={true}
            fallbackImage="http://https://asm-mada.onrender.com/default-event.jpg"
          />

          {/* Overlay gradient léger */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        {/* Vedette */}
        {event.featured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
            <Star className="w-3 h-3 fill-current" />
            Vedette
          </div>
        )}

        {/* Statut */}
        <div className="absolute top-3 left-3 z-10">
          {getStatusBadge(event.status)}
        </div>
      </div>
      {/* Contenu */}
      <div className="p-6">
        {/* Type */}
        <div className="mb-3">{getTypeBadge(event.type)}</div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        {/* Infos */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
            <span>{formatDate(event.date)}</span>
          </div>

          {event.time && (
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span>{event.time}</span>
            </div>
          )}

          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-rose-600" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {event.max_attendees && (
            <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-2 text-purple-600" />
              <span>
                {event.current_attendees || 0}/{event.max_attendees} places
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">{event.organizer}</span>

          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
          >
            Voir détails
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
