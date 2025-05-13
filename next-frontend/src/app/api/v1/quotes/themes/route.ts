import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define proper interface for the quotes data structure
interface QuoteTheme {
  name: string;
  quotes: string[];
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'quotes_merged_final.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(fileContents);
    let themes: string[] = [];
    if (json && Array.isArray(json.themes)) {
      themes = json.themes.map((themeObj: QuoteTheme) => themeObj.name);
    }
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json({ error: 'Themes not found' }, { status: 404 });
  }
}

