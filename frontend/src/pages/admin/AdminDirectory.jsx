// pages/admin/AdminDirectory.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MapPin,
  Mail,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  Building,
  Briefcase,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminDirectoryAPI } from "../../services/directory";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import MemberDetailsModal from "../../components/directory/MemberDetailsModal";
import { FadeIn } from "../../components/ui/animations";

const AdminDirectory = () => {
  // États
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, verified
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Charger les membres
  useEffect(() => {
    loadMembers();
  }, [pagination.page, statusFilter, searchQuery]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      };

      const response = await adminDirectoryAPI.getAllMembers(params);
      setMembers(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 20,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
      });
    } catch (error) {
      console.error("Erreur chargement membres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadMembers();
  };

  const handleVerifyMember = async (id, isVerified) => {
    if (
      !window.confirm(
        `Voulez-vous ${isVerified ? "vérifier" : "révoquer la vérification de"} ce membre ?`,
      )
    ) {
      return;
    }

    try {
      await adminDirectoryAPI.verifyMember(id, isVerified);
      // Recharger la liste
      loadMembers();
    } catch (error) {
      console.error("Erreur vérification:", error);
      alert("Erreur lors de la vérification");
    }
  };

  const handleDeleteMember = async (id) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer définitivement ce membre ?",
      )
    ) {
      return;
    }

    try {
      await adminDirectoryAPI.deleteMember(id);
      loadMembers();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleViewDetails = (memberId) => {
    setSelectedMember(memberId);
    setIsModalOpen(true);
  };

  const getStatusBadge = (isVerified) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3 mr-1" />
        Vérifié
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
        <XCircle className="w-3 h-3 mr-1" />
        En attente
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-asm-green-600 to-asm-yellow-600 rounded-xl flex items-center justify-center text-white mr-4">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Gestion des membres
                </h1>
                <p className="text-gray-600">
                  {pagination.total} membres au total •{" "}
                  {members.filter((m) => !m.isVerified).length} en attente
                </p>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="flex space-x-4">
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-green-700 font-semibold">
                  {members.filter((m) => m.isVerified).length}
                </span>
                <span className="text-green-600 text-sm ml-2">Vérifiés</span>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <span className="text-yellow-700 font-semibold">
                  {members.filter((m) => !m.isVerified).length}
                </span>
                <span className="text-yellow-600 text-sm ml-2">En attente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, email, entreprise..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-asm-green-600 text-white rounded-lg hover:bg-asm-green-700 transition"
            >
              Rechercher
            </button>
          </form>

          {/* Filtres par statut */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Filtrer :</span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "all"
                    ? "bg-asm-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => {
                  setStatusFilter("pending");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                En attente
              </button>
              <button
                onClick={() => {
                  setStatusFilter("verified");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "verified"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vérifiés
              </button>
            </div>
          </div>
        </div>

        {/* Liste des membres */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* En-tête du tableau */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="col-span-4">Membre</div>
            <div className="col-span-2">Contact</div>
            <div className="col-span-2">Entreprise</div>
            <div className="col-span-2">Localisation</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun membre trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <FadeIn key={member.id}>
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition">
                    {/* Membre */}
                    <div className="col-span-4 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-asm-green-500 to-asm-yellow-500 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                        {member.firstName?.[0]}
                        {member.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.currentPosition || "Non renseigné"}
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="text-sm text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {member.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Inscrit le{" "}
                          {new Date(member.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Entreprise */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {member.company || "Non renseigné"}
                        </span>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {member.location || "Non renseigné"}
                        </span>
                      </div>
                    </div>

                    {/* Statut */}
                    <div className="col-span-1 flex items-center">
                      {getStatusBadge(member.isVerified)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(member.id)}
                        className="p-2 text-gray-600 hover:text-asm-green-600 hover:bg-gray-100 rounded-lg transition"
                        title="Voir détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          handleVerifyMember(member.id, !member.isVerified)
                        }
                        className={`p-2 rounded-lg transition ${
                          member.isVerified
                            ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }`}
                        title={member.isVerified ? "Révoquer" : "Vérifier"}
                      >
                        {member.isVerified ? (
                          <UserX className="w-5 h-5" />
                        ) : (
                          <UserCheck className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Affichage de{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                à{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                sur <span className="font-medium">{pagination.total}</span>{" "}
                membres
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-1 bg-asm-green-600 text-white rounded-lg">
                  {pagination.page}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal des détails */}
      <MemberDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberId={selectedMember}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminDirectory;
