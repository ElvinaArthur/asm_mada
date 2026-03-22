import axios from "axios";

const API_URL = "http://localhost:3000/api/admin";

// Configuration axios avec interceptor
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
  (error) => Promise.reject(error),
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth?mode=login";
    }
    return Promise.reject(error);
  },
);

export const adminService = {
  // ==================== DASHBOARD ====================
  getDashboardStats: async () => {
    try {
      const response = await adminApi.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur dashboard stats:", error);
      throw error;
    }
  },

  // ==================== UTILISATEURS ====================
  getAllUsers: async (params = {}) => {
    try {
      const response = await adminApi.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur get users:", error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await adminApi.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur get user by id:", error);
      throw error;
    }
  },

  verifyUser: async (userId) => {
    try {
      const response = await adminApi.put(`/users/${userId}/verify`);
      return response.data;
    } catch (error) {
      console.error("Erreur verify user:", error);
      throw error;
    }
  },

  // ==================== GESTION DES JUSTIFICATIFS ====================
  rejectUserWithReason: async (userId, reason) => {
    try {
      const response = await adminApi.put(
        `/users/${userId}/reject-with-reason`,
        { reason },
      );
      return response.data;
    } catch (error) {
      console.error("Erreur rejet avec raison:", error);
      throw error;
    }
  },

  getUserProof: async (userId) => {
    try {
      const response = await adminApi.get(`/users/${userId}/proof`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération justificatif:", error);
      throw error;
    }
  },

  deleteUserProof: async (userId) => {
    try {
      const response = await adminApi.delete(`/users/${userId}/proof`);
      return response.data;
    } catch (error) {
      console.error("Erreur suppression justificatif:", error);
      throw error;
    }
  },

  rejectUser: async (userId) => {
    try {
      const response = await adminApi.put(`/users/${userId}/reject`);
      return response.data;
    } catch (error) {
      console.error("Erreur reject user:", error);
      throw error;
    }
  },

  toggleBlockUser: async (userId) => {
    try {
      const response = await adminApi.put(`/users/${userId}/toggle-block`);
      return response.data;
    } catch (error) {
      console.error("Erreur toggle block:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await adminApi.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur delete user:", error);
      throw error;
    }
  },

  bulkApproveUsers: async (userIds) => {
    try {
      const response = await adminApi.post("/users/bulk-approve", { userIds });
      return response.data;
    } catch (error) {
      console.error("Erreur bulk approve:", error);
      throw error;
    }
  },

  // ==================== VÉRIFICATIONS ====================
  getPendingVerifications: async (params = {}) => {
    try {
      const response = await adminApi.get("/users/pending", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur get pending verifications:", error);
      throw error;
    }
  },

  // ==================== LIVRES ====================
  getAllBooks: async (params = {}) => {
    try {
      const response = await adminApi.get("/books", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur get books:", error);
      throw error;
    }
  },

  getBookById: async (bookId) => {
    try {
      const response = await adminApi.get(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur get book by id:", error);
      throw error;
    }
  },

  getBookCategories: async () => {
    try {
      const response = await adminApi.get("/books/categories");
      return response.data;
    } catch (error) {
      console.error("Erreur get categories:", error);
      throw error;
    }
  },

  addBook: async (bookData) => {
    try {
      const response = await adminApi.post("/books", bookData);
      return response.data;
    } catch (error) {
      console.error("Erreur add book:", error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await adminApi.put(`/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      console.error("Erreur update book:", error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const response = await adminApi.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur delete book:", error);
      throw error;
    }
  },

  bulkDeleteBooks: async (bookIds) => {
    try {
      const response = await adminApi.post("/books/bulk-delete", { bookIds });
      return response.data;
    } catch (error) {
      console.error("Erreur bulk delete books:", error);
      throw error;
    }
  },

  // ==================== UPLOAD FICHIERS ====================
  uploadFile: async (file, type = "document") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await adminApi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(`Upload: ${percentCompleted}%`);
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur upload:", error);
      throw error;
    }
  },

  uploadPdf: async (file) => {
    return adminService.uploadFile(file, "pdf");
  },

  uploadImage: async (file) => {
    return adminService.uploadFile(file, "image");
  },

  // ==================== PROFIL ====================
  getProfile: async () => {
    try {
      const response = await adminApi.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Erreur get profile:", error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await adminApi.put("/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Erreur update profile:", error);
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await adminApi.put("/profile/password", passwordData);
      return response.data;
    } catch (error) {
      console.error("Erreur update password:", error);
      throw error;
    }
  },

  // ==================== PARAMÈTRES ====================
  getSettings: async () => {
    try {
      const response = await adminApi.get("/settings");
      return response.data;
    } catch (error) {
      console.error("Erreur get settings:", error);
      throw error;
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await adminApi.put("/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Erreur update settings:", error);
      throw error;
    }
  },

  // ==================== ÉVÉNEMENTS ====================
  getEvents: async (params = {}) => {
    try {
      const response = await adminApi.get("/events", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur get events:", error);
      throw error;
    }
  },

  getEventById: async (eventId) => {
    try {
      const response = await adminApi.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur get event by id:", error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await adminApi.post("/events", eventData);
      return response.data;
    } catch (error) {
      console.error("Erreur create event:", error);
      throw error;
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const response = await adminApi.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Erreur update event:", error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await adminApi.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur delete event:", error);
      throw error;
    }
  },

  // ==================== STATISTIQUES ====================
  getStatistics: async (period = "month") => {
    try {
      const response = await adminApi.get("/statistics", {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur get statistics:", error);
      throw error;
    }
  },

  // ==================== ACTIVITÉS ====================
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await adminApi.get("/activities/recent", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur get activities:", error);
      throw error;
    }
  },

  // ==================== EXPORT ====================
  exportUsers: async (format = "csv") => {
    try {
      const response = await adminApi.get("/export/users", {
        params: { format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Erreur export users:", error);
      throw error;
    }
  },

  exportBooks: async (format = "csv") => {
    try {
      const response = await adminApi.get("/export/books", {
        params: { format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Erreur export books:", error);
      throw error;
    }
  },

  // ==================== BACKEND/SYSTEM ====================
  getSystemInfo: async () => {
    try {
      const response = await adminApi.get("/system/info");
      return response.data;
    } catch (error) {
      console.error("Erreur get system info:", error);
      throw error;
    }
  },

  backupDatabase: async () => {
    try {
      const response = await adminApi.post("/system/backup");
      return response.data;
    } catch (error) {
      console.error("Erreur backup:", error);
      throw error;
    }
  },

  clearCache: async () => {
    try {
      const response = await adminApi.post("/system/clear-cache");
      return response.data;
    } catch (error) {
      console.error("Erreur clear cache:", error);
      throw error;
    }
  },

  // ==================== AJOUTS POUR LES FONCTIONNALITÉS MANQUANTES ====================

  // ✅ Vérification en masse (alias pour bulkApproveUsers)
  bulkVerifyUsers: async (userIds) => {
    try {
      const response = await adminApi.post("/users/bulk-approve", { userIds });
      return response.data;
    } catch (error) {
      console.error("Erreur bulk verify:", error);
      throw error;
    }
  },

  // 🗑️ Suppression en masse
  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await adminApi.post("/users/bulk-delete", { userIds });
      return response.data;
    } catch (error) {
      console.error("Erreur bulk delete:", error);
      throw error;
    }
  },

  // 📊 Statistiques de vérification
  getVerificationStats: async () => {
    try {
      const response = await adminApi.get("/verifications/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur stats vérifications:", error);
      throw error;
    }
  },

  // 👥 Utilisateurs en attente avec justificatifs
  getPendingVerificationsWithProofs: async (params = {}) => {
    try {
      const response = await adminApi.get("/verifications", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur pending verifications with proofs:", error);
      throw error;
    }
  },

  // ✅ Approuver un utilisateur (alias)
  approveUser: async (userId) => {
    try {
      const response = await adminApi.put(`/users/${userId}/verify`);
      return response.data;
    } catch (error) {
      console.error("Erreur approve user:", error);
      throw error;
    }
  },

  // ❌ Rejeter un utilisateur avec raison (alias plus clair)
  rejectUserWithReasonAlias: async (userId, reason) => {
    try {
      const response = await adminApi.put(
        `/users/${userId}/reject-with-reason`,
        { reason },
      );
      return response.data;
    } catch (error) {
      console.error("Erreur reject with reason:", error);
      throw error;
    }
  },

  // 🔄 Activer/Désactiver (alias pour toggleBlockUser)
  toggleUserStatus: async (userId) => {
    try {
      const response = await adminApi.put(`/users/${userId}/toggle-block`);
      return response.data;
    } catch (error) {
      console.error("Erreur toggle status:", error);
      throw error;
    }
  },

  // ==================== SUPPRESSION UTILISATEUR ====================
  deleteUser: async (userId) => {
    try {
      const response = await adminApi.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur delete user:", error);
      throw error.response?.data || error;
    }
  },

  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await adminApi.post("/users/bulk-delete", { userIds });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur bulk delete:", error);
      throw error.response?.data || error;
    }
  },
};
export default adminService;
