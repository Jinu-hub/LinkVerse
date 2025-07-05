import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../core/components/ui/table";
import type { ContentType } from "~/core/lib/types";
import type { Memo, SortKey } from "../types/memo.types";
import { useNavigate } from "react-router";
import { contentIconMap, typeColorMap } from "~/core/lib/constants";
import type { title } from "process";

interface MemoTableProps {
  pagedMemos: Memo[];
  getType: (contentTypeId: number) => ContentType["code"];
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
  highlightText: (text: string, keyword: string) => React.ReactNode;
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
  highlightText,
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
              const icon = contentIconMap[type];
              const colorClass = typeColorMap[type];
              return (
                <TableRow
                  key={memo.memoId}
                  className="hover:bg-accent/40 transition-colors cursor-pointer"
                  onClick={() => navigate(`/memos/${memo.memoId}`, { state: { title: memo.title } })}
                >
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
                      {icon} {type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{highlightText(memo.title, search)}</TableCell>
                  <TableCell className="whitespace-pre-line max-w-[400px] truncate">
                    <span className="sm:inline hidden">
                      {(() => {
                        const text = typeof memo.content === 'string' ? memo.content : '';
                        const short = text.length > 80 ? text.slice(0, 80) + '...' : text;
                        return highlightText(short, search);
                      })()}
                    </span>
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