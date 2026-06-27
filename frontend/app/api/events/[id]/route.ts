import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await sql`SELECT e.*, COUNT(ue.id) as "participantsCount" FROM events e LEFT JOIN user_events ue ON e.id = ue."eventId" WHERE e.id = ${parseInt(params.id)} GROUP BY e.id`;
  if (result.rows.length === 0) return NextResponse.json({ success: false, message: 'Événement non trouvé' }, { status: 404 });
  return NextResponse.json({ success: true, data: result.rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const adminError = requireAdmin(user);
  if (adminError) return NextResponse.json(adminError.body, { status: adminError.status });
  const body = await req.json();
  const { title, description, date, location, imageUrl, maxParticipants, isPublished } = body;
  const result = await sql`
    UPDATE events SET title=${title}, description=${description||null}, date=${date}, location=${location||null},
    "imageUrl"=${imageUrl||null}, "maxParticipants"=${maxParticipants||null}, "isPublished"=${isPublished??true}, updated_at=NOW()
    WHERE id=${parseInt(params.id)} RETURNING *
  `;
  if (result.rows.length === 0) return NextResponse.json({ success: false, message: 'Non trouvé' }, { status: 404 });
  return NextResponse.json({ success: true, data: result.rows[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  const adminError = requireAdmin(user);
  if (adminError) return NextResponse.json(adminError.body, { status: adminError.status });
  await sql`DELETE FROM events WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ success: true, message: 'Événement supprimé' });
}
