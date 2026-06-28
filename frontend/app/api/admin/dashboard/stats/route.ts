import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

// Alias vers /api/admin/stats
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const [users, books, events, pending, views] = await Promise.all([
      sql`SELECT COUNT(*) as total FROM users WHERE role = 'user'`,
      sql`SELECT COUNT(*) as total FROM books`,
      sql`SELECT COUNT(*) as total FROM events`,
      sql`SELECT COUNT(*) as total FROM users WHERE "isVerified" = false AND role = 'user'`,
      sql`SELECT COALESCE(SUM(views), 0) as total FROM books`,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers:    parseInt(users.rows[0].total as string),
        totalBooks:    parseInt(books.rows[0].total as string),
        totalEvents:   parseInt(events.rows[0].total as string),
        pendingUsers:  parseInt(pending.rows[0].total as string),
        totalViews:    parseInt(views.rows[0].total as string),
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
