import React, { useState } from "react";
import {
  Users,
  Award,
  Briefcase,
  Globe,
  Mail,
  Linkedin,
  MapPin,
  Calendar,
  BookOpen,
  Sparkles,
  Building,
  FileText,
  Target,
  Network,
} from "lucide-react";
import {
  FadeIn,
  SlideUp,
  HoverEffect,
  StaggerChildren,
} from "../../components/ui/animations";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import IconButton from "../../components/ui/buttons/IconButton";

const TeamSection = () => {
  const [activeTeam, setActiveTeam] = useState("executive");

  const teamCategories = [
    { id: "executive", label: "Bureau Exécutif", count: 3 },
    { id: "commissions", label: "Commissions", count: 4 },
    { id: "delegates", label: "Délégués", count: 6 },
    { id: "advisors", label: "Conseillers", count: 2 },
  ];

  const executiveTeam = [
    {
      id: 1,
      name: "Président(e)",
      role: "Président(e) de l'Association",
      bio: "Dirige et gère l'association, représente juridiquement l'ASM, coordonne les commissions et délégués. Mandat de 3 ans non renouvelable.",
      location: "Antananarivo, Madagascar",
      expertise: [
        "Direction stratégique",
        "Représentation légale",
        "Coordination nationale",
      ],
      criteria: [
        "Diplômé en Sociologie",
        "Non-enseignant universitaire",
        "Hors parti politique",
        "Casier judiciaire vierge",
      ],
      social: { email: "president@asm.mg" },
      photoColor: "from-asm-green-500 to-asm-yellow-500",
    },
    {
      id: 2,
      name: "Secrétaire Général(e)",
      role: "Secrétaire Général(e)",
      bio: "Seconde le président, responsable de la gestion administrative, de la correspondance et des archives. Rédige les procès-verbaux.",
      location: "Antananarivo, Madagascar",
      expertise: [
        "Gestion administrative",
        "Archivage",
        "Communication institutionnelle",
      ],
      social: { email: "secretaire@asm.mg" },
      photoColor: "from-asm-green-600 to-asm-yellow-600",
    },
    {
      id: 3,
      name: "Trésorier(ère)",
      role: "Trésorier(ère) National(e)",
      bio: "Gère les finances, les cotisations et le budget de l'association. Présente les rapports financiers à l'Assemblée Générale.",
      location: "Antananarivo, Madagascar",
      expertise: [
        "Gestion financière",
        "Budgetisation",
        "Comptabilité associative",
      ],
      social: { email: "tresorier@asm.mg" },
      photoColor: "from-asm-green-700 to-asm-yellow-700",
    },
    {
      id: 4,
      name: "Commissaires aux Comptes",
      role: "Commissaires aux Comptes",
      bio: "Responsables du suivi et du contrôle des dépenses et recettes de l'association. Garants de la transparence financière.",
      location: "Antananarivo, Madagascar",
      expertise: [
        "Contrôle financier",
        "Audit interne",
        "Transparence comptable",
      ],
      social: { email: "commissaires@asm.mg" },
      photoColor: "from-asm-green-800 to-asm-yellow-800",
    },
  ];

  const commissions = [
    {
      name: "Étude et Recherche",
      leader: "À désigner",
      members: "3 membres minimum",
      description:
        "Comité scientifique responsable des publications et conférences",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Communication et RP",
      leader: "À désigner",
      members: "3 membres minimum",
      description: "Production de supports, site web et relations publiques",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Formation et Orientation",
      leader: "À désigner",
      members: "3 membres minimum",
      description: "Séminaires professionnels et partenariats formation",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Mobilisation et Vie Associative",
      leader: "À désigner",
      members: "3 membres minimum",
      description: "Événements, activités sociales et mobilisation",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const stats = [
    {
      value: "6",
      label: "Délégués Provinciaux",
      description: "Représentants régionaux",
    },
    { value: "4", label: "Commissions", description: "Pôles d'expertise" },
    {
      value: "3",
      label: "Bureau Exécutif",
      description: "Direction nationale",
    },
    { value: "2", label: "Conseillers", description: "Appui stratégique" },
  ];

  return (
    <div className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-asm-green-100 to-asm-yellow-100 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-asm-green-600" />
              <span className="font-medium text-asm-green-700">
                Gouvernance Associative
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Notre <span className="text-asm-green-600">Organisation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une structure démocratique transparente, organisée selon nos
              statuts pour servir efficacement les sociologues malgaches.
            </p>
          </div>
        </FadeIn>

        {/* Statistiques */}
        <SlideUp delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <HoverEffect key={index}>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>
                </div>
              </HoverEffect>
            ))}
          </div>
        </SlideUp>

        {/* Filtres d'équipe */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {teamCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTeam(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTeam === category.id
                  ? "bg-gradient-to-r from-asm-green-600 to-asm-green-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bureau Exécutif */}
        <StaggerChildren>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {executiveTeam.map((member) => (
              <SlideUp key={member.id} delay={member.id * 0.1}>
                <HoverEffect>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Photo/avatar */}
                    <div
                      className={`h-40 bg-gradient-to-r ${member.photoColor} relative`}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">
                          {member.name}
                        </h3>
                        <p className="text-white/90">{member.role}</p>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="p-6">
                      {/* Localisation */}
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{member.location}</span>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-700 mb-4 text-sm">{member.bio}</p>

                      {/* Critères spécifiques pour Président */}
                      {member.criteria && (
                        <div className="mb-4">
                          <div className="font-medium text-gray-900 mb-2">
                            Critères spécifiques
                          </div>
                          <div className="space-y-1">
                            {member.criteria.map((criterion, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-asm-green-500 rounded-full" />
                                <span className="text-xs text-gray-600">
                                  {criterion}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expertise */}
                      <div className="mb-6">
                        <div className="font-medium text-gray-900 mb-2">
                          Responsabilités
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex gap-3">
                        <IconButton
                          icon={Mail}
                          variant="ghost"
                          className="text-asm-green-600 hover:text-asm-green-700"
                        >
                          Contacter
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </HoverEffect>
              </SlideUp>
            ))}
          </div>
        </StaggerChildren>

        {/* Commissions */}
        <SlideUp delay={0.3}>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Nos Commissions Techniques
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {commissions.map((commission, index) => (
                <HoverEffect key={index}>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${commission.color} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      {commission.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {commission.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      <div>Responsable : {commission.leader}</div>
                      <div>{commission.members}</div>
                    </div>
                  </div>
                </HoverEffect>
              ))}
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default TeamSection;
