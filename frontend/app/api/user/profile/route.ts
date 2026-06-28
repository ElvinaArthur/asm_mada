import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// Champs texte simples
const TEXT_FIELDS = ['firstName', 'lastName', 'title', 'institution', 'location', 'expertise', 'bio', 'currentPosition', 'company', 'phone', 'phone2', 'birthDate', 'specialization'];
// Champs entiers
const INT_FIELDS = ['birthYear', 'graduationYear'];
// Champs JSONB — nécessitent un cast explicite
const JSONB_FIELDS = ['academicEducations', 'previousPositions', 'privacy', 'academicBackground'];

const ALL_FIELDS = [...TEXT_FIELDS, ...INT_FIELDS, ...JSONB_FIELDS];

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

      // Upload photo uniquement si fichier valide et token Blob configuré
      if (photo && photo.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const { put } = await import('@vercel/blob');
          const blob = await put(`avatars/${user.id}-${Date.now()}.${photo.name.split('.').pop()}`, photo, { access: 'public' });
          photoUrl = blob.url;
        } catch (blobErr) {
          console.warn('Upload photo blob échoué (token manquant ou erreur):', blobErr);
        }
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

    for (const field of ALL_FIELDS) {
      if (updateData[field] === undefined) continue;

      let value = updateData[field];

      if (JSONB_FIELDS.includes(field)) {
        // Parser la chaîne JSON → objet pour que pg l'envoie correctement en JSONB
        if (typeof value === 'string') {
          try { value = JSON.parse(value); } catch { value = field.endsWith('s') ? [] : {}; }
        }
        fields.push(`"${field}" = $${paramCount++}::jsonb`);
      } else if (INT_FIELDS.includes(field)) {
        value = value ? parseInt(value as string, 10) : null;
        fields.push(`"${field}" = $${paramCount++}`);
      } else {
        fields.push(`"${field}" = $${paramCount++}`);
      }

      values.push(value);
    }

    if (photoUrl) {
      fields.push(`"photoUrl" = $${paramCount++}`);
      values.push(photoUrl);
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: false, message: 'Rien à mettre à jour' }, { status: 400 });
    }

    fields.push(`"updatedAt" = NOW()`);
    values.push(user.id);

    const result = await sql.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, "firstName", "lastName", email, role, "isVerified", "photoUrl", "currentPosition", company, phone, bio`,
      values
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
