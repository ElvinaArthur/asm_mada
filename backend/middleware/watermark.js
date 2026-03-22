// middleware/watermark.js - Protection avancée
const PDFDocument = require("pdfkit");
const fs = require("fs");

const addWatermark = async (req, res, next) => {
  // Cette fonction pourrait ajouter un filigrane aux PDF
  // Plus complexe à implémenter mais offre une protection supplémentaire

  next();
};

module.exports = addWatermark;
