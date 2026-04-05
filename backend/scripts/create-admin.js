// scripts/create-admin.js
const db = require("../config/database");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    console.log("🔄 Création de l'administrateur...");

    // Vérifier si la table users existe
    const tableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      )
      .get();

    if (!tableExists) {
      console.log(
        "❌ Table 'users' n'existe pas. Exécutez d'abord server.js pour créer les tables.",
      );
      return;
    }

    // Créer l'administrateur par défaut
    const adminEmail = "admin@asm-alumni.com";
    const adminPassword = await bcrypt.hash("admin123", 10);

    // Vérifier si l'admin existe déjà
    const existingAdmin = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(adminEmail);

    if (existingAdmin) {
      console.log("✅ Administrateur existe déjà");
      console.log("📋 Email: admin@asm-alumni.com");
      console.log("🔐 Mot de passe: admin123");
      return;
    }

    // Insérer l'admin
    const result = db
      .prepare(
        `
      INSERT INTO users 
      (firstName, lastName, email, password, role, isVerified) 
      VALUES (?, ?, ?, ?, 'admin', 1)
    `,
      )
      .run("Admin", "System", adminEmail, adminPassword);

    console.log("🎉 Administrateur créé avec succès!");
    console.log("📋 Informations de connexion:");
    console.log("   Email: admin@asm-alumni.com");
    console.log("   Mot de passe: admin123");
    console.log("   ID: " + result.lastInsertRowid);
    console.log("\n🔗 Connectez-vous sur: https://asm-mada.onrender.com");
  } catch (error) {
    console.error("❌ Erreur lors de la création:", error);
  }
}

createAdmin();
