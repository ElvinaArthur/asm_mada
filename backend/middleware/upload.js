// middleware/upload.js - AJOUTEZ CES LIGNES
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ============== CRÉER TOUS LES DOSSIERS ==============
const uploadDirs = [
  path.join(__dirname, "../uploads/pdfs"),
  path.join(__dirname, "../uploads/thumbnails"),
  path.join(__dirname, "../uploads/proofs"), // AJOUTÉ pour les justificatifs
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Dossier créé: ${dir}`);
  }
});

// ============== CONFIGURATION POUR LES JUSTIFICATIFS ==============
const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/proofs"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "proof-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const proofFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Seuls les fichiers image (JPEG, PNG, GIF, WebP) et PDF sont autorisés",
      ),
      false,
    );
  }
};

// Middleware pour upload de justificatifs
const upload = multer({
  storage: proofStorage,
  fileFilter: proofFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// ============== CONFIGURATION POUR LES PDFs (LIVRES) ==============
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/pdfs"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "pdf-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  }
};

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

// ============== CONFIGURATION POUR LES IMAGES ==============
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/thumbnails"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "thumbnail-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Seules les images sont autorisées (JPEG, PNG, GIF, WebP)"),
      false,
    );
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// ============== MIDDLEWARE POUR UPLOAD MULTIPLE ==============
const uploadFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "pdf") {
        cb(null, path.join(__dirname, "../uploads/pdfs"));
      } else if (file.fieldname === "thumbnail") {
        cb(null, path.join(__dirname, "../uploads/thumbnails"));
      } else {
        cb(new Error("Champ de fichier non reconnu"), null);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "pdf" && file.mimetype !== "application/pdf") {
      cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
    } else if (
      file.fieldname === "thumbnail" &&
      ![
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(file.mimetype)
    ) {
      cb(new Error("Seules les images sont autorisées"), false);
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
}).fields([
  { name: "pdf", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// ============== CONFIGURATION POUR LES ÉVÉNEMENTS ==============
const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const eventsDir = path.join(__dirname, "../uploads/events");
    if (!fs.existsSync(eventsDir)) {
      fs.mkdirSync(eventsDir, { recursive: true });
      console.log(`📁 Dossier events créé: ${eventsDir}`);
    }
    cb(null, eventsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "event-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const eventFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Seules les images sont autorisées (JPEG, PNG, GIF, WebP)"),
      false,
    );
  }
};

const uploadEvent = multer({
  storage: eventStorage,
  fileFilter: eventFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// ============== EXPORTS ==============
module.exports = {
  upload, // Pour upload de justificatifs (adminRoutes.js)
  uploadPDF, // Pour upload de PDFs
  uploadImage, // Pour upload d'images
  uploadFiles, // Pour upload multiple
  uploadEvent: uploadEvent.single("image"),
};
