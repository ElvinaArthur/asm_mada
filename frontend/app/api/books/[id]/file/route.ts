import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
  }
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

    let pdfBytes: Uint8Array;

    if (fileName.startsWith('http')) {
      // Vercel Blob URL
      const response = await fetch(fileName);
      if (!response.ok) return NextResponse.json({ success: false, message: 'Fichier introuvable' }, { status: 404 });
      pdfBytes = new Uint8Array(await response.arrayBuffer());
    } else {
      // Fichier local dans public/
      const filePath = path.join(process.cwd(), 'public', fileName);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, message: 'Fichier introuvable' }, { status: 404 });
      }
      pdfBytes = new Uint8Array(fs.readFileSync(filePath));
    }

    // === WATERMARK avec pdf-lib ===
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      const watermarkText = `© ASM 2026 — Lecture autorisée uniquement sur asm-mada.vercel.app`;

      for (const page of pages) {
        const { width, height } = page.getSize();

        // Filigrane diagonal en milieu de page
        page.drawText(watermarkText, {
          x: width / 2 - 280,
          y: height / 2,
          size: 14,
          font: helvetica,
          color: rgb(0.75, 0.75, 0.75),
          opacity: 0.35,
          rotate: degrees(45),
        });

        // Filigrane en bas de chaque page
        page.drawText(`ASM — asm-mada.vercel.app`, {
          x: 20,
          y: 12,
          size: 8,
          font: helvetica,
          color: rgb(0.6, 0.6, 0.6),
          opacity: 0.5,
        });
      }

      pdfBytes = await pdfDoc.save();
    } catch (wErr) {
      console.warn('Watermark skipped (PDF encrypted or error):', (wErr as Error).message);
      // Servir le PDF original sans watermark si erreur
    }

    // Incrémenter les vues
    await sql`UPDATE books SET views = views + 1 WHERE id = ${parseInt(params.id)}`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(book.title as string)}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    console.error('Erreur serve PDF:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
