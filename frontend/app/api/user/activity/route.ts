import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '5');

  try {
    const { rows } = await sql.query(
      `SELECT 'book' AS type, b.title, ub.status, ub."updatedAt" AS date, b.thumbnail
       FROM user_books ub JOIN books b ON ub."bookId" = b.id
       WHERE ub."userId" = $1
       UNION ALL
       SELECT 'event' AS type, e.title, ue.status, ue."registeredAt" AS date, e."imageUrl" AS thumbnail
       FROM user_events ue JOIN events e ON ue."eventId" = e.id
       WHERE ue."userId" = $1
       ORDER BY date DESC NULLS LAST LIMIT $2`,
      [user.id, limit]
    );
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
