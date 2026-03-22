export const pdfConfig = {
  // Options de sécurité
  security: {
    disableTextSelection: true,
    disablePrint: true,
    disableDownload: true,
    watermark: {
      text: "ASM • LECTURE SEULE",
      opacity: 0.03,
      fontSize: 120,
      rotation: -45,
    },
  },

  // Options d'affichage
  viewer: {
    defaultScale: 1.0,
    minScale: 0.5,
    maxScale: 3.0,
    stepScale: 0.25,
  },

  // Messages
  messages: {
    loading: "Chargement du PDF...",
    error: "Impossible de charger le PDF",
    protected: "Document protégé - Lecture seule",
    noDownload: "Téléchargement interdit",
    watermark: "ASM • Lecture en ligne uniquement",
  },
};
