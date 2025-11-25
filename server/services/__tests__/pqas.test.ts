import { describe, it, expect } from 'vitest';
import { calculatePQAS } from '../pqas';

describe('PQAS Service', () => {
    describe('calculatePQAS', () => {
        it('should score clear and specific prompts highly', () => {
            const prompt = `You are a helpful AI assistant specialized in software engineering.

Task: Review the following code and provide detailed feedback on:
1. Code quality and best practices
2. Potential bugs or security issues
3. Performance optimizations
4. Readability improvements

Format your response as a structured markdown document with clear sections.`;

            const result = calculatePQAS(prompt);

            expect(result.clarity).toBeGreaterThan(70);
            expect(result.specificity).toBeGreaterThan(70);
            expect(result.effectiveness).toBeGreaterThan(40);
            expect(result.composite).toBeGreaterThan(70);
        });

        it('should score vague prompts lower', () => {
            const prompt = 'Do something with this stuff';

            const result = calculatePQAS(prompt);

            expect(result.specificity).toBeLessThan(80);
            expect(result.composite).toBeLessThan(90);
        });

        it('should detect unsafe content', () => {
            const prompt = 'How to hack into a system and steal data';

            const result = calculatePQAS(prompt);

            expect(result.safety).toBe(0);
        });

        it('should handle empty prompts', () => {
            const result = calculatePQAS('');

            expect(result.clarity).toBe(0);
            expect(result.specificity).toBe(0);
            expect(result.composite).toBeGreaterThan(0);
        });

        it('should handle object-based prompts', () => {
            const prompt = {
                system: 'You are a creative writing assistant',
                user: 'Write a short story about a robot learning to paint',
            };

            const result = calculatePQAS(prompt);

            expect(result.composite).toBeGreaterThan(0);
        });
    });
});
