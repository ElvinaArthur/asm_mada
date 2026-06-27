import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { rows } = await sql`
    SELECT id, "firstName", "lastName", email, "graduationYear", specialization, proof_filename, proof_status, proof_uploaded_at, "createdAt"
    FROM users WHERE proof_status = 'pending' ORDER BY "createdAt" ASC
  `;
  return NextResponse.json({ success: true, data: rows });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { userId, action, reason } = await req.json();
  if (!userId || !action) return NextResponse.json({ success: false, message: 'userId et action requis' }, { status: 400 });

  if (action === 'approve') {
    await sql`
      UPDATE users SET "isVerified" = true, proof_status = 'approved', "verifiedAt" = NOW(), "verifiedBy" = ${user!.id}
      WHERE id = ${userId}
    `;
    return NextResponse.json({ success: true, message: 'Utilisateur vérifié' });
  } else if (action === 'reject') {
    await sql`
      UPDATE users SET proof_status = 'rejected', "rejectedAt" = NOW(), "rejectedBy" = ${user!.id}, proof_rejection_reason = ${reason || 'Non spécifié'}
      WHERE id = ${userId}
    `;
    return NextResponse.json({ success: true, message: 'Utilisateur rejeté' });
  }
  return NextResponse.json({ success: false, message: 'Action invalide' }, { status: 400 });
}
