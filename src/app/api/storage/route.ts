import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function POST(request: Request) {
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

    // Fetch all blobs
    // The default limit is 1000, which should be plenty for a hobby site. 
    // If it exceeds 1000, pagination logic would be required.
    const { blobs } = await list();
    
    const totalBytes = blobs.reduce((acc, blob) => acc + blob.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    
    // Vercel Free Tier limit is 250MB
    const limitMB = 250;
    const percentage = Math.min((totalMB / limitMB) * 100, 100);

    return NextResponse.json({ 
      success: true, 
      totalMB: totalMB.toFixed(2),
      limitMB,
      percentage: percentage.toFixed(1),
      fileCount: blobs.length
    });
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
