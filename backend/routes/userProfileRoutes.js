// routes/userProfileRoutes.js — VERSION MISE À JOUR
// Nouveaux champs : phone2, birthDate, location (JSON), academicEducations (tableau)
// Migration : birthYear et academicBackground gardés pour compatibilité

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/database");

// ─── Configuration multer ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      /jpeg|jpg|png|gif/.test(path.extname(file.originalname).toLowerCase()) &&
      /jpeg|jpg|png|gif/.test(file.mimetype);
    cb(
      ok
        ? null
        : new Error("Seules les images sont autorisées (JPG, PNG, GIF)"),
      ok,
    );
  },
});

// ─── Migration : ajouter les colonnes manquantes si elles n'existent pas ───
// À exécuter au démarrage du serveur (idempotent)
const runMigrations = () => {
  const newColumns = [
    { name: "phone2", def: "TEXT DEFAULT ''" },
    { name: "birthDate", def: "TEXT DEFAULT ''" },
    { name: "academicEducations", def: "TEXT DEFAULT '[]'" },
  ];

  const existingCols = db.pragma("table_info(users)").map((c) => c.name);

  newColumns.forEach(({ name, def }) => {
    if (!existingCols.includes(name)) {
      try {
        db.prepare(`ALTER TABLE users ADD COLUMN ${name} ${def}`).run();
        console.log(`✅ Colonne ajoutée : users.${name}`);
      } catch (e) {
        console.warn(`⚠️  Impossible d'ajouter users.${name} :`, e.message);
      }
    }
  });
};

try {
  runMigrations();
} catch (e) {
  console.warn("Migration ignorée :", e.message);
}

// ─── GET /api/user/profile ─────────────────────────────────────────
router.get("/", protect, (req, res) => {
  try {
    const user = db
      .prepare(
        `
      SELECT 
        id, firstName, lastName, email, phone, phone2,
        birthDate, birthYear,
        currentPosition, company, location, bio, photoUrl,
        academicBackground, academicEducations,
        previousPositions, privacy,
        createdAt, updatedAt
      FROM users WHERE id = ?
    `,
      )
      .get(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });

    const safeJson = (val, fallback) => {
      if (!val) return fallback;
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch {
        return fallback;
      }
    };

    const profile = {
      ...user,
      academicBackground: safeJson(user.academicBackground, {
        degree: "",
        field: "",
        graduationYear: "",
        institution: "",
      }),
      academicEducations: safeJson(user.academicEducations, []),
      previousPositions: safeJson(user.previousPositions, []),
      privacy: safeJson(user.privacy, {
        showPhone: false,
        showPhone2: false,
        showEmail: false,
        showBirthDate: false,
        showCompany: false,
        showLocation: false,
        showAcademic: false,
        showPreviousPositions: false,
        showBio: false,
      }),
    };

    res.json({ success: true, profile });
  } catch (error) {
    console.error("❌ GET /user/profile:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ─── PUT /api/user/profile ─────────────────────────────────────────
router.put("/", protect, upload.single("photo"), (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      phone2,
      birthDate,
      currentPosition,
      company,
      location,
      bio,
      academicBackground,
      academicEducations,
      previousPositions,
      privacy,
    } = req.body;

    const updates = [];
    const params = [];

    const addField = (col, val) => {
      if (val !== undefined) {
        updates.push(`${col} = ?`);
        params.push(val);
      }
    };

    addField("firstName", firstName);
    addField("lastName", lastName);
    addField("email", email);
    addField("phone", phone);
    addField("phone2", phone2);
    addField("bio", bio);
    addField("currentPosition", currentPosition);
    addField("company", company);

    // birthDate → dériver birthYear pour compatibilité
    if (birthDate !== undefined) {
      updates.push("birthDate = ?");
      params.push(birthDate);
      if (birthDate && birthDate.length >= 4) {
        updates.push("birthYear = ?");
        params.push(parseInt(birthDate.substring(0, 4), 10));
      }
    }

    // location : accepter string JSON ou string brute
    if (location !== undefined) {
      const locStr =
        typeof location === "string" ? location : JSON.stringify(location);
      updates.push("location = ?");
      params.push(locStr);
    }

    // Champs JSON
    const addJson = (col, val) => {
      if (val !== undefined) {
        updates.push(`${col} = ?`);
        params.push(typeof val === "string" ? val : JSON.stringify(val));
      }
    };

    addJson("academicBackground", academicBackground);
    addJson("academicEducations", academicEducations);
    addJson("previousPositions", previousPositions);
    addJson("privacy", privacy);

    // Photo
    if (req.file) {
      const photoUrl = `/uploads/profiles/${req.file.filename}`;
      updates.push("photoUrl = ?");
      params.push(photoUrl);

      // Supprimer l'ancienne photo
      const old = db
        .prepare("SELECT photoUrl FROM users WHERE id = ?")
        .get(req.user.id);
      if (old?.photoUrl) {
        const oldPath = path.join(__dirname, "..", old.photoUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    updates.push("updatedAt = datetime('now')");

    if (updates.length <= 1) {
      return res
        .status(400)
        .json({ success: false, message: "Aucune donnée à mettre à jour" });
    }

    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(
      ...params,
    );

    // Retourner le profil mis à jour
    const updated = db
      .prepare(
        `
      SELECT id, firstName, lastName, email, phone, phone2,
             birthDate, birthYear, currentPosition, company,
             location, bio, photoUrl,
             academicBackground, academicEducations,
             previousPositions, privacy
      FROM users WHERE id = ?
    `,
      )
      .get(req.user.id);

    const safeJson = (val, fb) => {
      try {
        return typeof val === "string" ? JSON.parse(val) : (val ?? fb);
      } catch {
        return fb;
      }
    };

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      profile: {
        ...updated,
        academicBackground: safeJson(updated.academicBackground, {}),
        academicEducations: safeJson(updated.academicEducations, []),
        previousPositions: safeJson(updated.previousPositions, []),
        privacy: safeJson(updated.privacy, {}),
      },
    });
  } catch (error) {
    console.error("❌ PUT /user/profile:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la mise à jour",
        error: error.message,
      });
  }
});

console.log(
  "✅ Routes user/profile chargées (v2 — avec phone2, birthDate, localisation JSON, academicEducations)",
);
module.exports = router;
