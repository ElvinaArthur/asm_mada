// backend/routes/admin/adminUserRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ==================== GESTION UTILISATEURS ====================

// Liste complète des utilisateurs avec pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "all",
      role = "all",
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += ` AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status === "pending") {
      whereClause += " AND isVerified = 0";
    } else if (status === "verified") {
      whereClause += " AND isVerified = 1";
    } else if (status === "blocked") {
      whereClause += " AND isActive = 0";
    }

    if (role === "admin") {
      whereClause += " AND role = 'admin'";
    } else if (role === "user") {
      whereClause += " AND role = 'user'";
    }

    const query = `
      SELECT 
        id, firstName, lastName, email, role, isVerified, isActive,
        graduationYear, specialization, createdAt,
        (SELECT COUNT(*) FROM favorites WHERE userId = users.id) as favoritesCount
      FROM users 
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    const users = db.prepare(query).all(...params, limit, offset);
    const total = db
      .prepare(`SELECT COUNT(*) as total FROM users ${whereClause}`)
      .get(...params).total;

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur liste utilisateurs:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs",
      });
  }
});

// Récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = db
      .prepare(
        `
        SELECT id, firstName, lastName, email, role, isVerified, isActive,
               graduationYear, specialization, createdAt, lastLogin,
               (SELECT COUNT(*) FROM favorites WHERE userId = users.id) as favoritesCount
        FROM users WHERE id = ?
      `,
      )
      .get(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("❌ Erreur récupération utilisateur:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la récupération de l'utilisateur",
      });
  }
});

// ✅ Vérifier un utilisateur
router.put("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const result = db
      .prepare(
        `
        UPDATE users 
        SET isVerified = 1, verifiedAt = datetime('now'), verifiedBy = ?
        WHERE id = ? AND isVerified = 0
      `,
      )
      .run(req.user.id, id);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Utilisateur non trouvé ou déjà vérifié",
        });
    }

    const user = db
      .prepare(
        "SELECT id, firstName, lastName, email, isVerified FROM users WHERE id = ?",
      )
      .get(id);
    res.json({
      success: true,
      message: `✅ ${user.firstName} ${user.lastName} vérifié avec succès`,
      data: user,
    });
  } catch (error) {
    console.error("❌ Erreur vérification utilisateur:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de la vérification" });
  }
});

// ❌ Rejeter un utilisateur
router.put("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const result = db
      .prepare("UPDATE users SET isVerified = 0 WHERE id = ?")
      .run(id);

    if (result.changes === 0)
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    res.json({ success: true, message: "❌ Utilisateur rejeté" });
  } catch (error) {
    console.error("❌ Erreur rejet utilisateur:", error);
    res.status(500).json({ success: false, message: "Erreur lors du rejet" });
  }
});

// ❌ Rejeter avec raison
router.put("/:id/reject-with-reason", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason)
      return res
        .status(400)
        .json({ success: false, message: "La raison du rejet est requise" });

    const result = db
      .prepare(
        `
        UPDATE users 
        SET isVerified = 0, proof_status = 'rejected', proof_rejection_reason = ?
        WHERE id = ?
      `,
      )
      .run(reason, id);

    if (result.changes === 0)
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    res.json({ success: true, message: "❌ Utilisateur rejeté avec raison" });
  } catch (error) {
    console.error("❌ Erreur rejet avec raison:", error);
    res.status(500).json({ success: false, message: "Erreur lors du rejet" });
  }
});

// 🔄 Bloquer/Débloquer un utilisateur
router.put("/:id/toggle-block", async (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare("SELECT isActive FROM users WHERE id = ?").get(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });

    const newStatus = user.isActive ? 0 : 1;
    db.prepare("UPDATE users SET isActive = ? WHERE id = ?").run(newStatus, id);

    res.json({
      success: true,
      message: newStatus ? "✅ Utilisateur débloqué" : "🚫 Utilisateur bloqué",
      data: { isActive: newStatus },
    });
  } catch (error) {
    console.error("❌ Erreur blocage utilisateur:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors du changement de statut" });
  }
});

// 🗑️ Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(id);

    if (user?.role === "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Impossible de supprimer un administrateur",
        });
    }

    const result = db
      .prepare("DELETE FROM users WHERE id = ? AND role = 'user'")
      .run(id);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Utilisateur non trouvé ou déjà supprimé",
        });
    }

    res.json({ success: true, message: "🗑️ Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur suppression utilisateur:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de la suppression" });
  }
});

// ✅ Approuver plusieurs utilisateurs en masse
router.post("/bulk-approve", async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Liste d'utilisateurs invalide" });
    }

    const placeholders = userIds.map(() => "?").join(",");
    const result = db
      .prepare(
        `
        UPDATE users 
        SET isVerified = 1, verifiedAt = datetime('now'), verifiedBy = ?
        WHERE id IN (${placeholders}) AND isVerified = 0
      `,
      )
      .run(req.user.id, ...userIds);

    res.json({
      success: true,
      message: `✅ ${result.changes} utilisateur(s) approuvé(s)`,
      count: result.changes,
    });
  } catch (error) {
    console.error("❌ Erreur approbation en masse:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de l'approbation en masse",
      });
  }
});

// 🗑️ Supprimer plusieurs utilisateurs en masse
router.post("/bulk-delete", async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Liste d'utilisateurs invalide" });
    }

    // Empêcher la suppression des admins
    const placeholders = userIds.map(() => "?").join(",");
    const admins = db
      .prepare(
        `SELECT id FROM users WHERE id IN (${placeholders}) AND role = 'admin'`,
      )
      .all(...userIds);

    if (admins.length > 0) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Impossible de supprimer des administrateurs",
        });
    }

    const result = db
      .prepare(
        `DELETE FROM users WHERE id IN (${placeholders}) AND role = 'user'`,
      )
      .run(...userIds);

    res.json({
      success: true,
      message: `🗑️ ${result.changes} utilisateur(s) supprimé(s)`,
      count: result.changes,
    });
  } catch (error) {
    console.error("❌ Erreur suppression en masse:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la suppression en masse",
      });
  }
});

// 📊 Utilisateurs en attente de vérification
router.get("/pending/list", async (req, res) => {
  try {
    const users = db
      .prepare(
        `
        SELECT id, firstName, lastName, email, role, isVerified,
               graduationYear, specialization, createdAt,
               proof_filename, proof_status, proof_uploaded_at
        FROM users
        WHERE role = 'user' AND isVerified = 0
        ORDER BY createdAt DESC
      `,
      )
      .all();

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("❌ Erreur utilisateurs en attente:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs en attente",
      });
  }
});

module.exports = router;
