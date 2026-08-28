import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const magazines = await prisma.magazine.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(magazines);
  } catch (error) {
    console.error('Error fetching magazines:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Check password
    const password = formData.get('password');
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set.');
      return NextResponse.json({ error: 'Server misconfigured. Contact the admin.' }, { status: 500 });
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const title = formData.get('title') as string;
    const volume = formData.get('volume') as string;
    const year = formData.get('year') as string;
    const description = formData.get('description') as string | null;
    const file = formData.get('pdf') as File;
    const coverImage = formData.get('coverImage') as File | null;

    if (!title || !volume || !year || !file) {
      return NextResponse.json(
        { error: 'Missing required fields: title, volume, year, and pdf are required.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are accepted.' },
        { status: 400 }
      );
    }

    // Upload PDF to Vercel Blob
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const pdfFilename = `magazines/mag_${uniqueSuffix}.pdf`;
    
    const pdfBlob = await put(pdfFilename, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    const pdfUrl = pdfBlob.url;

    // Process Cover Image (optional)
    let coverImageUrl = null;
    if (coverImage && coverImage.size > 0) {
      const coverExt = coverImage.name.split('.').pop() || 'jpg';
      const coverFilename = `magazines/cover_${uniqueSuffix}.${coverExt}`;
      
      const coverBlob = await put(coverFilename, coverImage, {
        access: 'public',
        addRandomSuffix: false,
      });
      coverImageUrl = coverBlob.url;
    }

    // Save to database
    const magazine = await prisma.magazine.create({
      data: {
        title,
        volume,
        year,
        description: description || null,
        pdfUrl,
        coverImage: coverImageUrl,
      },
    });

    return NextResponse.json({ success: true, magazine }, { status: 201 });
  } catch (error) {
    console.error('Error uploading magazine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
