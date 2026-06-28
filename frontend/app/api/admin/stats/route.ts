import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const err = requireAdmin(user);
  if (err) return NextResponse.json(err.body, { status: err.status });

  try {
    const [usersResult, booksResult, eventsResult, pendingResult, viewsResult, categoriesResult] = await Promise.all([
      sql`SELECT COUNT(*) as total FROM users WHERE role != 'admin'`,
      sql`SELECT COUNT(*) as total FROM books`,
      sql`SELECT COUNT(*) as total FROM events`,
      sql`SELECT COUNT(*) as total FROM users WHERE proof_status = 'pending' AND role != 'admin'`,
      sql`SELECT COALESCE(SUM(views), 0) as total FROM books`,
      sql`SELECT category, COUNT(*) as count FROM books WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC LIMIT 10`,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        // Structure plate (pour compatibilité)
        totalUsers: parseInt(usersResult.rows[0].total as string),
        totalBooks: parseInt(booksResult.rows[0].total as string),
        totalEvents: parseInt(eventsResult.rows[0].total as string),
        pendingVerifications: parseInt(pendingResult.rows[0].total as string),
        totalViews: parseInt(viewsResult.rows[0].total as string),
        // Structure imbriquée (pour AdminDashboard.jsx qui lit stats.totals.*)
        totals: {
          users: parseInt(usersResult.rows[0].total as string),
          books: parseInt(booksResult.rows[0].total as string),
          events: parseInt(eventsResult.rows[0].total as string),
          pendingUsers: parseInt(pendingResult.rows[0].total as string),
          views: parseInt(viewsResult.rows[0].total as string),
        },
        categories: categoriesResult.rows,
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, message: 'Erreur stats' }, { status: 500 });
  }
}
