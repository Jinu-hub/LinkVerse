import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../core/components/ui/table";
import type { ContentType } from "~/core/lib/types";
import type { UntaggedContent, UntaggedSortKey } from "../lib/tag.types";
import { SORT_OPTIONS_UNTAGGED } from "../lib/constants";
import { useNavigate } from "react-router";
import { Button } from "~/core/components/ui/button";
import TagInputForm from "./tag-input-form";
import { cn } from "~/core/lib/utils";

interface UntagTableProps {
  pagedUntaggedContents: UntaggedContent[];
  getType: (contentTypeId: number) => ContentType["code"];
  sortKey: UntaggedSortKey;
  sortOrder: 'asc' | 'desc';
  onSort: (key: UntaggedSortKey) => void;
  page: number;
  totalPages: number;
  totalRows: number;
  startEntry: number;
  endEntry: number;
  onPageChange: (newPage: number) => void;
  search: string;
  highlightText: (text: string, keyword: string) => React.ReactNode;
  allTags: string[];
}

const UntagTable: React.FC<UntagTableProps> = ({
  pagedUntaggedContents,
  getType,
  sortKey,
  sortOrder,
  onSort,
  page,
  totalPages,
  totalRows,
  startEntry,
  endEntry,
  onPageChange,
  search,
  highlightText,
  allTags,
}) => {
  const navigate = useNavigate();
  
  // 각 콘텐츠별 태그 상태 관리
  const [contentTags, setContentTags] = useState<Record<string, string[]>>({});
  
  // 태그 변경 핸들러
  const handleTagsChange = (contentId: string, tags: string[]) => {
    setContentTags(prev => ({
      ...prev,
      [contentId]: tags
    }));
  };
  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            총 <strong className="font-bold text-foreground">{totalRows}</strong>개 중 <strong className="font-bold text-foreground">{startEntry}-{endEntry}</strong>개 항목
          </div>
          <div className="flex items-center gap-2">
            <button className="border rounded px-2 py-1" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>&lt;</button>
            <span className="text-sm">{page} / {totalPages}</span>
            <button className="border rounded px-2 py-1" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>&gt;</button>
          </div>
        </div>
      </div>
      <div className="rounded-xl shadow-lg border bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-zinc-800 border-b border-gray-300 dark:border-zinc-700">
              {SORT_OPTIONS_UNTAGGED.map(col => (
                <TableHead 
                  key={col.value} 
                  onClick={() => col.isSortable && onSort(col.value)} 
                  className={cn(
                    "cursor-pointer select-none text-base font-bold",
                    col.mobileHidden && "hidden md:table-cell"
                  )}
                  style={{ width: col.width }}
                >
                  {col.label} {col.isSortable && sortKey === col.value && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedUntaggedContents.map((untaggedContent) => {
              return (
                <TableRow
                  key={untaggedContent.targetId}
                  className="hover:bg-accent/40 transition-colors"
                >
                  <TableCell className="font-semibold">
                    {highlightText(
                      untaggedContent.title.length > 20 
                        ? `${untaggedContent.title.substring(0, 20)}...` 
                        : untaggedContent.title, 
                      search
                    )}
                  </TableCell>
                  <TableCell className="whitespace-pre-line max-w-[400px] truncate hidden md:table-cell">
                    <a
                      href={untaggedContent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                    >
                      {new URL(untaggedContent.url).hostname}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 hidden md:table-cell">{untaggedContent.createdAt.slice(0, 10)}</TableCell>
                  {/* 태그 입력 필드 */}
                  <TableCell className="text-xs text-gray-500" >
                     <TagInputForm
                       tags={contentTags[untaggedContent.targetId.toString()] || []}
                       onTagsChange={(tags) => handleTagsChange(untaggedContent.targetId.toString(), tags)}
                       allTags={allTags}
                       placeholder="태그 추가"
                       className="w-full"
                     />
                   </TableCell>
                  <TableCell className="text-xs text-gray-500 text-center">
                    <Button variant="outline" className="cursor-pointer" size="sm">저장</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UntagTable; 