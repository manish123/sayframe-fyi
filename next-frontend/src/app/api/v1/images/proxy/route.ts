import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const imageResponse = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
    // Use the response data directly with proper type assertion
    return new NextResponse(imageResponse.data as Buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    
    return NextResponse.json({
      error: 'Failed to proxy image',
      details: 'An error occurred while fetching the image',
    }, { status: 500 });
  }
}
