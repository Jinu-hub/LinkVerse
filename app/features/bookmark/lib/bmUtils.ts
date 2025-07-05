import React from 'react'
import type { BookmarksAction, BookmarksState, Category } from '../types/bookmark.types'
import { ALL_CATEGORY_ID } from './constants'


export function toCategory(category: any): Category {
  return {
    id: category.category_id,
    parent_id: category.parent_category_id,
    name: category.name,
    level: category.level,
    is_root: category.is_root ?? false,
    children: category.children ? category.children.map(toCategory) : [],
  };
}

export function bookmarksReducer(
  state: BookmarksState,
  action: BookmarksAction,
): BookmarksState {
  switch (action.type) {
    case 'CHANGE_TAB': {
      const { tabId, categoryId } = action.payload
      // 탭을 클릭하면 항상 해당 탭의 루트 카테고리를 선택하도록 설정합니다.
      return {
        ...state,
        selectedTabId: tabId,
        selectedCategoryId: categoryId || ALL_CATEGORY_ID, // categoryId가 없으면 '전체'로
      }
    }
    case 'CHANGE_CATEGORY': {
      const { categoryId, tabId } = action.payload
      return {
        ...state,
        selectedCategoryId: categoryId,
        selectedTabId: tabId || state.selectedTabId,
      }
    }
    case 'SORT': {
      const key = action.payload
      const currentSortKey = state.sortKeyMap[state.selectedTabId]
      const currentSortOrder = state.sortOrderMap[state.selectedTabId]
      return {
        ...state,
        sortKeyMap: { ...state.sortKeyMap, [state.selectedTabId]: key },
        sortOrderMap: {
          ...state.sortOrderMap,
          [state.selectedTabId]:
            currentSortKey === key
              ? currentSortOrder === 'asc'
                ? 'desc'
                : 'asc'
              : 'asc',
        },
      }
    }
    case 'SEARCH': {
      return {
        ...state,
        searchMap: { ...state.searchMap, [state.selectedTabId]: action.payload },
      }
    }
    case 'CHANGE_ROWS_PER_PAGE': {
      return {
        ...state,
        rowsPerPageMap: {
          ...state.rowsPerPageMap,
          [state.selectedTabId]: action.payload,
        },
        pageMap: { ...state.pageMap, [state.selectedTabId]: 1 }, // 페이지당 개수 변경 시 1페이지로
      }
    }
    case 'CHANGE_PAGE': {
      return {
        ...state,
        pageMap: { ...state.pageMap, [state.selectedTabId]: action.payload },
      }
    }
    case 'OPEN_DETAIL': {
      return {
        ...state,
        selectedBookmark: { ...action.payload, memo: '' },
        isDetailDialogOpen: true,
      }
    }
    case 'CLOSE_DETAIL': {
      return {
        ...state,
        selectedBookmark: null,
        isDetailDialogOpen: false,
      }
    }
    default:
      return state
  }
}

export function findCategoryPath(categoryId: number, categories: Category[]): { id: number; name: string }[] {
  let path: { id: number; name: string }[] = [];
  function traverse(id: number, cats: Category[]): boolean {
    for (const cat of cats) {
      if (cat.id === id) {
        if (cat.parent_id && cat.parent_id > ALL_CATEGORY_ID) {
          traverse(cat.parent_id, categories);
        }
        path.push({ id: cat.id, name: cat.name });
        return true;
      }
      if (cat.children && cat.children.length > 0) {
        if (traverse(id, cat.children)) return true;
      }
    }
    return false;
  }
  traverse(categoryId, categories);
  return path;
} 

// 카테고리 트리에서 parentPath에 해당하는 하위 카테고리 배열 반환
export function findChildrenByPath(categories: Category[], path: string[]): Category[] {
  let current = categories;
  for (const name of path) {
    const found = current.find(cat => cat.name === name);
    if (!found || !found.children) return [];
    current = found.children;
  }
  return current;
}

export function getParentPathAndCurrentText(categoryInput: string, categoryPath: string[]) {
  if (categoryInput.trim().endsWith('>')) {
    return { parentPath: categoryPath, currentText: '' };
  } else {
    return {
      parentPath: categoryPath.slice(0, -1),
      currentText: categoryPath[categoryPath.length - 1] || '',
    };
  }
}

export function filterCategoryCandidates(children: Category[], currentText: string) {
  if (currentText === '') return children;
  return children.filter(
    cat => cat.name.toLowerCase().startsWith(currentText.toLowerCase()) && cat.name !== currentText
  );
}

export function pathExists(categories: Category[], path: string[]): boolean {
  let current = categories;
  for (const name of path) {
    const found = current.find(cat => cat.name === name);
    if (!found) return false;
    current = found.children || [];
  }
  return true;
}

// flat 배열을 트리로 변환
export function buildCategoryTree(flatCategories: any[]): Category[] {
  // 1. 항상 추가할 루트 카테고리 2개
  const rootCategories: Category[] = [
    { id: 0, parent_id: 0, name: '🗂️ 전체보기', level: 0, is_root: true, children: [] },
    { id: -1, parent_id: 0, name: '❓ 미분류', level: 0, is_root: true, children: [] },
  ];

  // 2. flatCategories에서 트리 생성
  const idMap: { [key: string]: Category } = {};
  flatCategories.forEach(cat => {
    idMap[String(cat.category_id)] = {
      id: cat.category_id,
      parent_id: cat.parent_category_id,
      name: cat.category_name,
      level: cat.level,
      is_root: cat.is_root ?? false,
      children: [],
    };
  });

  // 3. 트리 구조 생성
  const tree: Category[] = [];
  Object.values(idMap).forEach(cat => {
    if (cat.parent_id && idMap[cat.parent_id] && cat.parent_id !== cat.id) {
      idMap[cat.parent_id].children!.push(cat);
    } else {
      tree.push(cat);
    }
  });

  // 4. 항상 rootCategories를 제일 앞에 추가
  return [...rootCategories, ...tree];
}
