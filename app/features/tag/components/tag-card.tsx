// app/features/tag/components/TagCard.tsx
import { Card, CardContent } from "~/core/components/ui/card"
import { Button } from "~/core/components/ui/button"
import { useNavigate } from "react-router";
import { Popover, PopoverContent, PopoverTrigger } from "~/core/components/ui/popover";
import React, { useEffect, useState } from "react";
import { editTagName } from "../lib/taActions";
import type { Tag } from "../lib/tag.types";

type TagCardProps = {
  id: number
  name: string
  usageCount: number
  createdAt: string
  goToDetail?: boolean // 기본 true
  onClick?: () => void // 별도 사용자 정의 동작
  onEdit?: () => void
  onDelete?: () => void
  tags: Tag[]
  setTags?: (tags: Tag[]) => void
}

export function TagCard({ id, name, usageCount, createdAt, goToDetail = true, onClick, onEdit, onDelete, tags, setTags }: TagCardProps) {
  const navigate = useNavigate();

  if (id === 61) {
    console.log("name", name);
  }

  useEffect(() => {
    setEditValue(name);
  }, [name]);

  const [editValue, setEditValue] = useState(name);
  const [editing, setEditing] = useState(false);
  const [isEditAfter, setIsEditAfter] = useState(false);
  const [nameHover, setNameHover] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
    if (goToDetail) {
      navigate(`/tags/${id}`, { state: { tagName: name } });
    }
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleEdit = async () => {
    setSaving(true);
    setEditing(true);
    const result = await editTagName({ id, name: editValue, tags, setTags: setTags! });
  };

  const handleEditComplete = () => {
    setSaving(false);
    setEditing(false);
    setIsEditAfter(true);
    setNameHover(false);
    if (editValue !== name && onEdit) onEdit();
  };



  return (
    <Card
      className={`w-full cursor-pointer border-0 bg-zinc-100 dark:bg-zinc-900 transition-all duration-200
        hover:shadow-2xl hover:ring-2 hover:ring-primary/40 hover:scale-[1.025]`}
      onClick={e => {
        if (!editing && !isEditAfter)handleCardClick();
        setIsEditAfter(false);
      }}
    >
      <CardContent className="px-3 py-3 flex flex-col gap-2 group relative">
        {editing ? (
          <input
            className="text-xl font-extrabold text-primary dark:text-primary-300 mb-2 tracking-tight bg-transparent border-b border-primary outline-none px-1"
            value={editValue}
            autoFocus
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleEditComplete}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleEdit();
                handleEditComplete();
              }
            }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <div className="relative inline-block">
            <h4
              className={
                "text-xl font-extrabold mb-2 tracking-tight transition-all text-primary dark:text-primary-300 cursor-pointer"
              }
              onClick={e => { e.stopPropagation(); handleNameClick(e); }}
              onMouseEnter={() => setNameHover(true)}
              onMouseLeave={() => setNameHover(false)}
              tabIndex={0}
              title="클릭해서 편집"
            >
              <span className={nameHover ? "underline underline-offset-4" : ""}>
                #{name}
              </span>
              {nameHover && (
                <span className="ml-2 text-base align-middle text-primary/80 no-underline">✏️</span>
              )}
            </h4>
          </div>
        )}
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-col flex-1 gap-0.5">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">{usageCount} items</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">생성일: {createdAt.slice(0, 10)}</span>
          </div>
          {/* PC: hover 시 노출, 테블릿 이하: ... 버튼 → 팝오버 */}
          <div className="hidden md:flex flex-row gap-2 items-center justify-end ml-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
            {!editing && (
              <Button size="sm" variant="destructive" className="backdrop-blur bg-white/60 dark:bg-zinc-800/60 border-white/40 dark:border-zinc-700/40 text-red-700 dark:text-red-300 hover:bg-red-100 hover:border-red-300 dark:hover:bg-zinc-700/80" onClick={e => { e.stopPropagation(); onDelete?.(); }}>
                삭제
              </Button>
            )}
          </div>
          <div className="flex md:hidden absolute top-2 right-2 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="w-8 h-8 p-0" onClick={e => e.stopPropagation()}>
                  <span className="text-2xl">⋯</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-2 w-32">
                {!editing && (
                  <Button size="sm" variant="destructive" className="w-full" onClick={e => { e.stopPropagation(); onDelete?.(); }}>
                    삭제
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
