import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const search = searchParams.get('search');

  try {
    let whereSQL = '';
    const params: unknown[] = [limit, offset];

    if (search) {
      whereSQL = `WHERE title ILIKE $3 OR author ILIKE $3`;
      params.push(`%${search}%`);
    }

    const { rows } = await sql.query(
      `SELECT * FROM books ${whereSQL} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      params
    );
    const { rows: [{ total }] } = await sql.query(
      `SELECT COUNT(*) as total FROM books ${whereSQL}`,
      search ? [`%${search}%`] : []
    );

    return NextResponse.json({ success: true, data: rows, total: parseInt(total) });
  } catch (error) {
    console.error('Admin books error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const formData = await req.formData();
    const title       = formData.get('title') as string;
    const author      = formData.get('author') as string;
    const description = formData.get('description') as string;
    const category    = formData.get('category') as string;
    const year        = formData.get('year') as string;
    const pages       = formData.get('pages') as string;
    const readTime    = formData.get('readTime') as string;
    const pdfFile     = formData.get('pdf') as File | null;
    const imgFile     = formData.get('thumbnail') as File | null;

    if (!title || !author || !category || !pdfFile) {
      return NextResponse.json({ success: false, message: 'Titre, auteur, catégorie et PDF sont requis' }, { status: 400 });
    }

    const slug = title.toLowerCase()
      .replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[ùûü]/g,'u')
      .replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

    let fileName: string;
    let thumbnail: string | null = null;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const pdfBlob = await put(`books/${slug}-${Date.now()}.pdf`, pdfFile, { access: 'public' });
      fileName = pdfBlob.url;
      if (imgFile && imgFile.size > 0) {
        const imgBlob = await put(`covers/${slug}-${Date.now()}.${imgFile.name.split('.').pop()}`, imgFile, { access: 'public' });
        thumbnail = imgBlob.url;
      }
    } else {
      // Fallback: stocker dans public/books/
      const dir = path.join(process.cwd(), 'public', 'books', slug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'book.pdf'), Buffer.from(await pdfFile.arrayBuffer()));
      fileName = `/books/${slug}/book.pdf`;
      if (imgFile && imgFile.size > 0) {
        const ext = imgFile.name.split('.').pop() || 'png';
        fs.writeFileSync(path.join(dir, `cover.${ext}`), Buffer.from(await imgFile.arrayBuffer()));
        thumbnail = `/books/${slug}/cover.${ext}`;
      }
    }

    const { rows } = await sql`
      INSERT INTO books (title, author, description, category, year, pages, "readTime", "fileName", thumbnail)
      VALUES (${title}, ${author}, ${description || null}, ${category},
              ${year ? parseInt(year) : null}, ${pages ? parseInt(pages) : null},
              ${readTime || null}, ${fileName}, ${thumbnail})
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ success: false, message: 'id requis' }, { status: 400 });

  await sql`DELETE FROM books WHERE id = ${parseInt(id)}`;
  return NextResponse.json({ success: true, message: 'Livre supprimé' });
}
