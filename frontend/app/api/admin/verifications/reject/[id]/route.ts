import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const { reason } = await req.json().catch(() => ({ reason: '' }));

    const { rows } = await sql`
      UPDATE users SET "isVerified" = false, proof_status = 'rejected',
        "rejectedAt" = NOW(), "rejectedBy" = ${user!.id},
        proof_rejection_reason = ${reason || null}
      WHERE id = ${parseInt(params.id)}
      RETURNING id, "firstName", "lastName", email
    `;
    if (rows.length === 0) return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Compte rejeté', data: rows[0] });
  } catch (error) {
    console.error('Reject user error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
