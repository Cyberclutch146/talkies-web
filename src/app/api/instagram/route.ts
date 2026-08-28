import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching instagram posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Check password
    const password = formData.get('password') as string;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postUrl = formData.get('postUrl') as string;
    const caption = formData.get('caption') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!postUrl) {
      return NextResponse.json({ error: 'Instagram Post URL is required.' }, { status: 400 });
    }
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are accepted.' }, { status: 400 });
    }

    // Save image to public/uploads/instagram/
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads/instagram');
    await mkdir(uploadDir, { recursive: true });

    const ext = imageFile.name.split('.').pop() || 'jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `insta_${uniqueSuffix}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    const imageUrl = `/uploads/instagram/${filename}`;

    // Get the next order number
    const maxOrder = await prisma.instagramPost.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const post = await prisma.instagramPost.create({
      data: {
        imageUrl,
        postUrl,
        caption: caption || null,
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating instagram post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
