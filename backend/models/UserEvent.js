// models/UserEvent.js - Inscriptions aux événements
const db = require("../config/database");

class UserEvent {
  // Récupérer tous les événements d'un utilisateur
  static findByUser(userId, upcoming = true) {
    try {
      let sql = `
        SELECT ue.*, e.title, e.description, e.date, e.time, e.location,
               e.type, e.image, e.max_attendees
        FROM user_events ue
        JOIN events e ON ue.eventId = e.id
        WHERE ue.userId = ?
      `;

      if (upcoming) {
        sql += ` AND e.date >= date('now') AND ue.status = 'registered'`;
      } else {
        sql += ` AND (e.date < date('now') OR ue.status = 'attended')`;
      }

      sql += ` ORDER BY e.date ASC`;

      const stmt = db.prepare(sql);
      return stmt.all(userId);
    } catch (error) {
      console.error("❌ Erreur UserEvent.findByUser:", error);
      return [];
    }
  }

  // Récupérer les statistiques des événements
  static getStats(userId) {
    try {
      const stmt = db.prepare(`
        SELECT 
          COUNT(CASE WHEN e.date >= date('now') AND ue.status = 'registered' THEN 1 END) as upcoming,
          COUNT(CASE WHEN e.date < date('now') AND ue.status = 'attended' THEN 1 END) as attended,
          COUNT(CASE WHEN ue.status = 'registered' THEN 1 END) as total
        FROM user_events ue
        JOIN events e ON ue.eventId = e.id
        WHERE ue.userId = ?
      `);

      return stmt.get(userId);
    } catch (error) {
      console.error("❌ Erreur UserEvent.getStats:", error);
      return { upcoming: 0, attended: 0, total: 0 };
    }
  }

  // S'inscrire à un événement
  static register(userId, eventId) {
    try {
      // Vérifier si déjà inscrit
      const existing = db
        .prepare("SELECT id FROM user_events WHERE userId = ? AND eventId = ?")
        .get(userId, eventId);

      if (existing) {
        // Mettre à jour le statut
        const stmt = db.prepare(`
          UPDATE user_events 
          SET status = 'registered', updatedAt = datetime('now')
          WHERE userId = ? AND eventId = ?
        `);
        return stmt.run(userId, eventId).changes > 0;
      }

      // Nouvelle inscription
      const stmt = db.prepare(`
        INSERT INTO user_events (userId, eventId, status, registeredAt, updatedAt)
        VALUES (?, ?, 'registered', datetime('now'), datetime('now'))
      `);

      const result = stmt.run(userId, eventId);

      // Incrémenter le compteur de participants
      db.prepare(
        `
        UPDATE events 
        SET currentParticipants = currentParticipants + 1 
        WHERE id = ?
      `,
      ).run(eventId);

      return result.lastInsertRowid;
    } catch (error) {
      console.error("❌ Erreur UserEvent.register:", error);
      throw error;
    }
  }

  // Se désinscrire
  static unregister(userId, eventId) {
    try {
      const stmt = db.prepare(`
        UPDATE user_events 
        SET status = 'cancelled', updatedAt = datetime('now')
        WHERE userId = ? AND eventId = ?
      `);

      const result = stmt.run(userId, eventId);

      if (result.changes > 0) {
        // Décrémenter le compteur
        db.prepare(
          `
          UPDATE events 
          SET currentParticipants = currentParticipants - 1 
          WHERE id = ?
        `,
        ).run(eventId);
      }

      return result.changes > 0;
    } catch (error) {
      console.error("❌ Erreur UserEvent.unregister:", error);
      return false;
    }
  }

  // Marquer comme présent
  static markAttended(userId, eventId) {
    try {
      const stmt = db.prepare(`
        UPDATE user_events 
        SET status = 'attended', updatedAt = datetime('now')
        WHERE userId = ? AND eventId = ?
      `);

      return stmt.run(userId, eventId).changes > 0;
    } catch (error) {
      console.error("❌ Erreur UserEvent.markAttended:", error);
      return false;
    }
  }

  // Vérifier si l'utilisateur est inscrit
  static isRegistered(userId, eventId) {
    try {
      const stmt = db.prepare(
        "SELECT status FROM user_events WHERE userId = ? AND eventId = ?",
      );
      const result = stmt.get(userId, eventId);
      return result && result.status === "registered";
    } catch (error) {
      console.error("❌ Erreur UserEvent.isRegistered:", error);
      return false;
    }
  }
}

module.exports = UserEvent;
