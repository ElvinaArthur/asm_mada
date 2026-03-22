// routes/adminRoutes.js - VERSION CORRIGÉE SANS createdAt
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { protect, authorize } = require("../middleware/auth");
const { uploadPDF, uploadImage, uploadFiles } = require("../middleware/upload");
const path = require("path");
const fs = require("fs");
const { uploadEvent } = require("../middleware/upload");

// ==================== MIDDLEWARE ADMIN ====================
router.use(protect);
router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès réservé aux administrateurs",
    });
  }
  next();
});

const adminUserRoutes = require("./adminUserRoutes");
router.use("/users", adminUserRoutes);

// ==================== DASHBOARD STATISTIQUES ====================
router.get("/dashboard/stats", async (req, res) => {
  try {
    // Statistiques générales
    const totalBooks = db.prepare("SELECT COUNT(*) as count FROM books").get();
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
    const pendingUsers = db
      .prepare("SELECT COUNT(*) as count FROM users WHERE isVerified = 0")
      .get();

    // Statistiques des vues/téléchargements
    const totalViews = db
      .prepare("SELECT COALESCE(SUM(views), 0) as total FROM books")
      .get();
    const totalDownloads = db
      .prepare("SELECT COALESCE(SUM(downloads), 0) as total FROM books")
      .get();

    // Livres par catégorie
    const booksByCategory = db
      .prepare(
        `
      SELECT category, COUNT(*) as count 
      FROM books 
      GROUP BY category 
      ORDER BY count DESC
    `,
      )
      .all();

    // Utilisateurs récents - CORRIGÉ : sans createdAt si la colonne n'existe pas
    let recentUsers = [];
    try {
      recentUsers = db
        .prepare(
          `
        SELECT id, firstName, lastName, email, isVerified 
        FROM users 
        ORDER BY id DESC 
        LIMIT 5
      `,
        )
        .all();
    } catch (error) {
      console.warn(
        "Impossible de récupérer les utilisateurs récents:",
        error.message,
      );
      recentUsers = [];
    }

    // Livres récents - CORRIGÉ : sans createdAt si la colonne n'existe pas
    let recentBooks = [];
    try {
      recentBooks = db
        .prepare(
          `
        SELECT id, title, author, category, views 
        FROM books 
        ORDER BY id DESC 
        LIMIT 5
      `,
        )
        .all();
    } catch (error) {
      console.warn(
        "Impossible de récupérer les livres récents:",
        error.message,
      );
      recentBooks = [];
    }

    res.json({
      success: true,
      data: {
        totals: {
          books: totalBooks.count || 0,
          users: totalUsers.count || 0,
          pendingUsers: pendingUsers.count || 0,
          views: totalViews.total || 0,
          downloads: totalDownloads.total || 0,
        },
        categories: booksByCategory,
        recent: {
          users: recentUsers,
          books: recentBooks,
        },
      },
    });
  } catch (error) {
    console.error("❌ Erreur statistiques dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ==================== GESTION LIVRES ====================

// Liste des livres avec filtres
router.get("/books", async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", category = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += ` AND (title LIKE ? OR author LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += ` AND category = ?`;
      params.push(category);
    }

    const query = `
      SELECT * FROM books 
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    const books = db.prepare(query).all(...params, limit, offset);

    const countQuery = `SELECT COUNT(*) as total FROM books ${whereClause}`;
    const total = db.prepare(countQuery).get(...params).total;

    res.json({
      success: true,
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur liste livres:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des livres",
    });
  }
});

// Récupérer un livre par ID
router.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("❌ Erreur récupération livre:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du livre",
    });
  }
});

// Obtenir les catégories
router.get("/books/categories/list", async (req, res) => {
  try {
    const categories = db
      .prepare(
        `
      SELECT category, COUNT(*) as count 
      FROM books 
      GROUP BY category 
      ORDER BY category
    `,
      )
      .all();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("❌ Erreur catégories:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories",
    });
  }
});

// Ajouter un livre (avec upload de fichiers)
router.post(
  "/books",
  (req, res, next) => {
    uploadFiles(req, res, (err) => {
      if (err) {
        console.error("❌ Erreur upload:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "Erreur lors de l'upload des fichiers",
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, author, description, category, year, pages, readTime } =
        req.body;

      // Validation des champs requis
      if (!title || !author || !category) {
        if (req.files) {
          Object.values(req.files).forEach((fileArray) => {
            fileArray.forEach((file) => {
              fs.unlink(file.path, (err) => {
                if (err) console.error("Erreur nettoyage fichier:", err);
              });
            });
          });
        }

        return res.status(400).json({
          success: false,
          message: "Titre, auteur et catégorie sont requis",
        });
      }

      // Vérifier si un PDF a été uploadé
      if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
        if (req.files) {
          Object.values(req.files).forEach((fileArray) => {
            fileArray.forEach((file) => {
              fs.unlink(file.path, (err) => {
                if (err) console.error("Erreur nettoyage fichier:", err);
              });
            });
          });
        }

        return res.status(400).json({
          success: false,
          message: "Fichier PDF requis",
        });
      }

      const pdfFile = req.files.pdf[0];
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

      const fileName = pdfFile.filename;
      const thumbnailName = thumbnailFile ? thumbnailFile.filename : null;

      const stmt = db.prepare(`
        INSERT INTO books 
        (title, author, description, category, year, pages, readTime, fileName, thumbnail, views, downloads)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        title,
        author,
        description || null,
        category,
        year ? parseInt(year) : null,
        pages ? parseInt(pages) : null,
        readTime || null,
        fileName,
        thumbnailName,
        0,
        0,
      );

      const newBook = db
        .prepare("SELECT * FROM books WHERE id = ?")
        .get(result.lastInsertRowid);

      res.status(201).json({
        success: true,
        message: "Livre ajouté avec succès",
        data: newBook,
      });
    } catch (error) {
      console.error("❌ Erreur ajout livre:", error);

      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) console.error("Erreur nettoyage fichier:", err);
            });
          });
        });
      }

      res.status(500).json({
        success: false,
        message: "Erreur lors de l'ajout du livre",
      });
    }
  },
);

// Mettre à jour un livre
router.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, category, year, pages, readTime } =
      req.body;

    const stmt = db.prepare(`
      UPDATE books 
      SET 
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        year = COALESCE(?, year),
        pages = COALESCE(?, pages),
        readTime = COALESCE(?, readTime)
      WHERE id = ?
    `);

    const result = stmt.run(
      title,
      author,
      description,
      category,
      year,
      pages,
      readTime,
      id,
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    const updatedBook = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

    res.json({
      success: true,
      message: "Livre mis à jour avec succès",
      data: updatedBook,
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour livre:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du livre",
    });
  }
});

// Supprimer un livre
router.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le livre pour supprimer les fichiers
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    // Supprimer les fichiers
    if (book.fileName) {
      const pdfPath = path.join(__dirname, "../uploads/pdfs", book.fileName);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    if (book.thumbnail) {
      const thumbnailPath = path.join(
        __dirname,
        "../uploads/thumbnails",
        book.thumbnail,
      );
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Supprimer de la base de données
    db.prepare("DELETE FROM books WHERE id = ?").run(id);

    res.json({
      success: true,
      message: "Livre supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur suppression livre:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du livre",
    });
  }
});

// Supprimer plusieurs livres en masse
router.post("/books/bulk-delete", async (req, res) => {
  try {
    const { bookIds } = req.body;

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Liste de livres invalide",
      });
    }

    // Récupérer les livres pour supprimer les fichiers
    const placeholders = bookIds.map(() => "?").join(",");
    const books = db
      .prepare(`SELECT * FROM books WHERE id IN (${placeholders})`)
      .all(...bookIds);

    // Supprimer les fichiers
    books.forEach((book) => {
      if (book.fileName) {
        const pdfPath = path.join(__dirname, "../uploads/pdfs", book.fileName);
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
      }
      if (book.thumbnail) {
        const thumbnailPath = path.join(
          __dirname,
          "../uploads/thumbnails",
          book.thumbnail,
        );
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
    });

    // Supprimer de la base de données
    const stmt = db.prepare(`DELETE FROM books WHERE id IN (${placeholders})`);
    const result = stmt.run(...bookIds);

    res.json({
      success: true,
      message: `${result.changes} livre(s) supprimé(s)`,
      count: result.changes,
    });
  } catch (error) {
    console.error("❌ Erreur suppression en masse:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression en masse",
    });
  }
});

// ==================== GESTION ÉVÉNEMENTS (ADMIN) ====================

// Liste des événements (admin)
router.get("/events", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      type = "",
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += ` AND (title LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ` AND status = ?`;
      params.push(status);
    }

    if (type) {
      whereClause += ` AND type = ?`;
      params.push(type);
    }

    const query = `
      SELECT * FROM events 
      ${whereClause}
      ORDER BY date DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;

    const events = db.prepare(query).all(...params, limit, offset);

    // Compter total
    const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`;
    const total = db.prepare(countQuery).get(...params).total;

    // Récupérer les types pour les filtres
    const types = db
      .prepare(
        `
      SELECT DISTINCT type FROM events WHERE type IS NOT NULL ORDER BY type
    `,
      )
      .all();

    res.json({
      success: true,
      data: events,
      filters: {
        types: types.map((t) => t.type),
        status: ["upcoming", "past", "cancelled"],
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur admin events list:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements",
    });
  }
});

// Récupérer un événement (admin)
router.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const event = db
      .prepare(
        `
      SELECT e.*, 
             u.firstName as creator_firstName,
             u.lastName as creator_lastName,
             u.email as creator_email
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `,
      )
      .get(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("❌ Erreur admin get event:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'événement",
    });
  }
});

// Créer un événement (admin) - Utilise le contrôleur existant
router.post("/events", uploadEvent, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      created_by: req.user.id,
      image: req.file ? req.file.filename : null,
    };

    // Validation
    if (!eventData.title || !eventData.date || !eventData.location) {
      if (req.file) {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Titre, date et lieu sont requis",
      });
    }

    const sql = `
      INSERT INTO events (
        title, description, type, category, date, time,
        location, image, status, featured, registration_open,
        max_attendees, price, organizer, speaker, contact_email,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      eventData.title,
      eventData.description || null,
      eventData.type || "conference",
      eventData.category || null,
      eventData.date,
      eventData.time || null,
      eventData.location,
      eventData.image || null,
      eventData.status || "upcoming",
      eventData.featured ? 1 : 0,
      eventData.registration_open !== false ? 1 : 0,
      eventData.max_attendees || null,
      eventData.price || null,
      eventData.organizer || "ASM",
      eventData.speaker || null,
      eventData.contact_email || null,
      eventData.created_by,
    ];

    const result = db.prepare(sql).run(...params);
    const newEvent = db
      .prepare("SELECT * FROM events WHERE id = ?")
      .get(result.lastInsertRowid);

    // Ajouter l'URL de l'image
    if (newEvent.image) {
      newEvent.imageUrl = `/uploads/events/${newEvent.image}`;
    }

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      data: newEvent,
    });
  } catch (error) {
    console.error("❌ Erreur admin create event:", error);

    if (req.file) {
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'événement",
    });
  }
});

// Mettre à jour un événement (admin)
router.put("/events/:id", uploadEvent, async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer l'événement existant
    const existingEvent = db
      .prepare("SELECT * FROM events WHERE id = ?")
      .get(id);

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    const updateData = { ...req.body };

    // Gérer la nouvelle image
    if (req.file) {
      updateData.image = req.file.filename;

      // Supprimer l'ancienne image
      if (existingEvent.image) {
        const fs = require("fs");
        const path = require("path");
        const oldImagePath = path.join(
          __dirname,
          "../uploads/events",
          existingEvent.image,
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Construire la requête UPDATE
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && key !== "id") {
        fields.push(`${key} = ?`);

        // Gérer les booléens
        if (typeof value === "boolean") {
          params.push(value ? 1 : 0);
        } else {
          params.push(value);
        }
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucune donnée à mettre à jour",
      });
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    const sql = `UPDATE events SET ${fields.join(", ")} WHERE id = ?`;

    db.prepare(sql).run(...params);

    const updatedEvent = db
      .prepare("SELECT * FROM events WHERE id = ?")
      .get(id);

    if (updatedEvent.image) {
      updatedEvent.imageUrl = `/uploads/events/${updatedEvent.image}`;
    }

    res.json({
      success: true,
      message: "Événement mis à jour avec succès",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("❌ Erreur admin update event:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'événement",
    });
  }
});

// Supprimer un événement (admin)
router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer l'événement
    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    // Supprimer l'image associée
    if (event.image) {
      const fs = require("fs");
      const path = require("path");
      const imagePath = path.join(__dirname, "../uploads/events", event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Supprimer l'événement
    db.prepare("DELETE FROM events WHERE id = ?").run(id);

    res.json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur admin delete event:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'événement",
    });
  }
});

// Supprimer plusieurs événements en masse
router.post("/events/bulk-delete", async (req, res) => {
  try {
    const { eventIds } = req.body;

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Liste d'événements invalide",
      });
    }

    // Récupérer les événements pour supprimer les images
    const placeholders = eventIds.map(() => "?").join(",");
    const events = db
      .prepare(`SELECT * FROM events WHERE id IN (${placeholders})`)
      .all(...eventIds);

    // Supprimer les images
    events.forEach((event) => {
      if (event.image) {
        const fs = require("fs");
        const path = require("path");
        const imagePath = path.join(
          __dirname,
          "../uploads/events",
          event.image,
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    // Supprimer de la base de données
    const stmt = db.prepare(`DELETE FROM events WHERE id IN (${placeholders})`);
    const result = stmt.run(...eventIds);

    res.json({
      success: true,
      message: `${result.changes} événement(s) supprimé(s)`,
      count: result.changes,
    });
  } catch (error) {
    console.error("❌ Erreur suppression en masse événements:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression en masse",
    });
  }
});

// Récupérer les statistiques événements
router.get("/events/stats", async (req, res) => {
  try {
    const totalEvents = db
      .prepare("SELECT COUNT(*) as count FROM events")
      .get();
    const upcomingEvents = db
      .prepare(
        "SELECT COUNT(*) as count FROM events WHERE date >= date('now') AND status = 'upcoming'",
      )
      .get();
    const pastEvents = db
      .prepare(
        "SELECT COUNT(*) as count FROM events WHERE date < date('now') OR status = 'past'",
      )
      .get();
    const featuredEvents = db
      .prepare("SELECT COUNT(*) as count FROM events WHERE featured = 1")
      .get();

    // Événements par type
    const eventsByType = db
      .prepare(
        `
        SELECT type, COUNT(*) as count 
        FROM events 
        GROUP BY type 
        ORDER BY count DESC
      `,
      )
      .all();

    // Événements par mois (pour graphique)
    const eventsByMonth = db
      .prepare(
        `
        SELECT strftime('%Y-%m', date) as month, COUNT(*) as count
        FROM events
        WHERE date >= date('now', '-6 months')
        GROUP BY month
        ORDER BY month
      `,
      )
      .all();

    res.json({
      success: true,
      data: {
        totals: {
          events: totalEvents.count || 0,
          upcoming: upcomingEvents.count || 0,
          past: pastEvents.count || 0,
          featured: featuredEvents.count || 0,
        },
        byType: eventsByType,
        byMonth: eventsByMonth,
      },
    });
  } catch (error) {
    console.error("❌ Erreur stats événements:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
});

// ==================== PROFIL ADMIN ====================

// Récupérer profil admin
router.get("/profile", async (req, res) => {
  try {
    const user = db
      .prepare(
        `
      SELECT 
        id, firstName, lastName, email, role, 
        graduationYear, specialization
      FROM users 
      WHERE id = ?
    `,
      )
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Erreur récupération profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
    });
  }
});

// Mettre à jour profil admin
router.put("/profile", async (req, res) => {
  try {
    const { firstName, lastName, graduationYear, specialization } = req.body;

    const stmt = db.prepare(`
      UPDATE users 
      SET 
        firstName = COALESCE(?, firstName),
        lastName = COALESCE(?, lastName),
        graduationYear = COALESCE(?, graduationYear),
        specialization = COALESCE(?, specialization)
      WHERE id = ?
    `);

    stmt.run(firstName, lastName, graduationYear, specialization, req.user.id);

    const updatedUser = db
      .prepare(
        `
      SELECT id, firstName, lastName, email, role, 
             graduationYear, specialization
      FROM users WHERE id = ?
    `,
      )
      .get(req.user.id);

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil",
    });
  }
});

// ==================== PARAMÈTRES ====================

// Récupérer les paramètres
router.get("/settings", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        siteName: "ASM Alumni",
        siteDescription: "Bibliothèque numérique des anciens",
        maxFileSize: "10MB",
        allowedFileTypes: ["pdf", "jpg", "png", "jpeg"],
        requireVerification: true,
        maintenanceMode: false,
        contactEmail: "contact@asm-alumni.com",
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération paramètres:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des paramètres",
    });
  }
});

// ==================== UPLOAD DE FICHIERS ====================

// Upload séparé de fichiers
router.post("/upload", uploadPDF.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier uploadé",
      });
    }

    res.json({
      success: true,
      message: "Fichier uploadé avec succès",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: `/uploads/pdfs/${req.file.filename}`,
        url: `${req.protocol}://${req.get("host")}/uploads/pdfs/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur upload:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload",
    });
  }
});

// Upload de justificatif
router.post("/upload/proof", async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier uploadé",
      });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Type de fichier non autorisé. Utilisez PNG, JPG ou PDF",
      });
    }

    res.json({
      success: true,
      message: "Fichier uploadé avec succès",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: `/uploads/proofs/${req.file.filename}`,
        url: `${req.protocol}://${req.get("host")}/uploads/proofs/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur upload justificatif:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload du fichier",
    });
  }
});

// Lister les fichiers uploadés
router.get("/uploads/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const dir = type === "pdf" ? "pdfs" : "thumbnails";
    const dirPath = path.join(__dirname, `../uploads/${dir}`);

    if (!fs.existsSync(dirPath)) {
      return res.json({
        success: true,
        count: 0,
        files: [],
      });
    }

    const files = fs.readdirSync(dirPath);
    const fileList = files.map((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        url: `${req.protocol}://${req.get("host")}/uploads/${dir}/${file}`,
      };
    });

    res.json({
      success: true,
      count: fileList.length,
      files: fileList,
    });
  } catch (error) {
    console.error("❌ Erreur liste fichiers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la liste des fichiers",
    });
  }
});

// ==================== FONCTIONS UTILITAIRES ====================

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ==================== VÉRIFICATION DES COMPTES - VERSION CORRIGÉE ====================

// GET - Liste des utilisateurs en attente de vérification
router.get("/verifications", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // Construire la requête WHERE
    let whereClause = "WHERE isVerified = 0 AND role = 'user'";
    const params = [];

    if (search) {
      whereClause += ` AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Requête pour récupérer les utilisateurs en attente
    const usersQuery = `
      SELECT 
        id, firstName, lastName, email, role, isVerified,
        graduationYear, specialization, createdAt,
        proof_filename, proof_status, proof_uploaded_at,
        CASE WHEN proof_filename IS NOT NULL THEN 1 ELSE 0 END as hasProof
      FROM users ${whereClause}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `;

    const users = db.prepare(usersQuery).all(...params, limit, offset);

    // Compter le total
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const total = db.prepare(countQuery).get(...params).total;

    // Statistiques
    const today = new Date().toISOString().split("T")[0];

    const statsQueries = {
      totalPending: db
        .prepare(
          "SELECT COUNT(*) as count FROM users WHERE isVerified = 0 AND role = 'user'",
        )
        .get().count,

      today: db
        .prepare(
          `
        SELECT COUNT(*) as count FROM users 
        WHERE isVerified = 0 AND DATE(createdAt) = ?
      `,
        )
        .get(today).count,

      lastWeek: db
        .prepare(
          `
        SELECT COUNT(*) as count FROM users 
        WHERE isVerified = 0 AND createdAt >= datetime('now', '-7 days')
      `,
        )
        .get().count,
    };

    res.json({
      success: true,
      data: users,
      stats: statsQueries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération vérifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des vérifications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST - Vérifier un utilisateur
router.post("/verifications/verify/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Vérifier si l'utilisateur existe et est en attente
    const user = db
      .prepare(
        "SELECT id, firstName, lastName, email, isVerified FROM users WHERE id = ?",
      )
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (user.isVerified === 1) {
      return res.status(400).json({
        success: false,
        message: "Cet utilisateur est déjà vérifié",
      });
    }

    // Mettre à jour le statut de vérification
    const stmt = db.prepare(`
      UPDATE users 
      SET isVerified = 1, 
          verifiedAt = datetime('now'),
          verifiedBy = ?,
          proof_status = 'approved'
      WHERE id = ?
    `);

    const result = stmt.run(req.user.id, userId);

    if (result.changes === 0) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification",
      });
    }

    // Récupérer l'utilisateur mis à jour
    const updatedUser = db
      .prepare(
        `
        SELECT id, firstName, lastName, email, isVerified, proof_status
        FROM users WHERE id = ?
      `,
      )
      .get(userId);

    // TODO: Envoyer un email de confirmation à l'utilisateur
    console.log(`✅ Utilisateur vérifié: ${updatedUser.email}`);

    res.json({
      success: true,
      message: `Utilisateur ${updatedUser.firstName} ${updatedUser.lastName} vérifié avec succès`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Erreur vérification utilisateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST - Rejeter un utilisateur
router.post("/verifications/reject/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "La raison du rejet est requise",
      });
    }

    // Vérifier si l'utilisateur existe
    const user = db
      .prepare("SELECT id, firstName, lastName, email FROM users WHERE id = ?")
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour le statut
    const stmt = db.prepare(`
      UPDATE users 
      SET isVerified = 0,
          rejectedAt = datetime('now'),
          rejectedBy = ?,
          proof_status = 'rejected',
          proof_rejection_reason = ?
      WHERE id = ?
    `);

    const result = stmt.run(req.user.id, reason.trim(), userId);

    if (result.changes === 0) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors du rejet",
      });
    }

    // TODO: Envoyer un email de rejet à l'utilisateur avec la raison
    console.log(`❌ Utilisateur rejeté: ${user.email} - Raison: ${reason}`);

    res.json({
      success: true,
      message: "Utilisateur rejeté avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur rejet utilisateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du rejet",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST - Vérification en masse
router.post("/verifications/bulk-verify", async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Liste d'utilisateurs invalide",
      });
    }

    const placeholders = userIds.map(() => "?").join(",");
    const stmt = db.prepare(`
      UPDATE users 
      SET isVerified = 1, 
          verifiedAt = datetime('now'),
          verifiedBy = ?,
          proof_status = 'approved'
      WHERE id IN (${placeholders}) AND isVerified = 0
    `);

    const result = stmt.run(req.user.id, ...userIds);

    res.json({
      success: true,
      message: `${result.changes} utilisateur(s) vérifié(s)`,
      count: result.changes,
    });
  } catch (error) {
    console.error("❌ Erreur vérification en masse:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification en masse",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET - Statistiques de vérification
router.get("/verifications/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const stats = {
      pending:
        db
          .prepare(
            "SELECT COUNT(*) as count FROM users WHERE isVerified = 0 AND role = 'user'",
          )
          .get().count || 0,

      verified:
        db
          .prepare("SELECT COUNT(*) as count FROM users WHERE isVerified = 1")
          .get().count || 0,

      today:
        db
          .prepare(
            `
          SELECT COUNT(*) as count FROM users 
          WHERE isVerified = 0 AND DATE(createdAt) = ?
        `,
          )
          .get(today).count || 0,

      lastWeek:
        db
          .prepare(
            `
          SELECT COUNT(*) as count FROM users 
          WHERE isVerified = 0 AND createdAt >= datetime('now', '-7 days')
        `,
          )
          .get().count || 0,

      bySpecialization: db
        .prepare(
          `
          SELECT specialization, COUNT(*) as count 
          FROM users 
          WHERE isVerified = 0 AND specialization IS NOT NULL
          GROUP BY specialization 
          ORDER BY count DESC
        `,
        )
        .all(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Erreur stats vérifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
