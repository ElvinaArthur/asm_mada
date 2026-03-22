// services/userBooksService.js
import api from "./api/apiClient";

export const userBooksService = {
  // Récupérer tous les livres de l'utilisateur
  getUserBooks: async (status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get("/user/books", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.getUserBooks:", error);
      throw error;
    }
  },

  // Récupérer les statistiques de lecture
  getStats: async () => {
    try {
      const response = await api.get("/user/books/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.getStats:", error);
      throw error;
    }
  },

  // Récupérer les livres récents
  getRecent: async (limit = 5) => {
    try {
      const response = await api.get("/user/books/recent", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.getRecent:", error);
      throw error;
    }
  },

  // Ajouter un livre
  addBook: async (bookId, status = "to-read") => {
    try {
      const response = await api.post("/user/books", { bookId, status });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.addBook:", error);
      throw error;
    }
  },

  // Mettre à jour le statut
  updateStatus: async (bookId, status, currentPage = null) => {
    try {
      const response = await api.put(`/user/books/${bookId}`, {
        status,
        currentPage,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.updateStatus:", error);
      throw error;
    }
  },

  // Toggle favori
  toggleFavorite: async (bookId) => {
    try {
      const response = await api.post(`/user/books/${bookId}/favorite`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.toggleFavorite:", error);
      throw error;
    }
  },

  // Supprimer un livre
  removeBook: async (bookId) => {
    try {
      const response = await api.delete(`/user/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur userBooksService.removeBook:", error);
      throw error;
    }
  },
};
