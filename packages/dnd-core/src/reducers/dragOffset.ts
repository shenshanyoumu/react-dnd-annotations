import {
  INIT_COORDS,
  BEGIN_DRAG,
  HOVER,
  END_DRAG,
  DROP
} from "../actions/dragDrop";
import { XYCoord, Action } from "../interfaces";
import { areCoordsEqual } from "../utils/equality";

// 注意在页面中DOM元素的几个坐标信息，包括视口偏移坐标、文档偏移坐标等
export interface State {
  initialSourceClientOffset: XYCoord | null;
  initialClientOffset: XYCoord | null;
  clientOffset: XYCoord | null;
}

const initialState: State = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};

// 记录在整个拖拽生命周期中各阶段拖拽源组件的坐标信息
export default function dragOffset(
  state: State = initialState,
  action: Action<{
    sourceClientOffset: XYCoord;
    clientOffset: XYCoord;
  }>
) {
  const { payload } = action;
  switch (action.type) {
    case INIT_COORDS:
    case BEGIN_DRAG:
      return {
        initialSourceClientOffset: payload.sourceClientOffset,
        initialClientOffset: payload.clientOffset,
        clientOffset: payload.clientOffset
      };
    case HOVER:
      if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
        return state;
      }
      return {
        ...state,
        clientOffset: payload.clientOffset
      };
    case END_DRAG:
    case DROP:
      return initialState;
    default:
      return state;
  }
}
