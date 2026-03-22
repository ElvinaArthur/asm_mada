// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api/auth";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("auth_token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else {
          // Essayer de récupérer l'utilisateur via l'API
          const currentUser = await authAPI.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        console.error("Erreur initialisation auth:", err);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authAPI.login(credentials);
      setUser(userData);
      localStorage.setItem("auth_token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const registeredUser = await authAPI.register(userData);
      setUser(registeredUser);
      localStorage.setItem("auth_token", registeredUser.token);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      return registeredUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.forgotPassword(email);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.resetPassword(token, newPassword);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...userData }));
  };

  const isAdmin = user?.isAdmin || user?.role === "admin";
  const isVerified = user?.isVerified;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUser,
        isAuthenticated: !!user,
        isAdmin,
        isVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
