import { XYCoord } from "../../../interfaces";
import { INIT_COORDS } from "../types";

// 在每次拖拽行为发生时初始化拖拽源组件的位置
export function setClientOffset(
  clientOffset: XYCoord | null | undefined,
  sourceClientOffset?: XYCoord | null | undefined
) {
  return {
    type: INIT_COORDS,
    payload: {
      sourceClientOffset: sourceClientOffset || null,
      clientOffset: clientOffset || null
    }
  };
}
