// utils/seedDatabase.js
require("dotenv").config();
const db = require("../config/database");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

// Tes 15 livres avec les vraies données
const demoBooks = [
  {
    title: "Mouvements et Enjeux Sociaux",
    author: "Revue Internationale des Dynamiques Sociales",
    description:
      "L'étude s'inscrit dans cette perspective lorsqu'elle se propose de démontrer ce qui intéresse la sociologie dans le domaine de la santé, de situer la portée sémantique des notions de base et de recenser les travaux à travers les thèmes fréquemment étudiés par les sociologues en matière de santé.",
    category: "santé",
    year: 2024,
    pages: 15,
    readTime: "30 minutes",
    fileName: "1.pdf",
    thumbnail: "1.jpg",
  },
  {
    title: "Introduction à la Sociologie du Travail",
    author: "Jean Claude RABIER",
    description:
      "Il s'agit d'un cours d'introduction sur du travail industriel ou tertiaire, d'illustrer l'approche sociologique des problèmes du travail en utilisant quelques-uns des concepts et quelques-unes des méthodes qui caractérisent la discipline.",
    category: "travail",
    year: 1990,
    pages: 28,
    readTime: "1 heure",
    fileName: "2.pdf",
    thumbnail: "2.jpg",
  },
  {
    title: "Corps, santé et sociétés - Plan de Cours",
    author: "Fabrice Fernandez",
    description:
      "Autour de la maladie et des soins se cristallisent un ensemble de transformations majeures de la société contemporaine, de l'économie politique, de l'État, de l'identité subjective et de l'éthique.",
    category: "santé",
    year: 2016,
    pages: 20,
    readTime: "30 minutes",
    fileName: "3.pdf",
    thumbnail: "3.jpg",
  },
  {
    title: "Sociologie de l'environnement",
    author: "Dr ADOU Djané",
    description:
      "La sociologie de l'environnement étudie les relations que les humains entretiennent avec « la nature » tout en questionnant les processus socioculturels qui la construise et la dénature.",
    category: "environnement",
    year: 2023,
    pages: 20,
    readTime: "30 minutes",
    fileName: "4.pdf",
    thumbnail: "4.jpg",
  },
  {
    title: "Qu'est-ce que la Sociologie",
    author: "Inconnu",
    description:
      "Le but de la sociologie n'est pas la construction de la Cité idéale, mais l'observation scientifique des faits sociaux.",
    category: "sociologie",
    year: 2022,
    pages: 10,
    readTime: "20 minutes",
    fileName: "5.pdf",
    thumbnail: "5.jpg",
  },
  {
    title: "PSYCHOLOGIE DE L'ENFANT Traduit en Justice",
    author: "Jean Piaget",
    description:
      "Étude psychologique de l'enfant dans le contexte judiciaire par le célèbre psychologue Jean Piaget.",
    category: "psychologie",
    year: 1912,
    pages: 32,
    readTime: "1 heure",
    fileName: "6.pdf",
    thumbnail: "6.jpg",
  },
  {
    title: "Faire face à ces peurs",
    author: "CEDAR",
    description:
      "Une approche tirée de la thérapie cognitive-comportementale et basée sur des données probantes pour vous aider à surmonter des phobies.",
    category: "psychologie",
    year: 2019,
    pages: 24,
    readTime: "45 minutes",
    fileName: "7.pdf",
    thumbnail: "7.jpg",
  },
  {
    title:
      "Les bases de la psychologie sociale : Problématique individu/société",
    author: "Gustave Nicolas FISCHER",
    description: "Relations entre pouvoir politique et structures sociales.",
    category: "psychologie",
    year: 2025,
    pages: 8,
    readTime: "15 minutes",
    fileName: "8.pdf",
    thumbnail: "8.jpg",
  },
  {
    title: "La Psychologie de l'enfant",
    author: "Jean Piaget",
    description:
      "La psychologie de l'enfant a acquis une importance dans les études du développement de l'enfant.",
    category: "psychologie",
    year: 1919,
    pages: 14,
    readTime: "30 minutes",
    fileName: "9.pdf",
    thumbnail: "9.jpg",
  },
  {
    title:
      "Longue marche vers la science pragmatique: arpenteur du social ou conseiller du Prince",
    author: "Bernard Kalaora",
    description:
      "De la fin des années soixante-dix au début des années quatre-vingt-dix, la sociologie a parcouru un important itinéraire dans sa façon d'aborder les problèmes d'environnement.",
    category: "environnement",
    year: 2022,
    pages: 7,
    readTime: "20 minutes",
    fileName: "10.pdf",
    thumbnail: "10.jpg",
  },
  {
    title: "Sociologie de l'environnement",
    author: "Emiliano Scanu",
    description:
      "Ce séminaire porte sur la sociologie de l'environnement et plus largement sur les études sociologiques s'intéressant aux rapports entre environnement et société.",
    category: "environnement",
    year: 2025,
    pages: 14,
    readTime: "30 minutes",
    fileName: "11.pdf",
    thumbnail: "11.jpg",
  },
  {
    title: "Les dynamiques contemporaines de la sociologie du travail",
    author: "Nicolas Jounin",
    description:
      "Mettre l'accent sur quelques dynamiques de cette sociologie du travail des trois dernières décennies.",
    category: "travail",
    year: 2016,
    pages: 4,
    readTime: "10 minutes",
    fileName: "12.pdf",
    thumbnail: "12.jpg",
  },
  {
    title: "Sociologie de l'éducation",
    author: "Nathalie Bulle",
    description:
      "La sociologie éducative constituait une branche de l'éducation plus que de la sociologie, destinée principalement à la formation des enseignants.",
    category: "éducation",
    year: 2005,
    pages: 15,
    readTime: "30 minutes",
    fileName: "13.pdf",
    thumbnail: "13.jpg",
  },
  {
    title:
      "Pour un nouveau cadre d'analyse de la sociologie de l'éducation européenne",
    author: "Zagefka Polymnia",
    description:
      "Analyse des principales tendances dans les études sociologiques de l'éducation dans sept pays européens.",
    category: "éducation",
    year: 1997,
    pages: 17,
    readTime: "35 minutes",
    fileName: "14.pdf",
    thumbnail: "14.jpg",
  },
  {
    title: "Histoire de la sociologie et théorie sociologique",
    author: "Olivier Tschannen",
    description:
      "Le terme 'interaction' renvoie au fait que ce qui se passe entre deux personnes est le produit de l'ajustement de deux séries d'actions.",
    category: "sociologie",
    year: 2001,
    pages: 28,
    readTime: "45 minutes",
    fileName: "15.pdf",
    thumbnail: "15.jpg",
  },
];

const demoUsers = [
  {
    email: "admin@asm.mg",
    password: "Admin123!",
    firstName: "Admin",
    lastName: "ASM",
    role: "admin",
    graduationYear: 2010,
    specialization: "Sociologie Générale",
  },
  {
    email: "alumni@asm.mg",
    password: "Alumni123!",
    firstName: "Jean",
    lastName: "Rakoto",
    role: "user",
    graduationYear: 2015,
    specialization: "Sociologie du Développement",
  },
];

const seedDatabase = async () => {
  console.log("🌱 Démarrage du seed SQLite pour ASM...\n");

  try {
    // 1. Vérifier que la base est accessible
    console.log("🔌 Test de la connexion SQLite...");
    try {
      const test = db.prepare("SELECT 1 as test").get();
      console.log("✅ Connexion SQLite OK");
    } catch (error) {
      console.error("❌ Impossible de se connecter à SQLite:", error.message);
      console.log(
        "💡 Vérifiez que better-sqlite3 est installé: npm install better-sqlite3",
      );
      process.exit(1);
    }

    // 2. Vérifier/Créer les dossiers uploads
    console.log("\n📁 Vérification des dossiers uploads...");
    const uploadsDir = path.join(__dirname, "../uploads");
    const pdfsDir = path.join(uploadsDir, "pdfs");
    const thumbnailsDir = path.join(uploadsDir, "thumbnails");

    [uploadsDir, pdfsDir, thumbnailsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Dossier créé: ${dir}`);
      } else {
        console.log(`✅ Dossier existe: ${dir}`);
      }
    });

    // 3. Ajouter les livres
    console.log("\n📚 Ajout des livres à la base de données...");

    // Préparer la requête d'insertion
    const insertBookStmt = db.prepare(`
      INSERT OR IGNORE INTO books 
      (title, author, description, category, year, pages, readTime, fileName, thumbnail, views, downloads)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let booksAdded = 0;
    let booksSkipped = 0;

    for (const book of demoBooks) {
      try {
        const result = insertBookStmt.run(
          book.title,
          book.author,
          book.description,
          book.category,
          book.year,
          book.pages,
          book.readTime,
          book.fileName,
          book.thumbnail,
          0, // views
          0, // downloads
        );

        if (result.changes > 0) {
          booksAdded++;
          console.log(`✅ "${book.title.substring(0, 40)}..." ajouté`);
        } else {
          booksSkipped++;
          console.log(`⏭️ "${book.title.substring(0, 40)}..." déjà existant`);
        }
      } catch (error) {
        console.error(`❌ Erreur avec "${book.title}":`, error.message);
      }
    }

    // 4. Ajouter les utilisateurs
    console.log("\n👥 Ajout des utilisateurs...");

    const insertUserStmt = db.prepare(`
      INSERT OR IGNORE INTO users 
      (email, password, firstName, lastName, role, graduationYear, specialization)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let usersAdded = 0;

    for (const user of demoUsers) {
      try {
        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const result = insertUserStmt.run(
          user.email,
          hashedPassword,
          user.firstName,
          user.lastName,
          user.role,
          user.graduationYear,
          user.specialization,
        );

        if (result.changes > 0) {
          usersAdded++;
          console.log(`✅ Utilisateur "${user.email}" ajouté`);
        } else {
          console.log(`⏭️ Utilisateur "${user.email}" déjà existant`);
        }
      } catch (error) {
        console.error(
          `❌ Erreur avec utilisateur "${user.email}":`,
          error.message,
        );
      }
    }

    // 5. Vérification finale
    console.log("\n📊 RÉSUMÉ DU SEED:");
    console.log("=".repeat(40));

    const totalBooks = db
      .prepare("SELECT COUNT(*) as count FROM books")
      .get().count;
    const totalUsers = db
      .prepare("SELECT COUNT(*) as count FROM users")
      .get().count;

    console.log(`📚 Livres dans la base: ${totalBooks}`);
    console.log(`👥 Utilisateurs dans la base: ${totalUsers}`);
    console.log(`➕ Livres ajoutés cette fois: ${booksAdded}`);
    console.log(`⏭️ Livres déjà existants: ${booksSkipped}`);
    console.log(`➕ Utilisateurs ajoutés: ${usersAdded}`);

    // Afficher les catégories disponibles
    console.log("\n🏷️ Catégories disponibles:");
    const categories = db
      .prepare(
        "SELECT DISTINCT category, COUNT(*) as count FROM books GROUP BY category ORDER BY category",
      )
      .all();

    categories.forEach((cat) => {
      console.log(`  - ${cat.category}: ${cat.count} livre(s)`);
    });

    console.log("\n✅ Seed terminé avec succès!");
    return { booksAdded, usersAdded, totalBooks, totalUsers };
  } catch (error) {
    console.error("\n❌ ERREUR FATALE:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log("\n🎉 Base de données prête à l'utilisation!");
      console.log(
        `🔗 API disponible sur: http://localhost:${process.env.PORT || 3000}`,
      );
      console.log(
        `🔗 Testez avec: http://localhost:${process.env.PORT || 3000}/api/books`,
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seed échoué!");
      process.exit(1);
    });
}

module.exports = seedDatabase;
