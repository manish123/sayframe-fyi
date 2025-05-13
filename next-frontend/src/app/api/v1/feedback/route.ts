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

    // Instead of writing to a file, just log the feedback
    // In a production environment, you would send this to a database
    console.log('Received feedback:', {
      id: Date.now().toString(),
      feedback: data.feedback,
      timestamp: new Date().toISOString()
    });
    
    // For now, we'll just acknowledge receipt without storing it
    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback received. Note: In the Vercel environment, feedback cannot be stored in files. Please implement a database solution.' 
      },
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
