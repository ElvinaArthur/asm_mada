// scripts/test-uploads.js
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");

console.log("📁 Vérification du dossier uploads...\n");
console.log(`Chemin: ${uploadsDir}\n`);

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  console.log("❌ Le dossier uploads n'existe pas");
  console.log("✅ Création du dossier...");
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Dossier créé!\n");
} else {
  console.log("✅ Le dossier uploads existe\n");
}

// Lister les fichiers
console.log("📋 Fichiers dans uploads:");
try {
  const files = fs.readdirSync(uploadsDir);

  if (files.length === 0) {
    console.log("   (vide)\n");
  } else {
    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
    console.log("");
  }
} catch (err) {
  console.error("❌ Erreur lecture dossier:", err.message);
}

// Créer un fichier test
const testFile = path.join(uploadsDir, "test.txt");
try {
  fs.writeFileSync(testFile, "Test upload file");
  console.log("✅ Fichier test créé: test.txt");
  console.log(`   Accessible via: http://localhost:3000/uploads/test.txt\n`);
} catch (err) {
  console.error("❌ Erreur création fichier test:", err.message);
}

console.log("🎯 Instructions:");
console.log("1. Redémarrez votre serveur");
console.log("2. Testez: http://localhost:3000/uploads/test.txt");
console.log(
  "3. Si ça fonctionne, vos autres fichiers devraient aussi être accessibles\n",
);
