// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBook,
  viewPDF,
  getThumbnail,
  getCategories,
  searchBooks,
  getPopularBooks,
} = require("../controllers/bookController");

// Routes publiques
router.get("/", getBooks);
router.get("/categories", getCategories);
router.get("/popular", getPopularBooks);
router.get("/search/:query", searchBooks);
router.get("/:id", getBook);

// ROUTES PDF - IMPORTANT: L'ordre compte !
router.get("/:id/view", viewPDF); // Nouvelle route pour visualisation inline
router.get("/:id/file", viewPDF); // Changé: maintenant affiche au lieu de télécharger
// Route explicite pour téléchargement

// Route thumbnail
router.get("/:id/thumbnail", getThumbnail);

module.exports = router;
