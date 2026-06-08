# Why Code Coverage Is Misleading for AI-Generated Tests

A JavaScript price-calculation function with a deliberately buggy premium discount constant, plus a tautological test that achieves 100% line coverage across every branch while asserting nothing that would catch the bug.

> Companion code for the Autonoma blog post: **[Why Code Coverage Is Misleading for AI-Generated Tests](https://getautonoma.com/blog/code-coverage-misleading-ai-tests)**

## The anti-pattern: 100% coverage, 0% protection

`src/hollow-coverage.test.js` contains a `calculatePrice` function and a test suite that
together demonstrate the central failure mode of coverage-driven testing.

- **Every line runs.** The three test cases call `calculatePrice` once per tier
  (`premium`, `standard`, and an unknown/default tier), so every branch executes.
- **Coverage reports 100%.** Lines and branches are all touched.
- **Bug detection is 0%.** Each assertion compares the function's output back to the
  function's own output:

  ```js
  assert.strictEqual(price, calculatePrice(100, 'premium'));
  ```

  This is tautological. It can never fail, because both sides of the equality are
  computed by the same code under test.

### The deliberate bug

`PREMIUM_DISCOUNT` is set to `0.02` (2%) when it should be `0.20` (20%):

```js
export const PREMIUM_DISCOUNT = 0.02; // bug: should be 0.20
```

A premium customer is charged `100 * (1 - 0.02) = 98` instead of the intended
`100 * (1 - 0.20) = 80`. The test suite passes anyway, with full coverage, because no
assertion ever asks "is this 20%?" It only asks "is the output what the function
returned?" The function returned the wrong number, and the assertion confirmed it.

This is the gap coverage cannot see: execution is not verification.

## Requirements

Node 18+ (uses the built-in `node:test` runner and ES modules).

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/code-coverage-misleading-ai-tests.git
cd code-coverage-misleading-ai-tests
node --test src/hollow-coverage.test.js
```

You will see all three tests pass. The hollow assertions never catch the
`PREMIUM_DISCOUNT` bug. That green checkmark is exactly the point.

## Project structure

```
.
├── README.md
├── LICENSE
├── package.json
└── src/
    └── hollow-coverage.test.js
```

- `src/` — primary source files for the snippets referenced in the blog post.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/code-coverage-misleading-ai-tests/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.
