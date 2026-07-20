import { describe, expect, it } from "vitest";
import { add, fib, multiply } from "./math.js";

describe("math", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("multiplies two numbers", () => {
    expect(multiply(4, 6)).toBe(24);
  });

  it("calculates Fibonacci numbers", () => {
    expect(fib(0)).toBe(0);
    expect(fib(1)).toBe(1);
    expect(fib(8)).toBe(21);
  });
});
