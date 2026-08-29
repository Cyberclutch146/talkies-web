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

const MAX_BODY_SIZE = 10 * 1024; // 10KB

export async function POST(request: Request) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Request body too large." }, { status: 413 });
    }

    const data = await request.json();

    // Check password
    const { password, title, volume, year, description, pdfUrl, coverImageUrl } = data;
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set.');
      return NextResponse.json({ error: 'Server misconfigured. Contact the admin.' }, { status: 500 });
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!title || !volume || !year || !pdfUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, volume, year, and pdfUrl are required.' },
        { status: 400 }
      );
    }

    // Save to database
    const magazine = await prisma.magazine.create({
      data: {
        title,
        volume,
        year,
        description: description || null,
        pdfUrl,
        coverImage: coverImageUrl || null,
      },
    });

    return NextResponse.json({ success: true, magazine }, { status: 201 });
  } catch (error) {
    console.error('Error uploading magazine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

