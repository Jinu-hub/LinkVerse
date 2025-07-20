import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../core/components/ui/table";
import type { ContentType } from "~/core/lib/types";
import type { Memo, SortKey } from "../lib/memo.types";
import { useNavigate } from "react-router";
import { contentIconMap, typeColorMap } from "~/core/lib/constants";
import { cn } from "~/core/lib/utils";
import { SORTABLE_COLUMNS } from "../lib/constants";

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
              {SORTABLE_COLUMNS.map(col => (
                <TableHead 
                  key={col.key} 
                  onClick={() => col.isSortable && onSort(col.key)} 
                  className={cn("cursor-pointer select-none text-base font-bold", 
                    col.isMobileHidden && "hidden md:table-cell",
                    col.isSortable && "cursor-pointer")}
                  style={{ width: col.width }}
                  >
                  {col.label} {sortKey === col.key && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
              ))}
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
                      <span className="md:inline hidden">{icon} {type.toUpperCase()}</span>
                      <span className="inline md:hidden">{icon}</span>
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {highlightText(memo.title.length > 20 
                      ? `${memo.title.substring(0, 20)}...` 
                      : memo.title, 
                      search
                    )}
                  </TableCell>
                  <TableCell className="whitespace-pre-line max-w-[400px] truncate">
                    <span className="lg:inline hidden">
                      {(() => {
                        const text = typeof memo.content === 'string' ? memo.content : '';
                        const short = text.length > 80 ? text.slice(0, 80) + '...' : text;
                        return highlightText(short, search);
                      })()}
                    </span>
                    <span className="md:inline lg:hidden hidden">
                      {(() => {
                        const text = typeof memo.content === 'string' ? memo.content : '';
                        const short = text.length > 40 ? text.slice(0, 40) + '...' : text;
                        return highlightText(short, search);
                      })()}
                    </span>
                    <span className="inline md:hidden">
                      {(() => {
                        const text = typeof memo.content === 'string' ? memo.content : '';
                        const short = text.length > 12 ? text.slice(0, 12) + '...' : text;
                        return highlightText(short, search);
                      })()}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{memo.createdAt.slice(0, 10)}</TableCell>
                  <TableCell className="text-xs text-gray-500 hidden md:table-cell">{memo.updatedAt.slice(0, 10)}</TableCell>
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