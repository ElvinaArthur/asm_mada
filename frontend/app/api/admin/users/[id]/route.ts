import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { rows } = await sql`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "isActive",
           "graduationYear", specialization, "photoUrl", "createdAt", proof_status,
           proof_filename, title, institution, location, bio
    FROM users WHERE id = ${parseInt(params.id)}
  `;
  if (rows.length === 0) return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });
  return NextResponse.json({ success: true, data: rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const { action, reason } = await req.json();
  const userId = parseInt(params.id);

  try {
    switch (action) {
      case 'verify':
        await sql`
          UPDATE users SET "isVerified" = true, proof_status = 'approved',
          "verifiedAt" = NOW(), "verifiedBy" = ${user!.id}
          WHERE id = ${userId}
        `;
        return NextResponse.json({ success: true, message: 'Compte vérifié' });

      case 'reject':
        await sql`
          UPDATE users SET "isVerified" = false, proof_status = 'rejected',
          "rejectedAt" = NOW(), "rejectedBy" = ${user!.id},
          proof_rejection_reason = ${reason || null}
          WHERE id = ${userId}
        `;
        return NextResponse.json({ success: true, message: 'Compte rejeté' });

      case 'toggle-block':
        await sql`UPDATE users SET "isActive" = NOT "isActive" WHERE id = ${userId}`;
        return NextResponse.json({ success: true, message: 'Statut modifié' });

      default:
        return NextResponse.json({ success: false, message: 'Action inconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin user action error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  await sql`DELETE FROM users WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ success: true, message: 'Utilisateur supprimé' });
}
