import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  const [usersResult, booksResult, eventsResult, pendingResult] = await Promise.all([
    sql`SELECT COUNT(*) as total FROM users WHERE "isActive" = true`,
    sql`SELECT COUNT(*) as total FROM books`,
    sql`SELECT COUNT(*) as total FROM events WHERE "isPublished" = true`,
    sql`SELECT COUNT(*) as total FROM users WHERE proof_status = 'pending'`,
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalUsers: parseInt(usersResult.rows[0].total as string),
      totalBooks: parseInt(booksResult.rows[0].total as string),
      totalEvents: parseInt(eventsResult.rows[0].total as string),
      pendingVerifications: parseInt(pendingResult.rows[0].total as string),
    }
  });
}
