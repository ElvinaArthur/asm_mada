import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`SELECT * FROM books WHERE id = ${parseInt(params.id)}`;
    if (result.rows.length === 0) return NextResponse.json({ success: false, message: 'Livre non trouvé' }, { status: 404 });
    await sql`UPDATE books SET views = views + 1 WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const adminError = requireAdmin(user);
  if (adminError) return NextResponse.json(adminError.body, { status: adminError.status });

  try {
    const body = await req.json();
    const { title, author, description, category, year, pages, readTime } = body;

    const result = await sql`
      UPDATE books SET title = ${title}, author = ${author}, description = ${description || null},
      category = ${category}, year = ${year || null}, pages = ${pages || null},
      "readTime" = ${readTime || null}, updated_at = NOW()
      WHERE id = ${parseInt(params.id)} RETURNING *
    `;
    if (result.rows.length === 0) return NextResponse.json({ success: false, message: 'Livre non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const adminError = requireAdmin(user);
  if (adminError) return NextResponse.json(adminError.body, { status: adminError.status });

  try {
    await sql`DELETE FROM books WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true, message: 'Livre supprimé' });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
