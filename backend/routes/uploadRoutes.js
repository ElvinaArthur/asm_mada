// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const { uploadPDF, uploadImage } = require("../middleware/upload");

// Lister les PDFs
router.get("/pdfs", async (req, res) => {
  try {
    const pdfsDir = path.join(__dirname, "../uploads/pdfs");

    // Vérifier si le dossier existe
    try {
      await fs.access(pdfsDir);
    } catch {
      return res.json({
        success: true,
        count: 0,
        files: [],
      });
    }

    const files = await fs.readdir(pdfsDir);

    // Filtrer seulement les fichiers PDF
    const pdfFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".pdf"),
    );

    // Obtenir les infos détaillées
    const filesInfo = await Promise.all(
      pdfFiles.map(async (file) => {
        const filePath = path.join(pdfsDir, file);
        const stats = await fs.stat(filePath);

        return {
          name: file,
          path: `/uploads/pdfs/${file}`,
          url: `${req.protocol}://${req.get("host")}/uploads/pdfs/${file}`,
          size: stats.size,
          sizeFormatted: formatFileSize(stats.size),
          created: stats.birthtime,
          modified: stats.mtime,
        };
      }),
    );

    // Trier par nom (ordre naturel)
    filesInfo.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)?.[0]) || 0;
      const numB = parseInt(b.name.match(/\d+/)?.[0]) || 0;
      return numA - numB;
    });

    res.json({
      success: true,
      count: filesInfo.length,
      files: filesInfo,
    });
  } catch (error) {
    console.error("❌ Erreur lecture dossier PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la lecture du dossier PDFs",
    });
  }
});

// Lister les thumbnails
router.get("/thumbnails", async (req, res) => {
  try {
    const thumbsDir = path.join(__dirname, "../uploads/thumbnails");

    // Vérifier si le dossier existe
    try {
      await fs.access(thumbsDir);
    } catch {
      return res.json({
        success: true,
        count: 0,
        files: [],
      });
    }

    const files = await fs.readdir(thumbsDir);

    // Filtrer les images
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter((file) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
    );

    // Obtenir les infos détaillées
    const filesInfo = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = path.join(thumbsDir, file);
        const stats = await fs.stat(filePath);

        return {
          name: file,
          path: `/uploads/thumbnails/${file}`,
          url: `${req.protocol}://${req.get("host")}/uploads/thumbnails/${file}`,
          size: stats.size,
          sizeFormatted: formatFileSize(stats.size),
          created: stats.birthtime,
          modified: stats.mtime,
        };
      }),
    );

    // Trier par nom (ordre naturel)
    filesInfo.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)?.[0]) || 0;
      const numB = parseInt(b.name.match(/\d+/)?.[0]) || 0;
      return numA - numB;
    });

    res.json({
      success: true,
      count: filesInfo.length,
      files: filesInfo,
    });
  } catch (error) {
    console.error("❌ Erreur lecture dossier thumbnails:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la lecture du dossier thumbnails",
    });
  }
});

// Upload de fichier (compatible avec votre middleware existant)
router.post("/upload", async (req, res) => {
  try {
    const { type } = req.body;

    if (!type || (type !== "pdf" && type !== "thumbnail")) {
      return res.status(400).json({
        success: false,
        message: 'Type de fichier invalide. Utilisez "pdf" ou "thumbnail"',
      });
    }

    // Utiliser le middleware multer approprié
    const uploadMiddleware =
      type === "pdf" ? uploadPDF.single("file") : uploadImage.single("file");

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Aucun fichier téléchargé",
        });
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${type === "pdf" ? "pdfs" : "thumbnails"}/${req.file.filename}`;

      res.json({
        success: true,
        message: "Fichier uploadé avec succès",
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        sizeFormatted: formatFileSize(req.file.size),
        type: type,
        url: fileUrl,
        path: `/uploads/${type === "pdf" ? "pdfs" : "thumbnails"}/${req.file.filename}`,
      });
    });
  } catch (error) {
    console.error("❌ Erreur upload:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload du fichier",
    });
  }
});

// Vérifier si un fichier existe
router.get("/check/:type/:filename", async (req, res) => {
  try {
    const { type, filename } = req.params;

    if (type !== "pdf" && type !== "thumbnail") {
      return res.status(400).json({
        success: false,
        message: 'Type invalide. Utilisez "pdf" ou "thumbnail"',
      });
    }

    const dirPath =
      type === "pdf"
        ? path.join(__dirname, "../uploads/pdfs", filename)
        : path.join(__dirname, "../uploads/thumbnails", filename);

    try {
      await fs.access(dirPath);
      const stats = await fs.stat(dirPath);

      res.json({
        success: true,
        exists: true,
        filename: filename,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        url: `${req.protocol}://${req.get("host")}/uploads/${type === "pdf" ? "pdfs" : "thumbnails"}/${filename}`,
      });
    } catch {
      res.json({
        success: true,
        exists: false,
        filename: filename,
        message: "Fichier non trouvé",
      });
    }
  } catch (error) {
    console.error("❌ Erreur vérification fichier:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du fichier",
    });
  }
});

// Supprimer un fichier
router.delete("/delete", async (req, res) => {
  try {
    const { filename, type } = req.body;

    if (!filename || !type) {
      return res.status(400).json({
        success: false,
        message: "Nom de fichier et type requis",
      });
    }

    if (type !== "pdf" && type !== "thumbnail") {
      return res.status(400).json({
        success: false,
        message: 'Type invalide. Utilisez "pdf" ou "thumbnail"',
      });
    }

    const dirPath =
      type === "pdf"
        ? path.join(__dirname, "../uploads/pdfs", filename)
        : path.join(__dirname, "../uploads/thumbnails", filename);

    // Vérifier si le fichier existe
    try {
      await fs.access(dirPath);
    } catch {
      return res.status(404).json({
        success: false,
        message: "Fichier non trouvé",
      });
    }

    // Supprimer le fichier
    await fs.unlink(dirPath);

    console.log(`✅ Fichier supprimé: ${dirPath}`);

    res.json({
      success: true,
      message: "Fichier supprimé avec succès",
      filename: filename,
    });
  } catch (error) {
    console.error("❌ Erreur suppression fichier:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du fichier",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Statistiques des uploads
router.get("/stats", async (req, res) => {
  try {
    const pdfsDir = path.join(__dirname, "../uploads/pdfs");
    const thumbsDir = path.join(__dirname, "../uploads/thumbnails");

    let pdfCount = 0;
    let pdfTotalSize = 0;
    let thumbCount = 0;
    let thumbTotalSize = 0;

    // Compter les PDFs
    try {
      await fs.access(pdfsDir);
      const pdfFiles = await fs.readdir(pdfsDir);
      const pdfFilesFiltered = pdfFiles.filter((file) =>
        file.toLowerCase().endsWith(".pdf"),
      );
      pdfCount = pdfFilesFiltered.length;

      for (const file of pdfFilesFiltered) {
        const stats = await fs.stat(path.join(pdfsDir, file));
        pdfTotalSize += stats.size;
      }
    } catch {
      // Dossier n'existe pas
    }

    // Compter les thumbnails
    try {
      await fs.access(thumbsDir);
      const thumbFiles = await fs.readdir(thumbsDir);
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const thumbFilesFiltered = thumbFiles.filter((file) =>
        imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
      );
      thumbCount = thumbFilesFiltered.length;

      for (const file of thumbFilesFiltered) {
        const stats = await fs.stat(path.join(thumbsDir, file));
        thumbTotalSize += stats.size;
      }
    } catch {
      // Dossier n'existe pas
    }

    res.json({
      success: true,
      pdfs: {
        count: pdfCount,
        totalSize: pdfTotalSize,
        totalSizeFormatted: formatFileSize(pdfTotalSize),
      },
      thumbnails: {
        count: thumbCount,
        totalSize: thumbTotalSize,
        totalSizeFormatted: formatFileSize(thumbTotalSize),
      },
      total: {
        files: pdfCount + thumbCount,
        size: pdfTotalSize + thumbTotalSize,
        sizeFormatted: formatFileSize(pdfTotalSize + thumbTotalSize),
      },
    });
  } catch (error) {
    console.error("❌ Erreur statistiques uploads:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du calcul des statistiques",
    });
  }
});

// Fonction utilitaire pour formater la taille des fichiers
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

module.exports = router;
