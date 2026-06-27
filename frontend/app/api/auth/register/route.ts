import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { put } from '@vercel/blob';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const graduationYear = formData.get('graduationYear') as string | null;
    const specialization = formData.get('specialization') as string | null;
    const proof = formData.get('proof') as File | null;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ success: false, message: 'Tous les champs requis' }, { status: 400 });
    }
    if (!proof) {
      return NextResponse.json({ success: false, message: 'Le justificatif est requis' }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'Email déjà utilisé' }, { status: 400 });
    }

    // Upload proof to Vercel Blob
    const blob = await put(`proofs/${Date.now()}-${proof.name}`, proof, { access: 'public' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO users (email, password, "firstName", "lastName", "graduationYear", specialization, role, "isVerified", proof_filename, proof_status, proof_uploaded_at)
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${graduationYear || null}, ${specialization || null}, 'user', false, ${blob.url}, 'pending', NOW())
      RETURNING id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    `;
    const user = result.rows[0];

    const token = await signToken({ id: user.id, role: user.role, isVerified: false });

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie. En attente de vérification.',
      token,
      user: { ...user, photoUrl: user.photoUrl || null },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
