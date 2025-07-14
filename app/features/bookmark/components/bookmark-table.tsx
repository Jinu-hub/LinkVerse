import { Button } from "~/core/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/core/components/ui/table";
import type { Bookmark, BookmarkTableProps } from "../lib/bookmark.types";
import BookmarkDetailDialog from "./bookmark-detail-dialog";
import { useEffect, useState } from "react";
import { ALL_CATEGORY_ID, SORTABLE_COLUMNS } from "../lib/constants";
import { BookmarkTableRow } from "./bookmark-table-row";
import { deleteBookmark, editBookmark } from "../lib/bmActions";
import ConfirmDeleteBookmark from "./confirm-delete-bookmark";

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
  dispatch,
  selectedCategoryId,
}: BookmarkTableProps) {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Bookmark | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (editingBookmark) {
      setFieldErrors({});
    }
  }, [editingBookmark]);

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
                <TableHead key={col.key} onClick={() => sort.onSort(col.key)} 
                  className="cursor-pointer select-none text-base font-bold"
                  style={{ width: col.width }}
                  >
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
                onDelete={(bm) => setDeleteCandidate(bm)}
                setBookmarks={setBookmarks}
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
          saving={saving}
          onSave={async (edited) => {
            setSaving(true);
            const result = await editBookmark({
              id: editingBookmark.id,
              title: edited.title,
              url: edited.url,
              tags: edited.tags,
              categoryId: edited.categoryId ?? 0,
              parentCategoryId: edited.parentCategoryId ?? 0,
              newCategoryName: edited.newCategoryName ?? "",
              newCategoryLevel: edited.newCategoryLevel ?? 1,
              memo: edited.memo ?? "",
              setCategories: setCategories,
              setTabs: setTabs,
              setBookmarks: setBookmarks,
              dispatch: dispatch,
              selectedCategoryId: selectedCategoryId,
            });
            setSaving(false);
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

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDeleteBookmark
        open={!!deleteCandidate}
        bookmark={deleteCandidate}
        onCancel={() => setDeleteCandidate(null)}
        deleting={deleting}
        onConfirm={async () => {
          if (!deleteCandidate) return;
          setDeleting(true);
          const result = await deleteBookmark({
            id: deleteCandidate.id,
            setBookmarks: setBookmarks,
            tags: tags,
          });
          setDeleting(false);
          if (!result.ok) {
            console.error(result.error);
            return;
          }
          setDeleteCandidate(null);
        }}
      />
    </>
  );
} 