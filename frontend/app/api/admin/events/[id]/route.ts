import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { rows } = await sql`SELECT * FROM events WHERE id = ${parseInt(params.id)}`;
  if (rows.length === 0) return NextResponse.json({ success: false, message: 'Événement non trouvé' }, { status: 404 });
  return NextResponse.json({ success: true, data: rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const contentType = req.headers.get('content-type') || '';
    let title, description, date, time, location, maxParticipants, isPublished, imageUrl: string | null | undefined;

    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData();
      title           = fd.get('title') as string;
      description     = fd.get('description') as string;
      date            = fd.get('date') as string;
      time            = fd.get('time') as string;
      location        = fd.get('location') as string;
      maxParticipants = fd.get('maxParticipants') as string;
      isPublished     = fd.get('isPublished') === '1' || fd.get('isPublished') === 'true';
      const imgFile   = fd.get('image') as File | null;
      if (imgFile && imgFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`events/${Date.now()}-${imgFile.name}`, imgFile, { access: 'public' });
        imageUrl = blob.url;
      }
    } else {
      const body = await req.json();
      ({ title, description, date, time, location, maxParticipants, isPublished, imageUrl } = body);
    }

    const eventDate = (time && date) ? `${date}T${time}:00` : (date || undefined);

    // Si pas d'image dans la request, garder l'ancienne
    if (imageUrl === undefined) {
      const { rows: [current] } = await sql`SELECT "imageUrl" FROM events WHERE id = ${parseInt(params.id)}`;
      imageUrl = current?.imageUrl ?? null;
    }

    const { rows } = await sql`
      UPDATE events SET
        title = ${title}, description = ${description || null},
        date = ${eventDate ? eventDate : sql`date`},
        location = ${location || null},
        "imageUrl" = ${imageUrl},
        "maxParticipants" = ${maxParticipants ? parseInt(maxParticipants as string) : null},
        "isPublished" = ${isPublished ?? true},
        updated_at = NOW()
      WHERE id = ${parseInt(params.id)} RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ success: false, message: 'Événement non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  await sql`DELETE FROM events WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ success: true, message: 'Événement supprimé' });
}
