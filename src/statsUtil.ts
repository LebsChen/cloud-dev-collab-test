export function mean(nums: number[]): number {
  if (nums.length === 0) {
    throw new Error("mean of empty array is undefined");
  }
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

export function median(nums: number[]): number {
  if (nums.length === 0) {
    throw new Error("median of empty array is undefined");
  }
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
