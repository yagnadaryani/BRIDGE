import { NextRequest, NextResponse } from 'next/server';
import { generateContextAwareAssistantResponse } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, studentId, subjectId, conceptId, learnerModel, prerequisiteGaps } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = await generateContextAwareAssistantResponse({
      query,
      studentId: studentId || 'aarav-101',
      subjectId,
      conceptId,
      learnerModel,
      prerequisiteGaps,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process AI assistant request' },
      { status: 500 }
    );
  }
}
