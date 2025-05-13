import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// For development testing, we'll use a hardcoded token
// In production, this should come from environment variables
const BLOB_TOKEN = process.env.SF_READ_WRITE_TOKEN || "vercel_blob_rw_I0m0AiT2Tei4XAOV_Ahw4xttiszrMm5TYTiIh6Zwx0p12Q9";

// Environment variable for Vercel Blob
// Make sure to add SF_READ_WRITE_TOKEN to your Vercel environment variables
// SF_READ_WRITE_TOKEN="vercel_blob_rw_I0m0AiT2Tei4XAOV_Ahw4xttiszrMm5TYTiIh6Zwx0p12Q9"

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

    // The Vercel Blob SDK will automatically check for the token
    
    try {
      // Store directly in Vercel Blob Storage
      // Each feedback is stored as a separate file with timestamp in the name
      const fileName = `feedback-${Date.now()}.json`;
      const feedbackJson = JSON.stringify(newFeedback);
      
      // Use the put function from Vercel Blob with explicit token
      const { url } = await put(`feedback/${fileName}`, feedbackJson, {
        contentType: 'application/json',
        access: 'public', // Make it publicly accessible
        token: BLOB_TOKEN, // Explicitly pass the token
      });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Feedback saved successfully to Blob Storage',
          url: url
        },
        { status: 200 }
      );
    } catch (error) {
      const blobError = error as Error;
      console.error('Error storing feedback in Blob Storage:', blobError);
      
      // Fall back to just logging the feedback
      console.log('Received feedback (not stored):', newFeedback);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Feedback received but could not be stored in Blob Storage.',
          error: blobError.message
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

// Note: To implement a GET endpoint to retrieve all feedback,
// you would need to use the list function from Vercel Blob
// This is simplified for now
