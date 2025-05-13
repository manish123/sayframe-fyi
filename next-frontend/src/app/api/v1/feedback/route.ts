import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface FeedbackItem {
  id: string;
  feedback: string;
  timestamp: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();
    
    if (!data.feedback || typeof data.feedback !== 'string') {
      return NextResponse.json(
        { error: 'Feedback is required and must be a string' },
        { status: 400 }
      );
    }

    // Path to the feedback JSON file
    const filePath = path.join(process.cwd(), 'src/data/feedback.json');
    
    // Read existing feedback
    let feedbackData: FeedbackItem[] = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      feedbackData = JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading feedback file:', error);
      // If file doesn't exist or is invalid, we'll start with an empty array
    }
    
    // Add new feedback with timestamp
    feedbackData.push({
      id: Date.now().toString(),
      feedback: data.feedback,
      timestamp: new Date().toISOString()
    });
    
    // Write updated feedback back to file
    await fs.writeFile(filePath, JSON.stringify(feedbackData, null, 2), 'utf8');
    
    return NextResponse.json(
      { success: true, message: 'Feedback saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}
