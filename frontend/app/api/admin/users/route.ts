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

  let whereSQL = 'WHERE 1=1';
  const params: unknown[] = [limit, offset];
  if (search) {
    whereSQL += ` AND ("firstName" ILIKE $3 OR "lastName" ILIKE $3 OR email ILIKE $3)`;
    params.push(`%${search}%`);
  }

  const { rows } = await sql.query(
    `SELECT id, "firstName", "lastName", email, role, "isVerified", "isActive", "graduationYear", specialization, "photoUrl", "createdAt", proof_status
     FROM users ${whereSQL} ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`,
    params
  );
  const { rows: countRows } = await sql.query(`SELECT COUNT(*) as total FROM users ${whereSQL}`, search ? [`%${search}%`] : []);

  return NextResponse.json({ success: true, data: rows, total: parseInt(countRows[0].total as string) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { action, userIds } = await req.json();

  try {
    if (action === 'bulk-approve' || action === 'bulk-verify') {
      for (const id of userIds) {
        await sql`UPDATE users SET "isVerified" = true, proof_status = 'approved', "verifiedAt" = NOW() WHERE id = ${id}`;
      }
      return NextResponse.json({ success: true, message: `${userIds.length} comptes vérifiés` });
    }
    if (action === 'bulk-delete') {
      for (const id of userIds) {
        await sql`DELETE FROM users WHERE id = ${id}`;
      }
      return NextResponse.json({ success: true, message: `${userIds.length} comptes supprimés` });
    }
    return NextResponse.json({ success: false, message: 'Action inconnue' }, { status: 400 });
  } catch (error) {
    console.error('Bulk user action error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
