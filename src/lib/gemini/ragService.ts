import { RAG_KNOWLEDGE_BASE, RAGDocument } from '@/lib/data/ragKnowledge';

export interface GroundedRAGResponse {
  query: string;
  matchedDocuments: RAGDocument[];
  groundedContextSnippet: string;
  sources: { title: string; source: string }[];
}

export function searchGroundedKnowledge(
  query: string,
  subjectId?: string,
  conceptId?: string
): GroundedRAGResponse {
  const normalizedQuery = query.toLowerCase();

  // Filter documents by subject/concept if provided, or search by tag/keyword matching
  let matches = RAG_KNOWLEDGE_BASE.filter((doc) => {
    if (subjectId && doc.subjectId === subjectId) return true;
    if (conceptId && doc.conceptId === conceptId) return true;

    return doc.tags.some((tag) => normalizedQuery.includes(tag.toLowerCase())) ||
      doc.content.toLowerCase().includes(normalizedQuery) ||
      doc.title.toLowerCase().includes(normalizedQuery);
  });

  if (matches.length === 0) {
    // Fallback to default document for subject
    matches = RAG_KNOWLEDGE_BASE.slice(0, 2);
  }

  const groundedContextSnippet = matches
    .map((doc) => `--- SOURCE: ${doc.source} (${doc.title}) ---\n${doc.content}`)
    .join('\n\n');

  const sources = matches.map((doc) => ({
    title: doc.title,
    source: doc.source,
  }));

  return {
    query,
    matchedDocuments: matches,
    groundedContextSnippet,
    sources,
  };
}
