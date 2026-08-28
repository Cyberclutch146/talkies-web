import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    // Check password
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    if (body.password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the magazine first to find its file URLs
    const magazine = await prisma.magazine.findUnique({
      where: { id },
    });

    if (!magazine) {
      return NextResponse.json({ error: 'Magazine not found' }, { status: 404 });
    }

    // Delete files from Vercel Blob
    try {
      if (magazine.pdfUrl && magazine.pdfUrl.includes('public.blob.vercel-storage.com')) {
        await del(magazine.pdfUrl);
      }
      if (magazine.coverImage && magazine.coverImage.includes('public.blob.vercel-storage.com')) {
        await del(magazine.coverImage);
      }
    } catch (e) {
      console.error('Error deleting file from Blob, proceeding with db deletion anyway:', e);
    }

    // Delete from database
    await prisma.magazine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting magazine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    // Check password
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    if (body.password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, volume, year, description } = body;

    if (!title || !volume || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const magazine = await prisma.magazine.update({
      where: { id },
      data: {
        title,
        volume,
        year,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, magazine });
  } catch (error) {
    console.error('Error updating magazine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
