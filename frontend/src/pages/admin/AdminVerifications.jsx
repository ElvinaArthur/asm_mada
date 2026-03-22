import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Users } from "lucide-react";

// Hooks
import useVerifications from "../../hooks/useVerifications";

// Composants
import StatsCards from "../../components/verification/StatsCards";
import FiltersBar from "../../components/verification/FiltersBar";
import VerificationCard from "../../components/verification/VerificationCard";
import ProofModal from "../../components/verification/ProofModal";
import RejectModal from "../../components/verification/RejectModal";
import SuccessPopup from "../../components/verification/SuccessPopup";
import EmptyState from "../../components/verification/EmptyState";
import Pagination from "../../components/verification/Pagination";

const AdminVerifications = () => {
  const navigate = useNavigate();
  const {
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
  } = useVerifications();

  if (loading && pendingUsers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des vérifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Vérifications en attente
              </h1>
              <p className="text-gray-600">
                Validez les demandes d'inscription des nouveaux membres
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadPendingUsers}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <StatsCards stats={stats} pendingUsers={pendingUsers} />

        {/* Filtres */}
        <FiltersBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setPagination={setPagination}
        />

        {/* Liste des utilisateurs */}
        {pendingUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {pendingUsers.map((user) => (
                <VerificationCard
                  key={user.id}
                  user={user}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                  handleApprove={handleApprove}
                  handleOpenRejectModal={handleOpenRejectModal}
                  handleViewProof={handleViewProof}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} setPagination={setPagination} />
          </>
        )}

        {/* Modals */}
        <ProofModal
          isOpen={isProofModalOpen}
          onClose={() => {
            setIsProofModalOpen(false);
            setProofDetails(null);
          }}
          proofDetails={proofDetails}
          selectedUser={selectedUser}
          downloadProof={downloadProof}
          handleApprove={handleApprove}
          handleOpenRejectModal={handleOpenRejectModal}
        />

        <RejectModal
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setUserToReject(null);
          }}
          userToReject={userToReject}
          onReject={handleReject}
        />

        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          message={successMessage}
        />
      </div>
    </div>
  );
};

export default AdminVerifications;
