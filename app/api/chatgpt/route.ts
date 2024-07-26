import envConfig from '@/config';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    // Parse the request body to extract the question
    const { question } = await request.json();

    // Construct the request payload for the OpenAI API
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable assistant that provides quality information.',
        },
        {
          role: 'user',
          content: `Tell me ${question}`,
        },
      ],
    };

    // Make the API request to OpenAI
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${envConfig.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse the response from the OpenAI API
    const data = await res.json();

    // Log the entire response for debugging purposes
    console.log('OpenAI API Full Response:', data);

    // Check for the expected response structure
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      // Return the reply as a JSON response
      return NextResponse.json({ reply });
    } else {
      // Log detailed information for debugging
      console.error('Unexpected API response structure:', JSON.stringify(data));
      throw new Error('Unexpected API response structure');
    }
  } catch (err: any) {
    // Log the error and return an error response
    console.error('Error:', err);
    return NextResponse.json({ error: err.message, details: err });
  }
};
