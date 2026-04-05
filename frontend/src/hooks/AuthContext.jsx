// src/hooks/AuthContext.jsx - VERSION SIMPLE ET SÉCURISÉE
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://https://asm-mada.onrender.com/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Protection absolue contre les boucles
  const hasChecked = useRef(false);

  // Vérifier une SEULE fois au chargement
  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // Utiliser d'abord le cache
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }

      // Vérifier avec le serveur
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } else {
        // Token invalide
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur auth:", error);
      // En cas d'erreur, garder l'utilisateur du cache
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.requiresVerification) {
          const userData = {
            id: data.userId,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: credentials.email,
            isVerified: false,
          };
          localStorage.setItem("token", data.token || "");
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
          navigate("/verification-pending");
          return data;
        }
        throw new Error(data.message || "Erreur de connexion");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      setTimeout(() => {
        navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
      }, 100);

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur d'inscription");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError("");
    hasChecked.current = false;
    navigate("/auth?mode=login");
  };

  const isAdmin = user?.role === "admin";
  const isVerified = user?.isVerified === true || user?.isVerified === 1;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin,
        isVerified,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
