// models/Event.js - VERSION BETTER-SQLITE3
const db = require("../config/database");

class Event {
  // Créer un événement
  static create(eventData) {
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

    try {
      const result = db.prepare(sql).run(...params);
      return result.lastInsertRowid;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer tous les événements
  static findAll(filters = {}) {
    let sql = `SELECT * FROM events WHERE 1=1`;
    const params = [];

    if (filters.status) {
      sql += ` AND status = ?`;
      params.push(filters.status);
    }

    if (filters.type) {
      sql += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters.upcoming === "true") {
      sql += ` AND date >= date('now') AND status = 'upcoming'`;
    }

    if (filters.past === "true") {
      sql += ` AND (date < date('now') OR status = 'past')`;
    }

    if (filters.featured === "true") {
      sql += ` AND featured = 1`;
    }

    if (filters.search) {
      sql += ` AND (title LIKE ? OR description LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ` ORDER BY date ${filters.sort === "asc" ? "ASC" : "DESC"}`;

    if (filters.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(filters.limit));
    }

    try {
      const stmt = db.prepare(sql);
      const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer par ID
  static findById(id) {
    try {
      const stmt = db.prepare("SELECT * FROM events WHERE id = ?");
      return stmt.get(id);
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour
  static update(id, data) {
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
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
      return false;
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    const sql = `UPDATE events SET ${fields.join(", ")} WHERE id = ?`;

    try {
      const stmt = db.prepare(sql);
      const result = stmt.run(...params);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  }

  // Supprimer
  static delete(id) {
    try {
      const stmt = db.prepare("DELETE FROM events WHERE id = ?");
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  }

  // Compter
  static count(filters = {}) {
    let sql = `SELECT COUNT(*) as count FROM events WHERE 1=1`;
    const params = [];

    if (filters.status) {
      sql += ` AND status = ?`;
      params.push(filters.status);
    }

    try {
      const stmt = db.prepare(sql);
      const result = params.length > 0 ? stmt.get(...params) : stmt.get();
      return result.count;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les types disponibles
  static getTypes() {
    try {
      const stmt = db.prepare(`
        SELECT DISTINCT type 
        FROM events 
        WHERE type IS NOT NULL 
        ORDER BY type
      `);
      const rows = stmt.all();
      return rows.map((r) => r.type);
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les événements pour un mois donné (pour calendrier)
  static getEventsForCalendar(year, month) {
    try {
      const stmt = db.prepare(`
        SELECT id, title, type, date, time, location
        FROM events
        WHERE strftime('%Y-%m', date) = ?
        ORDER BY date
      `);
      const monthStr = `${year}-${month.toString().padStart(2, "0")}`;
      return stmt.all(monthStr);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;
