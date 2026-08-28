import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authenticate using the password sent from the client payload
        let payloadObj: { password?: string } = {};
        try {
          if (clientPayload) payloadObj = JSON.parse(clientPayload);
        } catch (e) {
          throw new Error('Invalid client payload');
        }

        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword || payloadObj.password !== adminPassword) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({ authorized: true }),
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB max limit
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('VERCEL BLOB UPLOAD ERROR:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // Vercel Blob webhook requires 400 for errors
    );
  }
}
