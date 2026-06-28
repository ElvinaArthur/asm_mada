import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`UPDATE books SET views = views + 1 WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
