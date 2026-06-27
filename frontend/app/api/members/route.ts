import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = (page - 1) * limit;

  try {
    let whereSQL = `WHERE "isVerified" = true AND "isActive" = true`;
    const params: unknown[] = [limit, offset];
    if (search) {
      whereSQL += ` AND ("firstName" ILIKE $3 OR "lastName" ILIKE $3 OR specialization ILIKE $3)`;
      params.push(`%${search}%`);
    }

    const { rows } = await sql.query(
      `SELECT id, "firstName", "lastName", specialization, "graduationYear", institution, location, "photoUrl", expertise, "memberSince"
       FROM users ${whereSQL} ORDER BY "firstName" ASC LIMIT $1 OFFSET $2`,
      params
    );
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
