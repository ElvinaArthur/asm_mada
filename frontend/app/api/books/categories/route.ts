import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await sql`SELECT DISTINCT category FROM books WHERE category IS NOT NULL ORDER BY category`;
    const categories = rows.map(r => r.category);
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
