// models/Book.js - CORRIGÉ
const db = require("../config/database");

class Book {
  // Récupérer tous les livres avec pagination et filtres
  static findAll(options = {}) {
    const { category, search, page = 1, limit = 12 } = options;
    const offset = (page - 1) * limit;

    let where = "";
    const params = [];

    if (category && category !== "all" && category !== "tous") {
      where = "WHERE category = ?";
      params.push(category);
    }

    if (search) {
      where = where ? where + " AND " : "WHERE ";
      where += "(title LIKE ? OR author LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Compter le total
    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM books ${where}`,
    );
    const total = countStmt.get(...params).total;

    // CORRIGÉ : utiliser created_at au lieu de createdAt
    const query = `SELECT * FROM books ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const books = db.prepare(query).all(...params, limit, offset);

    // Ajouter URLs
    const booksWithUrls = books.map((book) => ({
      ...book,
      pdfUrl: `/api/books/${book.id}/file`,
      thumbnailUrl: `/api/books/${book.id}/thumbnail`,
    }));

    return {
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: booksWithUrls,
    };
  }

  // Trouver par ID
  static findById(id) {
    try {
      const stmt = db.prepare("SELECT * FROM books WHERE id = ?");
      const book = stmt.get(id);

      if (!book) return null;

      // Incrémenter les vues
      db.prepare("UPDATE books SET views = views + 1 WHERE id = ?").run(id);

      return {
        ...book,
        pdfUrl: `/api/books/${book.id}/file`,
        thumbnailUrl: `/api/books/${book.id}/thumbnail`,
      };
    } catch (error) {
      console.error("Erreur findById:", error);
      return null;
    }
  }

  // Récupérer toutes les catégories
  static getCategories() {
    try {
      const stmt = db.prepare(
        "SELECT DISTINCT category as name, COUNT(*) as count FROM books GROUP BY category ORDER BY category",
      );
      return stmt.all();
    } catch (error) {
      console.error("Erreur getCategories:", error);
      return [];
    }
  }

  // Incrémenter les téléchargements
  static incrementDownloads(id) {
    try {
      db.prepare("UPDATE books SET downloads = downloads + 1 WHERE id = ?").run(
        id,
      );
      return true;
    } catch (error) {
      console.error("Erreur incrementDownloads:", error);
      return false;
    }
  }

  // Récupérer les livres populaires
  static getPopularBooks(limit = 6) {
    try {
      const stmt = db.prepare(
        "SELECT * FROM books ORDER BY views DESC, downloads DESC LIMIT ?",
      );
      const books = stmt.all(limit);

      return books.map((book) => ({
        ...book,
        pdfUrl: `/api/books/${book.id}/file`,
        thumbnailUrl: `/api/books/${book.id}/thumbnail`,
      }));
    } catch (error) {
      console.error("Erreur getPopularBooks:", error);
      return [];
    }
  }

  // Créer un nouveau livre (pour admin)
  static create(bookData) {
    try {
      const stmt = db.prepare(`
        INSERT INTO books 
        (title, author, description, category, year, pages, readTime, fileName, thumbnail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        bookData.title,
        bookData.author,
        bookData.description,
        bookData.category,
        bookData.year,
        bookData.pages,
        bookData.readTime,
        bookData.fileName,
        bookData.thumbnail,
      );

      return this.findById(result.lastInsertRowid);
    } catch (error) {
      console.error("Erreur create:", error);
      throw error;
    }
  }

  // Mettre à jour un livre (pour admin)
  static update(id, bookData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(bookData).forEach((key) => {
        if (bookData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(bookData[key]);
        }
      });

      if (fields.length === 0) return null;

      values.push(id);
      // CORRIGÉ : utiliser updated_at au lieu de updatedAt
      const stmt = db.prepare(
        `UPDATE books SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      );
      stmt.run(...values);

      return this.findById(id);
    } catch (error) {
      console.error("Erreur update:", error);
      throw error;
    }
  }

  // Supprimer un livre (pour admin)
  static delete(id) {
    try {
      const stmt = db.prepare("DELETE FROM books WHERE id = ?");
      return stmt.run(id);
    } catch (error) {
      console.error("Erreur delete:", error);
      throw error;
    }
  }

  // models/Book.js - ajoutez cette méthode
  static incrementViews(id) {
    try {
      db.prepare("UPDATE books SET views = views + 1 WHERE id = ?").run(id);
      return true;
    } catch (error) {
      console.error("Erreur incrementViews:", error);
      return false;
    }
  }

  // Gardez incrementDownloads pour les statistiques si nécessaire
  static incrementDownloads(id) {
    try {
      // Gardez cette méthode pour les stats, mais elle ne sera pas appelée
      db.prepare("UPDATE books SET downloads = downloads + 1 WHERE id = ?").run(
        id,
      );
      return true;
    } catch (error) {
      console.error("Erreur incrementDownloads:", error);
      return false;
    }
  }
}

module.exports = Book;
