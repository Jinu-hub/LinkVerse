import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "~/core/components/ui/dialog";
import { Button } from "~/core/components/ui/button";
import type { Bookmark } from "../lib/bookmark.types";

interface ConfirmDeleteBookmarkProps {
  open: boolean;
  bookmark: Bookmark | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function ConfirmDeleteBookmark({ open, bookmark, onConfirm, onCancel, deleting }: ConfirmDeleteBookmarkProps) {
  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>북마크 삭제</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          정말로 <b>{bookmark?.title}</b> 북마크를 삭제하시겠습니까?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={deleting} className="cursor-pointer">취소</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting} className="cursor-pointer">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 