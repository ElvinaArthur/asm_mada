// frontend/src/services/api/events.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Configuration axios avec intercepteur pour le token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Service événements public
export const eventService = {
  // Récupérer tous les événements
  getEvents: async (params = {}) => {
    try {
      const response = await api.get("/events", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getEvents:", error);
      throw error;
    }
  },

  // Récupérer un événement
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getEvent:", error);
      throw error;
    }
  },

  // Récupérer les événements à venir
  getUpcomingEvents: async (limit = 6) => {
    try {
      const response = await api.get("/events", {
        params: {
          upcoming: "true",
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getUpcomingEvents:", error);
      throw error;
    }
  },

  // Récupérer les événements passés
  getPastEvents: async (limit = 6) => {
    try {
      const response = await api.get("/events", {
        params: {
          past: "true",
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getPastEvents:", error);
      throw error;
    }
  },

  // Récupérer les événements mis en avant
  getFeaturedEvents: async () => {
    try {
      const response = await api.get("/events", {
        params: {
          featured: "true",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getFeaturedEvents:", error);
      throw error;
    }
  },
};

// Service admin pour les événements
export const adminEventService = {
  // Récupérer tous les événements (admin)
  getEvents: async (params = {}) => {
    try {
      const response = await api.get("/admin/events", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur admin getEvents:", error);
      throw error;
    }
  },

  // events.js - Modifiez uniquement la fonction createEvent
  createEvent: async (eventData) => {
    try {
      // Si eventData est déjà un FormData, l'utiliser directement
      const formData =
        eventData instanceof FormData ? eventData : new FormData();

      // Si ce n'était pas un FormData, ajouter les champs
      if (!(eventData instanceof FormData)) {
        Object.keys(eventData).forEach((key) => {
          if (eventData[key] !== undefined && eventData[key] !== null) {
            if (key === "featured" || key === "registration_open") {
              formData.append(key, eventData[key] ? "1" : "0");
            } else {
              formData.append(key, eventData[key]);
            }
          }
        });
      }

      const response = await api.post("/admin/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur createEvent:", error);
      throw error;
    }
  },

  // Mettre à jour un événement
  // events.js - Corrigez la fonction updateEvent
  updateEvent: async (id, eventData) => {
    try {
      // Si c'est déjà un FormData, l'utiliser directement
      const formData =
        eventData instanceof FormData ? eventData : new FormData();

      // Si ce n'était pas un FormData, ajouter les champs
      if (!(eventData instanceof FormData)) {
        Object.keys(eventData).forEach((key) => {
          if (eventData[key] !== undefined && eventData[key] !== null) {
            // Convertir les booléens en 1/0 pour le backend
            if (key === "featured" || key === "registration_open") {
              formData.append(key, eventData[key] ? "1" : "0");
            } else if (key === "max_attendees" || key === "price") {
              // S'assurer que les nombres sont des strings
              formData.append(key, String(eventData[key]));
            } else {
              formData.append(key, eventData[key]);
            }
          }
        });
      }

      const response = await api.put(`/admin/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur updateEvent:", error);
      // Log détaillé pour debug
      if (error.response) {
        console.error("❌ Réponse erreur:", error.response.data);
        console.error("❌ Status:", error.response.status);
      }
      throw error;
    }
  },

  // Supprimer un événement
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/admin/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur deleteEvent:", error);
      throw error;
    }
  },

  // Supprimer plusieurs événements
  deleteMultipleEvents: async (eventIds) => {
    try {
      const response = await api.post("/admin/events/bulk-delete", {
        eventIds,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur deleteMultipleEvents:", error);
      throw error;
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await api.get("/admin/events/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur getStats:", error);
      throw error;
    }
  },
};
