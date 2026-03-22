// server.js - VERSION CORRIGÉE POUR FORMDATA
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Importation des routes
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const protectPDF = require("./middleware/pdfProtection");
const registerRoutes = require("./routes/registerRoutes");
const proofRoutes = require("./routes/proofRoutes");

const userBooksRoutes = require("./routes/userBooksRoutes");
const userEventsRoutes = require("./routes/userEventsRoutes");
const userActivityRoutes = require("./routes/userActivityRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");

const directoryRoutes = require("./routes/directoryRoutes");
const adminDirectoryRoutes = require("./routes/adminDirectoryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//Configuration CORS
const corsOptions = require("./config/cors");
app.use(cors(corsOptions));

// Middleware de sécurité
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Logger HTTP
app.use(morgan("dev"));

// Limiteur de requêtes
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute au lieu de 15
  max: 200, // 200 requêtes par minute
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use("/api/", limiter);

// **IMPORTANT: URL-encoded parser pour les formulaires (DOIT ÊTRE AVANT JSON)**
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// **IMPORTANT: JSON parser (mais certaines routes auront besoin d'un traitement spécial)**
app.use(express.json({ limit: "10mb" }));

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// ==================== ROUTES API ====================
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/proofs", proofRoutes);

app.use("/api/user/books", userBooksRoutes);
app.use("/api/user/events", userEventsRoutes);
app.use("/api/user/activity", userActivityRoutes);
app.use("/api/user/profile", userProfileRoutes);

app.use("/api/directory", directoryRoutes);
app.use("/api/admin/directory", adminDirectoryRoutes);

// Protection PDF (APRÈS les routes uploads)
// app.use(protectPDF);

// Route de santé
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Serveur ASM Alumni fonctionne",
    timestamp: new Date().toISOString(),
    database: "SQLite",
    uploadsPath: path.join(__dirname, "uploads"),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(
  "/uploads/proofs",
  express.static(path.join(__dirname, "uploads/proofs")),
);

// Route racine du serveur
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ASM Alumni API Server",
    documentation: "/api",
  });
});

// Route 404 pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
    suggestion: "Consultez /api pour voir toutes les routes disponibles",
    availableRoutes: {
      documentation: "GET /api",
      books: "GET /api/books",
      auth: "POST /api/auth/register ou POST /api/auth/login",
      members: "GET /api/members/verified",
      admin: "GET /api/admin/dashboard/stats",
      health: "GET /api/health",
    },
  });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error("❌ Erreur:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`👥 Members API: http://localhost:${PORT}/api/members/verified`);
  console.log(
    `⚙️  Admin API: http://localhost:${PORT}/api/admin/dashboard/stats`,
  );
  console.log("📦 Vérification des routes directory:");
  console.log("- directoryRoutes:", directoryRoutes ? "✅" : "❌");
  console.log("- adminDirectoryRoutes:", adminDirectoryRoutes ? "✅" : "❌");
  console.log(
    `💾 Base de données: ${path.join(__dirname, "database", "asm-alumni.db")}`,
  );
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n✅ API prête à recevoir des requêtes!\n`);
});

// Gestion propre de l'arrêt
process.on("SIGINT", () => {
  console.log("\n🛑 Arrêt du serveur...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});

module.exports = app;
