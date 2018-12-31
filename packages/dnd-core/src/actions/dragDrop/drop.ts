import {
  Action,
  DragDropManager,
  DropPayload,
  DragDropMonitor,
  HandlerRegistry
} from "../../interfaces";
import { DROP } from "./types";

declare var require: any;
const invariant = require("invariant");
const isObject = require("lodash/isObject");

export default function createDrop<Context>(manager: DragDropManager<Context>) {
  return function drop(options = {}): void {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyInvariants(monitor);

    // 得到合法的拖拽目标列表
    const targetIds = getDroppableTargets(monitor);

    // Multiple actions are dispatched here, which is why this doesn't return an action
    targetIds.forEach((targetId, index) => {
      const dropResult = determineDropResult(
        targetId,
        index,
        registry,
        monitor
      );
      const action: Action<DropPayload> = {
        type: DROP,
        payload: {
          dropResult: {
            ...options,
            ...dropResult
          }
        }
      };

      // redux触发DROP类型的action
      manager.dispatch(action);
    });
  };
}

// 当组件正在被拖拽并且没有被放下时，可以触发拖放行为
function verifyInvariants(monitor: DragDropMonitor) {
  invariant(monitor.isDragging(), "Cannot call drop while not dragging.");
  invariant(
    !monitor.didDrop(),
    "Cannot call drop twice during one drag operation."
  );
}

function determineDropResult(
  targetId: string,
  index: number,
  registry: HandlerRegistry,
  monitor: DragDropMonitor
) {
  // 根据目标组件ID，得到目标组件对象
  const target = registry.getTarget(targetId);

  // 调用目标组件的drop方法，得到拖放结果数据
  let dropResult = target.drop(monitor, targetId);

  // 判定拖放结果是否合法
  verifyDropResultType(dropResult);

  //
  if (typeof dropResult === "undefined") {
    dropResult = index === 0 ? {} : monitor.getDropResult();
  }
  return dropResult;
}

//判定拖放结果数据合法性
function verifyDropResultType(dropResult: any) {
  invariant(
    typeof dropResult === "undefined" || isObject(dropResult),
    "Drop result must either be an object or undefined."
  );
}

//得到能够允许被拖拽组件存放的组件容器列表
function getDroppableTargets(monitor: DragDropMonitor) {
  const targetIds = monitor
    .getTargetIds()
    .filter(monitor.canDropOnTarget, monitor);
  targetIds.reverse();
  return targetIds;
}
