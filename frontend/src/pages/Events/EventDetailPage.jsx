// pages/Events/EventDetailPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  User,
  Mail,
  Phone,
  Globe,
  ChevronLeft,
  Share2,
  Heart,
  CheckCircle,
  XCircle,
  BookOpen,
  Tag,
  Star,
  ArrowRight,
} from "lucide-react";
import { eventService } from "../../services/api/events";
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
} from "../../components/ui/animations/index";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton";
import EventRegistrationModal from "../../components/events/EventRegistrationModal";
import EventImage from "../../components/events/EventImage";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Charger l'événement
  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Chargement événement ID:", id);

      // Appel API
      const response = await eventService.getEvent(id);
      console.log("📊 Événement chargé:", response);

      // Votre API retourne {success: true, data: {...}}
      const eventData = response.data || response;

      if (!eventData) {
        throw new Error("Aucune donnée d'événement reçue");
      }

      setEvent(eventData);

      // Charger les événements similaires
      if (eventData.category) {
        loadRelatedEvents(eventData.category);
      }

      // Vérifier les favoris
      const favorites = JSON.parse(
        localStorage.getItem("event_favorites") || "[]",
      );
      setIsFavorite(favorites.includes(id));
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err.message || "Impossible de charger l'événement");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedEvents = async (category) => {
    try {
      const response = await eventService.getEvents({
        category,
        limit: 3,
      });

      const eventsData = response.data || response.data?.data || [];

      // Exclure l'événement courant
      const filtered = eventsData
        .filter((ev) => ev.id !== parseInt(id))
        .slice(0, 3);

      setRelatedEvents(filtered);
    } catch (err) {
      console.error("❌ Erreur chargement événements liés:", err);
    }
  };

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  // Gérer les favoris
  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("event_favorites") || "[]",
    );

    if (isFavorite) {
      const newFavorites = favorites.filter((favId) => favId !== id);
      localStorage.setItem("event_favorites", JSON.stringify(newFavorites));
    } else {
      favorites.push(id);
      localStorage.setItem("event_favorites", JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
  };

  // Partager l'événement
  const shareEvent = async () => {
    const shareData = {
      title: event?.title,
      text: `Découvrez "${event?.title}" sur ASM Madagascar`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Erreur partage:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papier !");
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Badge type d'événement
  const getTypeBadge = (type) => {
    const colors = {
      Colloque: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Formation: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Conférence: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      Atelier: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      Séminaire: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[type] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
      >
        <Tag className="inline w-3 h-3 mr-1" />
        {type}
      </span>
    );
  };

  // Badge statut
  const getStatusBadge = () => {
    if (!event) return null;

    if (event.status === "past") {
      return (
        <span className="px-3 py-1 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full text-sm">
          Terminé
        </span>
      );
    }

    if (event.registration_open === false) {
      return (
        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm">
          Inscriptions fermées
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm">
        Inscriptions ouvertes
      </span>
    );
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-asm-green-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-asm-green-500/30 border-t-asm-green-500 rounded-full mx-auto mb-6"
          />
          <p className="text-gray-300 text-lg">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  // Écran d'erreur
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-asm-green-900 flex items-center justify-center">
        <div className="max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            {error || "Événement non trouvé"}
          </h2>
          <p className="text-gray-400 mb-6">
            L'événement que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-asm-green-600 text-white rounded-lg hover:bg-asm-green-700 transition"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950">
      // pages/Events/EventDetailPage.jsx - Section image modifiée
      {/* Header avec image */}
      <div className="relative min-h-[70vh] flex flex-col">
        {/* Background avec fallback */}
        <div className="relative flex-1 overflow-hidden">
          {event.imageUrl || event.image ? (
            <div className="absolute inset-0">
              <EventImage
                event={event}
                className="w-full h-full"
                objectFit="contain"
                objectPosition="center"
                fallbackImage="http://https://asm-mada.onrender.com/default-event.jpg"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-asm-green-900/50 to-asm-yellow-900/50" />
          )}
        </div>

        {/* Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Animated elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-asm-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-asm-yellow-500/10 rounded-full blur-3xl"></div>

        {/* Le reste du code reste inchangé */}
        {/* Navigation */}
        {/* Navigation */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center justify-between">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => navigate("/events")}
              className="flex items-center text-gray-300 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Retour aux événements
            </motion.button>

            <div className="flex gap-2">
              {/* Bouton Plein écran - NOUVEAU */}
              {(event.imageUrl || event.image) && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setShowFullscreen(true)}
                  className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition text-gray-300 hover:text-white"
                  title="Voir l'affiche en plein écran"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                    />
                  </svg>
                  <span className="hidden sm:inline text-sm">Plein écran</span>
                </motion.button>
              )}

              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={toggleFavorite}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400"}`}
                />
              </motion.button>

              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={shareEvent}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition"
              >
                <Share2 className="w-5 h-5 text-gray-300 hover:text-asm-green-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Event info */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          {/* ... */}
        </div>
      </div>
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaggerChildren className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Content */}
          <motion.div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <FadeIn delay={0.1}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <BookOpen className="w-6 h-6 text-asm-green-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">
                    À propos de cet événement
                  </h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {event.description ||
                      "Aucune description disponible pour le moment."}
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Speaker */}
            {event.speaker && (
              <FadeIn delay={0.2}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <User className="w-6 h-6 text-asm-green-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">
                      Intervenant(s)
                    </h2>
                  </div>
                  <p className="text-gray-300 text-lg">{event.speaker}</p>
                </div>
              </FadeIn>
            )}

            {/* Schedule if available */}
            {event.schedule && (
              <FadeIn delay={0.3}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Programme
                  </h2>
                  <div className="space-y-4">
                    {JSON.parse(event.schedule).map((item, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-asm-green-500 pl-6 py-4 hover:bg-white/5 transition rounded-r-lg"
                      >
                        <div className="font-semibold text-asm-green-300 text-lg">
                          {item.time}
                        </div>
                        <div className="text-gray-300 mt-2">
                          {item.activity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </motion.div>

          {/* Right column - Sidebar */}
          <motion.div className="space-y-8">
            {/* Registration card */}
            <FadeIn delay={0.1}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6">
                  Informations pratiques
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Date */}
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <Calendar className="w-5 h-5 text-asm-green-400 mr-3" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Date</div>
                      <div className="text-white">{formatDate(event.date)}</div>
                    </div>
                  </div>

                  {/* Time */}
                  {event.time && (
                    <div className="flex items-center p-3 bg-white/5 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">Heure</div>
                        <div className="text-white">{event.time}</div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <MapPin className="w-5 h-5 text-rose-400 mr-3" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Lieu</div>
                      <div className="text-white">{event.location}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <DollarSign className="w-5 h-5 text-amber-400 mr-3" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Tarif</div>
                      <div className="text-white">
                        {event.price && parseFloat(event.price) > 0
                          ? `${parseInt(event.price).toLocaleString()} ${event.currency || "MGA"}`
                          : "Gratuit"}
                      </div>
                    </div>
                  </div>

                  {/* Attendees */}
                  {event.max_attendees && (
                    <div className="flex items-center p-3 bg-white/5 rounded-lg">
                      <Users className="w-5 h-5 text-purple-400 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">
                          Places disponibles
                        </div>
                        <div className="text-white">
                          {event.current_attendees || 0}/{event.max_attendees}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration button */}
                <div className="pt-6 border-t border-white/10">
                  {event.registration_open && event.status !== "past" ? (
                    <>
                      <PrimaryButton
                        onClick={() => setShowRegistrationModal(true)}
                        className="w-full py-4 text-lg group"
                      >
                        <span className="flex items-center justify-center">
                          S'inscrire maintenant
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </PrimaryButton>

                      {event.price && parseFloat(event.price) > 0 && (
                        <p className="text-center text-sm text-gray-400 mt-3">
                          Paiement 100% sécurisé
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <XCircle className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 font-medium">
                        {event.status === "past"
                          ? "Cet événement est terminé"
                          : "Les inscriptions sont fermées"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick contact */}
                {(event.contact_email ||
                  event.contact_phone ||
                  event.website_url) && (
                  <div className="pt-6 mt-6 border-t border-white/10">
                    <h4 className="font-semibold text-white mb-3">Contact</h4>
                    <div className="space-y-2">
                      {event.contact_email && (
                        <a
                          href={`mailto:${event.contact_email}`}
                          className="flex items-center text-gray-400 hover:text-asm-green-400 transition p-2 hover:bg-white/5 rounded-lg"
                        >
                          <Mail className="w-4 h-4 mr-3" />
                          {event.contact_email}
                        </a>
                      )}
                      {event.contact_phone && (
                        <a
                          href={`tel:${event.contact_phone}`}
                          className="flex items-center text-gray-400 hover:text-asm-green-400 transition p-2 hover:bg-white/5 rounded-lg"
                        >
                          <Phone className="w-4 h-4 mr-3" />
                          {event.contact_phone}
                        </a>
                      )}
                      {event.website_url && (
                        <a
                          href={event.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-400 hover:text-asm-green-400 transition p-2 hover:bg-white/5 rounded-lg"
                        >
                          <Globe className="w-4 h-4 mr-3" />
                          Site web officiel
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Organizer */}
            <FadeIn delay={0.2}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Organisateur
                </h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-asm-green-500/20 rounded-full flex items-center justify-center mr-3 border border-asm-green-500/30">
                    <span className="text-asm-green-300 font-bold text-lg">
                      {event.organizer?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {event.organizer || "ASM Madagascar"}
                    </div>
                    <div className="text-sm text-gray-400">
                      Association des Sociologues de Madagascar
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </motion.div>
        </StaggerChildren>

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <FadeIn delay={0.4} className="mt-16">
            <div className="border-t border-white/10 pt-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Événements similaires
                  </h2>
                  <p className="text-gray-400">
                    Découvrez d'autres événements dans la même catégorie
                  </p>
                </div>
                <SecondaryButton onClick={() => navigate("/events")}>
                  Voir tous les événements
                </SecondaryButton>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedEvents.map((relatedEvent) => {
                  // Construire l'URL de l'image
                  const getRelatedImageUrl = () => {
                    if (
                      relatedEvent.imageUrl &&
                      relatedEvent.imageUrl !== "/default-event.jpg"
                    ) {
                      return relatedEvent.imageUrl.startsWith("/")
                        ? `http://https://asm-mada.onrender.com${relatedEvent.imageUrl}`
                        : relatedEvent.imageUrl;
                    }

                    if (relatedEvent.image) {
                      return `http://https://asm-mada.onrender.com/uploads/events/${relatedEvent.image}`;
                    }

                    return "http://https://asm-mada.onrender.com/default-event.jpg";
                  };

                  const imageUrl = getRelatedImageUrl();

                  return (
                    <div
                      key={relatedEvent.id}
                      onClick={() => navigate(`/events/${relatedEvent.id}`)}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-asm-green-500/30 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="h-40 bg-gradient-to-br from-asm-green-900/50 to-asm-yellow-900/50 relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={relatedEvent.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                          onError={(e) => {
                            e.target.src =
                              "http://https://asm-mada.onrender.com/default-event.jpg";
                          }}
                        />
                        {/* Overlay léger */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 bg-asm-green-500/20 text-asm-green-300 text-xs rounded">
                            {relatedEvent.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(relatedEvent.date)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-asm-green-300 transition">
                          {relatedEvent.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">
                            {relatedEvent.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
      {/* Modal simple */}
      {showFullscreen && (event.imageUrl || event.image) && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
          onClick={() => setShowFullscreen(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <EventImage
              event={event}
              className="max-w-full max-h-[90vh] object-contain"
              objectFit="contain"
              fallbackImage="http://https://asm-mada.onrender.com/default-event.jpg"
            />

            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="absolute bottom-4 text-white/70 text-sm">
            Cliquez n'importe où pour fermer
          </p>
        </div>
      )}
      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        event={event}
      />
    </div>
  );
};

export default EventDetailPage;
