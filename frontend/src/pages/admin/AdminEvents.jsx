// pages/admin/AdminEvents.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminEventService } from "../../services/api/events";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Eye,
} from "lucide-react";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await adminEventService.getEvents({});
      setEvents(response.data || []);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    try {
      await adminEventService.deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
              <p className="text-gray-600">Gérez les événements de l'ASM</p>
            </div>
            <Link
              to="/admin/events/add"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvel événement
            </Link>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un événement..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-2 border rounded-lg">
                  <option>Tous les statuts</option>
                  <option>À venir</option>
                  <option>Passés</option>
                </select>
                <button
                  onClick={loadEvents}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filtrer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "Aucun résultat pour votre recherche"
                : "Commencez par créer un événement"}
            </p>
            <Link
              to="/admin/events/add"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer un événement
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg border p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === "upcoming"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.status === "upcoming" ? "À venir" : "Passé"}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {event.type}
                      </span>
                      {event.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          ⭐ En vedette
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(event.date)}{" "}
                          {event.time && `• ${event.time}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.current_attendees || 0} participants</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/events/${event.id}`}
                      target="_blank"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </Link>
                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Link>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {events.length}
            </div>
            <div className="text-gray-600">Événements total</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {events.filter((e) => e.status === "upcoming").length}
            </div>
            <div className="text-gray-600">À venir</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {events.filter((e) => e.featured).length}
            </div>
            <div className="text-gray-600">En vedette</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
