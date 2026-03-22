// routes/authRoutes.js - VERSION CORRIGÉE
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { uploadProof } = require("../middleware/uploadMiddleware");

// ==================== ROUTES PUBLIQUES ====================

// Route GET pour la documentation (évite l'erreur 404)
router.get("/login", (req, res) => {
  res.status(405).json({
    success: false,
    message: "Méthode GET non autorisée pour /api/auth/login",
    correctUsage: {
      method: "POST",
      url: "/api/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: "votre@email.com",
        password: "votre-mot-de-passe",
      },
    },
    exampleCurl:
      'curl -X POST "http://localhost:3000/api/auth/login" -H "Content-Type: application/json" -d \'{"email":"test@test.com","password":"test123"}\'',
    availableAuthRoutes: [
      "POST /api/auth/register - Créer un compte",
      "POST /api/auth/login - Se connecter",
      "GET /api/auth/me - Mon profil (protégé)",
      "GET /api/auth/logout - Se déconnecter (protégé)",
    ],
  });
});

// Route GET pour register aussi (même principe)
router.get("/register", (req, res) => {
  res.status(405).json({
    success: false,
    message: "Méthode GET non autorisée pour /api/auth/register",
    correctUsage: {
      method: "POST",
      url: "/api/auth/register",
      note: "Utilisez FormData pour envoyer le fichier + les données",
      requiredFields: {
        firstName: "string (requis)",
        lastName: "string (requis)",
        email: "string (requis)",
        password: "string (requis)",
        proof: "file (requis - JPG, PNG ou PDF)",
        graduationYear: "number (optionnel)",
        specialization: "string (optionnel)",
      },
    },
  });
});

// Routes POST (les vraies routes fonctionnelles)
// IMPORTANT: uploadProof DOIT être AVANT authController.register
router.post("/register", uploadProof, authController.register);
router.post("/login", authController.login);

// ==================== ROUTES PROTÉGÉES ====================
router.get("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.put("/updatedetails", protect, authController.updateDetails);
router.put("/updatepassword", protect, authController.updatePassword);

// ==================== ROUTES FAVORIS ====================
router.get("/favorites", protect, authController.getFavorites);
router.post("/favorites/:bookId", protect, authController.addFavorite);
router.delete("/favorites/:bookId", protect, authController.removeFavorite);

// ==================== ROUTE INFO/DOCUMENTATION ====================
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API d'authentification ASM Alumni",
    endpoints: {
      public: {
        register: {
          method: "POST",
          url: "/api/auth/register",
          description: "Créer un nouveau compte avec justificatif",
          contentType: "multipart/form-data",
          fields: {
            firstName: "string (requis)",
            lastName: "string (requis)",
            email: "string (requis)",
            password: "string (requis)",
            proof: "file (requis - JPG, PNG ou PDF, max 5MB)",
            graduationYear: "number (optionnel)",
            specialization: "string (optionnel)",
          },
        },
        login: {
          method: "POST",
          url: "/api/auth/login",
          description: "Se connecter",
          contentType: "application/json",
          body: {
            email: "string (requis)",
            password: "string (requis)",
          },
        },
      },
      protected: {
        me: "GET /api/auth/me - Mon profil",
        logout: "GET /api/auth/logout - Déconnexion",
        updatedetails: "PUT /api/auth/updatedetails - Mettre à jour le profil",
        updatepassword:
          "PUT /api/auth/updatepassword - Changer le mot de passe",
        favorites: {
          list: "GET /api/auth/favorites - Mes favoris",
          add: "POST /api/auth/favorites/:bookId - Ajouter un favori",
          remove: "DELETE /api/auth/favorites/:bookId - Retirer un favori",
        },
      },
    },
  });
});

module.exports = router;
