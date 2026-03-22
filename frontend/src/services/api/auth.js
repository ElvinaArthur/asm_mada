// src/services/api/auth.js
import apiClient from "./apiClient";

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      // Pour le développement, on simule une API
      console.warn("API non disponible, simulation du login...");
      return simulateLogin(credentials);
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.warn("API non disponible, simulation de l'inscription...");
      return simulateRegister(userData);
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.warn("Erreur logout API");
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      // En cas d'erreur, on vérifie le token en localStorage
      const token = localStorage.getItem("auth_token");
      if (token) {
        return simulateGetUserFromToken(token);
      }
      return null;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.warn("API forgot-password non disponible");
      return {
        success: true,
        message: "Email de réinitialisation envoyé (simulation)",
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.warn("API reset-password non disponible");
      return {
        success: true,
        message: "Mot de passe réinitialisé (simulation)",
      };
    }
  },
};

// Simulation pour le développement
function simulateLogin(credentials) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        const user = {
          id: 1,
          email: credentials.email,
          firstName: "John",
          lastName: "Doe",
          isVerified: true,
          isAdmin: false,
          role: "member",
          token: "fake-jwt-token-" + Date.now(),
          refreshToken: "fake-refresh-token",
        };
        localStorage.setItem("auth_token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error("Email ou mot de passe incorrect"));
      }
    }, 1000);
  });
}

function simulateRegister(userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password) {
        const user = {
          id: 2,
          email: userData.email,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          isVerified: false, // En attente de vérification
          isAdmin: false,
          role: "member",
          token: "fake-jwt-token-register-" + Date.now(),
          refreshToken: "fake-refresh-token",
        };
        localStorage.setItem("auth_token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error("Données d'inscription incomplètes"));
      }
    }, 1000);
  });
}

function simulateGetUserFromToken(token) {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}
