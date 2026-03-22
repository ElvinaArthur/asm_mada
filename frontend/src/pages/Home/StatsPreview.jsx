import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Globe,
  Award,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";
import { FadeIn, SlideUp, HoverEffect } from "../../components/ui/animations";

const StatsPreview = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "50+",
      label: "Membres Actifs",
      description: "Sociologues professionnels",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      value: "15+",
      label: "Publications",
      description: "Dans notre bibliothèque",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: "10+",
      label: "Événements",
      description: "Par an",
      color: "from-yellow-500 to-amber-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "25",
      label: "Années",
      description: "D'expérience",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              L'ASM en <span className="text-asm-green-600">chiffres</span>
            </h2>
          </FadeIn>
          <SlideUp delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez l'impact de notre association en un coup d'œil
            </p>
          </SlideUp>
          <Link to="/about">
            <HoverEffect>
              <SecondaryButton className="mb-12">
                <span className="flex items-center">
                  Découvrir l'association
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </SecondaryButton>
            </HoverEffect>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 rounded-3xl p-8 text-center text-white">
          <FadeIn delay={0.4}>
            <h3 className="text-2xl font-bold mb-4">
              Prêt à faire partie de ces chiffres ?
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Rejoignez notre communauté grandissante de sociologues passionnés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <HoverEffect>
                  <button className="bg-white text-asm-green-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition">
                    Devenir membre
                  </button>
                </HoverEffect>
              </Link>
              <Link to="/about#impact">
                <HoverEffect>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition">
                    Voir notre impact
                  </button>
                </HoverEffect>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default StatsPreview;
