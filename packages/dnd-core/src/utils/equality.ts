import { XYCoord } from "../interfaces";

export type EqualityCheck<T> = (a: T, b: T) => boolean;
export const strictEquality = <T>(a: T, b: T) => a === b;

/**
 * 判定两个坐标是否相同
 * @param offsetA 坐标A
 * @param offsetB 坐标B
 */
export function areCoordsEqual(
  offsetA: XYCoord | null | undefined,
  offsetB: XYCoord | null | undefined
) {
  if (!offsetA && !offsetB) {
    return true;
  } else if (!offsetA || !offsetB) {
    return false;
  } else {
    return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
  }
}

/**
 * 判定两个数组是否相同，注意数组元素比较默认严格模式
 * @param a 数组A
 * @param b 数组B
 */
export function areArraysEqual<T>(
  a: T[],
  b: T[],
  isEqual: EqualityCheck<T> = strictEquality
) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (!isEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}
