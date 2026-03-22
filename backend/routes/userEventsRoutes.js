// routes/userEventsRoutes.js - BACKEND COMPLET
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const UserEvent = require("../models/UserEvent");

// @desc    Récupérer les statistiques des événements
// @route   GET /api/user/events/stats
// @access  Private
router.get("/stats", protect, (req, res) => {
  try {
    const stats = UserEvent.getStats(req.user.id);

    res.json({
      success: true,
      data: stats || {
        upcoming: 0,
        attended: 0,
        total: 0,
      },
    });
  } catch (error) {
    console.error("❌ Erreur /user/events/stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: {
        upcoming: 0,
        attended: 0,
        total: 0,
      },
    });
  }
});

// @desc    Récupérer les événements de l'utilisateur
// @route   GET /api/user/events?upcoming=true|false
// @access  Private
router.get("/", protect, (req, res) => {
  try {
    const upcoming = req.query.upcoming === "true";
    const events = UserEvent.findByUser(req.user.id, upcoming);

    res.json({
      success: true,
      count: events.length,
      data: events || [],
    });
  } catch (error) {
    console.error("❌ Erreur /user/events:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: [],
    });
  }
});

// @desc    S'inscrire à un événement
// @route   POST /api/user/events/:eventId/register
// @access  Private
router.post("/:eventId/register", protect, (req, res) => {
  try {
    const { eventId } = req.params;

    const result = UserEvent.register(req.user.id, eventId);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: { id: result },
    });
  } catch (error) {
    console.error("❌ Erreur POST /user/events/:eventId/register:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @desc    Se désinscrire d'un événement
// @route   DELETE /api/user/events/:eventId/unregister
// @access  Private
router.delete("/:eventId/unregister", protect, (req, res) => {
  try {
    const { eventId } = req.params;

    const result = UserEvent.unregister(req.user.id, eventId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Inscription non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Désinscription réussie",
    });
  } catch (error) {
    console.error("❌ Erreur DELETE /user/events/:eventId/unregister:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @desc    Vérifier l'inscription à un événement
// @route   GET /api/user/events/:eventId/check
// @access  Private
router.get("/:eventId/check", protect, (req, res) => {
  try {
    const { eventId } = req.params;
    const isRegistered = UserEvent.isRegistered(req.user.id, eventId);

    res.json({
      success: true,
      data: { isRegistered },
    });
  } catch (error) {
    console.error("❌ Erreur GET /user/events/:eventId/check:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: { isRegistered: false },
    });
  }
});

console.log("✅ Routes user/events chargées");

module.exports = router;
