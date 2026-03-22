// routes/userBooksRoutes.js - BACKEND COMPLET
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const UserBook = require("../models/UserBook");

// @desc    Récupérer les statistiques de lecture
// @route   GET /api/user/books/stats
// @access  Private
router.get("/stats", protect, (req, res) => {
  try {
    const stats = UserBook.getStats(req.user.id);

    res.json({
      success: true,
      data: stats || {
        booksRead: 0,
        booksReading: 0,
        booksToRead: 0,
        favorites: 0,
      },
    });
  } catch (error) {
    console.error("❌ Erreur /user/books/stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: {
        booksRead: 0,
        booksReading: 0,
        booksToRead: 0,
        favorites: 0,
      },
    });
  }
});

// @desc    Récupérer les livres de l'utilisateur
// @route   GET /api/user/books?status=reading|read|to-read
// @access  Private
router.get("/", protect, (req, res) => {
  try {
    const { status } = req.query;
    const books = UserBook.findByUser(req.user.id, status);

    res.json({
      success: true,
      count: books.length,
      data: books || [],
    });
  } catch (error) {
    console.error("❌ Erreur /user/books:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: [],
    });
  }
});

// @desc    Récupérer les livres récents
// @route   GET /api/user/books/recent?limit=5
// @access  Private
router.get("/recent", protect, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const books = UserBook.getRecent(req.user.id, limit);

    res.json({
      success: true,
      count: books.length,
      data: books || [],
    });
  } catch (error) {
    console.error("❌ Erreur /user/books/recent:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: [],
    });
  }
});

// @desc    Ajouter un livre à la bibliothèque
// @route   POST /api/user/books
// @access  Private
router.post("/", protect, (req, res) => {
  try {
    const { bookId, status = "to-read" } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "L'ID du livre est requis",
      });
    }

    const result = UserBook.add(req.user.id, bookId, status);

    res.status(201).json({
      success: true,
      message: "Livre ajouté avec succès",
      data: { id: result },
    });
  } catch (error) {
    console.error("❌ Erreur POST /user/books:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @desc    Mettre à jour le statut d'un livre
// @route   PUT /api/user/books/:bookId
// @access  Private
router.put("/:bookId", protect, (req, res) => {
  try {
    const { bookId } = req.params;
    const { status, currentPage } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Le statut est requis",
      });
    }

    const updated = UserBook.updateStatus(
      req.user.id,
      bookId,
      status,
      currentPage,
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Statut mis à jour",
    });
  } catch (error) {
    console.error("❌ Erreur PUT /user/books/:bookId:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @desc    Toggle favori
// @route   POST /api/user/books/:bookId/favorite
// @access  Private
router.post("/:bookId/favorite", protect, (req, res) => {
  try {
    const { bookId } = req.params;
    const updated = UserBook.toggleFavorite(req.user.id, bookId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Favori mis à jour",
    });
  } catch (error) {
    console.error("❌ Erreur POST /user/books/:bookId/favorite:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @desc    Supprimer un livre
// @route   DELETE /api/user/books/:bookId
// @access  Private
router.delete("/:bookId", protect, (req, res) => {
  try {
    const { bookId } = req.params;
    const deleted = UserBook.remove(req.user.id, bookId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Livre supprimé",
    });
  } catch (error) {
    console.error("❌ Erreur DELETE /user/books/:bookId:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

console.log("✅ Routes user/books chargées");

module.exports = router;
