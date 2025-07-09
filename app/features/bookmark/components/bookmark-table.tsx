import { Button } from "~/core/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/core/components/ui/table";
import type { Bookmark, BookmarkTableProps } from "../types/bookmark.types";
import BookmarkDetailDialog from "./bookmark-detail-dialog";
import { useState } from "react";
import { ALL_CATEGORY_ID, SORTABLE_COLUMNS } from "../lib/constants";
import { BookmarkTableRow } from "./bookmark-table-row";
import { addBookmark, editBookmark } from "../lib/bmActions";

export function BookmarkTable({
  pagedBookmarks,
  sort,
  onRowClick,
  highlightText,
  search,
  pagination,
  categoryTree,
  tags,
  setCategories,
  setTabs,
  setBookmarks,
}: BookmarkTableProps) {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          총 <strong className="font-bold text-foreground">{pagination.totalRows}</strong>개 중 <strong className="font-bold text-foreground">{pagination.startEntry}-{pagination.endEntry}</strong>개 항목
        </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => pagination.onPageChange(pagination.page - 1)} disabled={pagination.page <= 1}>&lt;</Button>
            <span className="text-sm">{pagination.page} / {pagination.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => pagination.onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>&gt;</Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl shadow-lg border bg-white dark:bg-zinc-900 overflow-hidden">
        <Table className="table-fixed border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-zinc-800">
              {SORTABLE_COLUMNS.map(col => (
                <TableHead key={col.key} onClick={() => sort.onSort(col.key)} className="cursor-pointer select-none text-base font-bold">
                  {col.label} {sort.sortKey === col.key && (sort.sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
              ))}
              <TableHead className="text-base font-bold w-[40px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedBookmarks.map((bookmark) => (
              <BookmarkTableRow
                key={bookmark.id}
                bookmark={bookmark}
                search={search}
                highlightText={highlightText}
                onEdit={(bm) => setEditingBookmark(bm)}
                // 필요시 onDelete, onRowClick 등 추가
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {editingBookmark && (
        <BookmarkDetailDialog
          open={!!editingBookmark}
          onOpenChange={(open) => {
            if (!open) setEditingBookmark(null);
          }}
          bookmark={{ ...editingBookmark, memo: editingBookmark?.memo ?? "" }}
          onSave={async (edited) => {
            const result = await editBookmark({
              id: editingBookmark.id,
              title: edited.title,
              url: edited.url,
              tags: edited.tags,
              categoryId: edited.categoryId ?? 0,
              parentCategoryId: edited.parentCategoryId ?? 0,
              newCategoryName: edited.newCategoryName ?? "",
              memo: edited.memo ?? "",
              setCategories: setCategories,
              setTabs: setTabs,
              setBookmarks: setBookmarks,
            });
            if (!result.ok) {
              setFieldErrors(result.fieldErrors ?? {});
              return;
            } 
            setFieldErrors({});
            setEditingBookmark(null);
          }}
          categories={categoryTree.filter(cat => cat.id > ALL_CATEGORY_ID)}
          allTags={tags}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
        />
      )}
    </>
  );
} 