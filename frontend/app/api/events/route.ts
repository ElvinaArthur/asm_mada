import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const result = await sql`
      SELECT e.*, COUNT(ue.id) as "participantsCount"
      FROM events e
      LEFT JOIN user_events ue ON e.id = ue."eventId" AND ue.status != 'cancelled'
      WHERE e."isPublished" = true
      GROUP BY e.id ORDER BY e.date ASC
    `;
    return NextResponse.json({ success: true, data: result.rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const adminError = requireAdmin(user);
  if (adminError) return NextResponse.json(adminError.body, { status: adminError.status });

  try {
    const body = await req.json();
    const { title, description, date, location, imageUrl, maxParticipants } = body;
    if (!title || !date) return NextResponse.json({ success: false, message: 'Titre et date requis' }, { status: 400 });

    const result = await sql`
      INSERT INTO events (title, description, date, location, "imageUrl", "maxParticipants")
      VALUES (${title}, ${description || null}, ${date}, ${location || null}, ${imageUrl || null}, ${maxParticipants || null})
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
