// components/directory/DirectoryHero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, TrendingUp, Globe } from "lucide-react";
import { FadeIn, SlideUp } from "../ui/animations/index";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useAuth } from "../../hooks/AuthContext";

const StatCard = ({ icon: Icon, value, label, delay }) => (
  <FadeIn delay={delay}>
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <Icon className="w-8 h-8 mx-auto mb-4" />
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  </FadeIn>
);

const DirectoryHero = ({ stats }) => {
  const { user } = useAuth();

  return (
    <section className="relative py-20 bg-gradient-to-br from-asm-green-600 to-asm-yellow-600 text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Annuaire des membres
            </h1>
          </FadeIn>
          <SlideUp delay={0.2}>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Découvrez la communauté des sociologues malgaches
            </p>
          </SlideUp>

          {/* Stats rapides */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <StatCard
                icon={Users}
                value={stats.total}
                label="Membres totaux"
                delay={0.3}
              />
              <StatCard
                icon={UserCheck}
                value={stats.verified}
                label="Membres vérifiés"
                delay={0.4}
              />
              <StatCard
                icon={TrendingUp}
                value={stats.newMembers || 0}
                label="Nouveaux (30j)"
                delay={0.5}
              />
              <StatCard
                icon={Globe}
                value={Object.keys(stats.byRegion || {}).length}
                label="Régions"
                delay={0.6}
              />
            </div>
          )}

          {!user && (
            <Link to="/auth?mode=register">
              <PrimaryButton className="bg-white text-asm-green-700 hover:bg-gray-100">
                <span className="flex items-center">
                  Rejoindre le répertoire
                  <Users className="ml-2 w-5 h-5" />
                </span>
              </PrimaryButton>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default DirectoryHero;
