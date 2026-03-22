// backend/migrations/add-proof-columns.js
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../database/asm-alumni.db");
const db = new Database(dbPath);

console.log(
  "🔄 Début de la migration : ajout des colonnes de justificatif...\n",
);

try {
  // Colonnes à ajouter pour le système de justificatifs
  const columnsToAdd = [
    { name: "proof_filename", type: "TEXT" },
    { name: "proof_originalname", type: "TEXT" },
    { name: "proof_mimetype", type: "TEXT" },
    { name: "proof_size", type: "INTEGER" },
    { name: "proof_uploaded_at", type: "DATETIME" },
    { name: "proof_status", type: "TEXT DEFAULT 'pending'" },
    { name: "proof_rejection_reason", type: "TEXT" },
    { name: "verifiedAt", type: "DATETIME" },
    { name: "verifiedBy", type: "INTEGER" },
    { name: "rejectedAt", type: "DATETIME" },
    { name: "rejectedBy", type: "INTEGER" },
  ];

  // Récupérer les colonnes existantes
  const existingColumns = db.prepare("PRAGMA table_info(users)").all();
  const existingColumnNames = existingColumns.map((col) => col.name);

  // Ajouter chaque colonne manquante
  columnsToAdd.forEach(({ name, type }) => {
    if (!existingColumnNames.includes(name)) {
      try {
        const sql = `ALTER TABLE users ADD COLUMN ${name} ${type}`;
        db.exec(sql);
        console.log(`✅ Colonne '${name}' ajoutée avec succès`);
      } catch (err) {
        if (!err.message.includes("duplicate column name")) {
          console.error(`❌ Erreur pour '${name}':`, err.message);
        }
      }
    } else {
      console.log(`ℹ️  Colonne '${name}' existe déjà`);
    }
  });

  console.log("\n✅ Migration terminée avec succès !");

  // Afficher le schéma mis à jour
  console.log("\n📋 Colonnes de la table users après migration :");
  const updatedColumns = db.prepare("PRAGMA table_info(users)").all();
  updatedColumns.forEach((col) => {
    console.log(`   - ${col.name} (${col.type})`);
  });
} catch (error) {
  console.error("❌ Erreur lors de la migration:", error);
} finally {
  db.close();
}
