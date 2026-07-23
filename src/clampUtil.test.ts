import { describe, expect, it } from "vitest";
import { clamp, sum } from "./clampUtil.js";

describe("clamp", () => {
  it("returns the value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min when value is below the range", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above the range", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("returns the boundary when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns the boundary when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("handles negative ranges", () => {
    expect(clamp(-7, -10, -5)).toBe(-7);
    expect(clamp(-20, -10, -5)).toBe(-10);
  });

  it("handles decimals", () => {
    expect(clamp(2.5, 1.5, 3.5)).toBe(2.5);
    expect(clamp(4.2, 1.5, 3.5)).toBe(3.5);
  });

  it("throws when min is greater than max", () => {
    expect(() => clamp(5, 10, 0)).toThrow("min must not be greater than max");
  });
});

describe("sum", () => {
  it("sums positive integers", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("sums a single element", () => {
    expect(sum([7])).toBe(7);
  });

  it("handles negative numbers", () => {
    expect(sum([-2, -4, 6])).toBe(0);
  });

  it("handles decimals", () => {
    expect(sum([1.5, 2.5])).toBe(4);
  });

  it("returns 0 for an empty array", () => {
    expect(sum([])).toBe(0);
  });
});
