// pages/Events/index.jsx
import React, { useState, useEffect } from "react";
import EventHero from "../../components/events/EventHero";
import EventFilters from "../../components/events/EventFilters";
import EventGrid from "../../components/events/EventGrid";
import { eventService } from "../../services/api/events";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, featured

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;

      // Appel API selon le filtre
      switch (filter) {
        case "upcoming":
          response = await eventService.getUpcomingEvents(20);
          break;
        case "past":
          response = await eventService.getPastEvents(20);
          break;
        case "featured":
          response = await eventService.getFeaturedEvents();
          break;
        default:
          response = await eventService.getEvents();
      }

      // Votre API retourne {success: true, data: [...], count: X}
      // Donc on prend response.data
      const eventsData = response.data || [];

      setEvents(eventsData);
    } catch (err) {
      console.error("❌ Erreur chargement:", err);
      setError("Impossible de charger les événements");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <EventHero />

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Filtres */}
        <EventFilters currentFilter={filter} onFilterChange={setFilter} />

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Grille d'événements */}
        <EventGrid events={events} loading={loading} filter={filter} />
      </div>
    </div>
  );
};

export default EventsPage;
