// backend/routes/proofRoutes.js - VERSION COMPLÈTE
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { protect } = require("../middleware/auth");
const { uploadProof } = require("../middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");

// ==================== ROUTES UTILISATEUR ====================

// GET - Mon justificatif
router.get("/my-proof", protect, async (req, res) => {
  try {
    const user = db
      .prepare(
        `
        SELECT proof_filename, proof_originalname, proof_mimetype, 
               proof_size, proof_uploaded_at, proof_status,
               proof_rejection_reason
        FROM users WHERE id = ?
      `,
      )
      .get(req.user.id);

    if (!user || !user.proof_filename) {
      return res.status(404).json({
        success: false,
        message: "Aucun justificatif uploadé",
      });
    }

    res.json({
      success: true,
      data: {
        filename: user.proof_filename,
        originalname: user.proof_originalname,
        mimetype: user.proof_mimetype,
        size: user.proof_size,
        uploaded_at: user.proof_uploaded_at,
        status: user.proof_status,
        rejection_reason: user.proof_rejection_reason,
        url: `/api/proofs/download/${user.proof_filename}`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération justificatif:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du justificatif",
    });
  }
});

// POST - Upload/Re-upload justificatif
router.post("/upload-proof", protect, uploadProof, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier uploadé",
      });
    }

    // Récupérer l'ancien fichier pour le supprimer
    const oldProof = db
      .prepare("SELECT proof_filename FROM users WHERE id = ?")
      .get(req.user.id);

    // Supprimer l'ancien fichier s'il existe
    if (oldProof && oldProof.proof_filename) {
      const oldPath = path.join(
        __dirname,
        "../uploads/proofs",
        oldProof.proof_filename,
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Mettre à jour avec le nouveau fichier
    const stmt = db.prepare(`
      UPDATE users 
      SET 
        proof_filename = ?,
        proof_originalname = ?,
        proof_mimetype = ?,
        proof_size = ?,
        proof_uploaded_at = datetime('now'),
        proof_status = 'pending',
        proof_rejection_reason = NULL,
        isVerified = 0
      WHERE id = ?
    `);

    stmt.run(
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      req.user.id,
    );

    // Récupérer l'utilisateur mis à jour
    const user = db
      .prepare(
        `
        SELECT id, firstName, lastName, email, isVerified,
               proof_status, proof_filename, proof_uploaded_at
        FROM users WHERE id = ?
      `,
      )
      .get(req.user.id);

    res.json({
      success: true,
      message: "Justificatif uploadé avec succès",
      data: {
        user: {
          ...user,
          proof_url: `/api/proofs/download/${req.file.filename}`,
        },
      },
    });
  } catch (error) {
    console.error("❌ Erreur upload justificatif:", error);

    // Supprimer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload du justificatif",
    });
  }
});

// ==================== ROUTES ADMIN ====================

// GET - Détails du justificatif d'un utilisateur (admin)
router.get("/admin/proof/:userId", protect, async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé aux administrateurs",
      });
    }

    const { userId } = req.params;

    const user = db
      .prepare(
        `
        SELECT id, firstName, lastName, email, isVerified,
               proof_filename, proof_originalname, proof_mimetype,
               proof_size, proof_uploaded_at, proof_status,
               proof_rejection_reason
        FROM users WHERE id = ?
      `,
      )
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: Boolean(user.isVerified),
        },
        proof: user.proof_filename
          ? {
              filename: user.proof_filename,
              originalname: user.proof_originalname,
              mimetype: user.proof_mimetype,
              size: user.proof_size,
              uploaded_at: user.proof_uploaded_at,
              status: user.proof_status,
              rejection_reason: user.proof_rejection_reason,
              url: `/api/proofs/download/${user.proof_filename}`,
              preview_url: user.proof_mimetype.startsWith("image/")
                ? `/api/proofs/admin/proof/preview/${user.proof_filename}`
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération justificatif admin:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du justificatif",
    });
  }
});

// GET - Prévisualiser une image (admin)
router.get("/admin/proof/preview/:filename", protect, async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé aux administrateurs",
      });
    }

    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads/proofs", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Fichier non trouvé",
      });
    }

    // Vérifier que c'est une image
    const ext = path.extname(filename).toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

    if (!imageExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: "Ce fichier n'est pas une image",
      });
    }

    // Envoyer l'image
    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ Erreur prévisualisation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la prévisualisation",
    });
  }
});

// ==================== TÉLÉCHARGEMENT ====================

// GET - Télécharger un justificatif
router.get("/download/:filename", protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads/proofs", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Fichier non trouvé",
      });
    }

    // Vérifier les permissions
    if (req.user.role !== "admin") {
      // Pour un utilisateur normal, vérifier que c'est son fichier
      const proofOwner = db
        .prepare("SELECT id FROM users WHERE proof_filename = ?")
        .get(filename);

      if (!proofOwner || proofOwner.id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé à ce fichier",
        });
      }
    }

    // Télécharger le fichier
    res.download(filePath);
  } catch (error) {
    console.error("❌ Erreur téléchargement:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du téléchargement",
    });
  }
});

module.exports = router;
