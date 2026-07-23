export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error("min must not be greater than max");
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

export function sum(nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}
