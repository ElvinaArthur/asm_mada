// routes/userActivityRoutes.js - BACKEND COMPLET
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Activity = require("../models/Activity");

// @desc    Récupérer l'activité récente de l'utilisateur
// @route   GET /api/user/activity?limit=10
// @access  Private
router.get("/", protect, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = Activity.findByUser(req.user.id, limit);

    res.json({
      success: true,
      count: activities.length,
      data: activities || [],
    });
  } catch (error) {
    console.error("❌ Erreur /user/activity:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      data: [],
    });
  }
});

// @desc    Enregistrer une connexion
// @route   POST /api/user/activity/login
// @access  Private
router.post("/login", protect, (req, res) => {
  try {
    const activityId = Activity.login(req.user.id);

    res.json({
      success: true,
      message: "Activité enregistrée",
      data: { id: activityId },
    });
  } catch (error) {
    console.error("❌ Erreur POST /user/activity/login:", error);
    // Ne pas bloquer la connexion si l'activité échoue
    res.json({
      success: true,
      message: "Connexion réussie",
    });
  }
});

console.log("✅ Routes user/activity chargées");

module.exports = router;
