declare var require: any;

import {
  Action,
  DragDropManager,
  XYCoord,
  BeginDragPayload,
  BeginDragOptions,
  DragDropMonitor,
  HandlerRegistry
} from "../../interfaces";
import { setClientOffset } from "./local/setClientOffset";
const invariant = require("invariant");
const isObject = require("lodash/isObject");

import { BEGIN_DRAG, INIT_COORDS } from "./types";

// 每次开始拖拽时，需要重置位置信息
const ResetCoordinatesAction = {
  type: INIT_COORDS,
  payload: {
    clientOffset: null,
    sourceClientOffset: null
  }
};

export default function createBeginDrag<Context>(
  manager: DragDropManager<Context>
) {
  return function beginDrag(
    sourceIds: string[] = [],
    options: BeginDragOptions = {
      publishSource: true
    }
  ): Action<BeginDragPayload> | undefined {
    const {
      publishSource = true,
      clientOffset,
      getSourceClientOffset
    }: BeginDragOptions = options;
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();

    // 使用拖拽源组件的client Offset坐标来初始化位置
    manager.dispatch(setClientOffset(clientOffset));

    verifyInvariants(sourceIds, monitor, registry);

    // Get the draggable source
    const sourceId = getDraggableSource(sourceIds, monitor);
    if (sourceId === null) {
      manager.dispatch(ResetCoordinatesAction);
      return;
    }

    // Get the source client offset
    let sourceClientOffset: XYCoord | null = null;
    if (clientOffset) {
      verifyGetSourceClientOffsetIsFunction(getSourceClientOffset);
      sourceClientOffset = getSourceClientOffset!(sourceId);
    }

    // Initialize the full coordinates
    manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));

    const source = registry.getSource(sourceId);
    const item = source.beginDrag(monitor, sourceId);
    verifyItemIsObject(item);
    registry.pinSource(sourceId);

    const itemType = registry.getSourceType(sourceId);
    return {
      type: BEGIN_DRAG,
      payload: {
        itemType,
        item,
        sourceId,
        clientOffset: clientOffset || null,
        sourceClientOffset: sourceClientOffset || null,
        isSourcePublic: !!publishSource
      }
    };
  };
}

function verifyInvariants(
  sourceIds: string[],
  monitor: DragDropMonitor,
  registry: HandlerRegistry
) {
  // 当拖拽行为正在发生，则无法调用beginDrag行为
  invariant(!monitor.isDragging(), "Cannot call beginDrag while dragging.");

  // 所有可被拖拽的组件一定需要先注册
  for (const s of sourceIds) {
    invariant(registry.getSource(s), "Expected sourceIds to be registered.");
  }
}

function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset: any) {
  invariant(
    typeof getSourceClientOffset === "function",
    "When clientOffset is provided, getSourceClientOffset must be a function."
  );
}

function verifyItemIsObject(item: any) {
  invariant(isObject(item), "Item must be an object.");
}

function getDraggableSource(sourceIds: string[], monitor: DragDropMonitor) {
  let sourceId = null;
  for (let i = sourceIds.length - 1; i >= 0; i--) {
    if (monitor.canDragSource(sourceIds[i])) {
      sourceId = sourceIds[i];
      break;
    }
  }
  return sourceId;
}
