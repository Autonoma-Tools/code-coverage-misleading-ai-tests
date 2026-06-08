import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// PREMIUM_DISCOUNT should be 0.20 (20%), but is set to 0.02 (2%) by mistake.
// No test below will catch this because every assertion mirrors the return value
// of the function itself, not an independently-derived expected value.
export const PREMIUM_DISCOUNT = 0.02; // bug: should be 0.20
export const STANDARD_DISCOUNT = 0.10;
export const DEFAULT_DISCOUNT = 0.0;

export function calculatePrice(basePrice, tier) {
    if (tier === 'premium') {
        return basePrice * (1 - PREMIUM_DISCOUNT);
    }
    if (tier === 'standard') {
        return basePrice * (1 - STANDARD_DISCOUNT);
    }
    return basePrice * (1 - DEFAULT_DISCOUNT);
}

// Coverage result: 100% lines, 100% branches.
// Bug detection result: 0%. Every assertion is tautological.
describe('calculatePrice', () => {
    it('applies premium tier pricing', () => {
        const price = calculatePrice(100, 'premium');
        // Asserts the output back to itself. If PREMIUM_DISCOUNT is wrong,
        // this expected value is also wrong, and the test stays green.
        assert.strictEqual(price, calculatePrice(100, 'premium'));
    });

    it('applies standard tier pricing', () => {
        const price = calculatePrice(100, 'standard');
        assert.strictEqual(price, calculatePrice(100, 'standard'));
    });

    it('applies default pricing for unknown tier', () => {
        const price = calculatePrice(100, 'guest');
        assert.strictEqual(price, calculatePrice(100, 'guest'));
    });
});
