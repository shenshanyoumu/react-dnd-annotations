import { Unsubscribe } from "redux";

export type Identifier = string | symbol;
export type SourceType = Identifier;
export type TargetType = Identifier | Identifier[];
export type Unsubscribe = () => void;
export type Listener = () => void;

//拖拽中的DOM元素坐标
export interface XYCoord {
  x: number;
  y: number;
}

//参与拖拽的DOM元素角色，分为拖拽源和拖拽目的
export enum HandlerRole {
  SOURCE = "SOURCE",
  TARGET = "TARGET"
}

export interface Backend {
  setup(): void;
  teardown(): void;
  connectDragSource(sourceId: any, node?: any, options?: any): Unsubscribe;
  connectDragPreview(sourceId: any, node?: any, options?: any): Unsubscribe;
  connectDropTarget(targetId: any, node?: any, options?: any): Unsubscribe;
}

// 拖拽行为管理器，这是中心控制器
export interface DragDropMonitor {
  // 在拖拽发生整个过程，监听redux管理的state状态树的变化
  subscribeToStateChange(
    listener: Listener,
    options?: {
      handlerIds: string[] | undefined;
    }
  ): Unsubscribe;
  // 监听拖拽源DOM元素的位置变化
  subscribeToOffsetChange(listener: Listener): Unsubscribe;

  // 判定DOM元素是否可以被拖拽，以及是否可以作为拖拽目的DOM容器
  canDragSource(sourceId: string): boolean;
  canDropOnTarget(targetId: string): boolean;

  // 判定当前拖拽行为是否正在发生
  isDragging(): boolean;
  isDraggingSource(sourceId: string): boolean;
  isOverTarget(
    targetId: string,
    options?: {
      shallow?: boolean;
    }
  ): boolean;

  // 在应用中通过匹配拖拽源和拖拽目的容器的类型兼容性来自定义拖拽行为是否合法
  getItemType(): Identifier | null;

  // 得到整个拖拽过程中保存的数据，这个数据会在拖拽结束后用于计算/渲染等过程
  getItem(): any;

  // 得到当前拖拽行为中的拖拽源DOM元素ID和拖拽目的DOM容器ID
  getSourceId(): string | null;
  getTargetIds(): string[];
  /**
   * Returns a plain object representing the last recorded drop result. The drop targets may optionally specify it by returning an
   * object from their drop() methods. When a chain of drop() is dispatched for the nested targets, bottom up, any parent that
   * explicitly returns its own result from drop() overrides the child drop result previously set by the child. Returns null if
   * called outside endDrag().
   */
  getDropResult(): any;
  /**
   * Returns true if some drop target has handled the drop event, false otherwise. Even if a target did not return a drop result,
   * didDrop() returns true. Use it inside endDrag() to test whether any drop target has handled the drop. Returns false if called
   * outside endDrag().
   */
  didDrop(): boolean;
  isSourcePublic(): boolean | null;
  /**
   * Returns the { x, y } client offset of the pointer at the time when the current drag operation has started.
   * Returns null if no item is being dragged.
   */
  getInitialClientOffset(): XYCoord | null;
  /**
   * Returns the { x, y } client offset of the drag source component's root DOM node at the time when the current drag
   * operation has started. Returns null if no item is being dragged.
   */
  getInitialSourceClientOffset(): XYCoord | null;

  //  记录拖拽过程中鼠标拖拽点在视口的偏移量
  getClientOffset(): XYCoord | null;

  // 在开始拖拽时，记录拖拽源DOM元素的视口偏移量
  getSourceClientOffset(): XYCoord | null;

  //当拖拽动作正在进行，则实时记录当前途拖拽点与开始拖拽时的坐标变化
  getDifferenceFromInitialOffset(): XYCoord | null;
}

/**
 * 事件处理注册中心，在redux的action中有对应的一些action
 */
export interface HandlerRegistry {
  // 通过下面两个方法来注册拖拽源/拖拽目标，只有被注册过才能响应事件
  addSource(type: SourceType, source: DragSource): string;
  addTarget(type: TargetType, target: DropTarget): string;

  containsHandler(handler: DragSource | DropTarget): boolean;

  // 获得事先注册的拖拽源组件
  getSource(sourceId: string, includePinned?: boolean): DragSource;

  // 获得拖拽源组件类型
  getSourceType(sourceId: string): SourceType;
  getTargetType(targetId: string): TargetType;
  getTarget(targetId: string): DropTarget;

  // 判定组件是否为拖拽源
  isSourceId(handlerId: string): boolean;
  isTargetId(handlerId: string): boolean;
  removeSource(sourceId: string): void;
  removeTarget(targetId: string): void;

  // 为了保证每次只有一个拖拽行为实例，需要将拖拽源“钉”起来，直到本次拖拽结束
  pinSource(sourceId: string): void;
  unpinSource(): void;
}

//创建redux的action对象接口
export interface Action<Payload> {
  type: string;
  payload: Payload;
}

// 创建哨兵action对象，这种对象类似redux的@@INIT一样用于触发store的构造
export interface SentinelAction {
  type: string;
}

// 基于redux库的状态管理，生成action对象
export type ActionCreator<Payload> = (args: any[]) => Action<Payload>;

export interface BeginDragOptions {
  publishSource?: boolean;
  clientOffset?: XYCoord;
  getSourceClientOffset?: (sourceId: Identifier) => XYCoord;
}

// 初始化redux中管理的拖拽位置相关数据
export interface InitCoordsPayload {
  clientOffset: XYCoord | null;
  sourceClientOffset: XYCoord | null;
}

// 初始化redux管理的拖拽源组件基础信息
export interface BeginDragPayload {
  itemType: Identifier;
  item: any;
  sourceId: Identifier;
  clientOffset: XYCoord | null;
  sourceClientOffset: XYCoord | null;
  isSourcePublic: boolean;
}

// 当拖拽源被拖拽到拖拽目标组件容器上方，需要产生的hover相关数据
export interface HoverPayload {
  targetIds: Identifier[];
  clientOffset: XYCoord | null;
}

export interface HoverOptions {
  clientOffset?: XYCoord;
}

// 当拖放动作发生，需要的数据
export interface DropPayload {
  dropResult: any;
}

// 拖放目标组件容器
export interface TargetIdPayload {
  targetId: string;
}

export interface SourceIdPayload {
  sourceId: string;
}

// 定义的拖拽动作接口，暴露给开发者
export interface DragDropActions {
  beginDrag(sourceIds: string[], options?: any): Action<BeginDragPayload>;
  publishDragSource(): SentinelAction;
  hover(targetIds: string[], options?: any): Action<HoverPayload>;
  drop(options?: any): void;
  endDrag(): SentinelAction;
}

//所谓context对象，就是提供当前拖拽行为的上下文环境
export interface DragDropManager<Context> {
  getContext(): Context;
  getMonitor(): DragDropMonitor;

  // 获得宿主环境下拖拽真正的后端实现，比如H5的原生拖拽能力
  getBackend(): Backend;

  //获得当前拖拽管理器管理的一系列事件处理注册
  getRegistry(): HandlerRegistry;

  // 触发store的state发生变化的action集合
  getActions(): DragDropActions;

  // redux中store.dispatch
  dispatch(action: any): void;
}

//所谓“后端”，就是宿主环境提供的拖拽能力。比如在支持H5的浏览器中，H5原生支持拖拽
export type BackendFactory = (dragDropManager: DragDropManager<any>) => Backend;

// 对拖拽源DOM元素的钩子函数
export interface DragSource {
  beginDrag(monitor: DragDropMonitor, targetId: string): void;
  endDrag(monitor: DragDropMonitor, targetId: string): void;
  canDrag(monitor: DragDropMonitor, targetId: string): boolean;
  isDragging(monitor: DragDropMonitor, targetId: string): boolean;
}

/**
 * 在拖放过程经历的三个钩子函数，分别判定是否可以被拖放到目标DOM容器，以及在还没有放下时的悬浮效果；
 * 最后当真正放下时的回调动作
 */
export interface DropTarget {
  canDrop(monitor: DragDropMonitor, targetId: string): boolean;
  hover(monitor: DragDropMonitor, targetId: string): void;
  drop(monitor: DragDropMonitor, targetId: string): any;
}
