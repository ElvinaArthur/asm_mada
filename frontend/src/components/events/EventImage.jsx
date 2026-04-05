// components/events/EventImage.jsx
import React, { useState } from "react";

const EventImage = ({
  event,
  className = "",
  fallback = true,
  showOverlay = false,
  objectFit = "cover",
  objectPosition = "center",
  fallbackImage = "http://https://asm-mada.onrender.com/default-event.jpg",
}) => {
  const [imgError, setImgError] = useState(false);

  // Fonction pour construire l'URL de l'image
  const getImageUrl = () => {
    if (!event || typeof event !== "object") {
      console.log("❌ EventImage: event est invalide", event);
      return fallbackImage;
    }

    console.log("🖼️ EventImage reçu:", {
      imageUrl: event.imageUrl,
      image: event.image,
      title: event.title,
    });

    // Priorité à imageUrl (URL complète)
    if (event.imageUrl && event.imageUrl !== "/default-event.jpg") {
      const url = event.imageUrl.startsWith("http")
        ? event.imageUrl
        : `http://https://asm-mada.onrender.com${event.imageUrl}`;
      console.log("📤 Utilisation imageUrl:", url);
      return url;
    }

    // Sinon utiliser le nom de fichier
    if (event.image) {
      const url = `http://https://asm-mada.onrender.com/uploads/events/${event.image}`;
      console.log("📤 Utilisation image:", url);
      return url;
    }

    console.log("⚠️ Fallback vers image par défaut");
    return fallbackImage;
  };

  const imageUrl = getImageUrl();
  console.log("🔗 URL finale:", imageUrl);

  const handleError = (e) => {
    console.error("❌ Erreur chargement image:", imageUrl);
    setImgError(true);
    if (fallback) {
      e.target.src = fallbackImage;
    }
  };

  return (
    <>
      <img
        src={imgError ? fallbackImage : imageUrl}
        alt={event?.title || "Image d'événement"}
        className={className}
        style={{
          objectFit: objectFit,
          objectPosition: objectPosition,
        }}
        onError={handleError}
        loading="lazy"
      />

      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      )}
    </>
  );
};

export default EventImage;
