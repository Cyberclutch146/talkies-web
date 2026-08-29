import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        desk: data.desk || 'General Inquiry',
        message: data.message,
      }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
