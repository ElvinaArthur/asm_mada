// backend/scripts/show-schema.js
const db = require("./config/database");

console.log("📊 Structure de la table users :");
console.log("================================\n");

const tableInfo = db.prepare("PRAGMA table_info(users)").all();
console.table(tableInfo);

console.log("\n📝 Colonnes disponibles :");
tableInfo.forEach((col) => {
  console.log(`- ${col.name} (${col.type})`);
});

console.log("\n👤 Exemple de données (premier utilisateur) :");
const sampleUser = db.prepare("SELECT * FROM users LIMIT 1").get();
console.log(sampleUser);

console.log("\n✅ Vérification terminée");
