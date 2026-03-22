// backend/middleware/uploadProof.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Créer le dossier s'il n'existe pas
const uploadDir = "uploads/proofs";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer pour les justificatifs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "proof-" + uniqueSuffix + ext);
  },
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error("Seuls les fichiers JPG, PNG et PDF sont autorisés (max 5MB)"),
      false,
    );
  }
};

const uploadProof = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

module.exports = uploadProof;
