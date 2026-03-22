// backend/middleware/verificationMiddleware.js
const db = require("../config/database");

const requireVerification = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié",
      });
    }

    // Les admins ont toujours accès
    if (req.user.role === "admin") {
      return next();
    }

    // Vérifier si l'utilisateur est vérifié
    const userStmt = db.prepare(`
      SELECT isVerified, proof_status FROM users WHERE id = ?
    `);
    const user = userStmt.get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (user.isVerified !== 1) {
      return res.status(403).json({
        success: false,
        message:
          "Accès refusé. Votre compte doit être vérifié par un administrateur.",
        requiresVerification: true,
        isVerified: user.isVerified,
        proofStatus: user.proof_status,
      });
    }

    next();
  } catch (error) {
    console.error("Erreur vérification middleware:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la vérification d'accès",
    });
  }
};

module.exports = { requireVerification };
