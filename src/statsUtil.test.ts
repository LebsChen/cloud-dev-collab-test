import { describe, expect, it } from "vitest";
import { mean, median } from "./statsUtil.js";

describe("mean", () => {
  it("computes the mean of positive integers", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
  });

  it("computes the mean of a single element", () => {
    expect(mean([7])).toBe(7);
  });

  it("handles negative numbers", () => {
    expect(mean([-2, -4, 6])).toBe(0);
  });

  it("handles decimals", () => {
    expect(mean([1.5, 2.5])).toBe(2);
  });

  it("throws on an empty array", () => {
    expect(() => mean([])).toThrow("mean of empty array is undefined");
  });
});

describe("median", () => {
  it("computes the median of an odd-length array", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("computes the median of an even-length array", () => {
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  it("computes the median of a single element", () => {
    expect(median([9])).toBe(9);
  });

  it("handles negative numbers", () => {
    expect(median([-5, -1, -3])).toBe(-3);
  });

  it("handles decimals", () => {
    expect(median([1.5, 3.5, 2.5, 0.5])).toBe(2);
  });

  it("does not mutate the input array", () => {
    const nums = [3, 1, 2];
    median(nums);
    expect(nums).toEqual([3, 1, 2]);
  });

  it("throws on an empty array", () => {
    expect(() => median([])).toThrow("median of empty array is undefined");
  });
});
