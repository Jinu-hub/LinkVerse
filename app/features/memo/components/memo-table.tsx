import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../core/components/ui/table";
import type { ContentType } from "../../tag/components/tag-content-card";
import type { Memo, SortKey } from "../types/memo.types";
import { highlightText } from "~/core/lib/common";
import { useNavigate } from "react-router";

const typeIconMap: Record<ContentType, string> = {
  bookmark: "🔖",
  book: "📘",
  movie: "🎬",
  travel: "✈️",
};
const typeColorMap: Record<ContentType, string> = {
  bookmark: "text-blue-700 bg-blue-100/80 dark:text-blue-200 dark:bg-blue-900/60 ring-1 ring-blue-300 dark:ring-blue-800 shadow-sm",
  book: "text-green-700 bg-green-100/80 dark:text-green-200 dark:bg-green-900/60 ring-1 ring-green-300 dark:ring-green-800 shadow-sm",
  movie: "text-red-700 bg-red-100/80 dark:text-red-200 dark:bg-red-900/60 ring-1 ring-red-300 dark:ring-red-800 shadow-sm",
  travel: "text-yellow-800 bg-yellow-100/80 dark:text-yellow-200 dark:bg-yellow-900/60 ring-1 ring-yellow-300 dark:ring-yellow-800 shadow-sm",
};

interface MemoTableProps {
  pagedMemos: Memo[];
  getType: (contentTypeId: number) => ContentType;
  sortKey: SortKey;
  sortOrder: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
  page: number;
  totalPages: number;
  totalRows: number;
  startEntry: number;
  endEntry: number;
  onPageChange: (newPage: number) => void;
  search: string;
}

const MemoTable: React.FC<MemoTableProps> = ({
  pagedMemos,
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
}) => {
  const navigate = useNavigate();
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
              <TableHead onClick={() => onSort('contentTypeId')} className="cursor-pointer select-none text-base font-bold">
                콘텐츠 타입 {sortKey === 'contentTypeId' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => onSort('title')} className="cursor-pointer select-none text-base font-bold">
                제목 {sortKey === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => onSort('content')} className="cursor-pointer select-none text-base font-bold">
                내용 {sortKey === 'content' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => onSort('createdAt')} className="cursor-pointer select-none text-base font-bold">
                작성일 {sortKey === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => onSort('updatedAt')} className="cursor-pointer select-none text-base font-bold">
                수정일 {sortKey === 'updatedAt' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedMemos.map((memo) => {
              const type = getType(memo.contentTypeId);
              const icon = typeIconMap[type];
              const colorClass = typeColorMap[type];
              return (
                <TableRow
                  key={memo.memoId}
                  className="hover:bg-accent/40 transition-colors cursor-pointer"
                  onClick={() => navigate(`/memos/${memo.memoId}`)}
                >
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
                      {icon} {type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{highlightText(memo.title, search)}</TableCell>
                  <TableCell className="whitespace-pre-line max-w-[400px] truncate">
                    <span className="sm:inline hidden">{highlightText(memo.content, search)}</span>
                    <span className="inline sm:hidden">
                      {(() => {
                        const text = typeof memo.content === 'string' ? memo.content : '';
                        const short = text.length > 12 ? text.slice(0, 12) + '...' : text;
                        // 하이라이트 적용
                        return highlightText(short, search);
                      })()}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{memo.createdAt.slice(0, 10)}</TableCell>
                  <TableCell className="text-xs text-gray-500">{memo.updatedAt.slice(0, 10)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MemoTable; 