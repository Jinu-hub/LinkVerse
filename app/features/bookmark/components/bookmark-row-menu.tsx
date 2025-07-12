import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/core/components/ui/dropdown-menu";
import { FiMoreHorizontal } from "react-icons/fi";
import { EDIT_DIALOG_TIMEOUT } from "../lib/constants";
import type { Bookmark } from "../lib/bookmark.types";

interface BookmarkRowMenuProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void; 
}

export function BookmarkRowMenu({ bookmark, onEdit, onDelete }: BookmarkRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={e => e.stopPropagation()}
          aria-label="더보기"
        >
          <FiMoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-24 p-1">
        <DropdownMenuItem onClick={e => {
          e.stopPropagation();
          setTimeout(() => {
            onEdit(bookmark);
          }, EDIT_DIALOG_TIMEOUT);
        }}>
          편집
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation();
            setTimeout(() => {
              onDelete(bookmark); 
            }, EDIT_DIALOG_TIMEOUT);
          }}
          variant="destructive"
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}