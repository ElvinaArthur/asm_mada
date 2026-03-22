// controllers/bookController.js
const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

// @desc    Récupérer tous les livres
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const options = {
      category: req.query.category,
      search: req.query.query || req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
    };

    const result = Book.findAll(options);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur getBooks:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des livres",
    });
  }
};

// @desc    Récupérer un livre par ID
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
  try {
    const book = Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    // Ajouter l'URL de visualisation (pas de téléchargement)
    const bookWithViewUrl = {
      ...book,
      viewUrl: `/api/books/${book.id}/view`, // URL pour la visualisation
      thumbnailUrl: `/api/books/${book.id}/thumbnail`,
    };

    res.status(200).json({
      success: true,
      data: bookWithViewUrl,
    });
  } catch (error) {
    console.error("Erreur getBook:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du livre",
    });
  }
};

// @desc    VISUALISER le PDF d'un livre (LECTURE SEULE - pas de téléchargement)
// @route   GET /api/books/:id/view
// @access  Public
exports.viewPDF = async (req, res) => {
  try {
    const book = Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    // Chemin vers le fichier PDF
    const pdfPath = path.join(__dirname, "../uploads/pdfs", book.fileName);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: "Fichier PDF non trouvé",
      });
    }

    // Incrémenter les vues (pour les statistiques)
    if (Book.incrementViews) {
      Book.incrementViews(req.params.id);
    }

    // Obtenir les infos du fichier
    const stat = fs.statSync(pdfPath);
    const fileSize = stat.size;

    // Gérer le cache pour éviter les erreurs 304
    const ifModifiedSince = req.headers["if-modified-since"];
    if (ifModifiedSince) {
      const lastModified = stat.mtime.toUTCString();
      if (ifModifiedSince === lastModified) {
        // Si le fichier n'a pas changé, renvoyer 304
        return res.status(304).end();
      }
    }

    // EN-TÊTES POUR LECTURE SEULE ET PROTECTION
    // --------------------------------------------------

    // 1. Type de contenu
    res.setHeader("Content-Type", "application/pdf");

    // 2. IMPORTANT: Afficher dans le navigateur SANS option de téléchargement
    // Pas de nom de fichier dans Content-Disposition pour empêcher le "Enregistrer sous"
    res.setHeader("Content-Disposition", "inline");

    // 3. Sécurité et protection des droits d'auteur
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN"); // Empêche l'iframe depuis d'autres sites
    res.setHeader("X-PDF-Protection", "no-download, no-print, no-copy");
    res.setHeader("X-Read-Only", "true");

    // 4. Politique de sécurité du contenu pour limiter les fonctionnalités
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
        "script-src 'none'; " + // Désactive JavaScript dans le PDF
        "style-src 'none'; " + // Désactive les styles
        "object-src 'none';", // Désactive les objets
    );

    // 5. GESTION DU CACHE POUR ÉVITER LES ERREURS 304
    // --------------------------------------------------
    const cacheControl =
      "private, no-cache, no-store, must-revalidate, max-age=0";
    res.setHeader("Cache-Control", cacheControl);
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // 6. Dernière modification (pour la validation de cache)
    res.setHeader("Last-Modified", stat.mtime.toUTCString());

    // 7. Taille du contenu
    res.setHeader("Content-Length", fileSize);

    // 8. Support du Range pour le streaming (lecture par morceaux)
    const range = req.headers.range;

    if (range) {
      // Extraire le range demandé
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      // Vérifier que le range est valide
      if (start >= fileSize || end >= fileSize) {
        res.writeHead(416, {
          "Content-Range": `bytes */${fileSize}`,
        });
        return res.end();
      }

      // Envoyer la partie demandée
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": cacheControl,
        "X-PDF-Protection": "no-download",
      });

      const fileStream = fs.createReadStream(pdfPath, { start, end });
      fileStream.pipe(res);
    } else {
      // Envoyer tout le fichier
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": cacheControl,
        "X-PDF-Protection": "no-download",
      });

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    }
  } catch (error) {
    console.error("Erreur viewPDF:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la visualisation du PDF",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Télécharger le PDF d'un livre (DÉSACTIVÉ pour protéger les droits d'auteur)
// @route   GET /api/books/:id/file
// @access  Public
exports.downloadPDF = async (req, res) => {
  // Rediriger vers la visualisation avec un message d'information
  return res.status(403).json({
    success: false,
    message:
      "Le téléchargement est désactivé pour protéger les droits d'auteur.",
    instruction: "Utilisez la visualisation en ligne pour lire le document.",
    viewUrl: `/api/books/${req.params.id}/view`,
    code: "DOWNLOAD_DISABLED",
  });
};

// @desc    Récupérer la miniature
// @route   GET /api/books/:id/thumbnail
// @access  Public
exports.getThumbnail = async (req, res) => {
  try {
    const book = Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    const thumbnailPath = path.join(
      __dirname,
      "../uploads/thumbnails",
      book.thumbnail || "default.jpg",
    );

    if (!fs.existsSync(thumbnailPath)) {
      // Si pas de miniature, retourner une image par défaut
      const defaultThumbnail = path.join(
        __dirname,
        "../uploads/thumbnails/default.jpg",
      );

      if (fs.existsSync(defaultThumbnail)) {
        return res.sendFile(defaultThumbnail);
      }

      return res.status(404).json({
        success: false,
        message: "Fichier miniature non trouvé",
      });
    }

    // Headers pour les images (cache plus long)
    res.setHeader("Cache-Control", "public, max-age=86400"); // 24 heures
    res.setHeader("Content-Type", "image/jpeg");

    res.sendFile(thumbnailPath);
  } catch (error) {
    console.error("Erreur getThumbnail:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la miniature",
    });
  }
};

// @desc    Récupérer toutes les catégories
// @route   GET /api/books/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = Book.getCategories();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Erreur getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories",
    });
  }
};

// @desc    Rechercher des livres
// @route   GET /api/books/search/:query
// @access  Public
exports.searchBooks = async (req, res) => {
  try {
    const options = {
      search: req.params.query,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
    };

    const result = Book.findAll(options);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur searchBooks:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche",
    });
  }
};

// @desc    Récupérer les livres populaires (plus de vues)
// @route   GET /api/books/popular
// @access  Public
exports.getPopularBooks = async (req, res) => {
  try {
    const books = Book.getPopularBooks();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Erreur getPopularBooks:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des livres populaires",
    });
  }
};

// @desc    Vérifier si un PDF est accessible (pour débogage)
// @route   GET /api/books/:id/check
// @access  Public
exports.checkPDF = async (req, res) => {
  try {
    const book = Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    const pdfPath = path.join(__dirname, "../uploads/pdfs", book.fileName);
    const exists = fs.existsSync(pdfPath);
    const stat = exists ? fs.statSync(pdfPath) : null;

    res.status(200).json({
      success: true,
      data: {
        bookId: book.id,
        bookTitle: book.title,
        fileName: book.fileName,
        fileExists: exists,
        fileSize: exists ? stat.size : 0,
        fileSizeFormatted: exists ? formatFileSize(stat.size) : "0 Bytes",
        lastModified: exists ? stat.mtime : null,
        viewUrl: `/api/books/${book.id}/view`,
        cacheStatus: "no-cache, no-store (protection droits d'auteur)",
      },
    });
  } catch (error) {
    console.error("Erreur checkPDF:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du PDF",
    });
  }
};

// Fonction utilitaire pour formater la taille des fichiers
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
