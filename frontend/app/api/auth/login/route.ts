import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email et mot de passe requis' }, { status: 400 });
    }

    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ success: false, message: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    if (user.role === 'user' && !user.isVerified) {
      return NextResponse.json({
        success: false,
        requiresVerification: true,
        message: 'Votre compte est en attente de vérification.',
        userId: user.id,
      }, { status: 403 });
    }

    const token = await signToken({ id: user.id, role: user.role, isVerified: Boolean(user.isVerified) });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        graduationYear: user.graduationYear,
        specialization: user.specialization,
        photoUrl: user.photoUrl || null,
      },
      message: 'Connexion réussie',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
