import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Vérifier l'authentification
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
  }

  // Vérifier que l'utilisateur est vérifié
  if (!user.isVerified && user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Compte non vérifié' }, { status: 403 });
  }

  try {
    const result = await sql`SELECT "fileName", title FROM books WHERE id = ${parseInt(params.id)}`;
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Livre non trouvé' }, { status: 404 });
    }

    const book = result.rows[0];
    const fileName = book.fileName as string;

    // Le fichier est dans public/
    const filePath = path.join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, message: 'Fichier introuvable' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Incrémenter les vues
    await sql`UPDATE books SET views = views + 1 WHERE id = ${parseInt(params.id)}`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // Affichage inline sans bouton télécharger
        'Content-Disposition': `inline; filename="${encodeURIComponent(book.title as string)}.pdf"`,
        // Empêcher le téléchargement et la mise en cache
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        // Empêcher l'embedding externe
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "default-src 'self'",
      },
    });
  } catch (error) {
    console.error('Erreur serve PDF:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
