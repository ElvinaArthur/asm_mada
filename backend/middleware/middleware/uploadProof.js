// middleware/uploadProof.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Créer le dossier proofs s'il n'existe pas
const proofsDir = path.join(__dirname, "../uploads/proofs");
if (!fs.existsSync(proofsDir)) {
  fs.mkdirSync(proofsDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, proofsDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp et userId
    const userId = req.body.userId || req.params.userId || "unknown";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `proof-${userId}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// Filtrage des fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Type de fichier non autorisé. Seuls JPG, PNG, GIF et PDF sont acceptés.",
      ),
      false,
    );
  }
};

// Configuration de l'upload
const uploadProof = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

module.exports = uploadProof;
