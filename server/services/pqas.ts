/**
 * Quality Checks Service
 * Rule-based automated checks to assist human review.
 * No AI/LLM dependencies.
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

// --- Rule-based Functions ---

export function calculateClarityRuleBased(content: string): number {
  if (!content || content.trim().length === 0) return 0;
  const text = content.trim();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Simple readability proxy
  let score = 100;
  if (avgWordsPerSentence > 30) score -= 20;
  if (avgWordsPerSentence > 40) score -= 20;

  const hasStructure = /^\s*[-*•\d]/m.test(text);
  if (!hasStructure) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateSpecificityRuleBased(content: string): number {
  if (!content || content.trim().length === 0) return 0;
  const text = content.toLowerCase();
  const vagueWords = ['stuff', 'things', 'something', 'maybe'];
  let score = 80;
  vagueWords.forEach(w => {
    if (text.includes(w)) score -= 5;
  });
  if (text.length < 50) score -= 30;
  return Math.max(0, Math.min(100, score));
}

export function calculateEffectivenessRuleBased(content: string): number {
  if (!content || content.trim().length === 0) return 0;
  const text = content.toLowerCase();
  let score = 0;
  if (text.includes('act as') || text.includes('you are')) score += 20;
  if (text.includes('context')) score += 20;
  if (text.includes('task') || text.includes('goal')) score += 20;
  if (text.includes('format') || text.includes('output')) score += 20;
  if (text.includes('example')) score += 20;
  return Math.max(0, Math.min(100, score));
}

export function calculateConsistencyRuleBased(content: string): number {
  return 90; // Placeholder for manual review
}

export function calculateSafetyRuleBased(content: string): number {
  const text = content.toLowerCase();
  const badWords = ['kill', 'murder', 'hack', 'steal'];
  for (const w of badWords) {
    if (text.includes(w)) return 0;
  }
  return 100;
}

export function calculateEfficiencyRuleBased(content: string): number {
  const words = content.split(/\s+/).length;
  if (words < 10) return 40;
  if (words > 500) return 60;
  return 90;
}

// --- Main Calculation Function ---

export function calculatePQAS(content: string | any): PQASScore {
  // Extract text content
  let textContent = '';
  if (typeof content === 'string') {
    textContent = content;
  } else if (typeof content === 'object') {
    if (content.user) textContent += content.user + '\n';
    if (content.system) textContent += content.system + '\n';
    if (content.instructions) textContent += content.instructions + '\n';
    if (content.mainPrompt) textContent += content.mainPrompt + '\n'; // Image prompts
    if (content.storyboardSteps) textContent += content.storyboardSteps + '\n'; // Video prompts
  }

  const clarity = calculateClarityRuleBased(textContent);
  const specificity = calculateSpecificityRuleBased(textContent);
  const effectiveness = calculateEffectivenessRuleBased(textContent);
  const consistency = calculateConsistencyRuleBased(textContent);
  const safety = calculateSafetyRuleBased(textContent);
  const efficiency = calculateEfficiencyRuleBased(textContent);

  // Calculate Composite
  const quality = (clarity + specificity + effectiveness) / 3;
  const composite = Math.round(
    (quality * 0.40) +
    (consistency * 0.30) +
    (safety * 0.20) +
    (efficiency * 0.10)
  );

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
      clarity: { score: clarity, details: "Automated readability check" },
      specificity: { score: specificity, details: "Automated keyword check" },
      effectiveness: { score: effectiveness, details: "Structure completeness check" },
      consistency: { score: consistency, details: "Pending manual review" },
      safety: { score: safety, details: "Basic keyword safety check" },
      efficiency: { score: efficiency, details: "Token usage estimation" },
    },
  };
}
