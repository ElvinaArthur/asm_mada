// frontend/src/services/adminService.js
import axios from "axios";

const API_URL = "https://asm-mada.onrender.com/api/admin";

// Intercepteur pour ajouter le token automatiquement
const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use(
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

// ==================== SERVICES UTILISATEURS ====================
export const adminUserService = {
  // Récupérer les utilisateurs en attente
  getPendingUsers: async () => {
    try {
      const response = await adminApi.get("/users/pending");
      return response.data;
    } catch (error) {
      console.error("Erreur getPendingUsers:", error);
      throw error;
    }
  },

  // Vérifier un utilisateur
  verifyUser: async (userId) => {
    try {
      const response = await adminApi.put(`/users/${userId}/verify`);
      return response.data;
    } catch (error) {
      console.error("Erreur verifyUser:", error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (userId) => {
    try {
      const response = await adminApi.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur deleteUser:", error);
      throw error;
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await adminApi.get(`/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Erreur getAllUsers:", error);
      throw error;
    }
  },
};

// ==================== SERVICES LIVRES ====================
export const adminBookService = {
  // Récupérer tous les livres (admin avec plus de données)
  getAllBooks: async (page = 1, limit = 10, search = "", category = "") => {
    try {
      let url = `/books?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const response = await adminApi.get(url);
      return response.data;
    } catch (error) {
      console.error("Erreur getAllBooks:", error);
      throw error;
    }
  },

  // Ajouter un nouveau livre
  addBook: async (bookData) => {
    try {
      const response = await adminApi.post("/books", bookData);
      return response.data;
    } catch (error) {
      console.error("Erreur addBook:", error);
      throw error;
    }
  },

  // Mettre à jour un livre
  updateBook: async (bookId, bookData) => {
    try {
      const response = await adminApi.put(`/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      console.error("Erreur updateBook:", error);
      throw error;
    }
  },

  // Supprimer un livre
  deleteBook: async (bookId) => {
    try {
      const response = await adminApi.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur deleteBook:", error);
      throw error;
    }
  },

  // Upload un fichier PDF
  uploadPDF: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "pdf");

      const response = await adminApi.post("/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur uploadPDF:", error);
      throw error;
    }
  },

  // Upload une thumbnail
  uploadThumbnail: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "thumbnail");

      const response = await adminApi.post("/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur uploadThumbnail:", error);
      throw error;
    }
  },

  // Lister les fichiers disponibles
  listUploads: async (type = "pdf") => {
    try {
      const response = await adminApi.get(
        `/uploads/${type === "pdf" ? "pdfs" : "thumbnails"}`,
      );
      return response.data;
    } catch (error) {
      console.error("Erreur listUploads:", error);
      throw error;
    }
  },

  // Statistiques des livres
  getBookStats: async () => {
    try {
      const response = await adminApi.get("/books/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur getBookStats:", error);
      throw error;
    }
  },
};

// ==================== SERVICES STATISTIQUES ====================
export const adminStatsService = {
  // Récupérer les statistiques globales
  getDashboardStats: async () => {
    try {
      const [users, books, uploads] = await Promise.all([
        adminApi.get("/users/stats"),
        adminApi.get("/books/stats"),
        adminApi.get("/uploads/stats"),
      ]);

      return {
        users: users.data,
        books: books.data,
        uploads: uploads.data,
      };
    } catch (error) {
      console.error("Erreur getDashboardStats:", error);
      throw error;
    }
  },
};

// Vérifier si l'utilisateur est admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role === "admin";
};

// frontend/src/services/adminService.js - AJOUTER CES FONCTIONS
// ==================== SERVICES VÉRIFICATION ====================
export const adminVerificationService = {
  // Récupérer les utilisateurs en attente de vérification
  getPendingVerifications: async (params = {}) => {
    try {
      const response = await adminApi.get("/admin/verifications", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur getPendingVerifications:", error);
      throw error.response?.data || error.message;
    }
  },

  // Vérifier un utilisateur
  verifyUser: async (userId) => {
    try {
      const response = await adminApi.post(
        `/admin/verifications/verify/${userId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Erreur verifyUser:", error);
      throw error.response?.data || error.message;
    }
  },

  // Rejeter un utilisateur
  rejectUser: async (userId, reason) => {
    try {
      const response = await adminApi.post(
        `/admin/verifications/reject/${userId}`,
        {
          reason,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Erreur rejectUser:", error);
      throw error.response?.data || error.message;
    }
  },

  // Vérifier plusieurs utilisateurs en masse
  bulkVerifyUsers: async (userIds) => {
    try {
      const response = await adminApi.post("/admin/verifications/bulk-verify", {
        userIds,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur bulkVerifyUsers:", error);
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les statistiques de vérification
  getVerificationStats: async () => {
    try {
      const response = await adminApi.get("/admin/verifications/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur getVerificationStats:", error);
      throw error.response?.data || error.message;
    }
  },

  // Vérifier le statut de vérification d'un utilisateur
  checkUserVerification: async (userId) => {
    try {
      const response = await adminApi.get(
        `/admin/users/${userId}/verification-status`,
      );
      return response.data;
    } catch (error) {
      console.error("Erreur checkUserVerification:", error);
      throw error.response?.data || error.message;
    }
  },
};

// Ajouter aussi cette fonction à la fin du fichier
export const checkVerificationStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { isVerified: false, status: "not_logged_in" };

    const response = await adminApi.get("/auth/me");
    const user = response.data.user;

    return {
      isVerified: user.isVerified === 1,
      status: user.isVerified === 1 ? "verified" : "pending",
      user: user,
    };
  } catch (error) {
    console.error("Erreur checkVerificationStatus:", error);
    return { isVerified: false, status: "error" };
  }
};

// Mettre à jour l'export par défaut
export default {
  adminUserService,
  adminBookService,
  adminStatsService,
  adminVerificationService,
  isAdmin,
  checkVerificationStatus,
};
