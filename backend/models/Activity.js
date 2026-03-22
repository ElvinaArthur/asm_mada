// models/Activity.js - Activité récente des utilisateurs
const db = require("../config/database");

class Activity {
  // Créer une activité
  static create(userId, type, description, metadata = {}) {
    try {
      const stmt = db.prepare(`
        INSERT INTO activities (userId, type, description, metadata, createdAt)
        VALUES (?, ?, ?, ?, datetime('now'))
      `);

      const result = stmt.run(
        userId,
        type,
        description,
        JSON.stringify(metadata),
      );

      return result.lastInsertRowid;
    } catch (error) {
      console.error("❌ Erreur Activity.create:", error);
      return null;
    }
  }

  // Récupérer l'activité récente d'un utilisateur
  static findByUser(userId, limit = 10) {
    try {
      const stmt = db.prepare(`
        SELECT * FROM activities
        WHERE userId = ?
        ORDER BY createdAt DESC
        LIMIT ?
      `);

      const activities = stmt.all(userId, limit);

      // Parser le metadata JSON
      return activities.map((act) => ({
        ...act,
        metadata: JSON.parse(act.metadata || "{}"),
      }));
    } catch (error) {
      console.error("❌ Erreur Activity.findByUser:", error);
      return [];
    }
  }

  // Récupérer l'activité récente de tous les utilisateurs (pour admin)
  static getRecentGlobal(limit = 20) {
    try {
      const stmt = db.prepare(`
        SELECT a.*, u.firstName, u.lastName, u.email
        FROM activities a
        JOIN users u ON a.userId = u.id
        ORDER BY a.createdAt DESC
        LIMIT ?
      `);

      const activities = stmt.all(limit);

      return activities.map((act) => ({
        ...act,
        metadata: JSON.parse(act.metadata || "{}"),
      }));
    } catch (error) {
      console.error("❌ Erreur Activity.getRecentGlobal:", error);
      return [];
    }
  }

  // Méthodes helper pour créer des activités spécifiques
  static async bookRead(userId, bookTitle, bookId) {
    return this.create(userId, "book_read", `A lu le livre "${bookTitle}"`, {
      bookId,
      bookTitle,
    });
  }

  static async bookAdded(userId, bookTitle, bookId) {
    return this.create(
      userId,
      "book_added",
      `A ajouté "${bookTitle}" à sa bibliothèque`,
      { bookId, bookTitle },
    );
  }

  static async eventRegistered(userId, eventTitle, eventId) {
    return this.create(
      userId,
      "event_registered",
      `S'est inscrit à l'événement "${eventTitle}"`,
      { eventId, eventTitle },
    );
  }

  static async profileUpdated(userId) {
    return this.create(
      userId,
      "profile_updated",
      "A mis à jour son profil",
      {},
    );
  }

  static async login(userId) {
    return this.create(userId, "login", "S'est connecté", {});
  }
}

module.exports = Activity;
