import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

interface FeedbackItem {
  id: string;
  feedback: string;
  timestamp: string;
}

// Helper function to get existing feedback from Blob Storage
async function getExistingFeedback(): Promise<FeedbackItem[]> {
  try {
    // List all blobs with the 'feedback' prefix
    const blobs = await list({ prefix: 'feedback/' });
    
    // If we find a feedback.json blob, return its content
    if (blobs.blobs.length > 0) {
      const feedbackBlob = blobs.blobs.find(blob => blob.pathname === 'feedback/feedback.json');
      if (feedbackBlob) {
        const response = await fetch(feedbackBlob.url);
        const data = await response.json();
        return data;
      }
    }
    
    // If no feedback blob exists yet, return an empty array
    return [];
  } catch (error) {
    console.error('Error fetching existing feedback:', error);
    return [];
  }
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

    // Create a new feedback item
    const newFeedback = {
      id: Date.now().toString(),
      feedback: data.feedback,
      timestamp: new Date().toISOString()
    };

    try {
      // Get existing feedback
      const existingFeedback = await getExistingFeedback();
      
      // Add new feedback
      const updatedFeedback = [...existingFeedback, newFeedback];
      
      // Convert to JSON string
      const feedbackJson = JSON.stringify(updatedFeedback, null, 2);
      
      // Store in Vercel Blob Storage
      const blob = await put('feedback/feedback.json', feedbackJson, {
        contentType: 'application/json',
        access: 'public', // Make it publicly accessible for easy retrieval
      });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Feedback saved successfully to Blob Storage',
          url: blob.url
        },
        { status: 200 }
      );
    } catch (blobError) {
      console.error('Error storing feedback in Blob Storage:', blobError);
      
      // Fall back to just logging the feedback if Blob Storage fails
      console.log('Received feedback (not stored):', newFeedback);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Feedback received but could not be stored. Please check Vercel Blob Storage configuration.',
          fallback: true
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all feedback
export async function GET(): Promise<NextResponse> {
  try {
    const feedback = await getExistingFeedback();
    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}
