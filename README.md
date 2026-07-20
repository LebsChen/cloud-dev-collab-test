# Cloud-Dev Collaboration Test Bed

This repository is a small, buildable project for Cloud-Dev collaboration and
repo-config-sync end-to-end tests. Worker sessions can implement the marked
functions, and the test suite provides an objective completion check.

## Worker tasks

- Implement `multiply(a, b)` in `src/math.ts`.
- Implement `fib(n)` in `src/math.ts`.

Both functions are intentionally left as TODO stubs, so their tests currently
fail until a Worker completes them. `add(a, b)` is already implemented and
serves as the passing baseline.

## Commands

```bash
npm install
npm run typecheck
npm test
```
