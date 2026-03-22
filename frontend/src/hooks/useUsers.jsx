// frontend/src/pages/admin/users/hooks/useUsers.js
import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // États pour les modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // ============ CHARGEMENT DES DONNÉES ============
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
      });

      if (response.success) {
        // 🔴 CORRECTION : Normaliser les données
        const normalizedUsers = (response.data || []).map((user) => ({
          ...user,
          isActive: user.isActive === 1 || user.isActive === true, // Force en booléen
          isVerified: user.isVerified === 1 || user.isVerified === true,
        }));

        setUsers(normalizedUsers);
        setFilteredUsers(normalizedUsers);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error("❌ Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter, roleFilter]);

  // ============ FILTRES ============
  const applyFilters = useCallback(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter === "pending") {
      filtered = filtered.filter((user) => !user.isVerified);
    } else if (statusFilter === "verified") {
      filtered = filtered.filter((user) => user.isVerified);
    } else if (statusFilter === "blocked") {
      filtered = filtered.filter((user) => !user.isActive);
    }

    if (roleFilter === "admin") {
      filtered = filtered.filter((user) => user.role === "admin");
    } else if (roleFilter === "user") {
      filtered = filtered.filter((user) => user.role === "user");
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // ============ ACTIONS UTILISATEUR ============

  // ✅ VÉRIFIER un utilisateur
  const handleVerifyUser = async (userId) => {
    try {
      const response = await adminService.verifyUser(userId);
      await loadUsers();
      return {
        success: true,
        message: response.message || "✅ Utilisateur vérifié avec succès",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erreur lors de la vérification",
      };
    }
  };

  // ❌ REJETER un utilisateur
  const handleRejectUser = async (userId, reason) => {
    try {
      const response = await adminService.rejectUser(userId, reason);
      await loadUsers();
      return {
        success: true,
        message: response.message || "❌ Utilisateur rejeté",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erreur lors du rejet",
      };
    }
  };

  // 🔄 BLOQUER/DÉBLOQUER un utilisateur
  const handleToggleBlock = async (userId) => {
    try {
      const response = await adminService.toggleBlockUser(userId);
      await loadUsers();
      return {
        success: true,
        message: response.message || "🔄 Statut modifié avec succès",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erreur lors du changement de statut",
      };
    }
  };

  // 🗑️ SUPPRIMER un utilisateur
  const handleDeleteUser = async (userId) => {
    try {
      const response = await adminService.deleteUser(userId);
      await loadUsers(); // Recharger la liste
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      return {
        success: true,
        message: response.message || "✅ Utilisateur supprimé avec succès",
      };
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la suppression",
      };
    }
  };

  // ✅ VÉRIFICATION EN MASSE
  const handleBulkVerify = async () => {
    try {
      const response = await adminService.bulkVerifyUsers(selectedUsers);
      await loadUsers();
      setSelectedUsers([]);
      return {
        success: true,
        message:
          response.message ||
          `✅ ${selectedUsers.length} utilisateur(s) vérifié(s)`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erreur lors de la vérification en masse",
      };
    }
  };

  // 🗑️ SUPPRESSION EN MASSE
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      return { success: false, message: "Aucun utilisateur sélectionné" };
    }

    try {
      const response = await adminService.bulkDeleteUsers(selectedUsers);
      await loadUsers();
      setSelectedUsers([]);
      return {
        success: true,
        message:
          response.message ||
          `✅ ${selectedUsers.length} utilisateur(s) supprimé(s)`,
      };
    } catch (error) {
      console.error("❌ Erreur bulk delete:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la suppression en masse",
      };
    }
  };

  // 📤 EXPORT CSV
  const exportToCSV = (options = {}) => {
    const { scope = "filtered", includeHeaders = true } = options;
    const dataToExport = scope === "filtered" ? filteredUsers : users;

    const headers = [
      "ID",
      "Prénom",
      "Nom",
      "Email",
      "Rôle",
      "Vérifié",
      "Actif",
      "Date inscription",
      "Promotion",
      "Spécialisation",
    ];
    const csvData = dataToExport.map((user) => [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.role,
      user.isVerified ? "Oui" : "Non",
      user.isActive ? "Oui" : "Non",
      new Date(user.createdAt).toLocaleDateString("fr-FR"),
      user.graduationYear || "",
      user.specialization || "",
    ]);

    const csvContent = [
      ...(includeHeaders ? [headers.join(",")] : []),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `utilisateurs_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    // États
    users,
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    selectedUsers,
    setSelectedUsers,
    pagination,
    setPagination,

    // Modals
    selectedUser,
    setSelectedUser,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    userToDelete,
    setUserToDelete,
    isBulkDelete,
    setIsBulkDelete,

    // Actions
    loadUsers,
    handleVerifyUser,
    handleRejectUser,
    handleToggleBlock,
    handleDeleteUser,
    handleBulkVerify,
    handleBulkDelete,
    exportToCSV,
  };
};

export default useUsers;
