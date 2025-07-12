import type { UniqueIdentifier } from "@dnd-kit/core"
import type { FlattenedItem, Category } from "./bookmark.types"
import { arrayMove } from "@dnd-kit/sortable"

const getDepth = (
  depth: number,
  previousItem: FlattenedItem,
  nextItem: FlattenedItem,
) => {
  const maxDepth = previousItem ? previousItem.depth + 1 : 0
  const minDepth = nextItem ? nextItem.depth : 0

  if (depth >= maxDepth) {
    return maxDepth
  } else if (depth < minDepth) {
    return minDepth
  }
  return depth
}

const getParentId = (
  depth: number,
  overItemIndex: number,
  previousItem: FlattenedItem,
  newItems: FlattenedItem[],
) => {
  if (depth === 0 || !previousItem) {
    return null
  }

  if (depth === previousItem.depth) {
    return previousItem.parentId
  }

  if (depth > previousItem.depth) {
    return previousItem.id
  }

  const newParent = newItems
    .slice(0, overItemIndex)
    .reverse()
    .find((item) => item.depth === depth)?.parentId

  return newParent ?? null
}

// 移動先の親アイテムの情報を取得する
export const getProjection = (
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) => {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]

  // 「ドラッグ中のアイテム」を「マウスオーバーしているアイテム」の位置に移動する
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]

  const dragDepth = Math.round(dragOffset / indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth

  const depth = getDepth(projectedDepth, previousItem, nextItem)

  const parentId = getParentId(depth, overItemIndex, previousItem, newItems)
  return { depth, parentId }
}

// ツリー構造を作成する
export const buildTree = (flattenedItems: FlattenedItem[]) => {
  const root: Category = { id: 0, parent_id: null, name: '', level: 0, children: [] }
  const nodes: Record<string, Category> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const { id, children } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? items.find(({ id }) => id === parentId)

    nodes[id] = { id, parent_id: parentId as number, name: '', level: 0, children: [] }
    parent.children?.push(item)
  }

  return root.children
}

export const flatten = (
  items: Category[],
  parentId: UniqueIdentifier | null = null,
  depth = 0,
) => {
  return items.reduce((acc, item): FlattenedItem[] => {
    return [
      ...acc,
      { ...item, parentId, depth },
      ...flatten(item.children || [], item.id, depth + 1),
    ]
  }, [] as FlattenedItem[])
}

export function flattenTree(items: Category[]): Category[] {
    return flatten(items);
}

const findFromTreeItem = (
  items: Category[],
  id: UniqueIdentifier,
): FlattenedItem | undefined => {
  const flattenedItems = flatten(items)
  return flattenedItems.find((item) => item.id === id)
}

// 子アイテムのIDを再起的に取得する
export const getChildrenIds = (
  items: Category[],
  id: UniqueIdentifier,
  includeSelf = false,
): UniqueIdentifier[] => {
  const item = findFromTreeItem(items, id)
  if (!item) {
    return []
  }

  const childrenIds = item.children?.flatMap((child) =>
    getChildrenIds(items, child.id, true),
  )

  return includeSelf ? [id, ...(childrenIds || [])] : childrenIds || []
}

export const getAllCategoryIds = (categories: Category[]): (string | number)[] => {
    const result: (string | number)[] = [];
    function traverse(nodes: Category[]) {
      for (const node of nodes) {
        result.push(node.id);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    }
    traverse(categories);
    return result;
  }

export const getParentsIds = (
  items: Category[],
  id: UniqueIdentifier,
): UniqueIdentifier[] => {
  const item = findFromTreeItem(items, id)
  if (!item || !item.parentId) {
    return []
  }

  const parentsIds = getParentsIds(items, item.parentId)

  return [item.parentId, ...parentsIds]
}
