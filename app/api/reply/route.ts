import { NextResponse } from 'next/server';
import { createReply, getRepliesByAnswerId, updateReply } from '@/actions/replay.action';

export async function POST(request: Request) {
  try {
    const { answerId, userId, content } = await request.json();

    if (!answerId || !userId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reply = await createReply({
      content,
      answerId,
      author: userId,
      path: `/questions/${answerId}`,
    });

    return NextResponse.json(reply, { status: 200 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const answerId = searchParams.get('answerId');

    if (!answerId) {
      return NextResponse.json({ error: 'Missing answerId parameter' }, { status: 400 });
    }

    const replies = await getRepliesByAnswerId(answerId);

    return NextResponse.json(replies, { status: 200 });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { replyId, content } = await request.json();

    if (!replyId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedReply = await updateReply(replyId, content);

    return NextResponse.json(updatedReply, { status: 200 });
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Exporting configuration for Vercel
export const maxDuration = 5; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';
