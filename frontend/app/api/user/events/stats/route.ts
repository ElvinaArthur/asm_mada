import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  try {
    const { rows } = await sql`
      SELECT
        COUNT(*) FILTER (WHERE ue.status = 'attended') AS "attended",
        COUNT(*) FILTER (WHERE e.date > NOW() AND ue.status = 'registered') AS "upcoming"
      FROM user_events ue JOIN events e ON ue."eventId" = e.id
      WHERE ue."userId" = ${user.id}
    `;
    return NextResponse.json({ success: true, data: rows[0] });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
