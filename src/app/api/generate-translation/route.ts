import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemMessage = `You are a helpful language tutor. Generate a daily study list containing:
1. 4 English sentences (Intermediate to Advanced level) suitable for daily conversation or business.
2. 4 Chinese sentences (Advanced level) suitable for daily conversation or business.

IMPORTANT:
- Ensure sentences are diverse and cover different topics (e.g., business, culture, technology, daily life).
- Do NOT repeat sentences from previous generations.
- Make the content interesting and practical.

For each Chinese sentence, provide the Pinyin and the Korean translation.
For each English sentence, provide the Korean translation.

Output Format (JSON):
{
  "english": [
    { "text": "English sentence 1", "translation": "Korean translation 1" },
    ...
  ],
  "chinese": [
    { "text": "Chinese sentence 1", "pinyin": "Pinyin 1", "translation": "Korean translation 1" },
    ...
  ]
}`;

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: "Generate today's study list." }
      ],
      model: "gpt-4o",
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    let studyData;

    try {
      studyData = JSON.parse(content || '{}');
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return NextResponse.json(
        { error: 'Failed to parse study data' },
        { status: 500 }
      );
    }

    return NextResponse.json(studyData);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json(
      { error: 'Failed to generate study data' },
      { status: 500 }
    );
  }
}