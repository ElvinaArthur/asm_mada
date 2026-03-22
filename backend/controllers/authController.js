// controllers/authController.js — ✅ CORRECTIF avatar
// Modifications :
//   1. getMe → re-fetch depuis DB avec photoUrl (au lieu de retourner req.user tel quel)
//   2. login  → userData inclut photoUrl
//   3. register → user retourné inclut photoUrl

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/database");

const generateToken = (id, role = "user", isVerified = false) => {
  return jwt.sign(
    { id, role, isVerified },
    process.env.JWT_SECRET || "asm-alumni-secret-key",
    { expiresIn: process.env.JWT_EXPIRE || "30d" },
  );
};

// @route POST /api/auth/register
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
      return res
        .status(400)
        .json({
          success: false,
          message: "Tous les champs requis doivent être remplis",
        });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Le justificatif est requis" });
    }

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email déjà utilisé" });
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
        photoUrl: user.photoUrl || null, // ✅
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de l'inscription" });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Veuillez fournir un email et un mot de passe",
        });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    if (user.role === "user" && user.isVerified === 0) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        message:
          "Votre compte est en attente de vérification par un administrateur. Vous serez notifié par email une fois vérifié.",
        userId: user.id,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "asm-alumni-secret-key",
      { expiresIn: "30d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        graduationYear: user.graduationYear,
        specialization: user.specialization,
        photoUrl: user.photoUrl || null, // ✅ FIX : était absent
      },
      message: "Connexion réussie",
    });
  } catch (error) {
    console.error("❌ Erreur login:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// @route GET /api/auth/logout
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Déconnexion réussie" });
};

// @route GET /api/auth/me
// ✅ FIX PRINCIPAL : re-fetch depuis la DB pour avoir photoUrl à jour
// Avant : retournait req.user qui vient du middleware protect (qui appelait findById sans photoUrl)
// Maintenant : on re-fetch avec un SELECT explicite qui inclut photoUrl
exports.getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  // Re-fetch depuis la DB → données fraîches, photoUrl inclus
  const freshUser = db
    .prepare(
      `
    SELECT 
      id, firstName, lastName, email, role,
      isVerified, isActive,
      graduationYear, specialization,
      photoUrl,
      createdAt
    FROM users
    WHERE id = ?
  `,
    )
    .get(req.user.id);

  if (!freshUser) {
    return res
      .status(404)
      .json({ success: false, message: "Utilisateur non trouvé" });
  }

  res.status(200).json({
    success: true,
    user: freshUser, // ✅ photoUrl est dedans
  });
};

// @route PUT /api/auth/updatedetails
exports.updateDetails = async (req, res) => {
  try {
    const { firstName, lastName, graduationYear, specialization } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Non autorisé" });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (graduationYear) updateData.graduationYear = graduationYear;
    if (specialization) updateData.specialization = specialization;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Aucune donnée à mettre à jour" });
    }

    const updatedUser = User.update(req.user.id, updateData);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    console.error("❌ Erreur updateDetails:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la mise à jour du profil",
      });
  }
};

// @route PUT /api/auth/updatepassword
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.user)
      return res.status(401).json({ success: false, message: "Non autorisé" });
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Veuillez fournir l'ancien et le nouveau mot de passe",
        });
    }

    const user = User.findByEmail(req.user.email);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });

    const isPasswordValid = await User.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Mot de passe actuel incorrect" });
    }

    const success = await User.updatePassword(req.user.id, newPassword);
    if (!success)
      return res
        .status(500)
        .json({
          success: false,
          message: "Erreur lors de la mise à jour du mot de passe",
        });

    res
      .status(200)
      .json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("❌ Erreur updatePassword:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la mise à jour du mot de passe",
      });
  }
};

// @route GET /api/auth/favorites
exports.getFavorites = (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Non autorisé" });

    const favorites = User.getFavorites(req.user.id);
    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites.map((book) => ({
        ...book,
        pdfUrl: `/api/books/${book.id}/file`,
        thumbnailUrl: `/api/books/${book.id}/thumbnail`,
      })),
    });
  } catch (error) {
    console.error("❌ Erreur getFavorites:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la récupération des favoris",
      });
  }
};

// @route POST /api/auth/favorites/:bookId
exports.addFavorite = (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Non autorisé" });

    const { bookId } = req.params;
    const book = db.prepare("SELECT id FROM books WHERE id = ?").get(bookId);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Livre non trouvé" });

    if (User.hasFavorite(req.user.id, bookId)) {
      return res
        .status(400)
        .json({ success: false, message: "Livre déjà dans les favoris" });
    }

    const result = User.addFavorite(req.user.id, bookId);
    if (result.changes === 0)
      return res
        .status(500)
        .json({
          success: false,
          message: "Erreur lors de l'ajout aux favoris",
        });

    res
      .status(200)
      .json({ success: true, message: "Livre ajouté aux favoris" });
  } catch (error) {
    console.error("❌ Erreur addFavorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de l'ajout aux favoris" });
  }
};

// @route DELETE /api/auth/favorites/:bookId
exports.removeFavorite = (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Non autorisé" });

    const { bookId } = req.params;
    const result = User.removeFavorite(req.user.id, bookId);
    if (result.changes === 0)
      return res
        .status(404)
        .json({ success: false, message: "Livre non trouvé dans les favoris" });

    res
      .status(200)
      .json({ success: true, message: "Livre retiré des favoris" });
  } catch (error) {
    console.error("❌ Erreur removeFavorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors du retrait des favoris" });
  }
};
