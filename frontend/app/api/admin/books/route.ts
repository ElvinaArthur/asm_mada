import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const search = searchParams.get('search');

  try {
    let whereSQL = '';
    const params: unknown[] = [limit, offset];

    if (search) {
      whereSQL = `WHERE title ILIKE $3 OR author ILIKE $3`;
      params.push(`%${search}%`);
    }

    const { rows } = await sql.query(
      `SELECT * FROM books ${whereSQL} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      params
    );
    const { rows: [{ total }] } = await sql.query(
      `SELECT COUNT(*) as total FROM books ${whereSQL}`,
      search ? [`%${search}%`] : []
    );

    return NextResponse.json({ success: true, data: rows, total: parseInt(total) });
  } catch (error) {
    console.error('Admin books error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ success: false, message: 'id requis' }, { status: 400 });

  await sql`DELETE FROM books WHERE id = ${parseInt(id)}`;
  return NextResponse.json({ success: true, message: 'Livre supprimé' });
}
