import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramCount = 1;

    if (category && category !== 'all') {
      conditions.push(`category = $${paramCount++}`);
      params.push(category);
    }
    if (search) {
      conditions.push(`(title ILIKE $${paramCount} OR author ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows: books } = await sql.query(
      `SELECT * FROM books ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );
    const { rows: [{ total }] } = await sql.query(
      `SELECT COUNT(*) as total FROM books ${whereClause}`,
      params
    );

    return NextResponse.json({ success: true, data: books, total: parseInt(total as string), page, pages: Math.ceil(parseInt(total as string) / limit) });
  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const adminError = requireAdmin(user);
  if (adminError) return NextResponse.json(adminError.body, { status: adminError.status });

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const year = formData.get('year') as string;
    const pages = formData.get('pages') as string;
    const readTime = formData.get('readTime') as string;
    const pdfFile = formData.get('pdf') as File | null;
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (!title || !author || !category || !pdfFile) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants' }, { status: 400 });
    }

    const pdfBlob = await put(`books/${Date.now()}-${pdfFile.name}`, pdfFile, { access: 'public' });
    let thumbnailUrl = null;
    if (thumbnailFile) {
      const thumbBlob = await put(`thumbnails/${Date.now()}-${thumbnailFile.name}`, thumbnailFile, { access: 'public' });
      thumbnailUrl = thumbBlob.url;
    }

    const result = await sql`
      INSERT INTO books (title, author, description, category, year, pages, "readTime", "fileName", thumbnail)
      VALUES (${title}, ${author}, ${description || null}, ${category}, ${year ? parseInt(year) : null}, ${pages ? parseInt(pages) : null}, ${readTime || null}, ${pdfBlob.url}, ${thumbnailUrl})
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la création' }, { status: 500 });
  }
}
