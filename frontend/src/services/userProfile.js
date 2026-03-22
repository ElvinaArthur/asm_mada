// routes/userProfileRoutes.js - BACKEND POUR PROFIL UTILISATEUR
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/database");

// Configuration multer pour upload photo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile-${req.user.id}-${Date.now()}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images sont autorisées (JPG, PNG, GIF)"));
    }
  },
});

// ==================== ROUTES ====================

// @desc    Récupérer le profil de l'utilisateur
// @route   GET /api/user/profile
// @access  Private
router.get("/", protect, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        id, firstName, lastName, email, phone, birthYear,
        currentPosition, company, location, bio, photoUrl,
        academicBackground, previousPositions, privacy,
        createdAt, updatedAt
      FROM users 
      WHERE id = ?
    `);

    const user = stmt.get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Parser les champs JSON
    const profile = {
      ...user,
      academicBackground: user.academicBackground
        ? JSON.parse(user.academicBackground)
        : { degree: "", field: "", graduationYear: "", institution: "" },
      previousPositions: user.previousPositions
        ? JSON.parse(user.previousPositions)
        : [],
      privacy: user.privacy
        ? JSON.parse(user.privacy)
        : {
            showPhone: false,
            showEmail: false,
            showBirthYear: false,
            showCompany: false,
            showLocation: false,
            showAcademic: false,
            showPreviousPositions: false,
            showBio: false,
          },
    };

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("❌ Erreur GET /user/profile:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/user/profile
// @access  Private
router.put("/", protect, upload.single("photo"), (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      birthYear,
      currentPosition,
      company,
      location,
      bio,
      academicBackground,
      previousPositions,
      privacy,
    } = req.body;

    // Construire la requête de mise à jour
    const updates = [];
    const params = [];

    // Ajouter chaque champ s'il est fourni
    if (firstName) {
      updates.push("firstName = ?");
      params.push(firstName);
    }
    if (lastName) {
      updates.push("lastName = ?");
      params.push(lastName);
    }
    if (email) {
      updates.push("email = ?");
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      params.push(phone);
    }
    if (birthYear !== undefined) {
      updates.push("birthYear = ?");
      params.push(birthYear);
    }
    if (currentPosition) {
      updates.push("currentPosition = ?");
      params.push(currentPosition);
    }
    if (company !== undefined) {
      updates.push("company = ?");
      params.push(company);
    }
    if (location !== undefined) {
      updates.push("location = ?");
      params.push(location);
    }
    if (bio !== undefined) {
      updates.push("bio = ?");
      params.push(bio);
    }

    // Champs JSON
    if (academicBackground) {
      updates.push("academicBackground = ?");
      params.push(
        typeof academicBackground === "string"
          ? academicBackground
          : JSON.stringify(academicBackground),
      );
    }
    if (previousPositions) {
      updates.push("previousPositions = ?");
      params.push(
        typeof previousPositions === "string"
          ? previousPositions
          : JSON.stringify(previousPositions),
      );
    }
    if (privacy) {
      updates.push("privacy = ?");
      params.push(
        typeof privacy === "string" ? privacy : JSON.stringify(privacy),
      );
    }

    // Photo de profil
    if (req.file) {
      const photoUrl = `/uploads/profiles/${req.file.filename}`;
      updates.push("photoUrl = ?");
      params.push(photoUrl);

      // Supprimer l'ancienne photo si elle existe
      try {
        const oldUser = db
          .prepare("SELECT photoUrl FROM users WHERE id = ?")
          .get(req.user.id);
        if (oldUser && oldUser.photoUrl) {
          const oldPath = path.join(__dirname, "..", oldUser.photoUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      } catch (err) {
        console.warn(
          "⚠️ Impossible de supprimer l'ancienne photo:",
          err.message,
        );
      }
    }

    // Date de mise à jour
    updates.push("updatedAt = datetime('now')");

    // Vérifier qu'il y a des données à mettre à jour
    if (updates.length === 1) {
      return res.status(400).json({
        success: false,
        message: "Aucune donnée à mettre à jour",
      });
    }

    // Ajouter l'ID de l'utilisateur
    params.push(req.user.id);

    // Exécuter la mise à jour
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Récupérer le profil mis à jour
    const updatedUser = db
      .prepare(
        `
      SELECT 
        id, firstName, lastName, email, phone, birthYear,
        currentPosition, company, location, bio, photoUrl,
        academicBackground, previousPositions, privacy
      FROM users 
      WHERE id = ?
    `,
      )
      .get(req.user.id);

    // Parser les champs JSON pour la réponse
    const profile = {
      ...updatedUser,
      academicBackground: updatedUser.academicBackground
        ? JSON.parse(updatedUser.academicBackground)
        : { degree: "", field: "", graduationYear: "", institution: "" },
      previousPositions: updatedUser.previousPositions
        ? JSON.parse(updatedUser.previousPositions)
        : [],
      privacy: updatedUser.privacy
        ? JSON.parse(updatedUser.privacy)
        : {
            showPhone: false,
            showEmail: false,
            showBirthYear: false,
            showCompany: false,
            showLocation: false,
            showAcademic: false,
            showPreviousPositions: false,
            showBio: false,
          },
    };

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      profile,
    });
  } catch (error) {
    console.error("❌ Erreur PUT /user/profile:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil",
      error: error.message,
    });
  }
});

// @desc    Mettre à jour uniquement la photo
// @route   PUT /api/user/profile/photo
// @access  Private
router.put("/photo", protect, upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune photo fournie",
      });
    }

    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    // Supprimer l'ancienne photo
    try {
      const oldUser = db
        .prepare("SELECT photoUrl FROM users WHERE id = ?")
        .get(req.user.id);
      if (oldUser && oldUser.photoUrl) {
        const oldPath = path.join(__dirname, "..", oldUser.photoUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    } catch (err) {
      console.warn("⚠️ Impossible de supprimer l'ancienne photo:", err.message);
    }

    // Mettre à jour la base de données
    const stmt = db.prepare(`
      UPDATE users 
      SET photoUrl = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(photoUrl, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Photo mise à jour avec succès",
      photoUrl,
    });
  } catch (error) {
    console.error("❌ Erreur PUT /user/profile/photo:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la photo",
    });
  }
});

// @desc    Mettre à jour les préférences de confidentialité
// @route   PUT /api/user/profile/privacy
// @access  Private
router.put("/privacy", protect, (req, res) => {
  try {
    const { privacy } = req.body;

    if (!privacy) {
      return res.status(400).json({
        success: false,
        message: "Aucune donnée de confidentialité fournie",
      });
    }

    const stmt = db.prepare(`
      UPDATE users 
      SET privacy = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(JSON.stringify(privacy), req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Préférences de confidentialité mises à jour",
    });
  } catch (error) {
    console.error("❌ Erreur PUT /user/profile/privacy:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour des préférences",
    });
  }
});

// @desc    Ajouter un poste précédent
// @route   POST /api/user/profile/previous-positions
// @access  Private
router.post("/previous-positions", protect, (req, res) => {
  try {
    const { title, company, startYear, endYear } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        success: false,
        message: "Le titre et l'entreprise sont requis",
      });
    }

    // Récupérer les postes actuels
    const user = db
      .prepare("SELECT previousPositions FROM users WHERE id = ?")
      .get(req.user.id);

    let positions = [];
    if (user && user.previousPositions) {
      positions = JSON.parse(user.previousPositions);
    }

    // Ajouter le nouveau poste
    positions.push({
      title,
      company,
      startYear: startYear || "",
      endYear: endYear || "",
    });

    // Mettre à jour
    const stmt = db.prepare(`
      UPDATE users 
      SET previousPositions = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(JSON.stringify(positions), req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Poste ajouté avec succès",
      previousPositions: positions,
    });
  } catch (error) {
    console.error("❌ Erreur POST /user/profile/previous-positions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du poste",
    });
  }
});

// @desc    Supprimer un poste précédent
// @route   DELETE /api/user/profile/previous-positions/:index
// @access  Private
router.delete("/previous-positions/:index", protect, (req, res) => {
  try {
    const index = parseInt(req.params.index);

    // Récupérer les postes actuels
    const user = db
      .prepare("SELECT previousPositions FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user || !user.previousPositions) {
      return res.status(404).json({
        success: false,
        message: "Aucun poste trouvé",
      });
    }

    let positions = JSON.parse(user.previousPositions);

    if (index < 0 || index >= positions.length) {
      return res.status(400).json({
        success: false,
        message: "Index invalide",
      });
    }

    // Supprimer le poste
    positions.splice(index, 1);

    // Mettre à jour
    const stmt = db.prepare(`
      UPDATE users 
      SET previousPositions = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(JSON.stringify(positions), req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Poste supprimé avec succès",
      previousPositions: positions,
    });
  } catch (error) {
    console.error("❌ Erreur DELETE /user/profile/previous-positions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du poste",
    });
  }
});

console.log("✅ Routes user/profile chargées avec succès !");

module.exports = router;
