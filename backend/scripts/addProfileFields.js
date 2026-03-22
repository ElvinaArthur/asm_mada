// scripts/addProfileFields.js
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../database/asm-alumni.db");
const migrationPath = path.join(
  __dirname,
  "../migrations/add_profile_migration.sql",
);

console.log("\n" + "=".repeat(60));
console.log("🔄 AJOUT DES CHAMPS DE PROFIL");
console.log("=".repeat(60));
console.log(`📁 Base de données: ${dbPath}`);
console.log(`📄 Fichier SQL: ${migrationPath}\n`);

try {
  // Vérifier que la DB existe
  if (!fs.existsSync(dbPath)) {
    console.error("❌ La base de données n'existe pas!");
    process.exit(1);
  }

  // Vérifier que le fichier SQL existe
  if (!fs.existsSync(migrationPath)) {
    console.error("❌ Le fichier SQL n'existe pas!");
    process.exit(1);
  }

  // Ouvrir la connexion
  const db = new Database(dbPath);
  console.log("✅ Connexion à la base de données établie\n");

  // Lire le fichier SQL
  const sql = fs.readFileSync(migrationPath, "utf8");

  // Exécuter les commandes SQL une par une (pour gérer les erreurs de colonnes existantes)
  const commands = sql
    .split(";")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  console.log("📝 Exécution des commandes SQL...\n");

  commands.forEach((command, index) => {
    try {
      db.exec(command);
      console.log(`✅ Commande ${index + 1}/${commands.length} exécutée`);
    } catch (error) {
      // Ignorer les erreurs "column already exists"
      if (error.message.includes("duplicate column name")) {
        console.log(
          `⚠️  Commande ${index + 1}/${commands.length} ignorée (colonne existe déjà)`,
        );
      } else {
        throw error;
      }
    }
  });

  // Vérifier la structure de la table
  console.log("\n📋 Structure de la table users:");
  const columns = db.prepare("PRAGMA table_info(users)").all();

  const newColumns = [
    "photoUrl",
    "phone",
    "birthYear",
    "location",
    "currentPosition",
    "company",
    "bio",
    "academicBackground",
    "previousPositions",
    "privacy",
    "updatedAt",
  ];

  console.log("\n✅ Colonnes de profil:");
  newColumns.forEach((colName) => {
    const exists = columns.find((col) => col.name === colName);
    if (exists) {
      console.log(`   ✓ ${colName.padEnd(25)} (${exists.type})`);
    } else {
      console.log(`   ✗ ${colName.padEnd(25)} MANQUANTE`);
    }
  });

  // Créer le dossier uploads/profiles s'il n'existe pas
  const uploadsDir = path.join(__dirname, "../uploads/profiles");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("\n✅ Dossier uploads/profiles créé");
  }

  db.close();
  console.log("\n" + "=".repeat(60));
  console.log("🎉 MIGRATION TERMINÉE AVEC SUCCÈS!");
  console.log("=".repeat(60) + "\n");
} catch (error) {
  console.error("\n❌ ERREUR LORS DE LA MIGRATION:");
  console.error(error.message);
  process.exit(1);
}
