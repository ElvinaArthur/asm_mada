import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const { status, currentPage } = await req.json();
  const bookId = parseInt(params.id);

  try {
    const result = await sql`
      UPDATE user_books SET
        status = COALESCE(${status}, status),
        "currentPage" = COALESCE(${currentPage ?? null}, "currentPage"),
        "updatedAt" = NOW()
      WHERE "userId" = ${user.id} AND "bookId" = ${bookId}
      RETURNING *
    `;
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Livre non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  try {
    await sql`DELETE FROM user_books WHERE "userId" = ${user.id} AND "bookId" = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
