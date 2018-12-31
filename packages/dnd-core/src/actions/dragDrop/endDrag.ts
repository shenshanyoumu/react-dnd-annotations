declare var require: any;

import {
  DragDropManager,
  SentinelAction,
  DragDropMonitor
} from "../../interfaces";
import { END_DRAG } from "./types";

const invariant = require("invariant");

export default function createEndDrag<Context>(
  manager: DragDropManager<Context>
) {
  return function endDrag(): SentinelAction {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyIsDragging(monitor);

    const sourceId = monitor.getSourceId();

    // 根据拖拽源组件ID，得到表示拖拽源组件的对象
    const source = registry.getSource(sourceId!, true);

    // 调用结束拖拽行为
    source.endDrag(monitor, sourceId!);

    // 释放本次拖拽源对象，从而可以在后续再次被拖拽
    registry.unpinSource();
    return { type: END_DRAG };
  };
}

// 验证当前拖拽行为是否正在发生
function verifyIsDragging(monitor: DragDropMonitor) {
  invariant(monitor.isDragging(), "Cannot call endDrag while not dragging.");
}
