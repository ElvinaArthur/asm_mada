// controllers/authController.js - REMPLACE SEULEMENT LA FONCTION register
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/database");

const generateToken = (id, role = "user", isVerified = false) => {
  return jwt.sign(
    { id, role, isVerified },
    process.env.JWT_SECRET || "asm-alumni-secret-key",
    { expiresIn: "30d" },
  );
};

// ✅ FONCTION REGISTER SIMPLIFIÉE
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      graduationYear,
      specialization,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs requis doivent être remplis",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Le justificatif est requis",
      });
    }

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      graduationYear: graduationYear || null,
      specialization: specialization || null,
      proofFileName: req.file.filename,
    });

    const token = generateToken(user.id, user.role, user.isVerified);

    res.status(201).json({
      success: true,
      message: "Inscription réussie. En attente de vérification.",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified ? true : false,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
    });
  }
};

// GARDE TES AUTRES FONCTIONS (login, logout, getMe, etc.)
// Ne touche pas au reste du fichier
