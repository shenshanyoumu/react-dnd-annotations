let nextUniqueId = 0;

// 每次拖拽行为发生，拖拽库内部维持一个ID来记录
export default function getNextUniqueId(): number {
  return nextUniqueId++;
}
