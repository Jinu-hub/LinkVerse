import { useState, useRef } from 'react';
import { useClickOutside } from './useClickOutside';
import { getParentPathAndCurrentText, filterCategoryCandidates, pathExists } from '../lib/bmUtils';
import type { Category } from '../types/bookmark.types';

interface UseCategoryAutocompleteParams {
  categories: Category[];
  findChildrenByPath: (categories: Category[], path: string[]) => Category[];
}
/**
 * useCategoryAutocomplete
 * 
 * 카테고리 자동완성 기능을 제공하는 커스텀 React 훅입니다.
 * 
 * 카테고리 경로 입력 시 자동으로 추천 카테고리를 표시하고, 키보드 이벤트를 처리합니다.
 */
export function useCategoryAutocomplete({ categories, findChildrenByPath }: UseCategoryAutocompleteParams) {
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 후보 계산
  const { parentPath, currentText } = getParentPathAndCurrentText(categoryInput, categoryPath);
  const children = findChildrenByPath(categories, parentPath);
  const categoryCandidates = filterCategoryCandidates(children, currentText);

  const isFullCategoryPathExists = pathExists(categories, categoryPath);
  const isCurrentTextExists = categoryCandidates.some(cat => cat.name === currentText);
  const canAddNewCategory = currentText && !isCurrentTextExists && !isFullCategoryPathExists;

  // 외부 클릭 시 추천 박스 닫힘
  useClickOutside(inputRef, () => setShowSuggestions(false), showSuggestions);

  // 키보드 이벤트 핸들러
  function handleCategoryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || !categoryCandidates.length) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIdx(idx => (idx + 1) % categoryCandidates.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIdx(idx => (idx - 1 + categoryCandidates.length) % categoryCandidates.length);
      e.preventDefault();
    } else if (e.key === 'Enter' && highlightedIdx >= 0) {
      const cat = categoryCandidates[highlightedIdx];
      const newPath = [...parentPath, cat.name];
      setCategoryInput(newPath.join(' > ') + ' > ');
      setHighlightedIdx(-1);
      setShowSuggestions(false);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  return {
    categoryInput, setCategoryInput,
    categoryPath, setCategoryPath,
    showSuggestions, setShowSuggestions,
    highlightedIdx, setHighlightedIdx,
    categoryCandidates,
    canAddNewCategory,
    handleCategoryKeyDown,
    inputRef,
    parentPath,
    currentText,
  };
} 