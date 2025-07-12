import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "~/core/components/ui/dialog";
import { Button } from "~/core/components/ui/button";
import type { Tag } from "../lib/tag.types";

interface ConfirmDeleteTagProps {
  open: boolean;
  tag: Tag | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function ConfirmDeleteTag({ open, tag, onConfirm, onCancel, deleting }: ConfirmDeleteTagProps) {
  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>태그 삭제</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          정말로 <b>{tag?.name}</b> 태그를 삭제하시겠습니까?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={deleting} className="cursor-pointer">취소</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting} className="cursor-pointer">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 