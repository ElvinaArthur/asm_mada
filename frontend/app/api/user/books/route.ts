import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const result = await sql`
    SELECT ub.*, b.title, b.author, b.category, b.thumbnail, b."fileName"
    FROM user_books ub JOIN books b ON ub."bookId" = b.id
    WHERE ub."userId" = ${user.id} ORDER BY ub."addedAt" DESC
  `;
  return NextResponse.json({ success: true, data: result.rows });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const { bookId, status } = await req.json();
  if (!bookId || !status) return NextResponse.json({ success: false, message: 'bookId et status requis' }, { status: 400 });

  try {
    const result = await sql`
      INSERT INTO user_books ("userId", "bookId", status) VALUES (${user.id}, ${bookId}, ${status})
      ON CONFLICT ("userId", "bookId") DO UPDATE SET status = ${status}, "updatedAt" = NOW()
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
