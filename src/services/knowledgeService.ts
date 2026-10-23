import { CAMPUS_POLICY_DOCUMENTS } from '../data/campusPolicies';
import { KnowledgeChunk, RetrievalResult, PolicyDocument } from '../types';
import { AuditLogger } from './auditLogger';

export class KnowledgeService {
  private static documents: PolicyDocument[] = [...CAMPUS_POLICY_DOCUMENTS];

  /**
   * Dynamically adds a new custom policy document (from PDF or text upload).
   */
  public static addCustomDocument(doc: Omit<PolicyDocument, 'id' | 'isCustomUploaded'>): PolicyDocument {
    const newDoc: PolicyDocument = {
      ...doc,
      id: 'CUSTOM-DOC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      isCustomUploaded: true
    };

    this.documents.unshift(newDoc);

    AuditLogger.log(
      'CUSTOM_DOC_INGESTION',
      'CAMPUS_KB',
      'kb-v1',
      'SUCCESS',
      12,
      `Ingested custom document: ${newDoc.title} (${newDoc.section})`
    );

    return newDoc;
  }

  /**
   * Retrieves matching policy passages with strict traceable citations.
   * Abstains if confidence is low or evidence is insufficient (FR-02).
   */
  public static retrieve(query: string, maxResults: number = 3): RetrievalResult {
    const rawTokens = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);

    const stopwords = new Set(['the', 'and', 'for', 'with', 'what', 'when', 'how', 'can', 'are', 'was', 'were', 'about', 'tell', 'show', 'please', 'does', 'much', 'get']);
    const queryTokens = rawTokens.filter(t => !stopwords.has(t));

    if (queryTokens.length === 0) {
      return {
        query,
        chunks: [],
        confidence: 0,
        abstained: true,
        abstentionReason: 'Query tokens too sparse to establish confident policy match.'
      };
    }

    const scoredChunks: KnowledgeChunk[] = [];

    for (const doc of this.documents) {
      let docScore = 0;

      // 1. Keyword direct match
      for (const kw of doc.keywords) {
        if (query.toLowerCase().includes(kw.toLowerCase())) {
          docScore += 18;
        }
      }

      // 2. Token overlap with title, summary, category
      const titleLower = doc.title.toLowerCase();
      const summaryLower = doc.summary.toLowerCase();
      const catLower = doc.category.toLowerCase();

      for (const token of queryTokens) {
        if (titleLower.includes(token)) docScore += 8;
        if (summaryLower.includes(token)) docScore += 5;
        if (catLower.includes(token)) docScore += 4;
      }

      // 3. Chunk lines inside document content
      const lines = doc.content.split('\n').filter(l => l.trim().length > 0);
      for (const line of lines) {
        let lineScore = docScore;
        const lineLower = line.toLowerCase();

        for (const token of queryTokens) {
          if (lineLower.includes(token)) {
            lineScore += 4;
          }
        }

        if (lineScore >= 12) {
          scoredChunks.push({
            documentId: doc.id,
            documentTitle: doc.title,
            owner: doc.owner,
            section: doc.section,
            effectiveDate: doc.effectiveDate,
            lastReviewedDate: doc.lastReviewedDate,
            text: line.trim(),
            score: lineScore
          });
        }
      }
    }

    scoredChunks.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Deduplicate chunks
    const uniqueChunks: KnowledgeChunk[] = [];
    const seenSections = new Set<string>();

    for (const chunk of scoredChunks) {
      const key = `${chunk.documentId}-${chunk.text.slice(0, 30)}`;
      if (!seenSections.has(key)) {
        seenSections.add(key);
        uniqueChunks.push(chunk);
      }
      if (uniqueChunks.length >= maxResults) break;
    }

    if (uniqueChunks.length === 0) {
      return {
        query,
        chunks: [],
        confidence: 0,
        abstained: true,
        abstentionReason: 'No official campus policy documents matched this inquiry with sufficient confidence.'
      };
    }

    const topScore = uniqueChunks[0].score || 0;
    const confidence = Math.min(0.99, Math.max(0.4, topScore / 35));

    if (confidence < 0.45) {
      return {
        query,
        chunks: uniqueChunks,
        confidence,
        abstained: true,
        abstentionReason: 'Low confidence in retrieved policy passages. Abstaining to avoid misleading guidance.'
      };
    }

    return {
      query,
      chunks: uniqueChunks,
      confidence,
      abstained: false
    };
  }

  public static getAllDocuments(): PolicyDocument[] {
    return this.documents;
  }
}
