// utils/imageHelper.js
export const getEventImageUrl = (event) => {
  // Priorité 1 : imageUrl (URL complète)
  if (event.imageUrl) {
    // Ajouter le host si c'est une URL relative
    if (event.imageUrl.startsWith("/")) {
      return `${window.location.origin}${event.imageUrl}`;
    }
    return event.imageUrl;
  }

  // Priorité 2 : Construire l'URL à partir du nom d'image
  if (event.image) {
    return `${window.location.origin}/uploads/events/${event.image}`;
  }

  // Fallback : Image par défaut
  return `${window.location.origin}/default-event.jpg`;
};
