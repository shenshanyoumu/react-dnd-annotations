import {
  ADD_SOURCE,
  ADD_TARGET,
  REMOVE_SOURCE,
  REMOVE_TARGET
} from "../actions/registry";
import { Action } from "../interfaces";

export type State = number;

//当增加源组件或者拖拽目标组件则增加计数；否则减少计数
export default function refCount(state: State = 0, action: Action<any>) {
  switch (action.type) {
    case ADD_SOURCE:
    case ADD_TARGET:
      return state + 1;
    case REMOVE_SOURCE:
    case REMOVE_TARGET:
      return state - 1;
    default:
      return state;
  }
}
