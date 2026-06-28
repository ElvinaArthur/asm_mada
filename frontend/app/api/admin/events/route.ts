import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { searchParams } = new URL(req.url);
  const page   = parseInt(searchParams.get('page') || '1');
  const limit  = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const search = searchParams.get('search');

  try {
    let whereSQL = 'WHERE 1=1';
    const params: unknown[] = [limit, offset];
    if (search) { whereSQL += ` AND (title ILIKE $3 OR description ILIKE $3)`; params.push(`%${search}%`); }

    const { rows } = await sql.query(
      `SELECT * FROM events ${whereSQL} ORDER BY date DESC LIMIT $1 OFFSET $2`, params
    );
    const { rows: [{ total }] } = await sql.query(
      `SELECT COUNT(*) as total FROM events ${whereSQL}`,
      search ? [`%${search}%`] : []
    );

    return NextResponse.json({ success: true, data: rows, total: parseInt(total as string) });
  } catch (error) {
    console.error('Admin events error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const contentType = req.headers.get('content-type') || '';
    let title, description, date, time, location, maxParticipants, imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData();
      title           = fd.get('title') as string;
      description     = fd.get('description') as string;
      date            = fd.get('date') as string;
      time            = fd.get('time') as string;
      location        = fd.get('location') as string;
      maxParticipants = fd.get('maxParticipants') as string;
      const imgFile   = fd.get('image') as File | null;
      if (imgFile && imgFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`events/${Date.now()}-${imgFile.name}`, imgFile, { access: 'public' });
        imageUrl = blob.url;
      }
    } else {
      const body = await req.json();
      ({ title, description, date, time, location, maxParticipants, imageUrl } = body);
    }

    const eventDate = time ? `${date}T${time}:00` : date;

    const { rows } = await sql`
      INSERT INTO events (title, description, date, location, "imageUrl", "maxParticipants", "isPublished")
      VALUES (${title}, ${description || null}, ${eventDate}, ${location || null},
              ${imageUrl}, ${maxParticipants ? parseInt(maxParticipants as string) : null}, true)
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
