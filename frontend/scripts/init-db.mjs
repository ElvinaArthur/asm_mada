// Script d'initialisation de la base de données Neon
// Lancer avec: node scripts/init-db.mjs

import pg from 'pg';
import bcrypt from 'bcryptjs';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL_UNPOOLED ||
    'postgresql://neondb_owner:npg_FgmeV8prsCK7@ep-holy-band-atv3z7tw.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

const tables = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    title TEXT, institution TEXT, location TEXT, expertise TEXT,
    "publicationsCount" INTEGER DEFAULT 0,
    "memberSince" TIMESTAMP DEFAULT NOW(),
    "isVerified" BOOLEAN DEFAULT FALSE,
    "avatarColor" TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    "graduationYear" INTEGER, specialization TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    "lastLogin" TIMESTAMP, "resetPasswordToken" TEXT, "resetPasswordExpire" TIMESTAMP,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    phone TEXT DEFAULT '', phone2 TEXT DEFAULT '',
    "birthDate" TEXT DEFAULT '', "birthYear" INTEGER,
    "currentPosition" TEXT DEFAULT '', company TEXT DEFAULT '', bio TEXT DEFAULT '',
    "academicBackground" JSONB DEFAULT '{}',
    "academicEducations" JSONB DEFAULT '[]',
    "previousPositions" JSONB DEFAULT '[]',
    privacy JSONB DEFAULT '{}',
    "verifiedAt" TIMESTAMP, "verifiedBy" INTEGER,
    "rejectedAt" TIMESTAMP, "rejectedBy" INTEGER,
    proof_filename TEXT,
    proof_status TEXT DEFAULT 'pending' CHECK(proof_status IN ('pending','approved','rejected')),
    proof_uploaded_at TIMESTAMP, proof_rejection_reason TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL, author TEXT NOT NULL, description TEXT,
    category TEXT NOT NULL, year INTEGER, pages INTEGER, "readTime" TEXT,
    "fileName" TEXT NOT NULL UNIQUE, thumbnail TEXT,
    views INTEGER DEFAULT 0, downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL, description TEXT,
    date TIMESTAMP NOT NULL, location TEXT, "imageUrl" TEXT,
    "maxParticipants" INTEGER, "isPublished" BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "bookId" INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "bookId")
  )`,
  `CREATE TABLE IF NOT EXISTS user_books (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "bookId" INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('reading','read','to-read')),
    "isFavorite" BOOLEAN DEFAULT FALSE, "currentPage" INTEGER DEFAULT 0,
    "dateRead" TEXT, "addedAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "bookId")
  )`,
  `CREATE TABLE IF NOT EXISTS user_events (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "eventId" INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('registered','attended','cancelled')),
    "registeredAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "eventId")
  )`,
  `CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('login','book_read','book_added','event_registered','profile_updated')),
    description TEXT NOT NULL, metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_users_verified ON users("isVerified")`,
  `CREATE INDEX IF NOT EXISTS idx_books_category ON books(category)`,
  `CREATE INDEX IF NOT EXISTS idx_activities_user ON activities("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_user_books_user ON user_books("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_user_events_user ON user_events("userId")`,
];

async function initDb() {
  await client.connect();
  console.log('✅ Connecté à Neon');

  for (const stmt of tables) {
    try {
      await client.query(stmt);
      console.log('✅', stmt.split('\n')[0].slice(0, 60));
    } catch (e) {
      console.error('❌', e.message);
    }
  }

  // Créer le compte admin par défaut
  const hash = await bcrypt.hash('Admin1234!', 10);
  await client.query(`
    INSERT INTO users (email, password, "firstName", "lastName", role, "isVerified")
    VALUES ('admin@asm-mada.mg', $1, 'Admin', 'ASM', 'admin', true)
    ON CONFLICT (email) DO NOTHING
  `, [hash]);
  console.log('\n🎉 Admin créé:');
  console.log('   Email    : admin@asm-mada.mg');
  console.log('   Mot de passe : Admin1234!');
  console.log('\nChangez ce mot de passe après la première connexion !');

  await client.end();
  console.log('\n✅ Base de données initialisée avec succès !');
}

initDb().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
