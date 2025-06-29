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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/core/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/core/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "~/core/lib/utils";
import type { Category } from '../types/bookmark.types';
import { findCategoryPath } from "../lib/bmUtils";
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

    useEffect(() => {
        setTitle(bookmark.title);
        setUrl(bookmark.url);
        setTags(bookmark.tags);
        //setMemo(bookmark.memo);
        setNewTag("");
        setCategoryId(bookmark.categoryId || "");
    }, [bookmark]);

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
  
            <div>
              <div className="mb-1 text-sm text-muted-foreground">카테고리</div>
              <Popover modal={true} open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {getCategoryPathName(categoryId)}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[375px] p-0">
                  <Command>
                    {/* <CommandInput placeholder="카테고리 검색..." /> */}
                    <CommandList>
                      <CommandEmpty>카테고리가 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {flatCategories(categories).map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.name}
                            onSelect={() => {
                              setCategoryId(cat.id === categoryId ? "" : cat.id);
                              setPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                categoryId === cat.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span style={{ paddingLeft: `${cat.depth * 1.2}rem` }}>{cat.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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