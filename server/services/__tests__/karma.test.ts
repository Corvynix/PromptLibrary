import { describe, it, expect } from 'vitest';
import { calculateKarmaBreakdown } from '../karma';

describe('Karma Service', () => {
    describe('calculateKarmaBreakdown', () => {
        it('should calculate karma for a user with prompts', () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                displayName: 'Test User',
                roles: ['user'],
                karmaScore: 0,
                metrics: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockPrompts = [
                {
                    id: 1,
                    slug: 'test-prompt',
                    title: 'Test Prompt',
                    shortDesc: 'A test prompt',
                    type: 'text',
                    industryTags: [],
                    socialTags: [],
                    visibility: 'public',
                    license: 'MIT',
                    ownerId: 1,
                    totalUses: 100,
                    popularityScore: 50,
                    featured: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            const mockVersions = [
                {
                    id: 1,
                    promptId: 1,
                    versionNumber: 1,
                    content: 'Test content',
                    modelCompatibility: ['gpt-4'],
                    pqasScore: { composite: 85 },
                    status: 'production',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            const breakdown = calculateKarmaBreakdown(
                mockUser,
                mockPrompts as any,
                mockVersions as any,
                [],
                [],
                []
            );

            expect(breakdown.totalKarma).toBeGreaterThan(0);
            expect(breakdown.breakdown.promptCreation).toBeGreaterThan(0);
            expect(breakdown.breakdown.qualityBonus).toBeGreaterThan(0);
            expect(breakdown.breakdown.usageBonus).toBeGreaterThan(0);
        });

        it('should return zero karma for new users', () => {
            const mockUser = {
                id: 1,
                email: 'new@example.com',
                displayName: 'New User',
                roles: ['user'],
                karmaScore: 0,
                metrics: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const breakdown = calculateKarmaBreakdown(
                mockUser,
                [],
                [],
                [],
                [],
                []
            );

            expect(breakdown.totalKarma).toBe(0);
        });
    });
});
