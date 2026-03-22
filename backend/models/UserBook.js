// models/UserBook.js - Bibliothèque personnelle de l'utilisateur
const db = require("../config/database");

class UserBook {
  // Récupérer tous les livres d'un utilisateur
  static findByUser(userId, status = null) {
    try {
      let sql = `
        SELECT ub.*, b.title, b.author, b.category, b.thumbnail, b.pages,
               b.description, b.year
        FROM user_books ub
        JOIN books b ON ub.bookId = b.id
        WHERE ub.userId = ?
      `;
      const params = [userId];

      if (status) {
        sql += ` AND ub.status = ?`;
        params.push(status);
      }

      sql += ` ORDER BY ub.updatedAt DESC`;

      const stmt = db.prepare(sql);
      return stmt.all(...params);
    } catch (error) {
      console.error("❌ Erreur UserBook.findByUser:", error);
      return [];
    }
  }

  // Récupérer les statistiques de lecture
  static getStats(userId) {
    try {
      const stmt = db.prepare(`
        SELECT 
          COUNT(CASE WHEN status = 'read' THEN 1 END) as booksRead,
          COUNT(CASE WHEN status = 'reading' THEN 1 END) as booksReading,
          COUNT(CASE WHEN status = 'to-read' THEN 1 END) as booksToRead,
          COUNT(CASE WHEN isFavorite = 1 THEN 1 END) as favorites
        FROM user_books
        WHERE userId = ?
      `);

      return stmt.get(userId);
    } catch (error) {
      console.error("❌ Erreur UserBook.getStats:", error);
      return {
        booksRead: 0,
        booksReading: 0,
        booksToRead: 0,
        favorites: 0,
      };
    }
  }

  // Ajouter un livre à la bibliothèque de l'utilisateur
  static add(userId, bookId, status = "to-read") {
    try {
      // Vérifier si le livre existe déjà
      const existing = db
        .prepare("SELECT id FROM user_books WHERE userId = ? AND bookId = ?")
        .get(userId, bookId);

      if (existing) {
        // Mettre à jour le statut
        return this.updateStatus(userId, bookId, status);
      }

      // Ajouter nouveau
      const stmt = db.prepare(`
        INSERT INTO user_books (userId, bookId, status, addedAt, updatedAt)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `);

      const result = stmt.run(userId, bookId, status);
      return result.lastInsertRowid;
    } catch (error) {
      console.error("❌ Erreur UserBook.add:", error);
      throw error;
    }
  }

  // Mettre à jour le statut d'un livre
  static updateStatus(userId, bookId, status, currentPage = null) {
    try {
      let sql = `
        UPDATE user_books 
        SET status = ?, updatedAt = datetime('now')
      `;
      const params = [status];

      if (status === "read") {
        sql += `, dateRead = datetime('now')`;
      }

      if (currentPage !== null) {
        sql += `, currentPage = ?`;
        params.push(currentPage);
      }

      sql += ` WHERE userId = ? AND bookId = ?`;
      params.push(userId, bookId);

      const stmt = db.prepare(sql);
      return stmt.run(...params).changes > 0;
    } catch (error) {
      console.error("❌ Erreur UserBook.updateStatus:", error);
      return false;
    }
  }

  // Marquer comme favori
  static toggleFavorite(userId, bookId) {
    try {
      const current = db
        .prepare(
          "SELECT isFavorite FROM user_books WHERE userId = ? AND bookId = ?",
        )
        .get(userId, bookId);

      if (!current) return false;

      const newValue = current.isFavorite ? 0 : 1;
      const stmt = db.prepare(`
        UPDATE user_books 
        SET isFavorite = ?, updatedAt = datetime('now')
        WHERE userId = ? AND bookId = ?
      `);

      return stmt.run(newValue, userId, bookId).changes > 0;
    } catch (error) {
      console.error("❌ Erreur UserBook.toggleFavorite:", error);
      return false;
    }
  }

  // Supprimer un livre de la bibliothèque
  static remove(userId, bookId) {
    try {
      const stmt = db.prepare(
        "DELETE FROM user_books WHERE userId = ? AND bookId = ?",
      );
      return stmt.run(userId, bookId).changes > 0;
    } catch (error) {
      console.error("❌ Erreur UserBook.remove:", error);
      return false;
    }
  }

  // Récupérer les livres récemment ajoutés
  static getRecent(userId, limit = 5) {
    try {
      const stmt = db.prepare(`
        SELECT ub.*, b.title, b.author, b.thumbnail
        FROM user_books ub
        JOIN books b ON ub.bookId = b.id
        WHERE ub.userId = ?
        ORDER BY ub.updatedAt DESC
        LIMIT ?
      `);

      return stmt.all(userId, limit);
    } catch (error) {
      console.error("❌ Erreur UserBook.getRecent:", error);
      return [];
    }
  }
}

module.exports = UserBook;
