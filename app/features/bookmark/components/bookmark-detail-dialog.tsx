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
import { CategorySuggestionList } from "./suggestion-list-category";
import { findCategoryPath } from "../lib/bmUtils";
import React from "react";
import { useClickOutside } from '../hooks/useClickOutside';
import { findChildrenByPath } from '../lib/bmUtils';
import { useCategoryAutocomplete } from '../hooks/useCategoryAutocomplete';
import { z } from "zod";
import { Label } from "~/core/components/ui/label";
import { Switch } from "~/core/components/ui/switch";
import type { BookmarkDetailDialogProps } from "../lib/bookmark.types";
import { cn } from "~/core/lib/utils";
import { TagSuggestionList } from "./suggestion-list-tag";
import FormErrors from "~/core/components/form-error";

export default function BookmarkDetailDialog({ 
  open, onOpenChange, bookmark, onSave, categories, allTags, fieldErrors, setFieldErrors, saving }
  : BookmarkDetailDialogProps) {
    const [title, setTitle] = useState(bookmark.title);
    const [url, setUrl] = useState(bookmark.url);
    const [tags, setTags] = useState<string[]>(bookmark.tags);
    const [newTag, setNewTag] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
    const [categoryId, setCategoryId] = useState(bookmark.categoryId || "");
    const [memo, setMemo] = useState(bookmark.memo);
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const {
      categoryInput, setCategoryInput,
      categoryPath, setCategoryPath,
      showSuggestions, setShowSuggestions,
      highlightedIdx, setHighlightedIdx,
      categoryCandidates,
      newCategoryName,
      handleCategoryKeyDown,
      inputRef,
      parentPath,
      currentText,
      parentCategoryId,
      currentCategoryId,
      newCategoryLevel,
    } = useCategoryAutocomplete({ categories, findChildrenByPath });

    const isAddMode = bookmark?.id === 0;
    const isError = Object.keys(fieldErrors).length > 0;

    // 북마크 정보 업데이트
    useEffect(() => {
      if (!isError && !saving) {
        setTitle(bookmark.title);
        setUrl(bookmark.url);
        setTags(bookmark.tags);
        setMemo(bookmark.memo);
        setNewTag("");
        setCategoryId(bookmark.categoryId || 0);
        setCategoryInput(getCategoryPathName(bookmark.categoryId || 0));
        setShowSuggestions(false);
      }
    }, [bookmark, isError]);

    // open이 false일 때만 입력값 리셋
    useEffect(() => {
      if (!open) {
        setTitle("");
        setUrl("");
        setTags([]);
        setMemo("");
        setFieldErrors({});
      }
    }, [open]);

    // 카테고리 경로 자동완성 추천 리스트 계산
    useEffect(() => {
        const parts = categoryInput
          .split('>')
          .map(s => s.trim())
          .filter(Boolean);
        setCategoryPath(parts);
        setShowSuggestions(true);
    }, [categoryInput]);

    // 북마크 추가 모드일 때 클립보드에서 URL 읽어오기
    useEffect(() => {
      if (isAddMode && open && !url) {
        navigator.clipboard.readText().then(text => {
          const urlSchema = z.string().url();
          const result = urlSchema.safeParse(text);
          if (result.success) {
            setUrl(result.data);
          }
        });
      }
    }, [isAddMode, open, url]);

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

      if (e.key === "Enter" && tagSuggestions.length > 0 && highlightedIdx >= 0) {
        const selected = tagSuggestions[highlightedIdx];
        if (!tags.includes(selected)) {
          setTags([...tags, selected]);
        }
        setNewTag("");
        setTagSuggestions([]);
        setHighlightedIdx(-1);
      }
    };
    
    // 태그 삭제
    const handleRemoveTag = (tag: string) => {
      setTags(tags.filter(t => t !== tag));
    };

    // 북마크 저장
    const handleSave = () => {
      onSave({
        ...bookmark,
        title,
        url,
        tags,
        categoryId: currentCategoryId ? Number(currentCategoryId) : undefined,
        parentCategoryId: parentCategoryId ? Number(parentCategoryId) : undefined,
        newCategoryName,
        newCategoryLevel,
        memo,
      });
    };

    // 카테고리 경로 이름 반환
    const getCategoryPathName = (id: number) => {
      //if (!id) return "카테고리 선택";
      const path = findCategoryPath(id, categories);
      return path.length > 0 ? path.map((p) => p.name).join(" > ") : "";
    }

    // 외부 클릭 시 추천 박스 닫힘 (커스텀 훅 사용)
    useClickOutside(inputRef, () => setShowSuggestions(false), showSuggestions);

    // 자동 타이틀 설정
    const [autoTitle, setAutoTitle] = useState(true);
    useEffect(() => {
      if (open) {
        if (isAddMode) {
          setAutoTitle(true);
        } else {
          setAutoTitle(false);
        }
      }
    }, [open, isAddMode]);

    // 태그 추천 리스트 계산
    useEffect(() => {
      const trimmed = newTag.trim();
      if (trimmed.length >= 2) {
        // 중복 제거: 입력값이 allTags에 있으면 추천에서 제외
        const filtered = allTags
          .filter(tag => tag.toLowerCase().includes(trimmed.toLowerCase()))
          .filter(tag => tag !== trimmed && !tags.includes(tag))
          .slice(0, 10);
        setTagSuggestions([trimmed, ...filtered]);
      } else {
        setTagSuggestions([]);
      }
    }, [newTag, allTags, tags]);

    // 태그 추천 리스트 하이라이트 인덱스 설정
    useEffect(() => {
      setHighlightedIdx(tagSuggestions.length > 0 ? 0 : -1);
    }, [tagSuggestions]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={dialogContentRef}>
          <DialogHeader>
            <DialogTitle className="text-xl">{isAddMode ? "북마크 추가" : "북마크 상세"}</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <div className="relative">
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" disabled={saving} />
              {fieldErrors?.url ? (<FormErrors errors={fieldErrors.url} />) : null}
            </div>

            {isAddMode && (
              <div className="flex items-center gap-2 mb-2">
                <Switch id="auto-title" className="mb-0" 
                  checked={autoTitle} onCheckedChange={setAutoTitle} disabled={saving} />
                <Label htmlFor="auto-title" className="text-xs text-muted-foreground mb-0">Title 자동생성</Label>
              </div>
            )}
            {!autoTitle && (
              <>
                <div className="relative">
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" disabled={saving} />
                  {fieldErrors?.title ? (<FormErrors errors={fieldErrors.title} />) : null}
                </div>
              </>
            )}
            <hr className="my-4 border-muted" />

            <div className="relative">
              <div className="mb-1 text-base text-muted-foreground">카테고리</div>
              {newCategoryName && (
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
                disabled={saving}
              />
              {fieldErrors?.newCategoryName ? (<FormErrors errors={fieldErrors.newCategoryName} />) : null}
              {/* 자동완성 추천 리스트 */}
              {showSuggestions && (
                <CategorySuggestionList
                  categoryCandidates={categoryCandidates}
                  highlightedIdx={highlightedIdx}
                  currentText={currentText}
                  onSelect={(cat) => {
                    const newPath = [...parentPath, cat.name];
                    setCategoryInput(newPath.join(' > ') + ' > ');
                    setHighlightedIdx(-1);
                    setShowSuggestions(false);
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }}
                  onHighlight={setHighlightedIdx}
                />
              )}
            </div>

            <div className="relative">
              <div className="mb-1 text-base text-muted-foreground">태그</div>
              <div className="flex flex-wrap gap-2 mb-2">
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
              <Input
                placeholder="태그 추가 후 Enter"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {fieldErrors?.tags ? (<FormErrors errors={fieldErrors.tags} />) : null}
              {tagSuggestions.length > 0 && (
                <TagSuggestionList
                  tagSuggestions={tagSuggestions}
                  highlightedIdx={highlightedIdx}
                  setHighlightedIdx={setHighlightedIdx}
                  onSelect={(tag) => {
                    setTags([...tags, tag]);
                    setNewTag("");
                  }}
                  allTags={allTags}
                  setNewTag={setNewTag}
                />
              )}
            </div>
  
            <div className="relative">
              <div className="mb-1 text-base text-muted-foreground">메모</div>
              <Textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="메모를 입력하세요"
                rows={3}
                disabled={saving}
              />
              {fieldErrors?.memo ? (<FormErrors errors={fieldErrors.memo} />) : null}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <div className="w-full text-left">
              {fieldErrors?.form ? (<FormErrors errors={fieldErrors.form} />) : null}
            </div>
            {isAddMode && (
              <Button 
                className="bg-blue-200 hover:bg-blue-300 text-blue-900 cursor-pointer disabled:cursor-not-allowed" 
                onClick={handleSave} 
                disabled={saving}
              >
                Add
              </Button>
            )}
            {!isAddMode && (
              <>
                <Button 
                  className="bg-green-200 hover:bg-green-300 text-green-900 cursor-pointer disabled:cursor-not-allowed" 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  Edit
                </Button>
                {/*
                <Button 
                  className="bg-red-200 hover:bg-red-300 text-red-900 cursor-pointer disabled:cursor-not-allowed" 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  Del
                </Button>
                */}
              </>
            )}
            <Button
              variant="secondary"
              disabled={saving}
              className="cursor-pointer disabled:cursor-not-allowed"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}