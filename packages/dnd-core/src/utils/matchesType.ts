import { Identifier } from "../interfaces";

// 在应用中，只有当拖拽目标组件接受拖拽源组件类型，拖拽行为才合法
export default function matchesType(
  targetType: Identifier | Identifier[] | null,
  draggedItemType: Identifier | null
) {
  if (draggedItemType === null) {
    return targetType === null;
  }
  return Array.isArray(targetType)
    ? (targetType as Identifier[]).some(t => t === draggedItemType)
    : targetType === draggedItemType;
}
