import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemMessage = `Create diverse and interesting sentences in English, Korean, and Chinese that can be used for study. Each generation should randomly select one topic from various fields including:

- Politics and International Relations (e.g., diplomatic relations, elections, policies)
- Economics and Business (e.g., market trends, company innovations, global trade)
- Science and Technology (e.g., AI developments, space exploration, medical breakthroughs)
- Arts and Literature (e.g., new cultural trends, book releases, art exhibitions)
- Social Issues (e.g., education, healthcare, social movements)
- Sports and Entertainment (e.g., major events, achievements, industry trends)

Guidelines:
1. Randomly select one of the above fields for each generation
2. Create a sentence that reflects current or recent events in that field
3. Ensure the sentence is at an intermediate level - not too simple, not too complex
4. Make sure the content is interesting and educational
5. Translate the sentence accurately while maintaining natural expression in each language

Output Format:
{
  "english": "[Sentence in English]",
  "korean": "[Sentence in Korean]",
  "chinese": "[Sentence in Mandarin Chinese]"
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
        { role: "user", content: "Generate a new sentence from a random field." }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.9,
      max_tokens: 500,
    });

    const content = completion.choices[0].message.content;
    let translations;

    try {
      translations = JSON.parse(content || '{}');
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return NextResponse.json(
        { error: 'Failed to parse translation' },
        { status: 500 }
      );
    }

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json(
      { error: 'Failed to generate translation' },
      { status: 500 }
    );
  }
} 