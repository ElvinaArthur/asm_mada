// backend/middleware/auth.js - VERSION CORRIGÉE POUR better-sqlite3
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// Middleware de protection des routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token du header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé, token manquant",
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "asm-alumni-secret-key",
    );

    // Récupérer l'utilisateur depuis SQLite - CORRECTION CRITIQUE ICI
    const stmt = db.prepare(`
      SELECT id, firstName, lastName, email, role, isVerified 
      FROM users 
      WHERE id = ?
    `);

    // AVEC better-sqlite3, on utilise .get() directement, pas de callback
    const user = stmt.get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      });
    }

    res.status(401).json({
      success: false,
      message: "Accès non autorisé",
    });
  }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
