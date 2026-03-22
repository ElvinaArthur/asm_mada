// config/database.js — ✅ CORRECTIF : photoUrl ajouté dans les colonnes à migrer

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../database/asm-alumni.db");
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Table books ───────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    year INTEGER,
    pages INTEGER,
    readTime TEXT,
    fileName TEXT NOT NULL UNIQUE,
    thumbnail TEXT,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ── Table users ───────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    title TEXT,
    institution TEXT,
    location TEXT,
    expertise TEXT,
    publicationsCount INTEGER DEFAULT 0,
    memberSince DATETIME DEFAULT CURRENT_TIMESTAMP,
    isVerified BOOLEAN DEFAULT 0,
    avatarColor TEXT,
    role TEXT DEFAULT 'user',
    graduationYear INTEGER,
    specialization TEXT,
    isActive BOOLEAN DEFAULT 1,
    lastLogin DATETIME,
    resetPasswordToken TEXT,
    resetPasswordExpire DATETIME,
    photoUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ── Migration : ajouter les colonnes manquantes (idempotent) ──────
try {
  const existingColumns = db.pragma("table_info(users)").map((c) => c.name);

  const columnsToAdd = [
    { name: "title", def: "TEXT" },
    { name: "institution", def: "TEXT" },
    { name: "location", def: "TEXT" },
    { name: "expertise", def: "TEXT" },
    { name: "publicationsCount", def: "INTEGER DEFAULT 0" },
    { name: "memberSince", def: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
    { name: "isVerified", def: "BOOLEAN DEFAULT 0" },
    { name: "avatarColor", def: "TEXT" },
    // ✅ Colonnes profil utilisateur
    { name: "photoUrl", def: "TEXT" },
    { name: "phone", def: "TEXT DEFAULT ''" },
    { name: "phone2", def: "TEXT DEFAULT ''" },
    { name: "birthDate", def: "TEXT DEFAULT ''" },
    { name: "birthYear", def: "INTEGER" },
    { name: "currentPosition", def: "TEXT DEFAULT ''" },
    { name: "company", def: "TEXT DEFAULT ''" },
    { name: "bio", def: "TEXT DEFAULT ''" },
    { name: "academicBackground", def: "TEXT DEFAULT '{}'" },
    { name: "academicEducations", def: "TEXT DEFAULT '[]'" },
    { name: "previousPositions", def: "TEXT DEFAULT '[]'" },
    { name: "privacy", def: "TEXT DEFAULT '{}'" },
    // Colonnes vérification
    { name: "verifiedAt", def: "DATETIME" },
    { name: "verifiedBy", def: "INTEGER" },
    { name: "rejectedAt", def: "DATETIME" },
    { name: "rejectedBy", def: "INTEGER" },
    { name: "proof_filename", def: "TEXT" },
    { name: "proof_status", def: "TEXT DEFAULT 'pending'" },
    { name: "proof_uploaded_at", def: "DATETIME" },
    { name: "proof_rejection_reason", def: "TEXT" },
  ];

  columnsToAdd.forEach(({ name, def }) => {
    if (!existingColumns.includes(name)) {
      try {
        db.exec(`ALTER TABLE users ADD COLUMN ${name} ${def}`);
        console.log(`✅ Colonne ajoutée : users.${name}`);
      } catch (err) {
        if (!err.message.includes("duplicate column name")) {
          console.error(`❌ Erreur ajout colonne '${name}':`, err.message);
        }
      }
    }
  });
} catch (err) {
  console.error("Erreur migration colonnes:", err);
}

// ── Table favorites ───────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    bookId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, bookId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
  )
`);

// ── Index ─────────────────────────────────────────────────────────
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
  CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_verified ON users(isVerified);
  CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
  CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(userId);
`);

// ── Tables utilisateur ────────────────────────────────────────────
console.log("📦 Vérification des tables utilisateur...");

db.exec(`
  CREATE TABLE IF NOT EXISTS user_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    bookId INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('reading', 'read', 'to-read')),
    isFavorite INTEGER DEFAULT 0,
    currentPage INTEGER DEFAULT 0,
    dateRead TEXT,
    addedAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE(userId, bookId)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    eventId INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('registered', 'attended', 'cancelled')),
    registeredAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(userId, eventId)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('login', 'book_read', 'book_added', 'event_registered', 'profile_updated')),
    description TEXT NOT NULL,
    metadata TEXT DEFAULT '{}',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Vues (DROP + CREATE pour éviter les conflits de colonnes)
try {
  db.exec(`DROP VIEW IF EXISTS user_stats`);
  db.exec(`
    CREATE VIEW user_stats AS
    SELECT 
      u.id as userId,
      u.firstName,
      u.lastName,
      COUNT(DISTINCT CASE WHEN ub.status = 'read'     THEN ub.bookId END) as booksRead,
      COUNT(DISTINCT CASE WHEN ub.status = 'reading'  THEN ub.bookId END) as booksReading,
      COUNT(DISTINCT CASE WHEN ub.status = 'to-read'  THEN ub.bookId END) as booksToRead,
      COUNT(DISTINCT CASE WHEN ub.isFavorite = 1      THEN ub.bookId END) as favorites,
      COUNT(DISTINCT CASE WHEN ue.status = 'registered' AND e.date >= date('now') THEN ue.eventId END) as upcomingEvents,
      COUNT(DISTINCT CASE WHEN ue.status = 'attended'  THEN ue.eventId END) as attendedEvents
    FROM users u
    LEFT JOIN user_books ub ON u.id = ub.userId
    LEFT JOIN user_events ue ON u.id = ue.userId
    LEFT JOIN events e ON ue.eventId = e.id
    GROUP BY u.id
  `);
} catch (e) {
  console.warn("Vue user_stats ignorée :", e.message);
}

try {
  db.exec(`DROP VIEW IF EXISTS recent_activity`);
  db.exec(`
    CREATE VIEW recent_activity AS
    SELECT a.*, u.firstName, u.lastName, u.email
    FROM activities a
    JOIN users u ON a.userId = u.id
    ORDER BY a.createdAt DESC
    LIMIT 50
  `);
} catch (e) {
  console.warn("Vue recent_activity ignorée :", e.message);
}

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_user_books_userId   ON user_books(userId);
  CREATE INDEX IF NOT EXISTS idx_user_books_status   ON user_books(status);
  CREATE INDEX IF NOT EXISTS idx_user_books_favorite ON user_books(isFavorite);
  CREATE INDEX IF NOT EXISTS idx_user_events_userId  ON user_events(userId);
  CREATE INDEX IF NOT EXISTS idx_activities_userId   ON activities(userId);
  CREATE INDEX IF NOT EXISTS idx_activities_createdAt ON activities(createdAt DESC);
`);

console.log("✅ Tables vérifiées/créées");
console.log(`✅ SQLite connecté: ${dbPath}`);

module.exports = db;
