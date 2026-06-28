// Script d'import des livres depuis le dossier local
// Usage: node scripts/import-books.mjs

import pg from 'pg';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOKS_SOURCE = 'C:\\Users\\Rasoa\\Desktop\\Boky hatsofoka anaty drive pour site ASM';
const PUBLIC_BOOKS = path.join(__dirname, '..', 'public', 'books');

const DB_URL = 'postgresql://neondb_owner:npg_FgmeV8prsCK7@ep-holy-band-atv3z7tw.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }
});

// Mapping dossier → métadonnées du livre
const BOOK_META = {
  '100 penseurs de la societe': {
    title: '100 penseurs de la société',
    author: 'Collectif PUL',
    category: 'Sociologie générale',
    year: 2010,
  },
  '150 petites expériences de psychologie des médias': {
    title: '150 petites expériences de psychologie des médias',
    author: 'Dunod',
    category: 'Psychologie sociale',
    year: 2008,
  },
  'Citoyenneté et démocratie': {
    title: 'Citoyenneté et démocratie',
    author: 'La Documentation Française',
    category: 'Science politique',
    year: 2012,
  },
  'De la democratie en Amerique': {
    title: 'De la démocratie en Amérique',
    author: 'Alexis de Tocqueville',
    category: 'Science politique',
    year: 1835,
  },
  'FORME ELEMENTAIRE PAUVRETE': {
    title: 'Forme élémentaire de la pauvreté',
    author: 'Collectif',
    category: 'Sociologie générale',
    year: 2005,
  },
  'Histoire des pensées sociologiques': {
    title: 'Histoire des pensées sociologiques',
    author: 'Armand Colin',
    category: 'Histoire de la sociologie',
    year: 2015,
  },
  'La sociologie comme science': {
    title: 'La sociologie comme science',
    author: 'Raymond Boudon',
    category: 'Sociologie générale',
    year: 2010,
  },
  'Lanalyse qualitative en sciences humaines et sociales': {
    title: "L'analyse qualitative en sciences humaines et sociales",
    author: 'Pierre Paillé, Alex Mucchielli',
    category: 'Méthodologie',
    year: 2016,
  },
  'Lanalyse quantitative des données': {
    title: "L'analyse quantitative des données",
    author: 'Olivier Martin',
    category: 'Méthodologie',
    year: 2012,
  },
  'Le coup d_Etat citoyen': {
    title: "Le coup d'État citoyen",
    author: 'La Découverte',
    category: 'Science politique',
    year: 2011,
  },
  'Le manager à l_écoute du sociologue': {
    title: "Le manager à l'écoute du sociologue",
    author: 'Éditions Organisation',
    category: 'Sociologie des organisations',
    year: 2009,
  },
  'MANUEL_DE_RECHERCHE_EN_SCIENCES_SOCIALES': {
    title: 'Manuel de recherche en sciences sociales',
    author: 'Luc Van Campenhoudt, Raymond Quivy',
    category: 'Méthodologie',
    year: 2017,
  },
  'Nouveau manuel de sociologie': {
    title: 'Nouveau manuel de sociologie',
    author: 'François de Singly, Christophe Giraud',
    category: 'Sociologie générale',
    year: 2010,
  },
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function readDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim().slice(0, 2000); // max 2000 chars
  } catch {
    return null;
  }
}

async function importBooks() {
  // Créer le dossier public/books
  if (!fs.existsSync(PUBLIC_BOOKS)) {
    fs.mkdirSync(PUBLIC_BOOKS, { recursive: true });
  }

  await client.connect();
  console.log('✅ Connecté à Neon\n');

  const folders = fs.readdirSync(BOOKS_SOURCE).filter(f => {
    const full = path.join(BOOKS_SOURCE, f);
    return fs.statSync(full).isDirectory() && f !== 'assets';
  });

  let imported = 0;
  let skipped = 0;

  for (const folder of folders) {
    console.log(`📚 Traitement: ${folder}`);
    const srcDir = path.join(BOOKS_SOURCE, folder);
    const files = fs.readdirSync(srcDir);

    // Trouver PDF, PNG, DOCX
    const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
    const pngFile = files.find(f => f.toLowerCase().endsWith('.png'));
    const docxFile = files.find(f => f.toLowerCase().endsWith('.docx'));

    if (!pdfFile) {
      console.log(`  ⚠️  Pas de PDF trouvé, ignoré\n`);
      skipped++;
      continue;
    }

    const meta = BOOK_META[folder] || {
      title: folder,
      author: 'Inconnu',
      category: 'Sociologie générale',
      year: null,
    };

    const slug = slugify(meta.title);
    const destDir = path.join(PUBLIC_BOOKS, slug);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Copier PDF
    const pdfDest = path.join(destDir, 'book.pdf');
    fs.copyFileSync(path.join(srcDir, pdfFile), pdfDest);
    console.log(`  ✅ PDF copié`);

    // Copier thumbnail
    let thumbnailUrl = null;
    if (pngFile) {
      const thumbDest = path.join(destDir, 'cover.png');
      fs.copyFileSync(path.join(srcDir, pngFile), thumbDest);
      thumbnailUrl = `/books/${slug}/cover.png`;
      console.log(`  ✅ Couverture copiée`);
    }

    // Lire description depuis .docx
    let description = null;
    if (docxFile) {
      description = await readDocx(path.join(srcDir, docxFile));
      if (description) console.log(`  ✅ Description extraite (${description.length} chars)`);
    }

    const fileUrl = `/books/${slug}/book.pdf`;

    // Insérer dans Neon
    try {
      await client.query(`
        INSERT INTO books (title, author, description, category, year, "fileName", thumbnail)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT ("fileName") DO UPDATE SET
          title = EXCLUDED.title,
          author = EXCLUDED.author,
          description = EXCLUDED.description,
          thumbnail = EXCLUDED.thumbnail,
          updated_at = NOW()
      `, [meta.title, meta.author, description, meta.category, meta.year, fileUrl, thumbnailUrl]);
      console.log(`  ✅ Inséré dans la DB\n`);
      imported++;
    } catch (e) {
      console.error(`  ❌ Erreur DB: ${e.message}\n`);
      skipped++;
    }
  }

  await client.end();

  console.log('═══════════════════════════════════');
  console.log(`✅ ${imported} livres importés`);
  if (skipped > 0) console.log(`⚠️  ${skipped} ignorés`);
  console.log('\nFichiers dans: frontend/public/books/');
  console.log('Fais un git push pour déployer sur Vercel !');
}

importBooks().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
