// services/userActivityService.js
import api from "./api/apiClient";

export const userActivityService = {
  // Récupérer l'activité récente
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get("/user/activity", { params: { limit } });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userActivityService.getRecentActivity:", error);
      throw error;
    }
  },

  // Enregistrer une connexion (appelé après login)
  recordLogin: async () => {
    try {
      await api.post("/user/activity/login");
    } catch (error) {
      console.error("❌ Erreur userActivityService.recordLogin:", error);
    }
  },
};
