import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const result = await sql`
    SELECT id, "firstName", "lastName", email, role, "isVerified", "isActive",
           "graduationYear", specialization, "photoUrl", "createdAt", title, institution, location, expertise, bio, "currentPosition", company, phone
    FROM users WHERE id = ${authUser.id}
  `;
  if (result.rows.length === 0) return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });
  return NextResponse.json({ success: true, user: result.rows[0] });
}
