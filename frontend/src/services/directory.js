// frontend/src/services/api/directory.js
import api from "./api/apiClient";

export const directoryAPI = {
  // Récupérer les membres (version publique)
  getMembers: async (params = {}) => {
    try {
      const response = await api.get("/directory/members", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur directoryAPI.getMembers:", error);
      throw error;
    }
  },

  // Récupérer les détails d'un membre (public)
  getMemberDetails: async (id) => {
    try {
      const response = await api.get(`/directory/members/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur directoryAPI.getMemberDetails:", error);
      throw error;
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await api.get("/directory/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur directoryAPI.getStats:", error);
      throw error;
    }
  },
};

// Version admin (avec authentification)
export const adminDirectoryAPI = {
  // Récupérer tous les membres (admin)
  getAllMembers: async (params = {}) => {
    try {
      const response = await api.get("/admin/directory/members", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur adminDirectoryAPI.getAllMembers:", error);
      throw error;
    }
  },

  // Récupérer les détails complets (admin)
  getFullMemberDetails: async (id) => {
    try {
      const response = await api.get(`/admin/directory/members/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur adminDirectoryAPI.getFullMemberDetails:", error);
      throw error;
    }
  },

  // Vérifier un membre
  verifyMember: async (id, isVerified) => {
    try {
      const response = await api.put(`/admin/directory/members/${id}/verify`, {
        isVerified,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur adminDirectoryAPI.verifyMember:", error);
      throw error;
    }
  },

  // Supprimer un membre
  deleteMember: async (id) => {
    try {
      const response = await api.delete(`/admin/directory/members/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur adminDirectoryAPI.deleteMember:", error);
      throw error;
    }
  },
};
