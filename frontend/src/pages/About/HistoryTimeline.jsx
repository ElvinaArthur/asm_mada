import React from "react";
import {
  Users,
  Target,
  BookOpen,
  Network,
  Lightbulb,
  Calendar,
  Award,
  Globe,
  GraduationCap,
} from "lucide-react";
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
} from "../../components/ui/animations";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { motion } from "framer-motion";

const HistoryTimeline = () => {
  const timelineEvents = [
    {
      year: "2024",
      title: "Fondation de l'ASM",
      description:
        "Création de l'Association des Sociologues Malagasy par d'anciens étudiants de la Mention Sociologie des Universités publiques malgaches, avec pour mission de regrouper les diplômés et promouvoir la sociologie à Madagascar.",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-asm-green-500 to-asm-yellow-500",
      achievements: [
        "Association apolitique et à but non lucratif",
        "Anciens étudiants de la Mention Sociologie",
        "Siège à la Faculté d'Économie, de Gestion et de Sociologie",
      ],
    },
    {
      year: "2025",
      title: "Structuration et Premières Commissions",
      description:
        "Mise en place des organes statutaires : Bureau Exécutif, Assemblée Générale et création des premières commissions techniques pour mettre en œuvre les missions de l'association.",
      icon: <Users className="w-6 h-6" />,
      color: "from-asm-green-600 to-asm-yellow-600",
      achievements: [
        "Bureau Exécutif élu",
        "4 commissions créées",
        "Adoption des statuts officiels",
      ],
    },
    {
      year: "2026",
      title: "Lancement du Programme d'Activités",
      description:
        "Déploiement du programme annuel par commission : conférences scientifiques, formations professionnelles, création du site web et démarrage de l'aménagement du bureau.",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-asm-green-700 to-asm-yellow-700",
      achievements: [
        "Programme 2026 validé",
        "Création du site web ASM",
        "Conférences scientifiques",
      ],
    },
    {
      year: "2026",
      title: "Renforcement du Réseau Professionnel",
      description:
        "Développement des partenariats avec institutions académiques, collectivités et ONG. Mise en place du réseau d'entraide entre anciens étudiants et jeunes diplômés.",
      icon: <Network className="w-6 h-6" />,
      color: "from-asm-green-800 to-asm-yellow-800",
      achievements: [
        "Partenariats institutionnels",
        "Réseau intergénérationnel",
        "Orientation professionnelle",
      ],
    },
    {
      year: "Avenir",
      title: "Projets Stratégiques",
      description:
        "Création de l'Ordre des Sociologues, développement de formations continues, participation active aux politiques publiques et rayonnement international de la sociologie malgache.",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-asm-green-900 to-asm-yellow-900",
      achievements: [
        "Ordre des Sociologues",
        "Formations continues",
        "Influence politique",
      ],
    },
  ];

  return (
    <div className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Notre <span className="text-asm-green-600">Histoire</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une association jeune et dynamique créée pour rassembler les
              sociologues malgaches, promouvoir la discipline et contribuer au
              développement social de Madagascar.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Ligne de temps verticale */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-asm-green-500 to-asm-yellow-500 hidden md:block" />

          <StaggerChildren>
            {timelineEvents.map((event, index) => (
              <SlideUp key={event.year} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex flex-col md:flex-row items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Côté gauche - Année et icône */}
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}
                  >
                    <div className="flex items-center justify-center md:justify-end gap-4 mb-4">
                      <div className="relative">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center text-white`}
                        >
                          {event.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white border-4 border-gray-50 rounded-full px-3 py-1">
                          <span className="font-bold text-gray-900">
                            {event.year}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`hidden md:block ${index % 2 === 0 ? "order-first" : ""}`}
                      >
                        <h3 className="text-2xl font-bold text-gray-900">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Point central */}
                  <div className="w-8 h-8 bg-white border-4 border-asm-green-500 rounded-full z-10 hidden md:block" />

                  {/* Côté droit - Contenu */}
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 md:hidden">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>

                      {/* Réalisations */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.achievements.map((achievement, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SlideUp>
            ))}
          </StaggerChildren>
        </div>

        {/* Statistiques finales */}
        <FadeIn delay={0.8}>
          <div className="mt-20 bg-gradient-to-r from-asm-green-600 to-asm-green-700 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">Sociologues Malagasy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="text-sm opacity-90">Commissions actives</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">6</div>
                <div className="text-sm opacity-90">Délégués provinciaux</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-sm opacity-90">Durée illimitée</div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Bouton CTA */}
        <div className="text-center mt-12">
          <PrimaryButton className="px-8 py-4 text-lg">
            Rejoindre l'Association
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default HistoryTimeline;
