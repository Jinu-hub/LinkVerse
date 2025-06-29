import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/core/components/ui/table";
import { Button } from "~/core/components/ui/button";
import { Badge } from "~/core/components/ui/badge";
import { useState } from "react";

type Tag = { id: string; name: string; usage_count: number };

type Props = {
  pagedTags: Tag[];
  sortKey: keyof Tag;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Tag) => void;
  page: number;
  totalPages: number;
  totalRows: number;
  startEntry: number;
  endEntry: number;
  onPageChange: (newPage: number) => void;
  search: string;
  highlightText: (text: string, keyword: string) => React.ReactNode;
};

export function TagTable({
  pagedTags,
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
}: Props) {
  const sortableColumns: { key: keyof Tag; label: string }[] = [
    { key: 'name', label: '이름' },
    { key: 'usage_count', label: '사용 횟수' },
  ];

  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            총 <strong className="font-bold text-foreground">{totalRows}</strong>개 중 <strong className="font-bold text-foreground">{startEntry}-{endEntry}</strong>개 항목
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>&lt;</Button>
            <span className="text-sm">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>&gt;</Button>
          </div>
        </div>
      </div>
      <div className="rounded-xl shadow-lg border bg-white dark:bg-zinc-900 overflow-hidden">
        <Table className="table-fixed border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-zinc-800">
              <TableHead className="w-20">ID</TableHead>
              {sortableColumns.map(col => (
                <TableHead key={col.key} onClick={() => onSort(col.key)} className="cursor-pointer select-none text-base font-bold">
                  {col.label} {sortKey === col.key && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedTags.map((tag) => (
              <TableRow key={tag.id} className="hover:bg-accent/40 transition-colors cursor-pointer">
                <TableCell className="font-mono">{highlightText(tag.id, search)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{highlightText(tag.name, search)}</Badge>
                </TableCell>
                <TableCell className="font-mono text-base">
                  {tag.usage_count > 10 ? <span className="text-red-500">🔥</span> : <span className="text-gray-400">📈</span>}
                  <span className="ml-1">{tag.usage_count}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
} 