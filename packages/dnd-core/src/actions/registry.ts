import { Action, SourceIdPayload, TargetIdPayload } from "../interfaces";

// action对象的type
export const ADD_SOURCE = "dnd-core/ADD_SOURCE";
export const ADD_TARGET = "dnd-core/ADD_TARGET";
export const REMOVE_SOURCE = "dnd-core/REMOVE_SOURCE";
export const REMOVE_TARGET = "dnd-core/REMOVE_TARGET";

/**
 *
 * @param sourceId 在应用开发中，每个组件具有唯一的标示
 */
export function addSource(sourceId: string): Action<SourceIdPayload> {
  return {
    type: ADD_SOURCE,
    payload: {
      sourceId
    }
  };
}

export function addTarget(targetId: string): Action<TargetIdPayload> {
  return {
    type: ADD_TARGET,
    payload: {
      targetId
    }
  };
}

export function removeSource(sourceId: string): Action<SourceIdPayload> {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId
    }
  };
}

export function removeTarget(targetId: string): Action<TargetIdPayload> {
  return {
    type: REMOVE_TARGET,
    payload: {
      targetId
    }
  };
}
