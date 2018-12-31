import { DragDropManager } from "../../interfaces";
import createBeginDrag from "./beginDrag";
import createPublishDragSource from "./publishDragSource";
import createHover from "./hover";
import createDrop from "./drop";
import createEndDrag from "./endDrag";

export * from "./types";

// 创建拖拽生命周期中几个关键事件
export default function createDragDropActions<Context>(
  manager: DragDropManager<Context>
) {
  return {
    beginDrag: createBeginDrag(manager),
    publishDragSource: createPublishDragSource(manager),
    hover: createHover(manager),
    drop: createDrop(manager),
    endDrag: createEndDrag(manager)
  };
}
