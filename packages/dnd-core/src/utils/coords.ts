import { State } from "../reducers/dragOffset";
import { XYCoord } from "..";

/**
 * 坐标加法运算
 * @param a The first coordinate
 * @param b The second coordinate
 */
export function add(a: XYCoord, b: XYCoord): XYCoord {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

/**
 * 坐标减法运算
 * @param a The first coordinate
 * @param b The second coordinate
 */
export function subtract(a: XYCoord, b: XYCoord): XYCoord {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

//计算被拖拽的组件初始坐标与拖拽中计算的坐标的笛卡尔距离
export function getSourceClientOffset(state: State) {
  const {
    clientOffset,
    initialClientOffset,
    initialSourceClientOffset
  } = state;
  if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
    return null;
  }
  return subtract(
    add(clientOffset, initialSourceClientOffset),
    initialClientOffset
  );
}

//计算拖拽开始坐标与拖拽中坐标的偏移，注意区分坐标的视口偏移和文档偏移的差异
export function getDifferenceFromInitialOffset(state: State): XYCoord | null {
  const { clientOffset, initialClientOffset } = state;
  if (!clientOffset || !initialClientOffset) {
    return null;
  }
  return subtract(clientOffset, initialClientOffset);
}
