import { NextRequest, NextResponse } from 'next/server';
import { createReply, getRepliesByAnswerId, updateReply } from '@/actions/replay.action';

export const config = {
  runtime: 'edge',
};

// Helper function to send response with streaming
async function sendResponse(data: any, status: number = 200) {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(JSON.stringify(data));
      controller.close();
    },
  });

  return new Response(readableStream, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { answerId, userId, content } = await request.json();

    console.log('Received data:', { answerId, userId, content });

    if (!answerId || !userId || !content) {
      return sendResponse({ error: 'Missing required fields' }, 400);
    }

    const reply = await createReply({
      content,
      answerId,
      author: userId,
      path: `/questions/${answerId}`,
    });

    return sendResponse(reply, 200);
  } catch (error) {
    console.error('Error creating reply:', error);
    return sendResponse({ error: 'Internal Server Error' }, 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const answerId = searchParams.get('answerId');

    console.log('Fetching replies for answerId:', answerId);

    if (!answerId) {
      return sendResponse({ error: 'Missing answerId parameter' }, 400);
    }

    const replies = await getRepliesByAnswerId(answerId);

    return sendResponse(replies, 200);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return sendResponse({ error: 'Internal Server Error' }, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { replyId, content } = await request.json();

    console.log('Updating reply:', { replyId, content });

    if (!replyId || !content) {
      return sendResponse({ error: 'Missing required fields' }, 400);
    }

    const updatedReply = await updateReply(replyId, content);

    return sendResponse(updatedReply, 200);
  } catch (error) {
    console.error('Error updating reply:', error);
    return sendResponse({ error: 'Internal Server Error' }, 500);
  }
}
