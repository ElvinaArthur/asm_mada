// services/userEventsService.js
import api from "./api/apiClient";

export const userEventsService = {
  // Récupérer les événements de l'utilisateur
  getMyEvents: async (upcoming = true) => {
    try {
      const response = await api.get("/user/events", { params: { upcoming } });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userEventsService.getMyEvents:", error);
      throw error;
    }
  },

  // Récupérer les statistiques des événements
  getStats: async () => {
    try {
      const response = await api.get("/user/events/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userEventsService.getStats:", error);
      throw error;
    }
  },

  // S'inscrire à un événement
  register: async (eventId) => {
    try {
      const response = await api.post(`/user/events/${eventId}/register`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userEventsService.register:", error);
      throw error;
    }
  },

  // Se désinscrire
  unregister: async (eventId) => {
    try {
      const response = await api.delete(`/user/events/${eventId}/unregister`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userEventsService.unregister:", error);
      throw error;
    }
  },

  // Vérifier l'inscription
  checkRegistration: async (eventId) => {
    try {
      const response = await api.get(`/user/events/${eventId}/check`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userEventsService.checkRegistration:", error);
      throw error;
    }
  },
};
