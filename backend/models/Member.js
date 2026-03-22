// backend/models/Member.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   GET /api/members/verified
// @desc    Get verified members with pagination
// @access  Public
router.get("/verified", async (req, res) => {
  try {
    const { page = 1, limit = 12, search, filter } = req.query;

    // Construire la clause WHERE
    let whereClause = "WHERE isVerified = 1";
    const params = [];

    // Filtrer par recherche
    if (search) {
      whereClause += ` AND (
        firstName LIKE ? OR 
        lastName LIKE ? OR 
        email LIKE ? OR 
        institution LIKE ? OR 
        expertise LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filtrer par région
    if (filter && filter !== "all" && filter !== "nouveaux") {
      whereClause += " AND location = ?";
      params.push(filter);
    }

    // Filtrer par nouveaux membres (derniers 30 jours)
    if (filter === "nouveaux") {
      whereClause += ' AND memberSince > datetime("now", "-30 days")';
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Récupérer les membres
    const members = await User.findAll(whereClause, params, limitNum, offset);

    // Compter le total
    const total = await User.count(whereClause, params);

    res.json({
      success: true,
      data: members,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Erreur récupération membres:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @route   GET /api/members/stats
// @desc    Get members statistics
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    // Compter les membres
    const total = await User.count();
    const verified = await User.count("WHERE isVerified = 1");
    const pending = await User.count("WHERE isVerified = 0");

    // Statistiques par région
    const regionStats = await new Promise((resolve, reject) => {
      const db = require("../config/database");
      db.all(
        'SELECT location, COUNT(*) as count FROM users WHERE location IS NOT NULL AND location != "" GROUP BY location ORDER BY count DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });

    // Statistiques par expertise
    const expertiseStats = await new Promise((resolve, reject) => {
      const db = require("../config/database");
      db.all(
        `SELECT expertise, COUNT(*) as count 
         FROM users 
         WHERE expertise IS NOT NULL AND expertise != '[]' AND expertise != ''
         GROUP BY expertise 
         ORDER BY count DESC 
         LIMIT 10`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });

    // Formater les résultats
    const byRegion = {};
    regionStats.forEach((stat) => {
      byRegion[stat.location] = stat.count;
    });

    const byExpertise = {};
    expertiseStats.forEach((stat) => {
      try {
        const expertises = JSON.parse(stat.expertise);
        if (Array.isArray(expertises)) {
          expertises.forEach((exp) => {
            byExpertise[exp] = (byExpertise[exp] || 0) + 1;
          });
        }
      } catch (e) {
        // Si expertise n'est pas un JSON valide
        byExpertise[stat.expertise] = stat.count;
      }
    });

    res.json({
      success: true,
      total,
      verified,
      pending,
      byRegion,
      byExpertise,
    });
  } catch (error) {
    console.error("Erreur statistiques membres:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @route   GET /api/members/:id
// @desc    Get member by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Membre non trouvé",
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Erreur récupération membre:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

module.exports = router;
