import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://asm-mada.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 secondes max
});

// Cache simple en mémoire pour éviter les requêtes répétées
const cache = {
  books: null,
  categories: null,
  lastFetch: {
    books: 0,
    categories: 0,
  },
};

// Attendre avant de réessayer en cas d'erreur 429
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Intercepteur avec retry pour les erreurs 429
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 429 (trop de requêtes), attendre et réessayer une fois
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("⏳ API limitée, attente de 3 secondes avant réessai...");
      await wait(3000);
      return api(originalRequest);
    }

    // Pour les autres erreurs, ne pas spammer la console
    if (error.response?.status !== 404 && error.response?.status !== 429) {
      console.warn(
        "⚠️ API Error:",
        error.response?.data?.message || "Erreur de connexion",
      );
    }

    return Promise.reject(error);
  },
);

export const bookAPI = {
  // Récupérer tous les livres (avec cache intelligent)
  getBooks: async (params = {}) => {
    try {
      // Ne pas utiliser le cache si des paramètres de filtrage sont présents
      if (Object.keys(params).length > 0) {
        const response = await api.get("/books", { params });
        return response.data;
      }

      // Utiliser le cache si disponible et récent (< 60 secondes)
      const now = Date.now();
      if (cache.books && now - cache.lastFetch.books < 60000) {
        console.log("📚 Utilisation du cache pour les livres");
        return cache.books;
      }

      const response = await api.get("/books", { params });

      // Mettre en cache seulement si succès
      if (response.data) {
        cache.books = response.data;
        cache.lastFetch.books = now;
      }

      return response.data;
    } catch (error) {
      console.error("❌ Erreur API getBooks:", error.message);

      // Retourner le cache en cas d'erreur (seulement si disponible)
      if (cache.books) {
        return cache.books;
      }

      // Lancer l'erreur pour que le frontend la gère
      throw error;
    }
  },

  // Récupérer un livre par ID
  getBook: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur API getBook:", error.message);
      throw error;
    }
  },

  // Récupérer les catégories (avec cache)
  getCategories: async () => {
    try {
      // Utiliser le cache si disponible et récent
      const now = Date.now();
      if (cache.categories && now - cache.lastFetch.categories < 120000) {
        // 2 minutes
        console.log("🏷️ Utilisation du cache pour les catégories");
        return cache.categories;
      }

      const response = await api.get("/books/categories");

      // Mettre en cache seulement si succès
      if (response.data) {
        cache.categories = response.data;
        cache.lastFetch.categories = now;
      }

      return response.data;
    } catch (error) {
      console.error("❌ Erreur API getCategories:", error.message);

      // Retourner le cache en cas d'erreur
      if (cache.categories) {
        return cache.categories;
      }

      throw error;
    }
  },

  // Rechercher des livres
  searchBooks: async (query, params = {}) => {
    try {
      const response = await api.get(`/books/search/${query}`, { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur API searchBooks:", error.message);

      // Pour la recherche, retourner un tableau vide plutôt que de throw
      // pour ne pas casser l'interface utilisateur
      return {
        success: false,
        message: "Erreur de recherche",
        data: [],
        total: 0,
      };
    }
  },

  // Incrémenter les vues d'un livre (silencieux)
  incrementViews: async (id) => {
    try {
      await api.patch(`/books/${id}/views`);
    } catch (error) {
      // Ignorer silencieusement les erreurs pour cette fonction
      console.log("Note: Impossible d'incrémenter les vues");
    }
  },

  // Récupérer le chemin du PDF
  getPDFPath: async (id) => {
    try {
      const response = await api.get(`/books/${id}/pdf-path`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur API getPDFPath:", error.message);
      throw error;
    }
  },

  // Vérifier si l'API est accessible
  healthCheck: async () => {
    try {
      await api.get("/health");
      return true;
    } catch (error) {
      console.warn("⚠️ API non accessible:", error.message);
      return false;
    }
  },

  // Nettoyer le cache (utile pour le développement)
  clearCache: () => {
    cache.books = null;
    cache.categories = null;
    cache.lastFetch.books = 0;
    cache.lastFetch.categories = 0;
    console.log("🧹 Cache nettoyé");
  },
};
