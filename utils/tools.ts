export const findAverage = (arr: number[]) =>
  arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
