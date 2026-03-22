-- migrations/create_user_data_tables.sql
-- Tables pour les données utilisateur personnalisées

-- ==================== TABLE user_books ====================
-- Bibliothèque personnelle de chaque utilisateur
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
);

CREATE INDEX IF NOT EXISTS idx_user_books_userId ON user_books(userId);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books(status);
CREATE INDEX IF NOT EXISTS idx_user_books_favorite ON user_books(isFavorite);

-- ==================== TABLE user_events ====================
-- Inscriptions aux événements
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
);

CREATE INDEX IF NOT EXISTS idx_user_events_userId ON user_events(userId);
CREATE INDEX IF NOT EXISTS idx_user_events_eventId ON user_events(eventId);
CREATE INDEX IF NOT EXISTS idx_user_events_status ON user_events(status);

-- ==================== TABLE activities ====================
-- Activité récente des utilisateurs
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('login', 'book_read', 'book_added', 'event_registered', 'profile_updated')),
  description TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activities_userId ON activities(userId);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_createdAt ON activities(createdAt DESC);

-- ==================== VUES UTILES ====================

-- Vue pour les statistiques rapides par utilisateur
CREATE VIEW IF NOT EXISTS user_stats AS
SELECT 
  u.id as userId,
  u.firstName,
  u.lastName,
  COUNT(DISTINCT CASE WHEN ub.status = 'read' THEN ub.bookId END) as booksRead,
  COUNT(DISTINCT CASE WHEN ub.status = 'reading' THEN ub.bookId END) as booksReading,
  COUNT(DISTINCT CASE WHEN ub.status = 'to-read' THEN ub.bookId END) as booksToRead,
  COUNT(DISTINCT CASE WHEN ub.isFavorite = 1 THEN ub.bookId END) as favorites,
  COUNT(DISTINCT CASE WHEN ue.status = 'registered' AND e.date >= date('now') THEN ue.eventId END) as upcomingEvents,
  COUNT(DISTINCT CASE WHEN ue.status = 'attended' THEN ue.eventId END) as attendedEvents
FROM users u
LEFT JOIN user_books ub ON u.id = ub.userId
LEFT JOIN user_events ue ON u.id = ue.userId
LEFT JOIN events e ON ue.eventId = e.id
GROUP BY u.id;

-- Vue pour l'activité récente globale
CREATE VIEW IF NOT EXISTS recent_activity AS
SELECT 
  a.*,
  u.firstName,
  u.lastName,
  u.email
FROM activities a
JOIN users u ON a.userId = u.id
ORDER BY a.createdAt DESC
LIMIT 50;