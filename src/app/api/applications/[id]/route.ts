import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { password, status } = body;
    const { id } = await params;
    
    // 1. Verify Admin Password
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Password' }, { status: 401 });
    }

    if (!['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED', 'SHORTLISTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 3. Update application
    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
