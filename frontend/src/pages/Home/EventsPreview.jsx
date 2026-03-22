import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  CalendarDays,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";
import { FadeIn, SlideUp, HoverEffect } from "../../components/ui/animations";

const EventsPreview = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Colloque: Sociologie et Développement Durable",
      date: "15 Mars 2024",
      time: "9h00 - 17h00",
      location: "Université d'Antananarivo",
      type: "Colloque",
      attendees: 120,
    },
    {
      id: 2,
      title: "Atelier: Méthodologies de Recherche",
      date: "22 Avril 2024",
      time: "14h00 - 18h00",
      location: "En ligne",
      type: "Formation",
      attendees: 45,
    },
  ];

  const eventStats = [
    { label: "Événements/an", value: "10+", icon: CalendarDays },
    { label: "Participants", value: "5,000+", icon: Users },
    { label: "Satisfaction", value: "98%", icon: Trophy },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📅 <span className="text-asm-green-600">Événements</span> à venir
            </h2>
          </FadeIn>
          <SlideUp delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Participez à nos rencontres professionnelles
            </p>
          </SlideUp>
          <Link to="/events">
            <HoverEffect>
              <SecondaryButton className="mb-12">
                <span className="flex items-center">
                  Voir tous les événements
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </SecondaryButton>
            </HoverEffect>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-asm-green-600 to-asm-yellow-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <FadeIn delay={0.5}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Organisez votre propre événement
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              L'ASM soutient les initiatives de ses membres pour promouvoir la
              sociologie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events/propose">
                <HoverEffect>
                  <button className="bg-white text-asm-green-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition">
                    Proposer un événement
                  </button>
                </HoverEffect>
              </Link>
              <Link to="/contact">
                <HoverEffect>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition">
                    Contactez-nous
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

export default EventsPreview;
