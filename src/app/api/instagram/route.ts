import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

const ORIGINAL_POSTS = [
  {
    id: "cmto1mbwe0000jr04lri3nhlk",
    imageUrl: "https://8brkwckz0zwemks0.public.blob.vercel-storage.com/instagram/insta_1788592205716-540699324.jpg",
    postUrl: "https://www.instagram.com/p/Dc5Yy-kpvCm/?igsi=NWwzbHExZDl3YTl1",
    caption: null,
    order: 5,
  },
  {
    id: "cmu0qxytn0000k004jhyagoqc",
    imageUrl: "https://8brkwckz0zwemks0.public.blob.vercel-storage.com/instagram/insta_1789360334094-307662712.jpg",
    postUrl: "https://www.instagram.com/p/DdQRi2fJo2V/?stkn=MW9hM2dvZ3Jzc2hrcw==",
    caption: null,
    order: 6,
  },
  {
    id: "cmua6sqzz0000kw04x31nk119",
    imageUrl: "https://8brkwckz0zwemks0.public.blob.vercel-storage.com/instagram/insta_1789931160472-996510633.jpeg",
    postUrl: "https://www.instagram.com/p/DdayN0dJxE4/?stkn=OTlpZzE1OXBia3Vy",
    caption: null,
    order: 7,
  }
];

export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { order: 'asc' },
    });
    if (posts && posts.length > 0) {
      return NextResponse.json(posts);
    }
  } catch (error) {
    console.error('Error fetching instagram posts:', error);
  }
  return NextResponse.json(ORIGINAL_POSTS);
}

const MAX_BODY_SIZE = 4.4 * 1024 * 1024; // 4.4MB

export async function POST(request: Request) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Image file is too large. Maximum size is 4.4MB." }, { status: 413 });
    }

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

    // Upload image to Vercel Blob
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `instagram/insta_${uniqueSuffix}.${ext}`;

    const blob = await put(filename, imageFile, {
      access: 'public',
      addRandomSuffix: false,
    });
    const imageUrl = blob.url;

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
