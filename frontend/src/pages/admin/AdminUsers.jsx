// frontend/src/pages/admin/AdminUsers.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";

// Hooks
import useUsers from "../../hooks/useUsers";

// Composants (déjà existants dans components/adminUser/)
import UsersHeader from "../../components/adminUser/UsersHeader";
import UsersStats from "../../components/adminUser/UsersStats";
import UsersFilters from "../../components/adminUser/UsersFilter";
import UsersTable from "../../components/adminUser/UsersTable";
import UserDetailsModal from "../../components/adminUser/UserDetailsModal";
import DeleteConfirmModal from "../../components/adminUser/DeleteConfirmModal";
import ExportModal from "../../components/adminUser/ExportModal";

const AdminUsers = () => {
  const {
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
  } = useUsers();

  // ============ GESTIONNAIRES ============
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Actions individuelles
  const handleVerify = async (userId) => {
    const result = await handleVerifyUser(userId);
    alert(result.message);
  };

  const handleReject = async (userId) => {
    const reason = prompt("Raison du rejet :");
    if (reason && reason.trim()) {
      const result = await handleRejectUser(userId, reason);
      alert(result.message);
    }
  };

  const handleBlockToggle = async (userId) => {
    const user = users.find((u) => u.id === userId);
    const confirmMessage = user?.isActive
      ? "🚫 Bloquer cet utilisateur ? Il ne pourra plus se connecter."
      : "✅ Débloquer cet utilisateur ?";

    if (window.confirm(confirmMessage)) {
      const result = await handleToggleBlock(userId);
      alert(result.message);
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find((u) => u.id === userId);
    setUserToDelete(user);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  // Actions en masse
  const handleBulkVerifyClick = async () => {
    if (selectedUsers.length === 0) {
      alert("Veuillez sélectionner au moins un utilisateur");
      return;
    }
    if (
      window.confirm(`✅ Vérifier ${selectedUsers.length} utilisateur(s) ?`)
    ) {
      const result = await handleBulkVerify();
      alert(result.message);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedUsers.length === 0) {
      alert("Veuillez sélectionner au moins un utilisateur");
      return;
    }
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      const result = await handleBulkDelete();
      alert(result.message);
    } else {
      const result = await handleDeleteUser(userToDelete.id);
      alert(result.message);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleExport = (options) => {
    exportToCSV(options);
    setIsExportModalOpen(false);
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Chargement initial
  useEffect(() => {
    loadUsers();
  }, []);

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 lg:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header avec actions en masse */}
        <UsersHeader
          selectedCount={selectedUsers.length}
          onBulkVerify={handleBulkVerifyClick}
          onBulkDelete={handleBulkDeleteClick}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Statistiques */}
        <UsersStats users={users} />

        {/* Filtres */}
        <UsersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onReset={handleResetFilters}
        />

        {/* Tableau des utilisateurs */}
        <UsersTable
          users={filteredUsers}
          selectedUsers={selectedUsers}
          onSelectAll={handleSelectAll}
          onSelectUser={handleSelectUser}
          onVerify={handleVerify}
          onReject={handleReject}
          onToggleBlock={handleBlockToggle}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
        />

        {/* Modals */}
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          user={selectedUser}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            setIsBulkDelete(false);
          }}
          onConfirm={handleConfirmDelete}
          user={userToDelete}
          isBulk={isBulkDelete}
          selectedCount={selectedUsers.length}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />
      </div>
    </motion.div>
  );
};

export default AdminUsers;
