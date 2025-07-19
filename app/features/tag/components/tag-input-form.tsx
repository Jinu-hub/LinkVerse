import React, { useState, useEffect, useMemo } from "react";
import { Input } from "~/core/components/ui/input";
import { Badge } from "~/core/components/ui/badge";
import { cn } from "~/core/lib/utils";
import FormErrors from "~/core/components/form-error";
import { TagSuggestionList } from "./suggestion-list-tag";

interface TagInputFormProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags?: string[];
  placeholder?: string;
  className?: string;
  fieldErrors?: { tags?: string[] };
}

export default function TagInputForm({ 
  tags, 
  onTagsChange, 
  allTags = [], 
  placeholder = "태그 추가 후 Enter",
  className,
  fieldErrors
}: TagInputFormProps) {
  const [newTag, setNewTag] = useState("");
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  
  // 태그 자동완성 로직
  const tagSuggestions = useMemo(() => {
    if (!newTag.trim()) return [];
    return allTags.filter(tag => 
      tag.toLowerCase().includes(newTag.toLowerCase()) && 
      !tags.includes(tag)
    ).slice(0, 5);
  }, [newTag, allTags, tags]);

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.nativeEvent as any).isComposing) return; // IME 조합 중이면 무시
    
    if (tagSuggestions.length > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const total = tagSuggestions.length;
      if (e.key === "ArrowDown") {
        setHighlightedIdx(prev => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        setHighlightedIdx(prev => (prev - 1 + total) % total);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      
      if (tagSuggestions.length > 0 && highlightedIdx >= 0) {
        // 자동완성에서 선택
        const selected = tagSuggestions[highlightedIdx];
        if (!tags.includes(selected)) {
          onTagsChange([...tags, selected]);
        }
        setNewTag("");
        setHighlightedIdx(-1);
      } else if (newTag.trim()) {
        // 직접 입력
        const trimmedTag = newTag.trim();
        if (!tags.includes(trimmedTag)) {
          onTagsChange([...tags, trimmedTag]);
        }
        setNewTag("");
      }
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  // 태그 추천 리스트 하이라이트 인덱스 설정
  useEffect(() => {
    setHighlightedIdx(tagSuggestions.length > 0 ? 0 : -1);
  }, [tagSuggestions]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* 기존 태그들 */}
      <div className="flex flex-wrap gap-2">
        {tags?.map(tag => {
          const isNew = !allTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "cursor-pointer",
                isNew ? "border border-blue-500 text-blue-500" : ""
              )}
              onClick={() => handleRemoveTag(tag)}
            >
              {tag} ✕
            </Badge>
          );
        })}
      </div>

      {/* 태그 입력 필드 */}
      <Input
        placeholder={placeholder}
        value={newTag}
        onChange={e => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
      />
      {fieldErrors?.tags ? (<FormErrors errors={fieldErrors.tags} />) : null}

      {/* 태그 추천 리스트 */}
      {tagSuggestions.length > 0 && (
        <TagSuggestionList
            tagSuggestions={tagSuggestions}
            highlightedIdx={highlightedIdx}
            setHighlightedIdx={setHighlightedIdx}
            onSelect={(tag) => {
                onTagsChange([...tags, tag]);
                setNewTag("");
            }}
            allTags={allTags}
            setNewTag={setNewTag}
            />
      )}
    </div>
  );
} 