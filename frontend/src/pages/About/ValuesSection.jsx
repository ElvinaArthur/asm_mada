import React from "react";
import {
  Heart,
  Target,
  Users,
  Shield,
  BookOpen,
  Network,
  Award,
  Lock,
  TrendingUp,
  Sparkles,
  Share2,
  Eye,
  RefreshCw,
  GraduationCap,
  HeartHandshake,
  Download,
  FileText,
} from "lucide-react";
import {
  FadeIn,
  SlideUp,
  HoverEffect,
  StaggerChildren,
} from "../../components/ui/animations";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import IconButton from "../../components/ui/buttons/IconButton";

const ValuesSection = () => {
  const coreValues = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Solidarité",
      description:
        "Entraide entre membres et engagement collectif pour le développement de la sociologie malgache.",
      color: "from-red-500 to-pink-500",
      principles: [
        "Soutien mutuel",
        "Engagement collectif",
        "Partage des opportunités",
      ],
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Partage",
      description:
        "Transmission des connaissances et expériences entre générations d'étudiants et chercheurs.",
      color: "from-blue-500 to-cyan-500",
      principles: [
        "Mentorat intergénérationnel",
        "Transfert de savoir",
        "Bibliothèque commune",
      ],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Intégrité",
      description:
        "Transparence dans la gestion associative et respect strict de l'éthique professionnelle.",
      color: "from-green-500 to-emerald-500",
      principles: [
        "Transparence financière",
        "Éthique professionnelle",
        "Reddition de comptes",
      ],
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Respect",
      description:
        "Ouverture à la diversité des opinions, parcours et expériences de chaque membre.",
      color: "from-purple-500 to-violet-500",
      principles: [
        "Pluralisme d'opinions",
        "Valorisation des parcours",
        "Dialogue constructif",
      ],
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Engagement",
      description:
        "Contribution active au progrès social et au bien-être collectif de la société malgache.",
      color: "from-yellow-500 to-orange-500",
      principles: [
        "Service au développement",
        "Implication citoyenne",
        "Impact social mesurable",
      ],
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Excellence",
      description:
        "Recherche de la qualité dans toutes nos activités scientifiques et professionnelles.",
      color: "from-indigo-500 to-blue-500",
      principles: [
        "Rigueur scientifique",
        "Professionnalisme",
        "Innovation continue",
      ],
    },
  ];

  const operationalPrinciples = [
    {
      title: "Indépendance",
      icon: <Eye className="w-6 h-6" />,
      description: "Association apolitique et autonome financièrement",
      detail:
        "Aucune affiliation politique ou religieuse, gestion indépendante",
    },
    {
      title: "Transparence",
      icon: <Lock className="w-6 h-6" />,
      description: "Comptes vérifiés et présentés annuellement",
      detail: "Contrôle par commissaires aux comptes, rapports publics",
    },
    {
      title: "Démocratie",
      icon: <Users className="w-6 h-6" />,
      description: "Décisions prises par Assemblée Générale",
      detail: "Élection du bureau, participation des membres",
    },
    {
      title: "Renouvellement",
      icon: <RefreshCw className="w-6 h-6" />,
      description: "Mandats limités, nouvelles idées",
      detail: "Présidence 3 ans non renouvelable, rotation des responsabilités",
    },
  ];

  const membershipBenefits = [
    "Accès au réseau professionnel des sociologues",
    "Participation aux conférences et séminaires",
    "Orientation et formation continue",
    "Accès aux publications de l'association",
    "Opportunités de partenariats professionnels",
    "Représentation dans les instances décisionnelles",
  ];

  // Fonctions pour gérer les téléchargements
  const handleDownloadStatuts = () => {
    const link = document.createElement("a");
    link.href = "/statut.pdf";
    link.download = "Statuts_ASM.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFormulaire = () => {
    const link = document.createElement("a");
    link.href = "/Formulaire.docx";
    link.download = "Formulaire_Adhesion_ASM.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBoth = () => {
    handleDownloadStatuts();
    setTimeout(handleDownloadFormulaire, 500);
  };

  return (
    <div className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="text-asm-green-400">Valeurs</span>{" "}
              Fondamentales
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Les principes qui fondent notre association et guident toutes nos
              actions, conformément à nos statuts et à notre éthique
              professionnelle.
            </p>
          </div>
        </FadeIn>

        {/* Valeurs principales */}
        <StaggerChildren>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {coreValues.map((value, index) => (
              <SlideUp key={value.title} delay={index * 0.1}>
                <HoverEffect>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`p-3 bg-gradient-to-r ${value.color} rounded-xl`}
                      >
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>

                    {/* Principes */}
                    <div className="space-y-2 mt-6">
                      {value.principles.map((principle, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-asm-green-400 rounded-full" />
                          <span className="text-sm text-gray-400">
                            {principle}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoverEffect>
              </SlideUp>
            ))}
          </div>
        </StaggerChildren>

        {/* Principes opérationnels */}
        <SlideUp delay={0.4}>
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Principes de Fonctionnement
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {operationalPrinciples.map((principle, index) => (
                <div
                  key={index}
                  className="text-center bg-gray-800/50 rounded-xl p-6"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-asm-green-500 to-asm-green-600 rounded-full mb-4">
                    {principle.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2">
                    {principle.title}
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">
                    {principle.description}
                  </p>
                  <p className="text-xs text-gray-400">{principle.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </SlideUp>

        {/* Avantages pour les membres */}
        <FadeIn delay={0.6}>
          <div className="bg-gradient-to-r from-asm-green-600/20 to-asm-yellow-600/20 rounded-2xl p-8 border border-gray-700 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-10 h-10 text-asm-green-400" />
              <h3 className="text-2xl font-bold text-white">
                Avantages d'être Membre
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-3">
                  {membershipBenefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-asm-green-400 rounded-full" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  {membershipBenefits.slice(3).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-asm-yellow-400 rounded-full" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Conditions d'adhésion */}
        <SlideUp delay={0.7}>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Conditions d'Adhésion
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-asm-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Diplôme requis
                      </h4>
                      <p className="text-gray-600 text-sm">
                        DEUG ou Master en Sociologie des universités publiques
                        malgaches
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-asm-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Étudiants avancés
                      </h4>
                      <p className="text-gray-600 text-sm">
                        En Master II Mémoïrsant (inscrit en Master terrain)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-asm-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Engagement</h4>
                      <p className="text-gray-600 text-sm">
                        Adhésion aux valeurs et aux statuts de l'association
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <PrimaryButton
                    onClick={handleDownloadStatuts}
                    className="px-8 py-3 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger les statuts
                  </PrimaryButton>

                  <PrimaryButton
                    onClick={handleDownloadFormulaire}
                    variant="outline"
                    className="px-8 py-3 border-asm-green-600 text-asm-green-600 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Formulaire d'adhésion
                  </PrimaryButton>

                  <button
                    onClick={handleDownloadBoth}
                    className="text-sm text-gray-600 hover:text-asm-green-600 transition-colors underline flex items-center gap-1 justify-center"
                  >
                    <Download className="w-3 h-3" />
                    Télécharger les deux documents
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>Documents disponibles :</p>
                  <p className="mt-1">
                    <span className="font-medium">Statuts :</span> statut.pdf
                  </p>
                  <p>
                    <span className="font-medium">Formulaire :</span>{" "}
                    Formulaire.docx
                  </p>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 p-4 bg-asm-green-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-asm-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Procédure d'adhésion
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>1. Téléchargez et lisez les statuts</li>
                    <li>2. Remplissez le formulaire d'adhésion</li>
                    <li>3. Imprimez et signez le formulaire</li>
                    <li>4. Soumettez-le avec les pièces justificatives</li>
                    <li>5. Paiement de la cotisation annuelle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default ValuesSection;
