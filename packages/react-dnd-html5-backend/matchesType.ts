//
// HACK: copied from dnd-core. duplicating here to fix a CI issue
//
import { Identifier, SourceType, TargetType } from "dnd-core";

// 下面代码直接拷贝dnd-core相关代码
export default function matchesType(
  targetType: TargetType | null,
  draggedItemType: SourceType | null
) {
  if (draggedItemType === null) {
    return targetType === null;
  }
  return Array.isArray(targetType)
    ? (targetType as Identifier[]).some(t => t === draggedItemType)
    : targetType === draggedItemType;
}
