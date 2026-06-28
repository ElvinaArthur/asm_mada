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
      `SELECT ub.*, b.title, b.author, b.category, b.thumbnail, b.pages
       FROM user_books ub JOIN books b ON ub."bookId" = b.id
       WHERE ub."userId" = $1 ORDER BY ub."updatedAt" DESC NULLS LAST LIMIT $2`,
      [user.id, limit]
    );
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
