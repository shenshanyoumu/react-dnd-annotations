import { DragDropManager, SentinelAction } from "../../interfaces";
import { PUBLISH_DRAG_SOURCE } from "./types";

//当拖拽行为正在发生，则表示当前拖拽源组件正在被监控
export default function createPublishDragSource<Context>(
  manager: DragDropManager<Context>
) {
  return function publishDragSource(): SentinelAction | undefined {
    const monitor = manager.getMonitor();
    if (monitor.isDragging()) {
      return { type: PUBLISH_DRAG_SOURCE };
    }
  };
}
