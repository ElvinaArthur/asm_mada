import React from "react";
import {
  Target,
  Eye,
  BookOpen,
  Users,
  Network,
  GraduationCap,
  Building,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn, SlideUp, HoverEffect } from "../../components/ui/animations";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";
import IconButton from "../../components/ui/buttons/IconButton";

const MissionVision = () => {
  const missionPoints = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Regrouper les sociologues",
      description:
        "Rassembler tous les anciens étudiants de la Mention Sociologie des universités publiques malgaches.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Promouvoir la discipline",
      description:
        "Faire connaître et valoriser la sociologie comme science essentielle au développement de Madagascar.",
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Créer un réseau professionnel",
      description:
        "Établir un réseau solide pour faciliter l'insertion et la collaboration entre les membres.",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Contribuer au développement",
      description:
        "Apporter une expertise sociologique aux enjeux sociaux, économiques et culturels du pays.",
    },
  ];

  const visionPoints = [
    "Une sociologie malgache reconnue et influente dans les politiques publiques",
    "Un réseau professionnel fort et solidaire de sociologues à travers tout le pays",
    "Des partenariats durables avec les institutions académiques, collectivités et ONG",
    "Une association qui forme et oriente les jeunes diplômés vers l'excellence professionnelle",
  ];

  const mainObjectives = [
    {
      title: "Membres actifs",
      description: "Rassembler les diplômés de sociologie",
      icon: <Users className="w-6 h-6" />,
      color: "from-asm-green-500 to-asm-green-600",
    },
    {
      title: "Commissions techniques",
      description: "4 pôles d'expertise opérationnels",
      icon: <Building className="w-6 h-6" />,
      color: "from-asm-yellow-500 to-asm-yellow-600",
    },
    {
      title: "Partenariats",
      description: "Collaborer avec institutions et entreprises",
      icon: <Network className="w-6 h-6" />,
      color: "from-asm-green-600 to-asm-yellow-500",
    },
    {
      title: "Publications",
      description: "Produire des connaissances scientifiques",
      icon: <FileText className="w-6 h-6" />,
      color: "from-asm-yellow-600 to-asm-green-500",
    },
  ];

  return (
    <div className="py-16 px-4 md:px-8 bg-gradient-to-br from-asm-green-50 via-white to-asm-yellow-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Notre <span className="text-asm-green-600">Mission</span> &{" "}
              <span className="text-asm-yellow-600">Vision</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une association au service des sociologues malgaches et du
              développement social de Madagascar
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <SlideUp delay={0.1}>
            <HoverEffect>
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-asm-green-500 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-asm-green-500 to-asm-green-600 rounded-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Notre Mission
                  </h3>
                </div>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  L'ASM a pour mission de rassembler les sociologues malgaches,
                  promouvoir la discipline sociologique, et contribuer
                  activement au développement social, économique et culturel de
                  Madagascar à travers la recherche, la formation et le
                  plaidoyer.
                </p>

                <div className="space-y-6">
                  {missionPoints.map((point, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <IconButton
                          icon={() => point.icon}
                          variant="primary"
                          className="p-2"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {point.title}
                        </h4>
                        <p className="text-gray-600">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </HoverEffect>
          </SlideUp>

          {/* Vision */}
          <SlideUp delay={0.2}>
            <HoverEffect>
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-asm-yellow-500 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-asm-yellow-500 to-asm-yellow-600 rounded-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Notre Vision
                  </h3>
                </div>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Nous aspirons à une société malgache où la sociologie est
                  reconnue comme science essentielle, où les sociologues sont
                  des acteurs clés du développement national, et où l'expertise
                  sociologique éclaire les décisions politiques et sociales.
                </p>

                <div className="space-y-4">
                  {visionPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-asm-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </HoverEffect>
          </SlideUp>
        </div>

        {/* Objectifs stratégiques */}
        <SlideUp delay={0.3}>
          <div className="bg-gradient-to-r from-asm-green-600 to-asm-green-700 rounded-2xl p-8 text-white mb-12">
            <div className="flex items-center gap-4 mb-8">
              <Target className="w-10 h-10" />
              <h3 className="text-3xl font-bold">Nos Objectifs Stratégiques</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mainObjectives.map((objective, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${objective.color} rounded-full mb-4`}
                  >
                    {objective.icon}
                  </div>
                  <div className="text-lg font-medium mb-2">
                    {objective.title}
                  </div>
                  <div className="text-sm opacity-90">
                    {objective.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SlideUp>

        {/* Programmes des commissions */}
        <FadeIn delay={0.4}>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Programmes 2026 par Commission
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-asm-green-600 mb-3">
                  Étude et Recherche
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Diffusion et publication des résultats</li>
                  <li>• Conférences scientifiques</li>
                  <li>• Création de l'Ordre des Sociologues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-asm-yellow-600 mb-3">
                  Formation et Orientation
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Séminaires sur les débouchés professionnels</li>
                  <li>• Ateliers de formation professionnelle</li>
                  <li>• Développement de formations courtes</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/auth?mode=register">
            <PrimaryButton className="px-8 py-4">
              Rejoindre l'Association
            </PrimaryButton>
          </Link>
          <Link to="/events">
            <SecondaryButton className="px-8 py-4">
              Voir nos activités
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
