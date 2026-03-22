// components/events/EventGrid.jsx
import React from "react";
import { Calendar } from "lucide-react";
import EventCard from "./EventCard";

const EventGrid = ({ events, loading, filter }) => {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-600">Chargement des événements...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">
          {filter === "featured"
            ? "Aucun événement mis en avant"
            : filter === "upcoming"
              ? "Aucun événement à venir"
              : filter === "past"
                ? "Aucun événement passé"
                : "Aucun événement trouvé"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;
