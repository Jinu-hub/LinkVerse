import { TableRow, TableCell } from "~/core/components/ui/table";
import { Badge } from "~/core/components/ui/badge";
import { chunkArray } from "../lib/bmUtils";
import type { Bookmark } from "../lib/bookmark.types";
import { updateBookmarkClickCount } from "../lib/bmActions";
import { 
  BADGE_ODD_EVEN_MOD,
  HOT_CLICK_COUNT_THRESHOLD,
  TAGS_CHUNK_SIZE,
} from "../lib/constants";
import { BookmarkRowMenu } from "./bookmark-row-menu";

interface BookmarkTableRowProps {
  bookmark: Bookmark;
  search: string;
  highlightText: (text: string, keyword: string) => React.ReactNode;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
}

export function BookmarkTableRow({
  bookmark,
  search,
  highlightText,
  onEdit,
  onDelete,
  setBookmarks,
}: BookmarkTableRowProps) {
  return (
    <TableRow
      className="hover:bg-accent/40 transition-colors cursor-pointer"
      onClick={async () => {
        if (bookmark.url) {
          window.open(bookmark.url, '_blank', 'noopener,noreferrer');
        }
        await updateBookmarkClickCount(bookmark.id, setBookmarks);
      }}
    >
      <TableCell className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          {highlightText(bookmark.title.length > 20 
            ? `${bookmark.title.substring(0, 20)}...` 
            : bookmark.title, 
            search
          )}
        </span>
      </TableCell>
      <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate hidden md:table-cell">
        {highlightText(bookmark.url, search)}
      </TableCell>
      <TableCell>
        {bookmark.tags &&
          chunkArray(bookmark.tags, 3).map((tagRow, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap mb-1">
              {tagRow.map((tag, idx) => (
                <Badge
                  key={tag}
                  variant={(rowIdx * TAGS_CHUNK_SIZE + idx) % BADGE_ODD_EVEN_MOD === 0 ? "secondary" : undefined}
                  className={(rowIdx * TAGS_CHUNK_SIZE + idx) % BADGE_ODD_EVEN_MOD === 1
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-1"
                    : "mr-1"}
                >
                  {highlightText(tag, search)}
                </Badge>
              ))}
            </div>
          ))
        }
      </TableCell>
      <TableCell className="font-mono text-base">
        {bookmark.click_count > HOT_CLICK_COUNT_THRESHOLD ? <span className="text-red-500">🔥</span> : <span className="text-gray-400">📈</span>}
        <span className="ml-1">{bookmark.click_count}</span>
      </TableCell>
      <TableCell className="w-[40px] text-center">
        <BookmarkRowMenu bookmark={bookmark} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
} 