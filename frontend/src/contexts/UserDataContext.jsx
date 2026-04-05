// src/contexts/UserDataContext.jsx - VERSION SIMPLE SANS BOUCLE
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "../hooks/AuthContext";

const UserDataContext = createContext();

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within UserDataProvider");
  }
  return context;
};

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();

  // États avec valeurs par défaut
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    booksRead: 0,
    booksReading: 0,
    booksToRead: 0,
    favorites: 0,
    eventsUpcoming: 0,
    eventsAttended: 0,
    daysRemaining: 365,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Protection absolue contre les boucles
  const hasLoaded = useRef(false);
  const currentUserId = useRef(null);

  // Charger les données UNE SEULE FOIS
  useEffect(() => {
    // Si pas d'utilisateur, ne rien faire
    if (!user?.id) {
      hasLoaded.current = false;
      currentUserId.current = null;
      return;
    }

    // Si déjà chargé pour cet utilisateur, ne rien faire
    if (hasLoaded.current && currentUserId.current === user.id) {
      return;
    }

    // Marquer comme chargé IMMÉDIATEMENT
    hasLoaded.current = true;
    currentUserId.current = user.id;

    // Charger les données
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Charger les stats
      try {
        const statsRes = await fetch(
          "https://asm-mada.onrender.com/api/user/books/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats((prev) => ({
              ...prev,
              booksRead: statsData.data?.booksRead || 0,
              booksReading: statsData.data?.booksReading || 0,
              booksToRead: statsData.data?.booksToRead || 0,
              favorites: statsData.data?.favorites || 0,
            }));
          }
        }
      } catch (e) {
        console.warn("Erreur stats livres:", e.message);
      }

      // Charger les événements stats
      try {
        const eventsRes = await fetch(
          "https://asm-mada.onrender.com/api/user/events/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (eventsData.success) {
            setStats((prev) => ({
              ...prev,
              eventsUpcoming: eventsData.data?.upcoming || 0,
              eventsAttended: eventsData.data?.attended || 0,
            }));
          }
        }
      } catch (e) {
        console.warn("Erreur stats événements:", e.message);
      }

      // Charger l'activité
      try {
        const activityRes = await fetch(
          "https://asm-mada.onrender.com/api/user/activity?limit=5",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          if (activityData.success) {
            setRecentActivity(activityData.data || []);
          }
        }
      } catch (e) {
        console.warn("Erreur activité:", e.message);
      }

      // Calculer jours restants
      if (user?.memberSince || user?.createdAt) {
        const start = new Date(user.memberSince || user.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        setStats((prev) => ({
          ...prev,
          daysRemaining: Math.max(0, 365 - diffDays),
        }));
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    stats,
    recentActivity,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
