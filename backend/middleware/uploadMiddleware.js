// middleware/uploadMiddleware.js - VERSION SIMPLE
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const proofsDir = path.join(__dirname, "../uploads/proofs");
if (!fs.existsSync(proofsDir)) {
  fs.mkdirSync(proofsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, proofsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `proof-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format non supporté. Utilisez JPG, PNG ou PDF."));
    }
  },
});

exports.uploadProof = upload.single("proof");
exports.uploadPDF = upload.single("pdf");
exports.uploadImage = upload.single("image");
