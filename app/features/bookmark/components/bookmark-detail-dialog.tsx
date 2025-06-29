import { Button } from "~/core/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Badge } from "~/core/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";
import { cn } from "~/core/lib/utils";
import type { Category } from '../types/bookmark.types';
import { findCategoryPath } from "../lib/bmUtils";
import React from "react";
import { useClickOutside } from '../hooks/useClickOutside';
import { findChildrenByPath } from '../lib/bmUtils';
import { useCategoryAutocomplete } from '../hooks/useCategoryAutocomplete';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void; 
    bookmark: {
      id: string;
      title: string;
      url: string;
      tags: string[];
      //memo: string;
      categoryId?: string;
    };
    onSave: (updated: Props["bookmark"]) => void;
    categories: Category[];
  };

export default function BookmarkDetailDialog({ open, onOpenChange, bookmark, onSave, categories }: Props) {
    const [title, setTitle] = useState(bookmark.title);
    const [url, setUrl] = useState(bookmark.url);
    const [tags, setTags] = useState<string[]>(bookmark.tags);
    const [newTag, setNewTag] = useState("");
    const [categoryId, setCategoryId] = useState(bookmark.categoryId || "");
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const {
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
    } = useCategoryAutocomplete({ categories, findChildrenByPath });

    // 북마크 정보 업데이트
    useEffect(() => {
        setTitle(bookmark.title);
        setUrl(bookmark.url);
        setTags(bookmark.tags);
        //setMemo(bookmark.memo);
        setNewTag("");
        setCategoryId(bookmark.categoryId || "");
        setCategoryInput(getCategoryPathName(bookmark.categoryId || ""));
        setShowSuggestions(false);
    }, [bookmark]);

    // 카테고리 경로 자동완성 추천 리스트 계산
    useEffect(() => {
        const parts = categoryInput
          .split('>')
          .map(s => s.trim())
          .filter(Boolean);
        setCategoryPath(parts);
        setShowSuggestions(true);
    }, [categoryInput]);

    // 태그 추가
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.trim()) {
          setTags([...tags, newTag.trim()]);
          setNewTag("");
        }
      };
    
    // 태그 삭제
    const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    };

    // 북마크 저장
    const handleSave = () => {
      onSave({ ...bookmark, title, url, tags, categoryId });
    };

    // 카테고리 경로 이름 반환
    const getCategoryPathName = (id: string) => {
      if (!id) return "카테고리 선택";
      const path = findCategoryPath(id, categories);
      return path.length > 0 ? path.map((p) => p.name).join(" > ") : "카테고리 선택";
    }

    // 외부 클릭 시 추천 박스 닫힘 (커스텀 훅 사용)
    useClickOutside(inputRef, () => setShowSuggestions(false), showSuggestions);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={dialogContentRef}>
          <DialogHeader>
            <DialogTitle>북마크 상세 정보</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" />
  
            <div>
              <div className="mb-1 text-sm text-muted-foreground">태그</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ✕
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="태그 추가 후 Enter"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
  
            <div className="relative">
              <div className="mb-1 text-sm text-muted-foreground">카테고리</div>
              {canAddNewCategory && (
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  입력하신 경로는 새 카테고리로 추가됩니다.
                </div>
              )}
              <Input
                ref={inputRef}
                value={categoryInput}
                onChange={e => {
                  setCategoryInput(e.target.value);
                  setHighlightedIdx(-1);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleCategoryKeyDown}
                placeholder="카테고리 입력 (예: 개발 > React > supabase)"
                autoComplete="off"
              />
              {/* 자동완성 추천 리스트 */}
              {showSuggestions && (
                <div className="border rounded bg-white dark:bg-zinc-900 shadow absolute z-50 mt-1 w-full max-h-40 overflow-auto select-none">
                  {categoryCandidates.length > 0 ? (
                    categoryCandidates.map((cat, idx) => (
                      <div
                        key={cat.id}
                        className={cn(
                          "px-3 py-2 cursor-pointer",
                          idx === highlightedIdx ? "bg-accent text-accent-foreground" : "hover:bg-accent"
                        )}
                        onMouseDown={e => {
                          e.preventDefault();
                          const newPath = [...parentPath, cat.name];
                          setCategoryInput(newPath.join(' > ') + ' > ');
                          setHighlightedIdx(-1);
                          setShowSuggestions(false);
                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 0);
                        }}
                        onMouseEnter={() => setHighlightedIdx(idx)}
                      >
                        {/* 입력 prefix 강조 */}
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
                    <div className="px-3 py-2 text-muted-foreground">추천 항목이 없습니다.</div>
                  )}
                </div>
              )}
            </div>
  
            <Textarea
              //value={memo}
              //onChange={e => setMemo(e.target.value)}
              placeholder="메모 입력"
              rows={4}
            />
          </div>
  
          <DialogFooter className="mt-4">
            <Button className="bg-blue-200 hover:bg-blue-300 text-blue-900" onClick={handleSave}>Add</Button>
            <Button className="bg-green-200 hover:bg-green-300 text-green-900" onClick={handleSave}>Edit</Button>
            <Button className="bg-red-200 hover:bg-red-300 text-red-900" onClick={handleSave}>Del</Button>
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}