// Next.js API route for paginated, theme-filtered quotes
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define proper interfaces for the quotes data structure
interface QuoteTheme {
  name: string;
  quotes: string[];
}

interface QuotesData {
  themes: QuoteTheme[];
}

interface FlattenedQuote {
  theme: string;
  quote: string;
}

function flattenQuotes(json: QuotesData): FlattenedQuote[] {
  const result: FlattenedQuote[] = [];
  if (json && Array.isArray(json.themes)) {
    json.themes.forEach((themeObj) => {
      if (themeObj && themeObj.name && Array.isArray(themeObj.quotes)) {
        themeObj.quotes.forEach((q: string) => {
          result.push({ theme: themeObj.name, quote: q });
        });
      }
    });
  }
  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get('theme');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const filePath = path.join(process.cwd(), 'quotes_merged_final.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(fileContents);
    let quotes = flattenQuotes(json);
    if (theme) {
      quotes = quotes.filter(q => q.theme === theme);
    }
    const total = quotes.length;
    const start = (page - 1) * limit;
    const paginated = quotes.slice(start, start + limit);
    return NextResponse.json({ quotes: paginated, total, page, limit });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Quotes not found' }, { status: 404 });
  }
}
