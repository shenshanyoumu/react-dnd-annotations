declare var require: any;

import { Store } from "redux";
import matchesType from "./utils/matchesType";
import {
  getSourceClientOffset,
  getDifferenceFromInitialOffset
} from "./utils/coords";
import { areDirty } from "./utils/dirtiness";
import { State } from "./reducers";
import {
  DragDropMonitor,
  Listener,
  Unsubscribe,
  XYCoord,
  HandlerRegistry,
  Identifier
} from "./interfaces";
const invariant = require("invariant");

export default class DragDropMonitorImpl implements DragDropMonitor {
  constructor(private store: Store<State>, public registry: HandlerRegistry) {}

  // 当redux的state发生变化，注册事件被调用
  public subscribeToStateChange(
    listener: Listener,
    options: { handlerIds: string[] | undefined } = { handlerIds: undefined }
  ): Unsubscribe {
    const { handlerIds } = options;
    invariant(typeof listener === "function", "listener must be a function.");
    invariant(
      typeof handlerIds === "undefined" || Array.isArray(handlerIds),
      "handlerIds, when specified, must be an array of strings."
    );

    let prevStateId = this.store.getState().stateId;
    const handleChange = () => {
      const state = this.store.getState();
      const currentStateId = state.stateId;
      try {
        const canSkipListener =
          currentStateId === prevStateId ||
          (currentStateId === prevStateId + 1 &&
            !areDirty(state.dirtyHandlerIds, handlerIds));

        if (!canSkipListener) {
          listener();
        }
      } finally {
        prevStateId = currentStateId;
      }
    };

    return this.store.subscribe(handleChange);
  }

  // 当拖拽组件位置发生变化，触发注册的监听器函数
  public subscribeToOffsetChange(listener: Listener): Unsubscribe {
    invariant(typeof listener === "function", "listener must be a function.");

    let previousState = this.store.getState().dragOffset;
    const handleChange = () => {
      const nextState = this.store.getState().dragOffset;
      if (nextState === previousState) {
        return;
      }

      previousState = nextState;
      listener();
    };

    return this.store.subscribe(handleChange);
  }

  // 拖拽行为是否可以开始，当拖拽行为已经在发生时则无法再开始一个拖拽行为
  public canDragSource(sourceId: string): boolean {
    const source = this.registry.getSource(sourceId);
    invariant(source, "Expected to find a valid source.");

    if (this.isDragging()) {
      return false;
    }

    return source.canDrag(this, sourceId);
  }

  // 是否可以将被拖拽组件拖放到特定的目标组件上
  public canDropOnTarget(targetId: string): boolean {
    const target = this.registry.getTarget(targetId);
    invariant(target, "Expected to find a valid target.");

    // 拖拽结束或者被拖拽组件已经被放下，则直接返回
    if (!this.isDragging() || this.didDrop()) {
      return false;
    }

    // 判定拖拽源组件类型和目标组件类型的兼容性
    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    return (
      matchesType(targetType, draggedItemType) && target.canDrop(this, targetId)
    );
  }

  // 拖拽行为是否正在发生
  public isDragging() {
    return Boolean(this.getItemType());
  }

  // 是否正在拖拽源组件
  public isDraggingSource(sourceId: string): boolean {
    const source = this.registry.getSource(sourceId, true);
    invariant(source, "Expected to find a valid source.");

    if (!this.isDragging() || !this.isSourcePublic()) {
      return false;
    }

    const sourceType = this.registry.getSourceType(sourceId);
    const draggedItemType = this.getItemType();
    if (sourceType !== draggedItemType) {
      return false;
    }

    return source.isDragging(this, sourceId);
  }

  // 表示被拖拽组件是否被拖拽到了目标组件上空
  public isOverTarget(targetId: string, options = { shallow: false }) {
    const { shallow } = options;
    if (!this.isDragging()) {
      return false;
    }

    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    if (draggedItemType && !matchesType(targetType, draggedItemType)) {
      return false;
    }

    const targetIds = this.getTargetIds();
    if (!targetIds.length) {
      return false;
    }

    const index = targetIds.indexOf(targetId);
    if (shallow) {
      return index === targetIds.length - 1;
    } else {
      return index > -1;
    }
  }

  // 表示当前正在被拖拽的组件类型
  public getItemType() {
    return this.store.getState().dragOperation.itemType as Identifier;
  }

  // 得到当前正在被拖拽的组件
  public getItem() {
    return this.store.getState().dragOperation.item;
  }

  // 得到当前正在被拖拽组件的ID
  public getSourceId() {
    return this.store.getState().dragOperation.sourceId;
  }

  // 获得能够存放拖拽源组件的目标组件DI列表
  public getTargetIds() {
    return this.store.getState().dragOperation.targetIds;
  }

  // 当目标组件接受到拖拽组件时，得到的拖放数据
  public getDropResult() {
    return this.store.getState().dragOperation.dropResult;
  }

  // 本次拖拽行为已经结束
  public didDrop() {
    return this.store.getState().dragOperation.didDrop;
  }

  // 源组件被发布后才会注册事件机制
  public isSourcePublic() {
    return this.store.getState().dragOperation.isSourcePublic;
  }

  // 下面是在页面拖拽中的各种位置信息
  public getInitialClientOffset(): XYCoord | null {
    return this.store.getState().dragOffset.initialClientOffset;
  }

  public getInitialSourceClientOffset(): XYCoord | null {
    return this.store.getState().dragOffset.initialSourceClientOffset;
  }

  public getClientOffset(): XYCoord | null {
    return this.store.getState().dragOffset.clientOffset;
  }

  public getSourceClientOffset(): XYCoord | null {
    return getSourceClientOffset(this.store.getState().dragOffset);
  }

  public getDifferenceFromInitialOffset() {
    return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
  }
}
