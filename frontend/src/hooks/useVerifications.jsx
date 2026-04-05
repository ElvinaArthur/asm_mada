import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useVerifications = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [stats, setStats] = useState({
    totalPending: 0,
    today: 0,
    lastWeek: 0,
    averageTime: "2.5 jours",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [proofDetails, setProofDetails] = useState(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [userToReject, setUserToReject] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Charger les utilisateurs en attente
  const loadPendingUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth?mode=login");
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(
        `https://asm-mada.onrender.com/api/admin/verifications?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth?mode=login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setPendingUsers(data.data || []);
        if (data.pagination) setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement vérifications:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, navigate]);

  // Charger les détails du justificatif
  const loadProofDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth?mode=login");
        return;
      }

      const response = await fetch(
        `https://asm-mada.onrender.com/api/proofs/admin/proof/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProofDetails(data.data);
          setSelectedUser(data.data.user);
          setIsProofModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Erreur chargement justificatif:", error);
    }
  };

  // Vérifier un utilisateur
  const verifyUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth?mode=login");
        return false;
      }

      const response = await fetch(
        `https://asm-mada.onrender.com/api/admin/verifications/verify/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Rejeter un utilisateur
  const rejectUser = async (userId, reason) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth?mode=login");
        return false;
      }

      const response = await fetch(
        `https://asm-mada.onrender.com/api/admin/verifications/reject/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        },
      );

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Télécharger un justificatif
  const downloadProof = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth?mode=login");
        return;
      }

      const response = await fetch(
        `https://asm-mada.onrender.com/api/proofs/download/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    }
  };

  // Handlers
  const handleApprove = async (userId, userData) => {
    try {
      await verifyUser(userId);
      setSuccessMessage(
        `✅ ${userData.firstName} ${userData.lastName} vérifié !`,
      );
      setShowSuccessPopup(true);
      loadPendingUsers();
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setIsProofModalOpen(false);
    } catch (error) {
      alert("Erreur: " + (error.message || "Veuillez réessayer"));
    }
  };

  const handleOpenRejectModal = (userId, userData) => {
    setUserToReject({ id: userId, ...userData });
    setIsRejectModalOpen(true);
  };

  const handleReject = async (reason) => {
    try {
      await rejectUser(userToReject.id, reason);
      setSuccessMessage(
        `❌ ${userToReject.firstName} ${userToReject.lastName} - Demande rejetée`,
      );
      setShowSuccessPopup(true);
      loadPendingUsers();
      setIsRejectModalOpen(false);
      setIsProofModalOpen(false);
      setUserToReject(null);
    } catch (error) {
      alert("Erreur: " + (error.message || "Veuillez réessayer"));
    }
  };

  const handleViewProof = (userId, userData) => {
    loadProofDetails(userId);
  };

  // Effets
  useEffect(() => {
    loadPendingUsers();
  }, [pagination.page, loadPendingUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        loadPendingUsers();
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, loadPendingUsers, pagination.page]);

  return {
    // États
    pendingUsers,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    selectedUsers,
    setSelectedUsers,
    pagination,
    setPagination,
    stats,
    selectedUser,
    proofDetails,
    isProofModalOpen,
    setIsProofModalOpen,
    isRejectModalOpen,
    setIsRejectModalOpen,
    userToReject,
    setUserToReject,
    showSuccessPopup,
    setShowSuccessPopup,
    successMessage,
    // Fonctions
    handleApprove,
    handleOpenRejectModal,
    handleReject,
    handleViewProof,
    downloadProof,
    loadPendingUsers,
  };
};

export default useVerifications;
