// routes/memberRoutes.js (version SQLite)
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { protect } = require("../middleware/auth");

// Helper pour parser JSON ou retourner un tableau vide
const parseExpertise = (expertise) => {
  if (!expertise) return [];
  try {
    const parsed = JSON.parse(expertise);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return expertise
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
  }
};

// @route   GET /api/members/verified
// @desc    Get verified members with pagination
// @access  Public
router.get("/verified", (req, res) => {
  try {
    const { page = 1, limit = 12, search, filter } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Construire la requête
    let whereClause = "WHERE isVerified = 1";
    const params = [];

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

    if (filter && filter !== "all" && filter !== "nouveaux") {
      whereClause += " AND location = ?";
      params.push(filter);
    }

    if (filter === "nouveaux") {
      whereClause += " AND memberSince > datetime('now', '-30 days')";
    }

    // Récupérer les membres avec pagination
    const query = `
      SELECT id, firstName, lastName, email, title, institution, 
             location, expertise, publicationsCount, memberSince,
             isVerified, avatarColor, createdAt,
             (firstName || ' ' || lastName) as fullName
      FROM users 
      ${whereClause}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `;

    // SQLite utilise .all() pour récupérer plusieurs lignes
    const rows = db.prepare(query).all(...params, limitNum, offset);

    // Formater les données
    const members = rows.map((member) => ({
      ...member,
      expertise: parseExpertise(member.expertise),
      memberSince: member.memberSince,
      isVerified: Boolean(member.isVerified),
    }));

    // Compter le total
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = db.prepare(countQuery).get(...params);

    res.json({
      success: true,
      data: members,
      page: pageNum,
      limit: limitNum,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limitNum),
    });
  } catch (error) {
    console.error("Erreur route verified:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// @route   GET /api/members/stats
// @desc    Get members statistics
// @access  Public
router.get("/stats", (req, res) => {
  try {
    // Compter les membres - version SQLite
    const totalResult = db.prepare("SELECT COUNT(*) as total FROM users").get();
    const verifiedResult = db
      .prepare("SELECT COUNT(*) as verified FROM users WHERE isVerified = 1")
      .get();
    const pendingResult = db
      .prepare("SELECT COUNT(*) as pending FROM users WHERE isVerified = 0")
      .get();

    const total = totalResult.total;
    const verified = verifiedResult.verified;
    const pending = pendingResult.pending;

    // Statistiques par région
    const regionStats = db
      .prepare(
        `
      SELECT location, COUNT(*) as count 
      FROM users 
      WHERE location IS NOT NULL AND location != ''
      GROUP BY location 
      ORDER BY count DESC
    `,
      )
      .all();

    // Statistiques par expertise
    const expertiseStats = db
      .prepare(
        `
      SELECT expertise, COUNT(*) as count 
      FROM users 
      WHERE expertise IS NOT NULL AND expertise != ''
      GROUP BY expertise
    `,
      )
      .all();

    // Formater les résultats
    const byRegion = {};
    regionStats.forEach((stat) => {
      byRegion[stat.location] = stat.count;
    });

    const byExpertise = {};
    expertiseStats.forEach((stat) => {
      const expertises = parseExpertise(stat.expertise);
      expertises.forEach((exp) => {
        if (exp) {
          byExpertise[exp] =
            (byExpertise[exp] || 0) + stat.count / expertises.length;
        }
      });
    });

    // Arrondir les valeurs
    Object.keys(byExpertise).forEach((key) => {
      byExpertise[key] = Math.round(byExpertise[key]);
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
    console.error("Erreur route stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// @route   GET /api/members/:id
// @desc    Get member by ID
// @access  Public
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, firstName, lastName, email, title, institution, 
             location, expertise, publicationsCount, memberSince,
             isVerified, avatarColor, createdAt,
             (firstName || ' ' || lastName) as fullName
      FROM users 
      WHERE id = ?
    `;

    const member = db.prepare(query).get(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Membre non trouvé",
      });
    }

    // Formater les données
    const formattedMember = {
      ...member,
      expertise: parseExpertise(member.expertise),
      isVerified: Boolean(member.isVerified),
    };

    res.json({
      success: true,
      data: formattedMember,
    });
  } catch (error) {
    console.error("Erreur récupération membre:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

module.exports = router;
