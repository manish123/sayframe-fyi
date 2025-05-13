import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import axios from 'axios';

// Define the feedback item interface for type safety
interface FeedbackItem {
  id: string;
  feedback: string;
  timestamp: string;
}

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

// GET endpoint to retrieve all feedback
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 100;
    const cursor = searchParams.get('cursor') || undefined;
    
    // List all feedback files with pagination
    const { blobs, hasMore, cursor: nextCursor } = await list({
      prefix: 'feedback/',
      limit,
      cursor,
      token: BLOB_TOKEN, // Use the same token as in POST
    });
    
    // If no feedback files found
    if (blobs.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No feedback found',
        feedback: [],
        pagination: {
          total: 0,
          limit,
          hasMore: false,
          cursor: nextCursor
        }
      });
    }
    
    // Fetch the content of each feedback file
    const feedbackPromises = blobs.map(async (blob) => {
      try {
        // Get the file content using axios since Vercel Blob SDK doesn't export a 'get' function
        const response = await axios.get(blob.url);
        return response.data;
      } catch (error) {
        console.error(`Error fetching feedback file ${blob.url}:`, error);
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const feedbackResults = await Promise.all(feedbackPromises);
    
    // Filter out any null results (failed fetches) and ensure proper typing
    const feedback = feedbackResults.filter((item): item is FeedbackItem => 
      item !== null && typeof item === 'object' && 'timestamp' in item
    );
    
    // Sort feedback by timestamp (newest first)
    feedback.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return NextResponse.json({
      success: true,
      message: `Retrieved ${feedback.length} feedback items`,
      feedback,
      pagination: {
        total: blobs.length,
        limit,
        hasMore,
        cursor: nextCursor
      }
    });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}
