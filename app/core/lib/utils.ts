/**
 * Utility Functions Module
 *
 * This module provides utility functions used throughout the application.
 * It includes helpers for class name management and other common operations.
 *
 * The primary utility here is the `cn` function which combines the power of
 * clsx (for conditional class names) and tailwind-merge (for resolving
 * Tailwind CSS class conflicts).
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single className string
 * 
 * This utility function combines the power of clsx and tailwind-merge to:
 * 1. Process conditional class names, arrays, objects, etc. with clsx
 * 2. Properly merge Tailwind CSS classes and handle conflicts with tailwind-merge
 * 
 * Use this function whenever you need to combine multiple classes, especially
 * when working with conditional classes or component variants.
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * 
 * // With conditionals
 * cn('text-base', isLarge && 'text-lg')
 * 
 * // With object syntax
 * cn({ 'text-red-500': isError, 'text-green-500': isSuccess })
 * 
 * // Resolving conflicts (last one wins)
 * cn('text-red-500', 'text-blue-500') // -> 'text-blue-500'
 * 
 * @param inputs - Any number of class values (strings, objects, arrays, etc.)
 * @returns A merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 배열 정렬 유틸
 * @param arr 원본 배열
 * @param key 정렬 키
 * @param order 'asc' | 'desc'
 * @param customSortFn (선택) 커스텀 정렬 함수
 */
export function sortArray<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc', customSortFn?: (a: T, b: T) => number): T[] {
  const sorted = [...arr];
  if (customSortFn) {
    sorted.sort(customSortFn);
    return sorted;
  }
  sorted.sort((a, b) => {
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      return order === 'asc'
        ? (a[key] as number) - (b[key] as number)
        : (b[key] as number) - (a[key] as number);
    } else {
      return order === 'asc'
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    }
  });
  return sorted;
}

/**
 * 배열 필터 유틸
 * @param arr 원본 배열
 * @param predicate 필터 함수
 */
export function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

/**
 * 페이지네이션 유틸
 * @param arr 원본 배열
 * @param page 현재 페이지(1부터)
 * @param rowsPerPage 한 페이지당 행 수('all'이면 전체)
 */
export function paginateArray<T>(arr: T[], page: number, rowsPerPage: number | 'all'): T[] {
  if (rowsPerPage === 'all') return arr;
  const start = (page - 1) * rowsPerPage;
  return arr.slice(start, start + rowsPerPage);
}