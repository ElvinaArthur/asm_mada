import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  const result = await sql`SELECT * FROM users WHERE id = ${user.id}`;
  if (result.rows.length === 0) return NextResponse.json({ success: false, message: 'Non trouvé' }, { status: 404 });
  const { password: _, ...safeUser } = result.rows[0];
  return NextResponse.json({ success: true, data: safeUser });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

  try {
    const contentType = req.headers.get('content-type') || '';
    let updateData: Record<string, unknown> = {};
    let photoUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const photo = formData.get('photo') as File | null;
      if (photo) {
        const blob = await put(`avatars/${user.id}-${Date.now()}.${photo.name.split('.').pop()}`, photo, { access: 'public' });
        photoUrl = blob.url;
      }
      formData.forEach((value, key) => {
        if (key !== 'photo') updateData[key] = value;
      });
    } else {
      updateData = await req.json();
    }

    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    const allowedFields = ['firstName', 'lastName', 'title', 'institution', 'location', 'expertise', 'bio', 'currentPosition', 'company', 'phone', 'phone2', 'birthDate', 'birthYear', 'graduationYear', 'specialization'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`"${field}" = $${paramCount++}`);
        values.push(updateData[field]);
      }
    });

    if (photoUrl) {
      fields.push(`"photoUrl" = $${paramCount++}`);
      values.push(photoUrl);
    }
    if (fields.length === 0) return NextResponse.json({ success: false, message: 'Rien à mettre à jour' }, { status: 400 });

    fields.push(`"updatedAt" = NOW()`);
    values.push(user.id);

    const result = await sql.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, "firstName", "lastName", email, role, "isVerified", "photoUrl"`,
      values
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
