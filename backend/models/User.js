// models/User.js — ✅ CORRECTIF : findById inclut photoUrl

const db = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  static findByEmail(email) {
    try {
      return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    } catch (error) {
      console.error("Erreur findByEmail:", error);
      return null;
    }
  }

  static async create(userData) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        graduationYear,
        specialization,
      } = userData;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = db
        .prepare(
          `
        INSERT INTO users 
        (email, password, firstName, lastName, graduationYear, specialization, role, isVerified)
        VALUES (?, ?, ?, ?, ?, ?, 'user', 0)
      `,
        )
        .run(
          email,
          hashedPassword,
          firstName,
          lastName,
          graduationYear || null,
          specialization || null,
        );

      return this.findById(result.lastInsertRowid);
    } catch (error) {
      console.error("Erreur create user:", error);
      throw error;
    }
  }

  // ✅ CORRECTIF : photoUrl ajouté dans le SELECT
  static findById(id) {
    try {
      return db
        .prepare(
          `
        SELECT 
          id, firstName, lastName, email, role,
          isVerified, isActive,
          graduationYear, specialization,
          photoUrl,
          createdAt
        FROM users WHERE id = ?
      `,
        )
        .get(id);
    } catch (error) {
      console.error("Erreur findById:", error);
      return null;
    }
  }

  static async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error("Erreur comparePassword:", error);
      return false;
    }
  }

  static update(id, updateData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) return null;

      fields.push("updatedAt = datetime('now')");
      values.push(id);

      db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(
        ...values,
      );
      return this.findById(id);
    } catch (error) {
      console.error("Erreur update user:", error);
      return null;
    }
  }

  static async updatePassword(id, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const result = db
        .prepare(
          "UPDATE users SET password = ?, updatedAt = datetime('now') WHERE id = ?",
        )
        .run(hashedPassword, id);
      return result.changes > 0;
    } catch (error) {
      console.error("Erreur updatePassword:", error);
      return false;
    }
  }

  static getFavorites(userId) {
    try {
      return db
        .prepare(
          `
        SELECT b.* FROM favorites f
        JOIN books b ON f.bookId = b.id
        WHERE f.userId = ?
        ORDER BY f.createdAt DESC
      `,
        )
        .all(userId);
    } catch (error) {
      console.error("Erreur getFavorites:", error);
      return [];
    }
  }

  static addFavorite(userId, bookId) {
    try {
      return db
        .prepare(
          "INSERT OR IGNORE INTO favorites (userId, bookId) VALUES (?, ?)",
        )
        .run(userId, bookId);
    } catch (error) {
      console.error("Erreur addFavorite:", error);
      return { changes: 0 };
    }
  }

  static removeFavorite(userId, bookId) {
    try {
      return db
        .prepare("DELETE FROM favorites WHERE userId = ? AND bookId = ?")
        .run(userId, bookId);
    } catch (error) {
      console.error("Erreur removeFavorite:", error);
      return { changes: 0 };
    }
  }

  static hasFavorite(userId, bookId) {
    try {
      return (
        db
          .prepare("SELECT id FROM favorites WHERE userId = ? AND bookId = ?")
          .get(userId, bookId) !== undefined
      );
    } catch (error) {
      return false;
    }
  }

  static count(whereClause = "", params = []) {
    try {
      return db
        .prepare(`SELECT COUNT(*) as total FROM users ${whereClause}`)
        .get(...params).total;
    } catch (error) {
      return 0;
    }
  }

  static findAll(whereClause = "", params = [], limit = 12, offset = 0) {
    try {
      return db
        .prepare(
          `
        SELECT id, firstName, lastName, email, role, isVerified,
               graduationYear, specialization, photoUrl, createdAt
        FROM users ${whereClause}
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `,
        )
        .all(...params, limit, offset);
    } catch (error) {
      console.error("Erreur findAll users:", error);
      return [];
    }
  }

  static verifyUser(userId, adminId = null) {
    try {
      return (
        db
          .prepare(
            `
        UPDATE users 
        SET isVerified = 1, verifiedAt = datetime('now'), verifiedBy = ?
        WHERE id = ? AND isVerified = 0
      `,
          )
          .run(adminId, userId).changes > 0
      );
    } catch (error) {
      console.error("Erreur verifyUser:", error);
      return false;
    }
  }

  static canAccessResources(userId) {
    try {
      const user = db
        .prepare("SELECT id, isVerified FROM users WHERE id = ?")
        .get(userId);
      return user && user.isVerified === 1;
    } catch (error) {
      return false;
    }
  }
}

module.exports = User;
