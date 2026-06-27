import { NextRequest, NextResponse } from 'next/server';
import { sql, SCHEMA_SQL } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const statements = SCHEMA_SQL.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await sql.query(statement);
      }
    }
    return NextResponse.json({ success: true, message: 'Base de données initialisée' });
  } catch (error) {
    console.error('DB init error:', error);
    return NextResponse.json({ success: false, message: "Erreur d'initialisation" }, { status: 500 });
  }
}
