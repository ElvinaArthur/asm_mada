// backend/routes/registerRoutes.js - VERSION CORRIGÉE
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadProof } = require("../middleware/uploadMiddleware");

router.post("/register", uploadProof, async (req, res) => {
  try {
    console.log("=== DÉBUT INSCRIPTION ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const {
      firstName,
      lastName,
      email,
      password,
      graduationYear,
      specialization,
    } = req.body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password) {
      if (req.file) {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Tous les champs requis doivent être remplis",
        missingFields: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          password: !password,
        },
      });
    }

    // Vérifier le justificatif
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Le justificatif d'adhésion est requis",
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérer l'utilisateur dans la base de données
    const stmt = db.prepare(`
      INSERT INTO users (
        firstName, lastName, email, password, role, isVerified,
        graduationYear, specialization,
        proof_filename, proof_originalname, proof_mimetype, proof_size,
        proof_uploaded_at, proof_status, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, 'user', 0, ?, ?, ?, ?, ?, ?, datetime('now'), 'pending', datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      firstName.trim(),
      lastName.trim(),
      email.trim().toLowerCase(),
      hashedPassword,
      graduationYear || null,
      specialization || null,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
    );

    // Récupérer l'utilisateur créé
    const user = db
      .prepare(
        `
        SELECT 
          id, firstName, lastName, email, role, isVerified,
          graduationYear, specialization, proof_status,
          proof_filename, proof_uploaded_at, createdAt
        FROM users WHERE id = ?
      `,
      )
      .get(result.lastInsertRowid);

    // Créer le token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "asm-alumni-secret-key",
      { expiresIn: "30d" },
    );

    // Préparer les données utilisateur
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: Boolean(user.isVerified),
      graduationYear: user.graduationYear,
      specialization: user.specialization,
      proofStatus: user.proof_status,
      createdAt: user.createdAt,
    };

    console.log("=== INSCRIPTION RÉUSSIE ===");
    console.log("User ID:", user.id);
    console.log("Email:", user.email);
    console.log("Proof uploaded:", req.file.filename);

    res.status(201).json({
      success: true,
      message:
        "Inscription réussie. Votre compte est en attente de vérification.",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("❌ Erreur inscription:", error);

    // Supprimer le fichier uploadé en cas d'erreur
    if (req.file) {
      try {
        const fs = require("fs");
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (unlinkError) {
        console.error("Erreur suppression fichier:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
