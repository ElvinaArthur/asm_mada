import apiClient from "./apiClient";

export const adminAPI = {
  // Récupérer les utilisateurs en attente
  getPendingUsers: async () => {
    try {
      const response = await apiClient.get("/admin/users/pending");
      return response.data;
    } catch (error) {
      console.error("Erreur utilisateurs en attente:", error);
      throw error;
    }
  },

  // Vérifier un utilisateur
  verifyUser: async (userId, status) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/verify`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur vérification utilisateur:", error);
      throw error;
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await apiClient.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur statistiques admin:", error);
      throw error;
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur tous les utilisateurs:", error);
      throw error;
    }
  },

  // Gérer les événements
  manageEvents: async (action, eventId, data) => {
    try {
      const response = await apiClient.put(`/admin/events/${eventId}`, {
        action,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur gestion événements:", error);
      throw error;
    }
  },

  // Gérer les livres
  manageBooks: async (action, bookId, data) => {
    try {
      const response = await apiClient.put(`/admin/books/${bookId}`, {
        action,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur gestion livres:", error);
      throw error;
    }
  },
};
