import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Process PDF file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory
    const uploadDir = path.join(process.cwd(), 'public/uploads/magazines');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `mag_${uniqueSuffix}.pdf`;
    const filepath = path.join(uploadDir, filename);

    // Save PDF
    await writeFile(filepath, buffer);
    const pdfUrl = `/uploads/magazines/${filename}`;

    // Process Cover Image (optional)
    let coverImageUrl = null;
    if (coverImage && coverImage.size > 0) {
      const coverBytes = await coverImage.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);
      const coverExt = coverImage.name.split('.').pop() || 'jpg';
      const coverFilename = `cover_${uniqueSuffix}.${coverExt}`;
      const coverFilepath = path.join(uploadDir, coverFilename);
      await writeFile(coverFilepath, coverBuffer);
      coverImageUrl = `/uploads/magazines/${coverFilename}`;
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
