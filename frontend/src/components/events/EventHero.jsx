// components/events/EventHero.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Globe, MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryButton from "../ui/buttons/SecondaryButton";
import { FadeIn, SlideUp, TypewriterEffect } from "../ui/animations/index";

const EventHero = () => {
  const contentRef = useRef(null);

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      const element = document.getElementById("events-content");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-asm-green-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-asm-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-asm-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <FadeIn delay={0.2}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Calendar className="w-4 h-4 text-asm-green-300" />
            <span className="text-sm text-white">Événements & Formations</span>
          </div>
        </FadeIn>

        <SlideUp delay={0.3}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="block">Transformez</span>
            <span className="block">
              <span className="bg-gradient-to-r from-asm-green-400 to-asm-yellow-400 bg-clip-text text-transparent">
                vos connaissances
              </span>
            </span>
          </h1>
        </SlideUp>

        <FadeIn delay={0.5}>
          <TypewriterEffect
            text="Colloques, conférences et ateliers"
            speed={30}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
            cursor={false}
          />
        </FadeIn>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/events?filter=upcoming">
            <PrimaryButton className="group">
              <span className="flex items-center">
                Voir les événements à venir
                <Calendar className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </PrimaryButton>
          </Link>
          <Link to="/events?filter=featured">
            <SecondaryButton>
              <span className="flex items-center">
                Événements en vedette
                <Users className="ml-2 w-5 h-5" />
              </span>
            </SecondaryButton>
          </Link>
        </div>

        {/* Parallax Floating Elements */}
        <div className="absolute top-1/4 left-10">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-6 h-6 bg-asm-green-400/20 rounded-full"
          />
        </div>
        <div className="absolute bottom-1/3 right-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="w-4 h-4 bg-asm-yellow-400/20 rounded-full"
          />
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToContent}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-asm-green-300 transition"
          aria-label="Défiler vers les événements"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>
    </section>
  );
};

export default EventHero;
