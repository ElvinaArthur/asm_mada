import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const { rows } = await sql`
      SELECT id, "firstName", "lastName", email, proof_filename, proof_status,
             proof_uploaded_at, proof_rejection_reason,
             "graduationYear", specialization, institution
      FROM users WHERE id = ${parseInt(params.id)}
    `;
    if (rows.length === 0) return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });

    const u = rows[0];
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          graduationYear: u.graduationYear,
          specialization: u.specialization,
          institution: u.institution,
        },
        proofUrl: u.proof_filename,      // URL Vercel Blob (accès public)
        proofStatus: u.proof_status,
        uploadedAt: u.proof_uploaded_at,
        rejectionReason: u.proof_rejection_reason,
        // Déterminer le type de fichier
        fileType: u.proof_filename
          ? (u.proof_filename.match(/\.(pdf)$/i) ? 'pdf' : 'image')
          : null,
      }
    });
  } catch (error) {
    console.error('Get proof error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
