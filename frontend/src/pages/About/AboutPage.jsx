import React from "react";
import HistoryTimeline from "./HistoryTimeline";
import MissionVision from "./MissionVision";
import ValuesSection from "./ValuesSection";
import TeamSection from "./TeamSection";
import { Users2, Heart, Hand, Mail } from "lucide-react";
import {
  ParallaxEffect,
  SlideUp,
  TypewriterEffect,
  FadeIn,
  StaggerChildren,
} from "../../components/ui/animations/index";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background avec gradient responsive */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-asm-green-900" />

      {/* Background Pattern - Optimisé pour mobile */}
      <div className="absolute inset-0 opacity-5 md:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center py-16 md:py-0">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8">
                <Users2 className="w-3 h-3 md:w-4 md:h-4 text-asm-green-300" />
                <span className="text-xs md:text-sm text-white font-medium">
                  Association des Sociologues Malagasy
                </span>
              </div>
            </FadeIn>

            <SlideUp delay={0.3}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                <span className="block text-2xl mb-2 md:mb-3">
                  Nous sommes le fruit de
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-asm-green-400 to-asm-yellow-400 bg-clip-text text-transparent">
                    50 ans de la
                  </span>{" "}
                  <br className="sm:hidden" />
                  Sociologie Malagasy.
                </span>
              </h1>
            </SlideUp>

            {/* Call to Action Buttons - Mobile optimized */}
            <StaggerChildren delay={0.7} staggerDelay={0.1}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <button className="w-full sm:w-auto px-6 py-3 bg-asm-green-600 hover:bg-asm-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Users2 className="w-4 h-4" />
                  Devenir Membre
                </button>
                <button className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  Découvrir nos Événements
                </button>
              </div>
            </StaggerChildren>

            {/* Stats Section - Mobile responsive */}
            <FadeIn delay={1}>
              <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    200+
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">
                    Membres Actifs
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    15+
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">
                    Années d'Expérience
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    50+
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">
                    Événements Organisés
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    6
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">
                    Régions Couvertes
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="space-y-16 md:space-y-24 pb-20">
        <section className="relative px-4 sm:px-6 lg:px-8">
          <HistoryTimeline />
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8">
          <MissionVision />
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8">
          <ValuesSection />
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8">
          <TeamSection />
        </section>
      </div>

      {/* CTA Final - Responsive */}
      <section className="relative bg-gradient-to-r from-gray-50 to-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-asm-green-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-asm-yellow-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-asm-green-100 rounded-full mb-6">
                <Hand className="w-6 h-6 md:w-8 md:h-8 text-asm-green-600" />
              </div>
            </FadeIn>

            <SlideUp>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Prêt à nous rejoindre dans cette mission ?
              </h2>
            </SlideUp>

            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto">
                Que vous soyez un donateur, un partenaire, un bénévole ou
                simplement quelqu'un qui croit en l'importance de la sociologie,
                il existe de nombreuses façons de contribuer à notre cause.
              </p>
            </FadeIn>

            <StaggerChildren delay={0.3} staggerDelay={0.1}>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
                <button className="group relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-asm-green-600 text-white font-semibold rounded-lg hover:bg-asm-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Faire un don</span>
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-asm-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Soutenez nos actions
                  </span>
                </button>

                <button className="group relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-asm-yellow-600 text-white font-semibold rounded-lg hover:bg-asm-yellow-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Users2 className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Devenir partenaire</span>
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-asm-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Collaborez avec nous
                  </span>
                </button>

                <button className="group relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white border-2 border-asm-green-600 text-asm-green-600 font-semibold rounded-lg hover:bg-asm-green-50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Nous contacter</span>
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-asm-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Échangeons ensemble
                  </span>
                </button>
              </div>
            </StaggerChildren>

            {/* Additional Info */}
            <FadeIn delay={0.5}>
              <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-asm-green-600 mb-2">
                      Transparence
                    </div>
                    <p className="text-sm text-gray-600">
                      Rapports annuels publics
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-asm-green-600 mb-2">
                      Impact
                    </div>
                    <p className="text-sm text-gray-600">
                      Projets concrets sur le terrain
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-asm-green-600 mb-2">
                      Communauté
                    </div>
                    <p className="text-sm text-gray-600">
                      Réseau national de sociologues
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mobile Navigation Bottom Bar (pour mobile uniquement) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center md:hidden z-50">
        <button className="flex flex-col items-center text-asm-green-600">
          <Users2 className="w-5 h-5" />
          <span className="text-xs mt-1">Membres</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <Heart className="w-5 h-5" />
          <span className="text-xs mt-1">Don</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <Hand className="w-5 h-5" />
          <span className="text-xs mt-1">Partenaire</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <Mail className="w-5 h-5" />
          <span className="text-xs mt-1">Contact</span>
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
