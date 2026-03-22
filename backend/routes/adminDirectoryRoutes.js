// backend/routes/adminDirectoryRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { protect, authorize } = require("../middleware/auth");

// Toutes les routes admin nécessitent authentification et rôle admin
router.use(protect);
router.use(authorize("admin"));

// @desc    Récupérer tous les membres (version admin)
// @route   GET /api/admin/directory/members
// @access  Admin
router.get("/members", async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM users WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (status === "pending") {
      sql += ` AND isVerified = 0`;
    } else if (status === "verified") {
      sql += ` AND isVerified = 1`;
    }

    // Compter le total
    const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total");
    const countStmt = db.prepare(countSql);
    const total = countStmt.get(...params).total;

    sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const stmt = db.prepare(sql);
    const members = stmt.all(...params);

    // Parser les champs JSON pour chaque membre
    const formattedMembers = members.map((member) => ({
      ...member,
      academicBackground: member.academicBackground
        ? JSON.parse(member.academicBackground)
        : null,
      previousPositions: member.previousPositions
        ? JSON.parse(member.previousPositions)
        : [],
      privacy: member.privacy ? JSON.parse(member.privacy) : {},
      fullName: `${member.firstName} ${member.lastName}`,
    }));

    res.json({
      success: true,
      data: formattedMembers,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Erreur GET /admin/directory/members:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des membres",
    });
  }
});

// @desc    Récupérer les détails complets d'un membre (admin)
// @route   GET /api/admin/directory/members/:id
// @access  Admin
router.get("/members/:id", async (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const member = stmt.get(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Membre non trouvé",
      });
    }

    // Parser tous les champs JSON
    const fullProfile = {
      ...member,
      academicBackground: member.academicBackground
        ? JSON.parse(member.academicBackground)
        : null,
      previousPositions: member.previousPositions
        ? JSON.parse(member.previousPositions)
        : [],
      privacy: member.privacy ? JSON.parse(member.privacy) : {},
      fullName: `${member.firstName} ${member.lastName}`,
    };

    res.json({
      success: true,
      profile: fullProfile,
    });
  } catch (error) {
    console.error("❌ Erreur GET /admin/directory/members/:id:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du membre",
    });
  }
});

// @desc    Mettre à jour le statut de vérification
// @route   PUT /api/admin/directory/members/:id/verify
// @access  Admin
router.put("/members/:id/verify", async (req, res) => {
  try {
    const { isVerified } = req.body;

    const stmt = db.prepare(`
      UPDATE users 
      SET isVerified = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(isVerified ? 1 : 0, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Membre non trouvé",
      });
    }

    res.json({
      success: true,
      message: `Membre ${isVerified ? "vérifié" : "non vérifié"} avec succès`,
    });
  } catch (error) {
    console.error("❌ Erreur PUT /admin/directory/members/:id/verify:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour",
    });
  }
});

// @desc    Supprimer un membre (admin uniquement)
// @route   DELETE /api/admin/directory/members/:id
// @access  Admin
router.delete("/members/:id", async (req, res) => {
  try {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Membre non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Membre supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur DELETE /admin/directory/members/:id:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
    });
  }
});

module.exports = router;
