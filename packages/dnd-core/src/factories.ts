import DragDropManagerImpl from "./DragDropManagerImpl";

// BackendFactory表示拖拽行为在宿主环境的实现，比如通常基于H5的拖拽特性实现
import { DragDropManager, BackendFactory } from "./interfaces";

//创建拖拽行为管理器生成函数
export function createDragDropManager<C>(
  backend: BackendFactory,
  context: C,
  debugMode?: boolean
): DragDropManager<C> {
  return new DragDropManagerImpl(backend, context, debugMode);
}
