// scripts/migrate-users-table.js
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../database/asm-alumni.db");
const db = new Database(dbPath);

console.log("🔄 Début de la migration de la table users...");

try {
  // Commencer une transaction
  db.exec("BEGIN TRANSACTION");

  // 1. Créer une nouvelle table avec le bon schéma
  db.exec(`
    CREATE TABLE IF NOT EXISTS users_new (
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
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Copier les données de l'ancienne table vers la nouvelle
  const columns = db.prepare("PRAGMA table_info(users)").all();
  const existingColumns = columns.map((col) => col.name);

  // Construire la liste des colonnes communes
  const newTableColumns = [
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "title",
    "institution",
    "location",
    "expertise",
    "publicationsCount",
    "memberSince",
    "isVerified",
    "avatarColor",
    "role",
    "graduationYear",
    "specialization",
    "isActive",
    "lastLogin",
    "resetPasswordToken",
    "resetPasswordExpire",
    "createdAt",
    "updatedAt",
  ];

  const columnsToTransfer = newTableColumns.filter((col) =>
    existingColumns.includes(col),
  );
  const columnsList = columnsToTransfer.join(", ");

  console.log(`📋 Colonnes à transférer: ${columnsList}`);

  // Copier les données
  db.exec(`
    INSERT INTO users_new (${columnsList})
    SELECT ${columnsList}
    FROM users
  `);

  // 3. Supprimer l'ancienne table
  db.exec("DROP TABLE users");

  // 4. Renommer la nouvelle table
  db.exec("ALTER TABLE users_new RENAME TO users");

  // 5. Recréer les indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_verified ON users(isVerified);
    CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
  `);

  // Valider la transaction
  db.exec("COMMIT");

  console.log("✅ Migration réussie !");
  console.log("📊 Vérification des colonnes:");

  const newColumns = db.prepare("PRAGMA table_info(users)").all();
  newColumns.forEach((col) => {
    console.log(`   - ${col.name} (${col.type})`);
  });

  // Compter les utilisateurs
  const count = db.prepare("SELECT COUNT(*) as count FROM users").get();
  console.log(`👥 Nombre d'utilisateurs: ${count.count}`);
} catch (error) {
  // Annuler en cas d'erreur
  db.exec("ROLLBACK");
  console.error("❌ Erreur lors de la migration:", error);
  process.exit(1);
}

db.close();
console.log("✅ Migration terminée avec succès !");
process.exit(0);
