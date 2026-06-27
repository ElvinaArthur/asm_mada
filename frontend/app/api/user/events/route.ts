import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const result = await sql`
    SELECT ue.*, e.title, e.date, e.location, e."imageUrl"
    FROM user_events ue JOIN events e ON ue."eventId" = e.id
    WHERE ue."userId" = ${user.id} ORDER BY e.date DESC
  `;
  return NextResponse.json({ success: true, data: result.rows });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const { eventId } = await req.json();
  if (!eventId) return NextResponse.json({ success: false, message: 'eventId requis' }, { status: 400 });

  try {
    const result = await sql`
      INSERT INTO user_events ("userId", "eventId", status) VALUES (${user.id}, ${eventId}, 'registered')
      ON CONFLICT ("userId", "eventId") DO NOTHING RETURNING *
    `;
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
