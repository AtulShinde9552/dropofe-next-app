import Reply from '@/db/models/reply.model';
import Answer from '@/db/models/answer.model';
import { revalidatePath } from 'next/cache';

export const createReply = async (params: {
  content: string;
  answerId: string;
  author: string;
  path: string;
}) => {
  const { content, answerId, author, path } = params;

  if (!content || !answerId || !author) {
    throw new Error('Missing required fields');
  }

  try {
    const reply = await Reply.create({ content, answer: answerId, author });
    await Answer.findByIdAndUpdate(answerId, { $push: { replies: reply._id } });
    revalidatePath(path);
    return reply;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw new Error('Failed to create reply');
  }
};

export const getRepliesByAnswerId = async (answerId: string) => {
  try {
    const replies = await Reply.find({ answer: answerId })
      .populate('author', '_id name username picture') // Populate author details if needed
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    return replies;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw new Error('Failed to fetch replies');
  }
};

export const updateReply = async (replyId: string, content: string) => {
  if (!replyId || !content) {
    throw new Error('Missing required fields');
  }

  try {
    const updatedReply = await Reply.findByIdAndUpdate(
      replyId,
      { content },
      { new: true }, // Return the updated document
    ).lean(); // Convert to plain object

    return updatedReply;
  } catch (error) {
    console.error('Error updating reply:', error);
    throw new Error('Failed to update reply');
  }
};
