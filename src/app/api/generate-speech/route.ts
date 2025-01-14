import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: language === 'chinese' ? 'onyx' : 'nova',
      input: text,
    });

    // Convert the audio to base64
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    return NextResponse.json({ audio: base64Audio });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 