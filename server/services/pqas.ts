/**
 * PQAS (Prompt Quality Assessment System) Service
 * Rule-based scoring system for evaluating prompt quality across multiple dimensions
 */

interface PQASScore {
  clarity: number;
  specificity: number;
  effectiveness: number;
  consistency: number;
  safety: number;
  efficiency: number;
  composite: number;
  timestamp: Date;
  breakdown: {
    clarity: { score: number; details: string };
    specificity: { score: number; details: string };
    effectiveness: { score: number; details: string };
    consistency: { score: number; details: string };
    safety: { score: number; details: string };
    efficiency: { score: number; details: string };
  };
}

/**
 * Calculate clarity score using readability metrics
 */
export function calculateClarity(content: string): number {
  if (!content || content.trim().length === 0) return 0;

  const text = content.trim();
  
  // Count sentences (split by . ! ?)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);
  
  // Count words
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Estimate syllables (rough approximation)
  const syllableCount = words.reduce((count, word) => {
    return count + estimateSyllables(word);
  }, 0);
  
  // Flesch Reading Ease formula: 206.835 - 1.015×(words/sentences) - 84.6×(syllables/words)
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / Math.max(wordCount, 1);
  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  // Normalize Flesch score (0-100 scale, higher is better readability)
  // Flesch typically ranges from 0-100+, we'll cap and normalize
  const normalizedFlesch = Math.max(0, Math.min(100, fleschScore));
  
  // Check for clear structure indicators
  const hasNumberedLists = /^\s*\d+[.):]/m.test(text);
  const hasBulletPoints = /^\s*[-*•]/m.test(text);
  const hasHeadings = /^#{1,6}\s+/m.test(text) || /^[A-Z][^.!?]*:$/m.test(text);
  const hasSections = text.includes('\n\n');
  
  let structureBonus = 0;
  if (hasNumberedLists) structureBonus += 10;
  if (hasBulletPoints) structureBonus += 10;
  if (hasHeadings) structureBonus += 10;
  if (hasSections) structureBonus += 5;
  
  // Average sentence length penalty (too long is bad for clarity)
  let lengthPenalty = 0;
  if (avgWordsPerSentence > 25) lengthPenalty = 10;
  else if (avgWordsPerSentence > 20) lengthPenalty = 5;
  
  // Calculate final score
  let score = (normalizedFlesch * 0.6) + structureBonus - lengthPenalty;
  return Math.max(0, Math.min(100, score));
}

/**
 * Estimate syllables in a word (rough approximation)
 */
function estimateSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  
  // Subtract silent e
  if (word.endsWith('e')) count--;
  
  // Minimum 1 syllable
  return Math.max(1, count);
}

/**
 * Calculate specificity score based on detail level and precision
 */
export function calculateSpecificity(content: string): number {
  if (!content || content.trim().length === 0) return 0;

  const text = content.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  // Count specific indicators
  const numbers = (text.match(/\d+(\.\d+)?/g) || []).length;
  const examples = (text.match(/\b(example|e\.g\.|for instance|such as)\b/gi) || []).length;
  const useCases = (text.match(/\b(use case|scenario|situation|context)\b/gi) || []).length;
  
  // Domain-specific terms (technical terms, proper nouns, etc.)
  const capitalizedWords = (content.match(/\b[A-Z][a-z]+\b/g) || []).length;
  const technicalTerms = (text.match(/\b(api|data|model|system|process|method|algorithm|parameter)\b/gi) || []).length;
  
  // Vague words penalty
  const vagueWords = ['maybe', 'some', 'stuff', 'things', 'somewhat', 'kind of', 'sort of', 'possibly'];
  const vagueCount = vagueWords.reduce((count, word) => {
    return count + (text.match(new RegExp(`\\b${word}\\b`, 'gi')) || []).length;
  }, 0);
  
  // Calculate specificity factors
  const numberDensity = Math.min(20, (numbers / Math.max(wordCount / 20, 1)) * 10);
  const exampleBonus = Math.min(20, examples * 7);
  const useCaseBonus = Math.min(15, useCases * 5);
  const technicalBonus = Math.min(20, (technicalTerms + capitalizedWords) / Math.max(wordCount / 15, 1) * 10);
  const vaguePenalty = Math.min(25, vagueCount * 5);
  
  const baseScore = 50;
  let score = baseScore + numberDensity + exampleBonus + useCaseBonus + technicalBonus - vaguePenalty;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate effectiveness score based on prompt structure and completeness
 */
export function calculateEffectiveness(content: string): number {
  if (!content || content.trim().length === 0) return 0;

  const text = content.toLowerCase();
  
  // Check for key sections
  const hasContext = /\b(context|background|about|overview)\b/.test(text);
  const hasGoal = /\b(goal|objective|aim|purpose|task)\b/.test(text);
  const hasInstructions = /\b(instruction|step|do|should|must|need to)\b/.test(text);
  const hasExamples = /\b(example|sample|instance|e\.g\.)\b/.test(text);
  const hasFormat = /\b(format|structure|template|output)\b/.test(text);
  const hasConstraints = /\b(constraint|limit|must not|don't|avoid)\b/.test(text);
  
  // Prompt structure indicators
  const hasRoleDefinition = /\b(you are|act as|assume the role|pretend)\b/.test(text);
  const hasInputOutput = /\b(input|output|return|provide|generate)\b/.test(text);
  
  // Calculate completeness score
  let score = 0;
  if (hasContext) score += 15;
  if (hasGoal) score += 20;
  if (hasInstructions) score += 20;
  if (hasExamples) score += 15;
  if (hasFormat) score += 10;
  if (hasConstraints) score += 10;
  if (hasRoleDefinition) score += 5;
  if (hasInputOutput) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate consistency score based on formatting and contradictions
 */
export function calculateConsistency(content: string): number {
  if (!content || content.trim().length === 0) return 0;

  let score = 100;
  
  // Check for JSON structure if applicable
  if (content.includes('{') && content.includes('}')) {
    try {
      // Try to extract and validate JSON blocks
      const jsonMatches = content.match(/\{[^{}]*\}/g);
      if (jsonMatches) {
        jsonMatches.forEach(match => {
          try {
            JSON.parse(match);
          } catch {
            score -= 10; // Malformed JSON
          }
        });
      }
    } catch {
      score -= 5;
    }
  }
  
  // Check formatting consistency
  const lines = content.split('\n');
  
  // Check for consistent list formatting
  const bulletTypes = new Set<string>();
  lines.forEach(line => {
    const bulletMatch = line.match(/^\s*([-*•\d]+)[.):]/);
    if (bulletMatch) {
      bulletTypes.add(bulletMatch[1]);
    }
  });
  
  if (bulletTypes.size > 2) score -= 10; // Inconsistent list formatting
  
  // Check for contradictory instructions
  const contradictoryPairs = [
    [/\b(always|must)\b/, /\b(never|don't)\b/],
    [/\b(include|add)\b/, /\b(exclude|remove)\b/],
    [/\b(formal|professional)\b/, /\b(casual|informal)\b/],
  ];
  
  const text = content.toLowerCase();
  contradictoryPairs.forEach(([pattern1, pattern2]) => {
    if (pattern1.test(text) && pattern2.test(text)) {
      // Check if they're in the same context (within 50 chars)
      const matches1 = [...content.matchAll(new RegExp(pattern1.source, 'gi'))];
      const matches2 = [...content.matchAll(new RegExp(pattern2.source, 'gi'))];
      
      matches1.forEach(m1 => {
        matches2.forEach(m2 => {
          if (m1.index && m2.index && Math.abs(m1.index - m2.index) < 50) {
            score -= 15;
          }
        });
      });
    }
  });
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate safety score by checking for PII and harmful content
 */
export function calculateSafety(content: string): number {
  let score = 100;
  
  // PII patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
  const creditCardPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  
  if (emailPattern.test(content)) score -= 20;
  if (phonePattern.test(content)) score -= 20;
  if (ssnPattern.test(content)) score -= 30;
  if (creditCardPattern.test(content)) score -= 30;
  
  // Harmful content keywords
  const harmfulKeywords = [
    'violence', 'weapon', 'bomb', 'kill', 'murder', 'attack',
    'hate', 'racist', 'discriminat',
    'illegal', 'drug', 'steal', 'hack',
    'porn', 'explicit', 'nsfw'
  ];
  
  const text = content.toLowerCase();
  harmfulKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score -= 10;
    }
  });
  
  // Bias indicators
  const biasIndicators = [
    'all women', 'all men', 'all people of', 'they always', 'they never',
    'everyone knows', 'obviously', 'clearly'
  ];
  
  biasIndicators.forEach(indicator => {
    if (text.includes(indicator)) {
      score -= 5;
    }
  });
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate efficiency score based on token count and brevity
 */
export function calculateEfficiency(content: string): number {
  if (!content || content.trim().length === 0) return 0;

  const wordCount = content.split(/\s+/).length;
  
  // Rough token estimation (words × 1.3)
  const estimatedTokens = Math.ceil(wordCount * 1.3);
  
  // Optimal range: 50-500 tokens
  let tokenScore = 100;
  if (estimatedTokens < 20) {
    tokenScore = 40; // Too brief
  } else if (estimatedTokens < 50) {
    tokenScore = 70; // Brief but acceptable
  } else if (estimatedTokens <= 500) {
    tokenScore = 100; // Optimal
  } else if (estimatedTokens <= 1000) {
    tokenScore = 80; // Acceptable
  } else if (estimatedTokens <= 2000) {
    tokenScore = 60; // Verbose
  } else {
    tokenScore = 30; // Too verbose
  }
  
  // Check for unnecessary repetition
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
  const repetitionRatio = uniqueSentences.size / Math.max(sentences.length, 1);
  const repetitionPenalty = (1 - repetitionRatio) * 20;
  
  let score = tokenScore - repetitionPenalty;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate composite PQAS score with weighted components
 */
export function calculateCompositeScore(scores: {
  clarity: number;
  specificity: number;
  effectiveness: number;
  consistency: number;
  safety: number;
  efficiency: number;
}): number {
  // Quality = average of clarity, specificity, effectiveness
  const quality = (scores.clarity + scores.specificity + scores.effectiveness) / 3;
  
  // Weighted composite: 0.40×quality + 0.30×consistency + 0.20×safety + 0.10×efficiency
  const composite = 
    (quality * 0.40) +
    (scores.consistency * 0.30) +
    (scores.safety * 0.20) +
    (scores.efficiency * 0.10);
  
  return Math.round(Math.max(0, Math.min(100, composite)));
}

/**
 * Calculate full PQAS score for a prompt
 */
export function calculatePQAS(content: string | any): PQASScore {
  // Extract text content from various formats
  let textContent = '';
  if (typeof content === 'string') {
    textContent = content;
  } else if (typeof content === 'object') {
    // Handle JSONB content structure
    if (content.user) textContent += content.user + '\n';
    if (content.system) textContent += content.system + '\n';
    if (content.instructions) textContent += content.instructions + '\n';
    if (content.examples) textContent += JSON.stringify(content.examples) + '\n';
  }
  
  const clarity = calculateClarity(textContent);
  const specificity = calculateSpecificity(textContent);
  const effectiveness = calculateEffectiveness(textContent);
  const consistency = calculateConsistency(textContent);
  const safety = calculateSafety(textContent);
  const efficiency = calculateEfficiency(textContent);
  
  const composite = calculateCompositeScore({
    clarity,
    specificity,
    effectiveness,
    consistency,
    safety,
    efficiency,
  });
  
  return {
    clarity,
    specificity,
    effectiveness,
    consistency,
    safety,
    efficiency,
    composite,
    timestamp: new Date(),
    breakdown: {
      clarity: { score: clarity, details: 'Readability and structure analysis' },
      specificity: { score: specificity, details: 'Detail level and precision' },
      effectiveness: { score: effectiveness, details: 'Prompt completeness and structure' },
      consistency: { score: consistency, details: 'Format validation and coherence' },
      safety: { score: safety, details: 'PII and harmful content check' },
      efficiency: { score: efficiency, details: 'Token efficiency and brevity' },
    },
  };
}
