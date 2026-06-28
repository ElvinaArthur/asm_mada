import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT category, COUNT(*)::int AS count
      FROM books
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC, category ASC
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
