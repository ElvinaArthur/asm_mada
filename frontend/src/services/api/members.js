import apiClient from "./apiClient";

export const membersAPI = {
  // Récupérer tous les membres vérifiés
  getVerifiedMembers: async (params = {}) => {
    try {
      const response = await apiClient.get("/members/verified", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur récupération membres:", error);
      throw error;
    }
  },

  // Rechercher des membres
  searchMembers: async (searchParams) => {
    try {
      const response = await apiClient.get("/members/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur recherche membres:", error);
      throw error;
    }
  },

  // Récupérer les détails d'un membre
  getMemberDetails: async (memberId) => {
    try {
      const response = await apiClient.get(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur détails membre:", error);
      throw error;
    }
  },

  // Récupérer les statistiques des membres
  getMembersStats: async () => {
    try {
      const response = await apiClient.get("/members/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur stats membres:", error);
      throw error;
    }
  },

  // Mettre à jour son profil membre
  updateMemberProfile: async (memberData) => {
    try {
      const response = await apiClient.put("/members/profile", memberData);

      // Mettre à jour les infos dans localStorage
      if (response.data.user) {
        const currentUser = JSON.parse(
          localStorage.getItem("asm_user") || "{}",
        );
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem("asm_user", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error("Erreur mise à jour profil membre:", error);
      throw error;
    }
  },

  // Télécharger la liste des membres (admin)
  exportMembers: async () => {
    try {
      const response = await apiClient.get("/members/export", {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Erreur export membres:", error);
      throw error;
    }
  },
};
