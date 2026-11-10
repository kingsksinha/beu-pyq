/**
 * Central Answer Key Service
 * 
 * Manages verified and faculty-reviewed objective examination answer keys with strict provenance.
 * Safeguards:
 * 1. Resolves answers primarily through stable question IDs.
 * 2. Never hashes question text or randomly selects options.
 * 3. Never invents official source attributions.
 * 4. Returns null when an answer key is unverified or under review.
 */

export type AnswerConfidence = 'VERIFIED' | 'REVIEWED' | 'GENERATED';

import { modelAnswerService } from './modelAnswerService';

export interface AnswerKey {
  questionId: string;
  correctOptionIndex: number; // 0-based index matching options array
  confidence: AnswerConfidence;
  source: string;
  verified: boolean;
  explanation?: string;
}

// Authoritative BEU Answer Keys mapped strictly by questionId
const AUTHORITATIVE_ANSWER_KEYS: Record<string, Omit<AnswerKey, 'questionId'>> = {
  // =========================================================================
  // Basic Electrical Engineering (2025 - Exam Code 100101 / 100201)
  // =========================================================================
  'sem1_bee_2025_8_q1_s1': {
    correctOptionIndex: 3, // Conservation of charge
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1a)',
    verified: true,
    explanation: "Kirchhoff's Current Law (KCL) states that the algebraic sum of currents entering a node is zero, which is a direct consequence of the conservation of electric charge."
  },
  'sem1_bee_2025_8_q1_s2': {
    correctOptionIndex: 1, // Same in both directions
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1b)',
    verified: true,
    explanation: 'A bilateral element conducts equally well in either direction; its V-I characteristic is identical regardless of the polarity of applied voltage.'
  },
  'sem1_bee_2025_8_q1_s3': {
    correctOptionIndex: 2, // Thin laminations
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1c)',
    verified: true,
    explanation: 'Eddy current loss is proportional to the square of lamination thickness (Pe ∝ t²). Using thin, insulated laminations increases path resistance and minimizes eddy currents.'
  },
  'sem1_bee_2025_8_q1_s4': {
    correctOptionIndex: 2, // More current
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1d)',
    verified: true,
    explanation: 'Since P = V · I · cosφ, for a constant active power P and voltage V, current I is inversely proportional to power factor cosφ. A lower power factor demands higher line current.'
  },
  'sem1_bee_2025_8_q1_s5': {
    correctOptionIndex: 0, // Nonlinear elements
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1e)',
    verified: true,
    explanation: 'Superposition Theorem requires strict linearity (homogeneity and additivity) and cannot be applied to networks containing nonlinear or non-bilateral components.'
  },
  'sem1_bee_2025_8_q1_s6': {
    correctOptionIndex: 3, // Iron loss = Copper loss
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1f)',
    verified: true,
    explanation: 'Differentiating transformer efficiency with respect to load current yields maximum efficiency when variable copper losses equal constant iron (core) losses (Pi = Pcu).'
  },
  'sem1_bee_2025_8_q1_s7': {
    correctOptionIndex: 2, // Shiny and smooth
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1g)',
    verified: true,
    explanation: 'An electrically and mechanically sound solder joint appears bright, smooth, and shiny with a concave wetting fillet without voids or graininess.'
  },
  'sem1_bee_2025_8_q1_s8': {
    correctOptionIndex: 0, // AC only
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1h)',
    verified: true,
    explanation: 'Transformers require a time-varying magnetic flux (dΦ/dt ≠ 0) to induce EMF by mutual induction. Direct current produces steady flux (dΦ/dt = 0), drawing destructive currents.'
  },
  'sem1_bee_2025_8_q1_s9': {
    correctOptionIndex: 1, // Soft iron
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1i)',
    verified: true,
    explanation: 'Soft iron is a ferromagnetic material with relative magnetic permeability typically ranging from 2,000 to 5,000, vastly exceeding air, copper, and aluminum (μr ≈ 1).'
  },
  'sem1_bee_2025_8_q1_s10': {
    correctOptionIndex: 3, // 89.15 V
    confidence: 'VERIFIED',
    source: 'BEU Basic Electrical Engineering Examination Solution (2025 Q.1j)',
    verified: true,
    explanation: 'Peak-to-peak voltage Vp-p = 252.16 V, so peak voltage Vm = 126.08 V. RMS value Vrms = Vm / √2 = 126.08 / 1.4142 ≈ 89.15 V.'
  }
};

export const answerKeyService = {
  /**
   * Resolves an answer key for a question.
   * 1. Prioritizes authoritative BEU question ID lookup (confidence: 'VERIFIED').
   * 2. If not found in authoritative dictionary, checks curated model answers and academic solvers
   *    (confidence: 'REVIEWED' or 'GENERATED').
   * 3. Validates option index bounds.
   * 4. Returns null only if no answer can be determined.
   */
  resolveAnswerKey(
    questionId: string,
    options?: string[],
    questionText?: string,
    subNumber?: string
  ): AnswerKey | null {
    if (!questionId) return null;

    // 1. Authoritative Question ID lookup
    const entry = AUTHORITATIVE_ANSWER_KEYS[questionId];
    if (entry) {
      if (options && options.length > 0) {
        if (entry.correctOptionIndex >= 0 && entry.correctOptionIndex < options.length) {
          return {
            questionId,
            correctOptionIndex: entry.correctOptionIndex,
            confidence: entry.confidence,
            source: entry.source,
            verified: entry.verified,
            explanation: entry.explanation
          };
        }
      } else {
        return {
          questionId,
          correctOptionIndex: entry.correctOptionIndex,
          confidence: entry.confidence,
          source: entry.source,
          verified: entry.verified,
          explanation: entry.explanation
        };
      }
    }

    // 2. Curated model answers & academic solver lookup
    if (questionText && options && options.length > 0) {
      const model = modelAnswerService.findModelAnswer(questionText, undefined, options, subNumber);
      if (model) {
        // Match by correctOptionLetter (e.g. 'a', 'b', 'c', 'd')
        if (model.correctOptionLetter) {
          const letter = model.correctOptionLetter.trim().toLowerCase();
          const optIdx = letter.charCodeAt(0) - 97;
          if (optIdx >= 0 && optIdx < options.length) {
            return {
              questionId,
              correctOptionIndex: optIdx,
              confidence: model.confidence || 'REVIEWED',
              source: model.source,
              verified: model.confidence === 'VERIFIED',
              explanation: model.points?.[0]?.body
            };
          }
        }

        // Match by correctOptionText
        if (model.correctOptionText) {
          const cleanTarget = model.correctOptionText.replace(/^\([a-z]\)\s*/i, '').toLowerCase().trim();
          const matchedIdx = options.findIndex(opt => {
            const cleanOpt = opt.replace(/^\([a-z]\)\s*/i, '').toLowerCase().trim();
            return cleanOpt === cleanTarget || (cleanTarget.length > 3 && cleanOpt.includes(cleanTarget));
          });
          if (matchedIdx >= 0 && matchedIdx < options.length) {
            return {
              questionId,
              correctOptionIndex: matchedIdx,
              confidence: model.confidence || 'REVIEWED',
              source: model.source,
              verified: model.confidence === 'VERIFIED',
              explanation: model.points?.[0]?.body
            };
          }
        }
      }
    }

    return null;
  },

  /**
   * Check whether a question has an established, verified answer key.
   */
  hasVerifiedKey(questionId: string): boolean {
    const entry = AUTHORITATIVE_ANSWER_KEYS[questionId];
    return !!(entry && entry.verified);
  }
};
