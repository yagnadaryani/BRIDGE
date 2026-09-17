import { NextRequest, NextResponse } from 'next/server';
import { searchGroundedKnowledge } from '@/lib/gemini/ragService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const subjectId = searchParams.get('subjectId') || undefined;
    const conceptId = searchParams.get('conceptId') || undefined;

    const result = searchGroundedKnowledge(query, subjectId, conceptId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to search RAG knowledge base' },
      { status: 500 }
    );
  }
}
