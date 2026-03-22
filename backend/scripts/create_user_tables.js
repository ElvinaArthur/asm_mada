// backend/scripts/create_user_tables.js
const db = require("../config/database");
const fs = require("fs");
const path = require("path");

console.log("🚀 Création des tables utilisateur...");

try {
  // Lire le fichier SQL
  const sqlPath = path.join(
    __dirname,
    "../migrations/create_user_data_tables.sql",
  );
  const sql = fs.readFileSync(sqlPath, "utf8");

  // Exécuter le script SQL
  db.exec(sql);

  console.log("✅ Tables créées avec succès !");
  console.log("   - user_books");
  console.log("   - user_events");
  console.log("   - activities");
  console.log("   - user_stats (vue)");
  console.log("   - recent_activity (vue)");
} catch (error) {
  console.error("❌ Erreur lors de la création des tables:", error.message);
}

// Fermer la connexion
process.exit(0);
