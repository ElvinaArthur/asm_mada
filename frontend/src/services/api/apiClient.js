import axios from "axios";

// Configuration de base de l'API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000, // 10 secondes
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("asm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur pour gérer les réponses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      // Erreurs 401 - Non autorisé
      if (error.response.status === 401) {
        localStorage.removeItem("asm_token");
        localStorage.removeItem("asm_user");
        window.location.href = "/auth?mode=login";
      }

      // Erreurs 403 - Interdit
      if (error.response.status === 403) {
        console.error("Accès interdit:", error.response.data);
      }

      // Erreurs 404 - Non trouvé
      if (error.response.status === 404) {
        console.error("Ressource non trouvée:", error.response.config.url);
      }

      // Erreurs 500 - Serveur
      if (error.response.status >= 500) {
        console.error("Erreur serveur:", error.response.data);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
