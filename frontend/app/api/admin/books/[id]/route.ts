import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { rows } = await sql`SELECT * FROM books WHERE id = ${parseInt(params.id)}`;
  if (rows.length === 0) return NextResponse.json({ success: false, message: 'Livre non trouvé' }, { status: 404 });
  return NextResponse.json({ success: true, data: rows[0] });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const contentType = req.headers.get('content-type') || '';
    let title, author, description, category, year, pages, readTime, fileName, thumbnail;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      title       = formData.get('title') as string;
      author      = formData.get('author') as string;
      description = formData.get('description') as string;
      category    = formData.get('category') as string;
      year        = formData.get('year') as string;
      pages       = formData.get('pages') as string;
      readTime    = formData.get('readTime') as string;

      const pdfFile  = formData.get('pdf') as File | null;
      const imgFile  = formData.get('thumbnail') as File | null;

      // Garder les valeurs actuelles si pas de nouveau fichier
      const { rows: [current] } = await sql`SELECT "fileName", thumbnail FROM books WHERE id = ${parseInt(params.id)}`;
      fileName  = current?.fileName;
      thumbnail = current?.thumbnail;

      if (pdfFile && pdfFile.size > 0) {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const blob = await put(`books/${Date.now()}-${pdfFile.name}`, pdfFile, { access: 'public' });
          fileName = blob.url;
        } else {
          // Fallback: public/books/
          const buf = Buffer.from(await pdfFile.arrayBuffer());
          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const dir = path.join(process.cwd(), 'public', 'books', slug);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'book.pdf'), buf);
          fileName = `/books/${slug}/book.pdf`;
        }
      }
      if (imgFile && imgFile.size > 0) {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const blob = await put(`covers/${Date.now()}-${imgFile.name}`, imgFile, { access: 'public' });
          thumbnail = blob.url;
        } else {
          const buf = Buffer.from(await imgFile.arrayBuffer());
          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const dir = path.join(process.cwd(), 'public', 'books', slug);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const ext = imgFile.name.split('.').pop() || 'png';
          fs.writeFileSync(path.join(dir, `cover.${ext}`), buf);
          thumbnail = `/books/${slug}/cover.${ext}`;
        }
      }
    } else {
      const body = await req.json();
      ({ title, author, description, category, year, pages, readTime, fileName, thumbnail } = body);
    }

    const { rows } = await sql`
      UPDATE books SET
        title = ${title}, author = ${author},
        description = ${description || null},
        category = ${category},
        year = ${year ? parseInt(year as string) : null},
        pages = ${pages ? parseInt(pages as string) : null},
        "readTime" = ${readTime || null},
        "fileName" = ${fileName || null},
        thumbnail = ${thumbnail || null},
        updated_at = NOW()
      WHERE id = ${parseInt(params.id)} RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ success: false, message: 'Livre non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Update book error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  await sql`DELETE FROM books WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ success: true, message: 'Livre supprimé' });
}
