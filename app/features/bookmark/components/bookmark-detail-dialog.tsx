import { Button } from "~/core/components/ui/button";
import { useState, useEffect, useRef } from "react";
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
import { findCategoryPath } from "../lib/utils";
import React from "react";

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
    //const [memo, setMemo] = useState(bookmark.memo);
    const [newTag, setNewTag] = useState("");
    //console.log(categories);
    const [categoryId, setCategoryId] = useState(bookmark.categoryId || "");
    const [popoverOpen, setPopoverOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);
    //const commandInputRef = useRef<HTMLInputElement>(null);
    const [categoryInput, setCategoryInput] = useState("");
    const [categoryPath, setCategoryPath] = useState<string[]>([]);
    const [highlightedIdx, setHighlightedIdx] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    useEffect(() => {
        const parts = categoryInput
          .split('>')
          .map(s => s.trim())
          .filter(Boolean);
        setCategoryPath(parts);
        setShowSuggestions(true);
    }, [categoryInput]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.trim()) {
          setTags([...tags, newTag.trim()]);
          setNewTag("");
        }
      };
    
    const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    };

    const handleSave = () => {
      onSave({ ...bookmark, title, url, tags, categoryId });
    };

    const getCategoryPathName = (id: string) => {
      if (!id) return "카테고리 선택";
      const path = findCategoryPath(id, categories);
      return path.length > 0 ? path.map((p) => p.name).join(" > ") : "카테고리 선택";
    }

    const flatCategories = (cats: Category[]): { id: string; name: string, depth: number }[] => {
      const result: { id: string; name: string, depth: number }[] = [];
      const traverse = (items: Category[], depth: number) => {
        for(const item of items) {
          result.push({ id: item.id, name: item.name, depth });
          if (item.children) {
            traverse(item.children, depth + 1);
          }
        }
      };
      traverse(cats, 0);
      return result;
    }
    
    // 카테고리 트리에서 parentPath에 해당하는 하위 카테고리 배열 반환
    function findChildrenByPath(categories: Category[], path: string[]): Category[] {
      let current = categories;
      for (const name of path) {
        const found = current.find(cat => cat.name === name);
        if (!found || !found.children) return [];
        current = found.children;
      }
      return current;
    }

    // 개선된 자동완성 후보 계산
    let parentPath: string[];
    let currentText: string;
    if (categoryInput.trim().endsWith('>')) {
      parentPath = categoryPath;
      currentText = "";
    } else {
      parentPath = categoryPath.slice(0, -1);
      currentText = categoryPath[categoryPath.length - 1] || "";
    }
    const children = findChildrenByPath(categories, parentPath);
    let candidates: Category[] = [];
    if (currentText === "") {
      candidates = children;
    } else {
      candidates = children.filter(
        cat => cat.name.toLowerCase().startsWith(currentText.toLowerCase()) && cat.name !== currentText
      );
    }

    // 입력값 전체가 기존 카테고리 경로와 일치하는지 검사
    function pathExists(categories: Category[], path: string[]): boolean {
      let current = categories;
      for (const name of path) {
        const found = current.find(cat => cat.name === name);
        if (!found) return false;
        current = found.children || [];
      }
      return true;
    }

    const isFullPathExists = pathExists(categories, categoryPath);
    const exists = candidates.some(cat => cat.name === currentText);
    const canAddNew = currentText && !exists && !isFullPathExists;

    // 외부 클릭 시 추천 박스 닫힘
    useEffect(() => {
      if (!showSuggestions) return;
      const handleClick = (e: MouseEvent) => {
        if (!inputRef.current) return;
        if (!inputRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [showSuggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || !candidates.length) return;
      if (e.key === "ArrowDown") {
        setHighlightedIdx(idx => (idx + 1) % candidates.length);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setHighlightedIdx(idx => (idx - 1 + candidates.length) % candidates.length);
        e.preventDefault();
      } else if (e.key === "Enter" && highlightedIdx >= 0) {
        const cat = candidates[highlightedIdx];
        const newPath = [...parentPath, cat.name];
        setCategoryInput(newPath.join(' > ') + ' > ');
        setHighlightedIdx(-1);
        setShowSuggestions(false);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

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
              {canAddNew && (
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
                onKeyDown={handleKeyDown}
                placeholder="카테고리 입력 (예: 개발 > React > supabase)"
                autoComplete="off"
              />
              {/* 자동완성 추천 리스트 */}
              {showSuggestions && (
                <div className="border rounded bg-white dark:bg-zinc-900 shadow absolute z-50 mt-1 w-full max-h-40 overflow-auto select-none">
                  {candidates.length > 0 ? (
                    candidates.map((cat, idx) => (
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