import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '10';

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // Define the expected response structure
    interface UnsplashResponse {
      results: Array<{
        id: string;
        urls: {
          regular: string;
          full: string;
        };
        user: {
          name: string;
          links: {
            html: string;
          };
        };
        alt_description?: string;
      }>;
    }
    
    const response = await axios.get<UnsplashResponse>('https://api.unsplash.com/search/photos', {
      params: { query, page, per_page, orientation: 'landscape' },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    });
    const images = response.data.results.map((img) => ({
      id: img.id,
      url: img.urls.regular,
      download_url: img.urls.full,
      photographer: img.user.name,
      photographer_url: img.user.links.html,
      alt: img.alt_description || `Photo by ${img.user.name}`,
    }));
    return NextResponse.json(images);
  } catch (error) {
    console.error('Image search error:', error);
    
    return NextResponse.json({
      error: 'Failed to search images',
      details: 'An error occurred while searching for images',
    }, { status: 500 });
  }
}
