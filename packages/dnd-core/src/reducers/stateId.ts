export type State = number;

// 记录状态ID，在每一轮拖拽行为发生时会修改这个值，用于增强判断逻辑
export default function stateId(state: State = 0) {
  return state + 1;
}
