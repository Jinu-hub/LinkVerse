import React from 'react'
import type { BookmarksAction, BookmarksState, Category } from '../types/bookmark.types'
import { ALL_CATEGORY_ID } from './constants'

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

export function findCategoryPath(categoryId: string, categories: Category[]): { id: string; name: string }[] {
  let path: { id: string; name: string }[] = [];
  function traverse(id: string, cats: Category[]): boolean {
    for (const cat of cats) {
      if (cat.id === id) {
        if (cat.parent_id && cat.parent_id !== "0") {
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