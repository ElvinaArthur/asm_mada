import React from "react";
import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Mail,
  ArrowRight,
  Shield,
  Award,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
} from "../../components/ui/animations";

const CtaSection = () => {
  const benefits = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Accès à la bibliothèque",
      description: "Accédez à toutes nos publications scientifiques",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Réseau professionnel",
      description: "Connectez-vous avec des sociologues de toute l'île",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Formations certifiantes",
      description: "Participez à nos formations et ateliers",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Reconnaissance officielle",
      description: "Obtenez votre carte de membre professionnel",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Marie Rasoanaivo",
      role: "Sociologue, Université d'Antananarivo",
      content:
        "L'ASM m'a offert des opportunités de collaboration exceptionnelles et un accès à des ressources précieuses pour mes recherches.",
      rating: 5,
    },
    {
      name: "Pr. Jean Ravelo",
      role: "Chercheur en Sciences Sociales",
      content:
        "Les événements organisés par l'association sont d'une qualité remarquable et permettent des échanges fructueux.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Rejoignez la communauté des{" "}
              <span className="text-asm-green-400">sociologues malgaches</span>
            </h2>
          </FadeIn>
          <SlideUp delay={0.2}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Faites partie d'un réseau professionnel dynamique et contribuez au
              développement de la sociologie à Madagascar
            </p>
          </SlideUp>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/join">
              <PrimaryButton className="bg-gradient-to-r from-asm-green-500 to-asm-green-600 hover:from-asm-green-600 hover:to-asm-green-700">
                <span className="flex items-center text-lg">
                  Devenir membre maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </PrimaryButton>
            </Link>
            <Link to="/contact">
              <SecondaryButton className="border-white text-white hover:bg-white/10">
                <span className="flex items-center">
                  Nous contacter
                  <Mail className="ml-2 w-5 h-5" />
                </span>
              </SecondaryButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              Pourquoi nous rejoindre ?
            </h3>
            <StaggerChildren>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-asm-green-500/50 transition-all group"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-asm-green-500/20 to-asm-green-600/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <div className="text-asm-green-300">{benefit.icon}</div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </StaggerChildren>
          </div>

          {/* Testimonials */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              Ce que disent nos membres
            </h3>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <FadeIn key={index} delay={index * 0.2}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-asm-yellow-500/20 to-asm-yellow-600/20 rounded-full flex items-center justify-center text-asm-yellow-300 font-bold text-xl mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-300">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-asm-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
