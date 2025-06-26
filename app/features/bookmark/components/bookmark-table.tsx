import { Button } from "~/core/components/ui/button";
import { Badge } from "~/core/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/core/components/ui/table";
import { FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Bookmark } from "../types/bookmark.types";
import BookmarkDetailDialog from "./bookmark-detail-dialog";
import { useState } from "react";
import { mockCategories } from "../lib/mock-data";

type Props = {
  pagedBookmarks: Bookmark[];
  sortKey: keyof Bookmark;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Bookmark) => void;
  onRowClick: (bookmark: Bookmark) => void;
  highlightText: (text: string, keyword: string) => React.ReactNode;
  search: string;
  // Pagination
  page: number;
  totalPages: number;
  totalRows: number;
  startEntry: number;
  endEntry: number;
  onPageChange: (newPage: number) => void;
};

export function BookmarkTable({
  pagedBookmarks,
  sortKey,
  sortOrder,
  onSort,
  onRowClick,
  highlightText,
  search,
  page,
  totalPages,
  totalRows,
  startEntry,
  endEntry,
  onPageChange,
}: Props) {
  const [selectedBookmark, setSelectedBookmark] = useState<(Bookmark & { memo: string }) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortableColumns: { key: keyof Bookmark; label: string }[] = [
    { key: 'title', label: '제목' },
    { key: 'url', label: 'URL' },
    { key: 'tags', label: '태그' },
    { key: 'click_count', label: '클릭수' },
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
              {sortableColumns.map(col => (
                <TableHead key={col.key} onClick={() => onSort(col.key)} className="cursor-pointer select-none text-base font-bold">
                  {col.label} {sortKey === col.key && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedBookmarks.map((bookmark) => (
              <TableRow
                key={bookmark.id}
                className="hover:bg-accent/40 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedBookmark({ ...bookmark, memo: "" });
                  setDialogOpen(true);
                }}
              >
                <TableCell className="flex items-center gap-2">
                  <a
                    href={bookmark.url}
                    className="text-blue-500 underline flex items-center gap-1"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {highlightText(bookmark.title, search)}
                    <FiExternalLink className="inline-block text-blue-400" />
                  </a>
                </TableCell>
                <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
                  {highlightText(bookmark.url, search)}
                </TableCell>
                <TableCell>
                  {bookmark.tags.map((tag, idx) => (
                    <Badge key={tag} variant={idx % 2 === 0 ? "secondary" : undefined} className={idx % 2 === 1 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-1" : "mr-1"}>
                      {highlightText(tag, search)}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell className="font-mono text-base">
                  {bookmark.click_count > 7 ? <span className="text-red-500">🔥</span> : <span className="text-gray-400">📈</span>}
                  <span className="ml-1">{bookmark.click_count}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedBookmark && (
        <BookmarkDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          bookmark={selectedBookmark}
          onSave={(updated) => {
            // 저장 로직 (원하면 구현)
            setDialogOpen(false);
          }}
          categories={mockCategories.filter(cat => cat.id !== '0')}
        />
      )}
    </>
  );
} 