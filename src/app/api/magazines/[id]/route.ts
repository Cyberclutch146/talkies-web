import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check password from header or body
    // We'll read it from the JSON body
    const body = await request.json();
    const { password } = body;
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const magazine = await prisma.magazine.findUnique({
      where: { id },
    });

    if (!magazine) {
      return NextResponse.json({ error: 'Magazine not found' }, { status: 404 });
    }

    // Try to delete the physical files
    try {
      if (magazine.pdfUrl) {
        // e.g. /uploads/magazines/mag_123.pdf
        const pdfFilename = magazine.pdfUrl.split('/').pop();
        if (pdfFilename) {
          const pdfPath = path.join(process.cwd(), 'public/uploads/magazines', pdfFilename);
          await unlink(pdfPath).catch((e) => console.error("Error deleting PDF file:", e));
        }
      }
      
      if (magazine.coverImage) {
        const coverFilename = magazine.coverImage.split('/').pop();
        if (coverFilename) {
          const coverPath = path.join(process.cwd(), 'public/uploads/magazines', coverFilename);
          await unlink(coverPath).catch((e) => console.error("Error deleting cover file:", e));
        }
      }
    } catch (e) {
      console.error("File deletion error (non-fatal):", e);
    }

    // Delete from database
    await prisma.magazine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting magazine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
