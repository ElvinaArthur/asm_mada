// Script d'import des livres — version complète avec parsing docx
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

const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

function slugify(str) {
  return str.toLowerCase()
    .replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[ùûü]/g,'u')
    .replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

// Cherche la valeur d'un champ "Label : valeur" dans le texte (insensible à la casse)
function getField(lines, ...labels) {
  for (const label of labels) {
    const re = new RegExp('^' + label + '\\s*:(.+)$', 'i');
    for (const line of lines) {
      const m = line.match(re);
      if (m && m[1] && m[1].trim()) return m[1].trim();
    }
  }
  return null;
}

async function parseDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const rawLines = result.value.split('\n').map(l => l.replace(/\r$/, ''));

    const title     = getField(rawLines, 'Titre du livre');
    const authors   = getField(rawLines, 'Auteur\\(s\\) du livre', 'Auteur du livre', 'Auteur\\(s\\)', 'Auteur', 'Auteurs');
    const pagesRaw  = getField(rawLines, 'Nombre de pages?');
    const yearRaw   = getField(rawLines, 'Ann.e de parution');
    const edition   = getField(rawLines, 'Édition', 'Edition');
    const keywords  = getField(rawLines, 'Mots.cl.s SEO', 'Mots.cl.s');
    const categories = getField(rawLines, 'Cat.gories?', 'Cat.gorie');

    // Extraire le résumé : lignes entre le label "Résumé" et le prochain champ structuré
    const structuredKeys = /^(Édition|Edition|Collection|Catégorie|Mots|$)/i;
    let inResume = false;
    const resumeLines = [];
    for (const line of rawLines) {
      if (/^R.sum. du livre/i.test(line)) { inResume = true; continue; }
      if (inResume) {
        if (structuredKeys.test(line)) break;
        resumeLines.push(line);
      }
    }
    // Si pas de label "Résumé", prendre le premier long paragraphe
    let resume = resumeLines.join('\n').trim() || null;
    if (!resume) {
      const longLine = rawLines.find(l => l.length > 150);
      resume = longLine || null;
    }

    const pagesMatch = pagesRaw ? pagesRaw.match(/(\d+)/) : null;
    const pages = pagesMatch ? parseInt(pagesMatch[1]) : null;
    const readTime = pages ? `${Math.round(pages / 30)} heures` : null;

    const yearMatch = yearRaw ? yearRaw.match(/(\d{4})/) : null;
    const year = yearMatch ? parseInt(yearMatch[1]) : null;

    const description = [
      resume,
      edition   ? `Édition : ${edition}`       : null,
      categories ? `Catégories : ${categories}` : null,
      keywords   ? `Mots-clés : ${keywords}`    : null,
    ].filter(Boolean).join('\n\n');

    return { title, authors, pages, year, readTime, edition, keywords, categories, description };
  } catch (e) {
    console.error('  ❌ Erreur lecture docx:', e.message, e.stack);
    return {};
  }
}

async function importBooks() {
  if (!fs.existsSync(PUBLIC_BOOKS)) fs.mkdirSync(PUBLIC_BOOKS, { recursive: true });

  await client.connect();
  console.log('✅ Connecté à Neon\n');

  // Vider les livres existants pour repartir proprement
  await client.query('DELETE FROM books');
  console.log('🗑️  Anciens livres supprimés\n');

  const folders = fs.readdirSync(BOOKS_SOURCE).filter(f => {
    const full = path.join(BOOKS_SOURCE, f);
    return fs.statSync(full).isDirectory() && f !== 'assets';
  });

  let imported = 0;

  for (const folder of folders) {
    console.log(`📚 ${folder}`);
    const srcDir = path.join(BOOKS_SOURCE, folder);
    const files = fs.readdirSync(srcDir);

    const pdfFile   = files.find(f => f.toLowerCase().endsWith('.pdf'));
    const pngFile   = files.find(f => f.toLowerCase().endsWith('.png'));
    const docxFile  = files.find(f => f.toLowerCase().endsWith('.docx'));

    if (!pdfFile) { console.log('  ⚠️  Pas de PDF, ignoré\n'); continue; }

    // Parser le docx
    const meta = docxFile ? await parseDocx(path.join(srcDir, docxFile)) : {};

    const title   = meta.title || folder;
    const authors = meta.authors || 'Auteur inconnu';
    const slug    = slugify(title);
    const destDir = path.join(PUBLIC_BOOKS, slug);

    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Copier PDF
    fs.copyFileSync(path.join(srcDir, pdfFile), path.join(destDir, 'book.pdf'));
    console.log(`  ✅ PDF copié`);

    // Copier thumbnail
    let thumbnailUrl = null;
    if (pngFile) {
      fs.copyFileSync(path.join(srcDir, pngFile), path.join(destDir, 'cover.png'));
      thumbnailUrl = `/books/${slug}/cover.png`;
      console.log(`  ✅ Couverture copiée → ${thumbnailUrl}`);
    }

    const fileUrl = `/books/${slug}/book.pdf`;

    console.log(`  📝 Titre: ${title}`);
    console.log(`  👤 Auteur(s): ${authors}`);
    console.log(`  📄 Pages: ${meta.pages || '?'} | Année: ${meta.year || '?'} | Lecture: ${meta.readTime || '?'}`);

    try {
      await client.query(`
        INSERT INTO books (title, author, description, category, year, pages, "readTime", "fileName", thumbnail)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT ("fileName") DO UPDATE SET
          title = EXCLUDED.title, author = EXCLUDED.author,
          description = EXCLUDED.description, category = EXCLUDED.category,
          year = EXCLUDED.year, pages = EXCLUDED.pages,
          "readTime" = EXCLUDED."readTime", thumbnail = EXCLUDED.thumbnail,
          updated_at = NOW()
      `, [
        title,
        authors,
        meta.description || null,
        meta.categories?.split(',')[0]?.trim() || 'Sociologie générale',
        meta.year,
        meta.pages,
        meta.readTime,
        fileUrl,
        thumbnailUrl,
      ]);
      console.log(`  ✅ Inséré en DB\n`);
      imported++;
    } catch (e) {
      console.error(`  ❌ DB: ${e.message}\n`);
    }
  }

  await client.end();
  console.log(`═══════════════════════════════════`);
  console.log(`✅ ${imported} livres importés avec succès`);
  console.log(`\n→ Fais: git add . && git commit -m "import livres" && git push`);
}

importBooks().catch(err => { console.error(err); process.exit(1); });
