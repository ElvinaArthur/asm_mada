import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const bookId = parseInt(params.id);

  try {
    const existing = await sql`SELECT "isFavorite" FROM user_books WHERE "userId" = ${user.id} AND "bookId" = ${bookId}`;
    if (existing.rows.length === 0) {
      await sql`INSERT INTO user_books ("userId", "bookId", status, "isFavorite") VALUES (${user.id}, ${bookId}, 'to-read', true)`;
      return NextResponse.json({ success: true, isFavorite: true });
    }
    const newFav = !existing.rows[0].isFavorite;
    await sql`UPDATE user_books SET "isFavorite" = ${newFav}, "updatedAt" = NOW() WHERE "userId" = ${user.id} AND "bookId" = ${bookId}`;
    return NextResponse.json({ success: true, isFavorite: newFav });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
