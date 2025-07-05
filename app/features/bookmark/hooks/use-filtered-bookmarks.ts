import { useMemo } from 'react'
import type { Bookmark, Category } from '../types/bookmark.types'
import {
  DEFAULT_ROWS_PER_PAGE,
  DEFAULT_SORT_KEY,
  ALL_CATEGORY_ID,
} from '../lib/constants'

interface UseFilteredBookmarksProps {
  bookmarks: Bookmark[]
  categories: Category[]
  selectedCategoryId: number
  search: string
  sortKey: keyof Bookmark
  sortOrder: 'asc' | 'desc'
  page: number
  rowsPerPage: number | 'all'
}

export function useFilteredBookmarks({
  bookmarks: initialBookmarks,
  categories,
  selectedCategoryId,
  search,
  sortKey,
  sortOrder,
  page,
  rowsPerPage,
}: UseFilteredBookmarksProps) {
  const filteredBookmarks = useMemo(() => {
    let bookmarks = initialBookmarks

    // 1. 카테고리 필터링 (탭 선택과 연동됨)
    if (selectedCategoryId && selectedCategoryId > ALL_CATEGORY_ID) {
      const allChildIds = new Set<number>()
      const findCategory = (
        id: number,
        cats: Category[],
      ): Category | undefined => {
        for (const cat of cats) {
          if (cat.id === id) return cat
          if (cat.children) {
            const found = findCategory(id, cat.children)
            if (found) return found
          }
        }
      }

      const targetCategory = findCategory(selectedCategoryId, categories)

      const getAllChildIds = (category: Category) => {
        allChildIds.add(category.id)
        if (category.children) {
          category.children.forEach(getAllChildIds)
        }
      }

      if (targetCategory) {
        getAllChildIds(targetCategory)
      }

      bookmarks = bookmarks.filter(b => allChildIds.has(b.categoryId))
    }

    // 2. 검색어 필터링
    if (search) {
      bookmarks = bookmarks.filter(
        b =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.url.toLowerCase().includes(search.toLowerCase()) ||
          b.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // 3. 정렬
    bookmarks = [...bookmarks].sort((a, b) => {
      let aValue = a[sortKey]
      let bValue = b[sortKey]
      if (sortKey === 'tags') {
        aValue = a.tags.join(', ')
        bValue = b.tags.join(', ')
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    return bookmarks
  }, [selectedCategoryId, search, sortKey, sortOrder, initialBookmarks, categories])

  // 페이지네이션 적용
  const totalRows = filteredBookmarks.length
  const totalPages =
    rowsPerPage === 'all' ? 1 : Math.ceil(totalRows / (rowsPerPage as number))

  const pagedBookmarks = useMemo(() => {
    if (rowsPerPage === 'all') return filteredBookmarks
    const start = (page - 1) * (rowsPerPage as number)
    return filteredBookmarks.slice(start, start + (rowsPerPage as number))
  }, [filteredBookmarks, rowsPerPage, page])

  // showing X to Y of Z entries 계산
  const startEntry =
    totalRows === 0
      ? 0
      : (rowsPerPage === 'all' ? 0 : (page - 1) * (rowsPerPage as number)) + 1
  const endEntry =
    rowsPerPage === 'all'
      ? totalRows
      : Math.min(page * (rowsPerPage as number), totalRows)

  return {
    pagedBookmarks,
    totalPages,
    totalRows,
    startEntry,
    endEntry,
  }
} 