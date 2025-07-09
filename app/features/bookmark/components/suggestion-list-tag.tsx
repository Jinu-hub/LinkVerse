import { cn } from "~/core/lib/utils";
import { useRef, useEffect } from "react";

interface TagSuggestionListProps {
  tagSuggestions: string[];
  highlightedIdx: number;
  setHighlightedIdx: (idx: number) => void;
  onSelect: (tag: string) => void;
  allTags: string[];
}

export function TagSuggestionList({
  tagSuggestions,
  highlightedIdx,
  setHighlightedIdx,
  onSelect,
  allTags,
}: TagSuggestionListProps) {
  if (tagSuggestions.length === 0) return null;

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
      {tagSuggestions.map((tag, idx) => {
        const isNew = !allTags.includes(tag);
        return (
          <div
            key={tag}
            ref={el => { itemRefs.current[idx] = el; }}
            className={cn(
              "px-3 py-2 cursor-pointer",
              isNew ? "border border-blue-500 text-blue-500" : "",
              idx === highlightedIdx ? "bg-accent text-accent-foreground" : "hover:bg-accent"
            )}
            onMouseDown={() => {
              onSelect(tag);
            }}
            onMouseEnter={() => setHighlightedIdx(idx)}
          >
            {isNew ? <span className="text-blue-500">"{tag}" 태그 추가</span> : tag}
          </div>
        );
      })}
    </div>
  );
} 