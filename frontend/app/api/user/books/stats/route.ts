import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  try {
    const { rows } = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'read') AS "booksRead",
        COUNT(*) FILTER (WHERE status = 'reading') AS "booksReading",
        COUNT(*) FILTER (WHERE status = 'to-read') AS "toRead",
        COUNT(*) FILTER (WHERE "isFavorite" = true) AS "favorites"
      FROM user_books WHERE "userId" = ${user.id}
    `;
    return NextResponse.json({ success: true, data: rows[0] });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
