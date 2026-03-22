// pages/Members/MembersPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { directoryAPI } from "../../services/directory";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import MemberDetailsModal from "../../components/directory/MemberDetailsModal";
import { Users } from "lucide-react";
import { FadeIn } from "../../components/ui/animations";
// Import des nouveaux composants
import DirectoryHero from "../../components/directory/DirectoryHero";
import DirectoryFilters from "../../components/directory/DirectoryFilters";
import DirectoryViews from "../../components/directory/DirectoryViews";
import DirectoryPagination from "../../components/directory/DirectoryPagination";
import DirectoryStats from "../../components/directory/DirectoryStats";
import MemberCard from "../../components/directory/MemberCard";
import MemberListItem from "../../components/directory/MemberListItem";

const MembersPage = () => {
  const { user, isAdmin } = useAuth();

  // États
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Modal
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données pour les filtres
  const regions = [
    { id: "all", label: "Toutes les régions" },
    { id: "antananarivo", label: "Antananarivo" },
    { id: "toamasina", label: "Toamasina" },
    { id: "fianarantsoa", label: "Fianarantsoa" },
    { id: "mahajanga", label: "Mahajanga" },
    { id: "toliara", label: "Toliara" },
  ];

  const typeFilters = [
    { id: "all", label: "Tous" },
    { id: "enseignants", label: "Enseignants" },
    { id: "chercheurs", label: "Chercheurs" },
    { id: "professionnels", label: "Professionnels" },
    { id: "nouveaux", label: "Nouveaux membres" },
  ];

  // Chargement des données
  useEffect(() => {
    loadMembers();
    loadStats();
  }, [pagination.page, activeFilter, selectedRegion, searchQuery]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        filter: activeFilter !== "all" ? activeFilter : undefined,
        region: selectedRegion !== "all" ? selectedRegion : undefined,
        search: searchQuery || undefined,
      };

      const response = await directoryAPI.getMembers(params);
      setMembers(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 12,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
      });
    } catch (error) {
      console.error("Erreur chargement membres:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await directoryAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erreur stats membres:", error);
    }
  };

  // Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadMembers();
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (memberId) => {
    setSelectedMember(memberId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <DirectoryHero stats={stats} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filtres */}
          <div className="mb-12">
            <DirectoryFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              regions={regions}
              typeFilters={typeFilters}
            />
          </div>

          {/* Liste des membres */}
          <div className="mb-12">
            <DirectoryViews
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              total={pagination.total}
            />

            {loading ? (
              <LoadingSpinner />
            ) : members.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun membre trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    setSelectedRegion("all");
                    setSearchQuery("");
                  }}
                  className="text-asm-green-600 hover:text-asm-green-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                      <FadeIn key={member.id} delay={index * 0.1}>
                        <MemberCard
                          member={member}
                          onViewDetails={handleViewDetails}
                        />
                      </FadeIn>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <MemberListItem
                        key={member.id}
                        member={member}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                <DirectoryPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>

          {/* Statistiques détaillées */}
          <DirectoryStats stats={stats} />
        </div>
      </div>

      {/* Modal des détails */}
      <MemberDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberId={selectedMember}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default MembersPage;
