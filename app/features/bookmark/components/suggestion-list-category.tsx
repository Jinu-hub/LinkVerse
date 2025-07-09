// app/features/bookmark/components/CategorySuggestionList.tsx
import { cn } from "~/core/lib/utils"; // cn 유틸리티가 있다면 import
import type { Category } from "../types/bookmark.types";
import { useRef, useEffect } from "react";

interface CategorySuggestionListProps {
  categoryCandidates: Category[];
  highlightedIdx: number;
  currentText: string;
  onSelect: (cat: Category) => void;
  onHighlight: (idx: number) => void;
}

export function CategorySuggestionList({
  categoryCandidates,
  highlightedIdx,
  currentText,
  onSelect,
  onHighlight,
}: CategorySuggestionListProps) {
  // 각 항목에 대한 ref 배열 생성
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (
      highlightedIdx >= 0 &&
      itemRefs.current[highlightedIdx]
    ) {
      itemRefs.current[highlightedIdx]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIdx]);

  return (
    <div className="border rounded bg-white dark:bg-zinc-900 shadow absolute z-50 mt-1 w-full max-h-40 overflow-auto select-none">
      {categoryCandidates.length > 0 ? (
        categoryCandidates.map((cat, idx) => (
          <div
            key={cat.id}
            ref={el => { itemRefs.current[idx] = el; }}
            className={cn(
              "px-3 py-2 cursor-pointer",
              idx === highlightedIdx ? "bg-accent text-accent-foreground" : "hover:bg-accent"
            )}
            onMouseDown={e => {
              e.preventDefault();
              onSelect(cat);
            }}
            onMouseEnter={() => onHighlight(idx)}
          >
            {currentText ? (
              <>
                <span className="font-bold">{cat.name.slice(0, currentText.length)}</span>
                <span>{cat.name.slice(currentText.length)}</span>
              </>
            ) : (
              cat.name
            )}
          </div>
        ))
      ) : (
        ""
        // <div className="px-3 py-2 text-muted-foreground">추천 항목이 없습니다.</div>
      )}
    </div>
  );
}