import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { prompt } = await request.json();

    // Validate input
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    // API request body
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // Call the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Parse the API response
    const data = await response.json();

    // Debugging: Log the full API response
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = data.error?.message || 'Failed to generate content.';
      console.error('Gemini API Error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Extract generated content from the response
    const generatedContent =
      data.candidates?.[0]?.output || 'No content generated.';

    return NextResponse.json({ output: generatedContent });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
