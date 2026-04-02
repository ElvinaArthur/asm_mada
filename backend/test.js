const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database/asm-alumni.db"));

db.prepare("DELETE FROM users").run();
console.log("Comptes supprimés");

const hash = bcrypt.hashSync("DaxPresident2026", 10);

db.prepare(
  "INSERT INTO users (email, password, firstName, lastName, role, isVerified, createdAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
).run("admin@asm.mg", hash, "Admin", "ASM", "admin", 1);

console.log("Admin créé !");
console.log("Email    : admin@asm.mg");
console.log("Password : DaxPresident2026");

db.close();
